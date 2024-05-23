"use client";

import { useCartStore } from "@/store";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const Cart = () => {
  const cartItems = useCartStore((state) => state.cartItems);
  const [itemAdded, setItemAdded] = useState(false);

  const totalItemsInCart = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  useEffect(() => {
    if (totalItemsInCart > 0) {
      setItemAdded(true);
      setTimeout(() => setItemAdded(false), 1000); // Reset after 1s
    }
  }, [totalItemsInCart]);

  return (
    <Link href="/checkout">
      <motion.div
        animate={itemAdded ? { rotate: [0, 5, -5, 5, -5, 0] } : {}}
        transition={{ duration: 0.5 }}
      >
        <ShoppingBag className="text-zinc-600" size="30px" />
      </motion.div>

      <div className="absolute top-[24px] right-[3px]">
        {totalItemsInCart > 0 && (
          <motion.div
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            exit={{ y: -50 }}
            className="w-6 h-5 rounded-full flex items-center font-bold bg-custom-purple
  justify-center text-[11px] text-white"
          >
            {totalItemsInCart}
          </motion.div>
        )}
      </div>
    </Link>
  );
};

export default Cart;
