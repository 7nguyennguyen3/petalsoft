"use client";

import { useCartStore } from "@/store";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

const Cart = () => {
  const cartItems = useCartStore((state) => state.cartItems);

  const totalItemsInCart = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <Link href="/checkout">
      <ShoppingBag className="text-zinc-600" size="30px" />

      <p
        className="w-6 h-5 rounded-full flex items-center font-bold bg-custom-purple
justify-center text-[11px] text-white absolute 
top-[20px] right-[3px]"
      >
        {totalItemsInCart}
      </p>
    </Link>
  );
};

export default Cart;
