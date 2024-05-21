"use server";

import { db } from "@/db";
import { stripe } from "@/lib/stripe";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

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
  const cartItemsJson = JSON.stringify(
    cartItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }))
  );

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
      email: user.email,
      cartItems: cartItemsJson,
    },
    line_items: [{ price: price.id, quantity: 1 }],
  });

  return { url: stripeSession.url };
};
