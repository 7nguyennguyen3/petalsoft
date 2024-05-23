"use client";
import { useState } from "react";
import { Button, buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { PRODUCTS } from "@prisma/client";
import { LoaderCircle, SquarePlus, Minus, Plus, Check } from "lucide-react";
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

  return (
    <div className="flex flex-col items-center justify-between max-w-[140px]">
      {showQuantity && (
        <div className="flex items-center justify-center w-full">
          <Button variant="ghost" onClick={decreaseQuantity}>
            <Minus />
          </Button>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            style={{ width: "50px", textAlign: "center" }}
          />
          <Button variant="ghost" onClick={increaseQuantity}>
            <Plus />
          </Button>
        </div>
      )}
      <Button
        disabled={adding || added}
        onClick={() => {
          try {
            setAdding(true);
            setTimeout(() => {
              setAdding(false);
              setAdded(true);
              addToCart(product.id, quantity);
              setTimeout(() => {
                setAdded(false);
              }, 1000);
            }, 1000);
          } catch (error) {
            console.error(error);
          }
        }}
        className={cn(
          "flex items-center gap-2 font-bold text-lg mt-2 w-full min-w-[140px]",
          adding || (added && " opacity-50 cursor-not-allowed")
        )}
      >
        {adding ? "Adding... " : added ? <Check /> : "Add to Cart"}
        {adding ? (
          <LoaderCircle className="animate-spin" />
        ) : added ? (
          ""
        ) : (
          <SquarePlus />
        )}
      </Button>

      {showBuyNow && (
        <Link
          href="/checkout"
          onClick={() => {
            addToCart(product.id, 1);
          }}
          className={cn(
            buttonVariants(),
            "bg-orange-500 hover:bg-yellow-500 text-white min-w-[140px] text-lg mt-4 text-center"
          )}
        >
          Buy Now
        </Link>
      )}
    </div>
  );
};

export default AddToCart;
