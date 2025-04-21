"use client";

import { useCartStore } from "@/store"; // Assuming your Zustand store path
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";

const Cart = () => {
  const cartItems = useCartStore((state) => state.cartItems);
  const [animate, setAnimate] = useState(false);

  const totalItemsInCart = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Determine the href based on whether the cart has items
  const cartLinkHref = totalItemsInCart > 0 ? "/checkout" : "/store";

  // Trigger animation when totalItemsInCart changes (and is > 0)
  // and the new total is greater than the previous total
  useEffect(() => {
    // Using sessionStorage to track previous total across renders/loads
    const previousTotal = parseInt(
      sessionStorage.getItem("cartTotal") || "0",
      10
    );

    if (totalItemsInCart > 0 && totalItemsInCart > previousTotal) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 500); // Animation duration
      // Store current total *after* potential animation check
      sessionStorage.setItem("cartTotal", totalItemsInCart.toString());
      return () => clearTimeout(timer); // Cleanup timer
    }

    // Always update sessionStorage with the current total when the cart changes,
    // even if not animating (e.g., item removed, quantity decreased)
    // This ensures the comparison in the next effect run is accurate.
    if (totalItemsInCart !== previousTotal) {
      sessionStorage.setItem("cartTotal", totalItemsInCart.toString());
    }

    // We only care about totalItemsInCart changing for the animation trigger
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalItemsInCart]); // Dependency on totalItemsInCart

  return (
    <Link
      href={cartLinkHref} // Dynamically set the href
      className={cn(
        buttonVariants({ variant: "ghost", size: "icon" }),
        "relative flex items-center justify-center h-10 w-10 rounded-full"
      )}
      aria-label={`View cart with ${totalItemsInCart} items`}
    >
      {/* Apply rotation animation to the motion div wrapping the icon */}
      <motion.div
        animate={
          animate
            ? { rotate: [0, 10, -10, 10, -10, 0], scale: [1, 1.1, 1] }
            : {}
        }
        transition={{ duration: 0.5 }}
      >
        <ShoppingBag className="scale-125" />
      </motion.div>

      {/* Badge with AnimatePresence for entry/exit */}
      <AnimatePresence>
        {totalItemsInCart > 0 && (
          <motion.div
            key="cart-badge"
            initial={{ scale: 0, y: -10, x: 10 }}
            animate={{ scale: 1, y: 0, x: 0 }}
            exit={{ scale: 0 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
              duration: 0.3,
            }}
            className={cn(
              "absolute -top-1 -right-1",
              "flex items-center justify-center",
              "rounded-full text-white text-[10px] font-semibold",
              "h-[18px] w-[18px]",
              "bg-primary"
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
