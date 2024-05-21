"use client";

import LoginModal from "@/components/LoginModal";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button, buttonVariants } from "@/components/ui/button";
import { useFetchProduct } from "@/lib/hook";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Confetti from "react-dom-confetti";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useMutation } from "@tanstack/react-query";
import { createCheckoutSession } from "./actions";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

const CheckOutPage = () => {
  const { data: addedProducts } = useFetchProduct();
  const { cartItems, initializeCart } = useCartStore((state) => ({
    cartItems: state.cartItems,
    initializeCart: state.initializeCart,
  }));
  const { user } = useKindeBrowserClient();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const router = useRouter();
  useEffect(() => {
    if (cartItems.length > 0 && !showConfetti) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [cartItems.length, showConfetti]);

  useEffect(() => {
    const storedCartItemsString = localStorage.getItem("cartItems");
    if (storedCartItemsString) {
      const storedCartItems = JSON.parse(storedCartItemsString);
      initializeCart(storedCartItems);
      localStorage.removeItem("cartItems");
    }
  }, [initializeCart]);

  const cartProductDetails = cartItems.map((cartItem) => {
    const product = addedProducts?.find(
      (product) => product.id === cartItem.productId
    );
    return {
      ...cartItem,
      title: product?.title,
      imgSrc: product?.imgSrc,
      price: product?.price,
    };
  });

  const total = cartProductDetails.reduce((acc, item) => {
    const itemPrice = item.price ?? 0;
    return acc + itemPrice * item.quantity;
  }, 0);
  const tax = total * 0.0975;

  const { mutate: createPaymentSession } = useMutation({
    mutationKey: ["get-checkout-session"],
    mutationFn: createCheckoutSession,
    onSuccess: ({ url }) => {
      if (url) router.push(url);
      else throw new Error("Unable to retrieve payment URL.");
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "There was an error on our end. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    },
  });

  const handleCheckout = () => {
    if (!!user) {
      createPaymentSession({
        cartItems: cartProductDetails,
        tax: tax,
        total: total,
      });
    } else {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      setIsLoginModalOpen(true);
    }
  };

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-0 overflow-hidden flex justify-center"
      >
        <Confetti
          active={showConfetti}
          config={{ elementCount: 200, spread: 90 }}
        />
      </div>
      <div className="grainy-light">
        <MaxWidthWrapper>
          <LoginModal
            isOpen={isLoginModalOpen}
            setIsOpen={setIsLoginModalOpen}
          />
          <div className="flex flex-col min-h-screen">
            <Link
              href="/store"
              className="self-start mb-10 hover:scale-105 pt-20"
            >
              <ArrowLeft size={30} />
            </Link>
            <h1 className="text-4xl self-start gra-p-b  pb-10">Checkout</h1>
            {cartProductDetails.map((item) => (
              <div
                key={item.productId}
                className="flex gap-3 items-center mb-10"
              >
                <div className="w-full max-w-[300px] h-full max-h-[200px]">
                  <img
                    src={item.imgSrc}
                    alt={item.title}
                    className="rounded-lg"
                  />
                </div>
                <div className="font-medium">
                  <p className="text-xl font-bold gra-p-b">{item.title}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: ${item.price?.toFixed(2) ?? "N/A"}</p>
                </div>
              </div>
            ))}
            {cartProductDetails.length <= 0 ? (
              <div className="flex flex-col gap-3">
                <p>You currently don't have any product in the cart. </p>
                <Link
                  href="/store"
                  className={cn(buttonVariants(), "c-button self-start")}
                >
                  Visit our store
                  <ArrowRight />
                </Link>
              </div>
            ) : (
              <>
                <div className="bg-zinc-500 h-[0.25px] my-5" />
                <div className="flex flex-col items-end gap-2">
                  <p className="text-2xl font-semibold">${total.toFixed(2)}</p>
                  <div className="w-[160px] flex justify-between items-center text-2xl font-semibold">
                    <p>Tax</p>
                    <p className="text-2xl font-semibold">+${tax.toFixed(2)}</p>
                  </div>
                  <div className="bg-zinc-500 h-[1px] w-[160px]" />
                  <div className="w-[160px] flex justify-between items-center text-2xl font-semibold">
                    <p>Total</p>
                    <h2>${(total + tax).toFixed(2)}</h2>
                  </div>
                  <Button
                    onClick={handleCheckout}
                    className="w-[160px] c-button"
                  >
                    Check Out
                    <ArrowRight />
                  </Button>
                </div>
              </>
            )}
          </div>
        </MaxWidthWrapper>
      </div>
    </>
  );
};

export default CheckOutPage;
