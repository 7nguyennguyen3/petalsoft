import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/db";
import { Resend } from "resend";
import OrderReceivedEmail from "@/components/emails/OrderReceivedEmail";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  const resend = new Resend(process.env.RESEND_API_KEY);

  let event = stripe.webhooks.constructEvent(body, signature!, webhookSecret);

  switch (event?.type) {
    case "checkout.session.completed":
      const userId = event.data.object.metadata!.userId;
      const userEmail = event.data.object.metadata!.email;
      const cartItems = JSON.parse(event.data.object.metadata!.cartItems);

      // const cartItems = [
      //   { productId: 5, quantity: 14 },
      //   { productId: 2, quantity: 12 },
      //   { productId: 3, quantity: 5 },
      // ];

      let userIdToUse = userId;

      if (!userId) {
        throw new Error("The userId is undefined.");
      }

      const userExists = await db.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!userExists) {
        const newUser = await db.user.create({
          data: {
            id: userId,
            email: userEmail,
          },
        });
        userIdToUse = newUser.id;
      }

      // const eventData = JSON.stringify(event.data.object);
      // await db.testStripeWebhook.create({
      //   data: {
      //     object: JSON.parse(eventData),
      //   },
      // });

      const shippingAddress = event.data.object.shipping_details;

      const existingShippingAddress = await db.shippingAddress.findFirst({
        where: {
          name: shippingAddress!.name!,
          street: shippingAddress!.address?.line1!,
          city: shippingAddress!.address?.city!,
          postalCode: shippingAddress!.address?.postal_code!,
          country: shippingAddress!.address?.country!,
          state: shippingAddress!.address?.state!,
          phoneNumber: shippingAddress?.phone,
        },
      });

      let shippingAddressId;
      if (existingShippingAddress) {
        shippingAddressId = existingShippingAddress.id;
      } else {
        // If it doesn't exist, create a new one
        const newShippingAddress = await db.shippingAddress.create({
          data: {
            name: shippingAddress!.name!,
            street: shippingAddress!.address?.line1!,
            city: shippingAddress!.address?.city!,
            postalCode: shippingAddress!.address?.postal_code!,
            country: shippingAddress!.address?.country!,
            state: shippingAddress!.address?.state!,
            phoneNumber: shippingAddress?.phone,
          },
        });
        shippingAddressId = newShippingAddress.id;
      }

      const order = await db.order.create({
        data: {
          status: "awaiting_shipment",
          email: userEmail || userExists?.email,
          total: event.data.object.amount_total! / 100,
          isPaid: true,
          userId: userIdToUse,
          shippingAddressId: shippingAddressId,
        },
      });

      for (const item of cartItems) {
        const product = await db.pRODUCTS.findUnique({
          where: {
            id: item.productId,
          },
        });

        await db.lineItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: product!.price,
          },
        });

        const newStock = product!.stock - item.quantity;
        await db.pRODUCTS.update({
          where: { id: item.productId },
          data: {
            stock: newStock,
          },
        });
      }

      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: userEmail,
        subject: "Thank you for your order",
        react: OrderReceivedEmail({
          orderDate: order.createdAt.toLocaleDateString(),
          orderId: order.id,
          shippingAddres: {
            id: shippingAddressId,
            name: shippingAddress!.name!,
            street: shippingAddress!.address?.line1!,
            city: shippingAddress!.address?.city!,
            postalCode: shippingAddress!.address?.postal_code!,
            country: shippingAddress!.address?.country!,
            state: shippingAddress!.address?.state!,
            phoneNumber: shippingAddress?.phone || "No phone number provided.",
          },
        }),
      });

      break;
    // handle other type of stripe events
    default:
      console.log(`Unhandled event type ${event.type}`);
      break;
  }

  return NextResponse.json({ received: true });
}
