"use client";
import { useState } from "react";
import { Button, buttonVariants } from "./ui/button"; // Assuming Button is from shadcn/ui
import { cn } from "@/lib/utils";
import { PRODUCTS } from "@prisma/client"; // Keep type import
import { LoaderCircle, Minus, Plus, Check, ShoppingCart } from "lucide-react"; // Changed SquarePlus to ShoppingCart
import Link from "next/link";

const AddToCart = ({
  product,
  addToCart,
  showQuantity,
  showBuyNow,
}: {
  product: PRODUCTS;
  addToCart: (productId: number, quantity: number) => void;
  showQuantity: boolean;
  showBuyNow: boolean;
}) => {
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    // Keep the original logic with setTimeout for demo purposes
    try {
      if (adding || added) return; // Prevent multiple clicks while processing

      setAdding(true);
      setAdded(false); // Ensure added state is reset if re-clicked quickly

      setTimeout(() => {
        setAdding(false);
        setAdded(true);
        addToCart(product.id, quantity); // Call the passed function

        // Reset added state after a delay
        setTimeout(() => {
          setAdded(false);
        }, 1500); // Slightly longer time for user to see "Added" state
      }, 1000); // Simulate network request
    } catch (error) {
      console.error("Failed to add to cart:", error);
      setAdding(false); // Reset state on error
      setAdded(false);
    }
  };

  return (
    // Removed max-width, allow component to fill container, adjust gap
    <div className="flex flex-col items-center w-full gap-3">
      {showQuantity && (
        // Improved styling for quantity selector group
        <div className="flex items-center border border-input rounded-md">
          <Button
            variant="ghost"
            size="icon" // Smaller button
            onClick={decreaseQuantity}
            disabled={quantity <= 1 || adding || added} // Disable when quantity is 1 or processing
            aria-label="Decrease quantity"
            className="h-9 w-9 rounded-r-none disabled:opacity-50" // Match input height, adjust rounding
          >
            <Minus className="h-4 w-4" />
          </Button>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              if (val >= 1) {
                setQuantity(val);
              } else if (e.target.value === "") {
                // Allow clearing the input, maybe default to 1? Or handle separately
                setQuantity(1); // Or perhaps handle empty string state if needed
              }
            }}
            aria-label="Quantity"
            disabled={adding || added} // Disable input while processing
            // Tailwind classes for input styling - remove inline style
            className={cn(
              "w-12 h-9 text-center border-y border-input bg-transparent text-sm font-medium",
              "focus:outline-none focus:ring-1 focus:ring-ring focus:ring-offset-0", // Basic focus style
              "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" // Remove number spinners
            )}
          />
          <Button
            variant="ghost"
            size="icon" // Smaller button
            onClick={increaseQuantity}
            disabled={adding || added} // Disable while processing
            aria-label="Increase quantity"
            className="h-9 w-9 rounded-l-none" // Match input height, adjust rounding
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}
      <Button
        disabled={adding || added} // Button is disabled during adding/added state
        onClick={handleAddToCart}
        // Standard button size, removed text-lg, added gap
        className={cn(
          "flex items-center justify-center gap-2 w-full",
          added && "bg-green-500 hover:bg-green-600" // Style for "Added" state
          // Disabled styles are usually handled by shadcn/ui base styles
        )}
        aria-live="polite" // Announce changes for screen readers
      >
        {adding ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin" />
            <span>Adding...</span>
          </>
        ) : added ? (
          <>
            <Check className="h-4 w-4" />
            <span>Added!</span>
          </>
        ) : (
          <>
            <ShoppingCart className="h-4 w-4" /> {/* Changed icon */}
            <span>Add to Cart</span>
          </>
        )}
      </Button>

      {showBuyNow && (
        <Link
          href="/checkout" // Assuming checkout page handles the cart
          onClick={() => {
            // Adds defined quantity then navigates
            // Consider if quantity selector should influence this
            addToCart(product.id, quantity);
          }}
          className={cn(
            buttonVariants({ variant: "secondary", size: "default" }), // Use a standard variant, standard size
            "w-full text-center" // Ensure full width and text centering
          )}
        >
          Buy Now
        </Link>
      )}
    </div>
  );
};

export default AddToCart;
