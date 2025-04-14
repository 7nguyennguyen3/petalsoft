"use client";

import { useCartStore } from "@/store"; // Assuming your Zustand store path
import { motion, AnimatePresence } from "framer-motion"; // Import AnimatePresence
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils"; // Import cn utility
import { buttonVariants } from "../ui/button";

const Cart = () => {
  const cartItems = useCartStore((state) => state.cartItems);
  const [animate, setAnimate] = useState(false); // Use a single state for animation trigger

  const totalItemsInCart = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Trigger animation when totalItemsInCart changes (and is > 0)
  useEffect(() => {
    // Only trigger animation if the total count changes from the previous state
    // This prevents animation on initial load if items are already in cart
    let previousTotal = parseInt(
      sessionStorage.getItem("cartTotal") || "0",
      10
    );
    if (totalItemsInCart > previousTotal) {
      setAnimate(true);
      setTimeout(() => setAnimate(false), 500); // Duration of the animation
    }
    // Store current total for next comparison
    sessionStorage.setItem("cartTotal", totalItemsInCart.toString());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalItemsInCart]);

  return (
    <Link
      href="/checkout" // Or "/cart" depending on your desired destination
      className={cn(
        buttonVariants({ variant: "ghost", size: "icon" }), // Style link like an icon button
        "relative flex items-center justify-center h-10 w-10 rounded-full" // Ensure consistent size and shape with user menu trigger
      )}
      aria-label={`View cart with ${totalItemsInCart} items`}
    >
      {/* Apply rotation animation to the motion div wrapping the icon */}
      <motion.div
        animate={
          animate
            ? { rotate: [0, 10, -10, 10, -10, 0], scale: [1, 1.1, 1] }
            : {}
        } // Added scale for extra effect
        transition={{ duration: 0.5 }}
      >
        <ShoppingBag className="scale-125" /> {/* Consistent icon size */}
      </motion.div>

      {/* Badge with AnimatePresence for entry/exit */}
      <AnimatePresence>
        {totalItemsInCart > 0 && (
          <motion.div
            key="cart-badge" // Need a key for AnimatePresence
            initial={{ scale: 0, y: -10, x: 10 }} // Initial state (small, slightly offset)
            animate={{ scale: 1, y: 0, x: 0 }} // Animate in
            exit={{ scale: 0 }} // Animate out
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
              duration: 0.3,
            }} // Spring animation
            // Position badge relative to the parent Link/Button
            className={cn(
              "absolute -top-1 -right-1", // Position top-right corner
              "flex items-center justify-center",
              "rounded-full text-white text-[10px] font-semibold", // Smaller text, adjusted font weight
              "h-[18px] w-[18px]", // Fixed small size for badge
              "bg-primary" // Use theme primary color for badge background
              // Or use "bg-red-500" for a more common notification style
            )}
          >
            {totalItemsInCart}
          </motion.div>
        )}
      </AnimatePresence>
    </Link>
  );
};

export default Cart;
