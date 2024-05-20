import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/db";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event = stripe.webhooks.constructEvent(
    body,
    signature!,
    "whsec_06PcbxzGn9803a91u1UgdCtuQswTy6Al"
  );

  switch (event?.type) {
    case "payment_intent.succeeded":
      console.log(event.data.object);
      const eventData = JSON.stringify(event.data.object);
      await db.testStripeWebhook.create({
        data: {
          object: JSON.parse(eventData),
        },
      });

      const shippingAddress = event.data.object.shipping;

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
          total: event.data.object.amount_received,
          isPaid: true,
          userId: event.data.object.metadata.userId,
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
