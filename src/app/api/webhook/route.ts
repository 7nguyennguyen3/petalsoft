import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/db";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event = stripe.webhooks.constructEvent(body, signature!, webhookSecret);

  switch (event?.type) {
    case "checkout.session.completed":
      const userId = event.data.object.metadata!.userId;
      const userEmail = event.data.object.metadata!.email;

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

      console.log(event.data.object);
      const eventData = JSON.stringify(event.data.object);
      await db.testStripeWebhook.create({
        data: {
          object: JSON.parse(eventData),
        },
      });

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

      await db.order.create({
        data: {
          status: "awaiting_shipment",
          total: event.data.object.amount_total! / 100,
          isPaid: true,
          userId: userIdToUse,
          shippingAddressId: shippingAddressId,
        },
      });

      // const cartItems = JSON.parse(event.data.object.metadata.cartItemsJson);

      break;
    // handle other type of stripe events
    default:
      console.log(`Unhandled event type ${event.type}`);
      break;
  }

  return NextResponse.json({ received: true });
}
