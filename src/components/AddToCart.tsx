"use client";
import { PRODUCTS } from "@prisma/client";
import { LoaderCircle, SquarePlus } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const AddToCart = ({
  product,
  addToCart,
}: {
  product: PRODUCTS;
  addToCart: (productId: number, quantity: number) => void;
}) => {
  const [adding, setAdding] = useState(false);

  return (
    <Button
      disabled={adding}
      onClick={() => {
        try {
          setAdding(true);
          setTimeout(() => {
            setAdding(false);
            addToCart(product.id, 1);
          }, 1000);
        } catch (error) {
          console.error(error);
        }
      }}
      className={cn(
        "flex items-center gap-2 bg-custom-purple font-bold text-lg",
        adding
          ? "bg-custom-purple opacity-50 cursor-not-allowed"
          : "bg-custom-purple"
      )}
    >
      {adding ? "Adding... " : "Add to Cart"}
      {adding ? <LoaderCircle className="animate-spin" /> : <SquarePlus />}
    </Button>
  );
};

export default AddToCart;
