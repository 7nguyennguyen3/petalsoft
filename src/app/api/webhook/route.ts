import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import { db } from "@/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const response = JSON.parse(body);
    const signature = headers().get("stripe-signature");

    if (!signature) {
      return new Response("Invalid signature", { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(
      response,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      if (
        !paymentIntent.metadata.email ||
        !paymentIntent.metadata.shippingAddress
      ) {
        throw new Error("Missing user email or shipping address");
      }

      const shippingAddress = JSON.parse(
        paymentIntent.metadata.shippingAddress
      );

      const customerShippingAddress = await db.shippingAddress.create({
        data: {
          name: paymentIntent.metadata.name,
          street: shippingAddress.line1,
          city: shippingAddress.city,
          country: shippingAddress.country,
          postalCode: shippingAddress.postal_code,
        },
      });

      await db.order.create({
        data: {
          userId: paymentIntent.metadata.userId,
          total: paymentIntent.amount_received / 100,
          isPaid: true,
          status: "awaiting_shipment",
          shippingAddressId: customerShippingAddress.id,
        },
      });

      return NextResponse.json({ result: event, ok: true });
    }
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "event failed", ok: false },
      { status: 500 }
    );
  }
}
