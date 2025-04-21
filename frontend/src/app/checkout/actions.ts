"use server";

import { db } from "@/db";
import { stripe } from "@/lib/stripe";

interface cartProductDetails {
  title: string | undefined;
  imgSrc: string | undefined;
  price: number | undefined;
  productId: number;
  quantity: number;
}

interface CheckoutProps {
  cartItems: cartProductDetails[];
  total: number;
  tax: number;
  userId: string;
  userEmail: string;
}

const crypto = require("crypto");

// Accept userId and userEmail as parameters
export const createCheckoutSession = async ({
  cartItems,
  tax,
  total,
  userId, // Get userId from the client
  userEmail, // Get userEmail from the client
}: CheckoutProps) => {
  const cartItemsJson = JSON.stringify(
    cartItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }))
  );

  const existingUser = await db.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!existingUser) {
    // Use the userId and userEmail passed from the client
    await db.user.create({
      data: {
        id: userId,
        email: userEmail, // Use userEmail
      },
    });
  }

  const totalAmount = Math.round((total + tax) * 100);

  // Create a dynamic product/price on Stripe based on the order total
  // NOTE: Creating a new product/price for *every* checkout session is generally
  // inefficient and can lead to hitting Stripe API limits quickly in a production
  // environment. It's better practice to manage products and prices in Stripe
  // or create them dynamically only when a *new* product type is encountered.
  // However, keeping this logic for now as it matches your original code's intent.
  const product = await stripe.products.create({
    name: "Your Order",
    // shippable: true, // `shippable` is deprecated for products type `good`
    // type: "good", // `type` is deprecated for products, use `default_price_data` or create prices separately
  });

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: totalAmount,
    currency: "USD",
    // recurring: { interval: 'month' }, // Only needed for subscriptions
  });

  const token = crypto.randomBytes(64).toString("hex");

  const stripeSession = await stripe.checkout.sessions.create({
    success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?token=${token}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/checkout`,
    payment_method_types: ["card"],
    mode: "payment",
    shipping_address_collection: { allowed_countries: ["US"] },
    metadata: {
      userId: userId, // Use the userId from parameters
      email: userEmail, // Use the userEmail from parameters
      cartItems: cartItemsJson,
      token,
    },
    line_items: [{ price: price.id, quantity: 1 }],
  });

  return { url: stripeSession.url };
};
