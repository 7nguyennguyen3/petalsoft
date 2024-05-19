import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import { db } from "@/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = headers().get("stripe-signature");

    if (!signature) {
      return new Response("Invalid signature", { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "checkout.session.completed") {
      if (!event.data.object.customer_details?.email) {
        throw new Error("Missing user email");
      }

      const session = event.data.object as Stripe.Checkout.Session;

      const shippingAddress = session.shipping_details!.address;

      if (session.payment_status === "paid") {
        const customerShippingAddress = await db.shippingAddress.create({
          data: {
            name: session.customer_details?.name!,
            street: shippingAddress?.line1!,
            city: shippingAddress?.city!,
            country: shippingAddress?.country!,
            postalCode: shippingAddress?.postal_code!,
          },
        });

        await db.order.create({
          data: {
            userId: session.metadata!.userId,
            total: session.amount_total! / 100,
            isPaid: true,
            status: "awaiting_shipment",
            shippingAddressId: customerShippingAddress.id,
          },
        });

        return NextResponse.json({ result: event, ok: true });
      }
    }
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Something went wrong", ok: false },
      { status: 500 }
    );
  }
}
