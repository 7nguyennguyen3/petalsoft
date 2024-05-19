"use server";

import { db } from "@/db";
import { stripe } from "@/lib/stripe";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Order } from "@prisma/client";

interface cartProductDetails {
  title: string | undefined;
  imgSrc: string | undefined;
  price: number | undefined;
  productId: number;
  quantity: number;
}
[];

interface CheckoutProps {
  cartItems: cartProductDetails[];
  total: number;
  tax: number;
}

export const createCheckoutSession = async ({
  cartItems,
  tax,
  total,
}: CheckoutProps) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) throw new Error("You need to be logged in.");

  const existingUser = await db.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!existingUser) {
    await db.user.create({
      data: {
        id: user.id,
        email: user.email!,
      },
    });
  }

  // const newOrder = await db.order.create({
  //   data: {
  //     userId: user.id,
  //     total: total + tax,
  //     status: "awaiting_shipment",
  //   },
  // });

  // for (const item of cartItems) {
  //   if (
  //     item.title &&
  //     item.imgSrc &&
  //     item.price &&
  //     item.productId &&
  //     item.quantity
  //   ) {
  //     await db.lineItem.create({
  //       data: {
  //         orderId: newOrder.id,
  //         productId: item.productId,
  //         quantity: item.quantity,
  //         price: item.price,
  //       },
  //     });
  //   } else {
  //     throw new Error("Cart item is missing required information.");
  //   }
  // }

  const totalAmount = Math.round((total + tax) * 100);

  const product = await stripe.products.create({
    name: "Your Order",
    shippable: true,
    type: "good",
  });

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: totalAmount,
    currency: "USD",
  });

  const stripeSession = await stripe.checkout.sessions.create({
    success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you`,
    cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/checkout`,
    payment_method_types: ["card"],
    mode: "payment",
    shipping_address_collection: { allowed_countries: ["US"] },
    metadata: {
      userId: user.id,
      // orderId: newOrder.id,
    },
    line_items: [{ price: price.id, quantity: 1 }],
  });

  return { url: stripeSession.url };
};
