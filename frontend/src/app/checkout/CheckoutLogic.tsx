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
import { useMutation } from "@tanstack/react-query";
import { createCheckoutSession } from "./actions";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";

const CheckoutLogic = ({ user }: { user: KindeUser | null }) => {
  const { data: addedProducts } = useFetchProduct();
  const { cartItems, initializeCart, decreaseQuantity, increaseQuantity } =
    useCartStore((state) => ({
      cartItems: state.cartItems,
      initializeCart: state.initializeCart,
      decreaseQuantity: state.decreaseQuantity,
      increaseQuantity: state.increaseQuantity,
    }));
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

  const handleIncreaseQuantity = (productId: number) => {
    increaseQuantity(productId);
  };

  const handleDecreaseQuantity = (productId: number) => {
    decreaseQuantity(productId);
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
      <div className="bg-gray-50 min-h-screen">
        <MaxWidthWrapper>
          <LoginModal
            isOpen={isLoginModalOpen}
            setIsOpen={setIsLoginModalOpen}
          />
          <div className="flex flex-col py-10">
            <Link
              href="/store"
              className="self-start mb-8 transition-transform hover:scale-105 pt-10"
            >
              <ArrowLeft size={30} className="text-gray-700" />
            </Link>
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Checkout</h1>
            {cartProductDetails.map((item) => (
              <div
                key={item.productId}
                className="flex flex-col sm:flex-row gap-4 items-center mb-10 p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
              >
                <div className="w-full sm:max-w-[180px] md:max-w-[300px]">
                  <img
                    src={item.imgSrc}
                    alt={item.title}
                    loading="lazy"
                    className="rounded-lg object-cover h-full w-full"
                  />
                </div>
                <div className="flex flex-col gap-3 flex-1">
                  <p className="text-xl font-semibold text-gray-700">
                    {item.title}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDecreaseQuantity(item.productId)}
                      className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-200 transition-colors"
                    >
                      -
                    </button>
                    <span className="text-lg font-medium text-gray-600">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleIncreaseQuantity(item.productId)}
                      className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-200 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-gray-600">
                    Price:{" "}
                    <span className="font-semibold text-gray-800">
                      ${item.price?.toFixed(2) ?? "N/A"}
                    </span>
                  </p>
                </div>
              </div>
            ))}
            {cartProductDetails.length <= 0 ? (
              <div className="flex flex-col gap-4 items-center py-10">
                <p className="text-lg text-gray-600">
                  You currently don't have any product in the cart.
                </p>
                <Link
                  href="/store"
                  className={cn(
                    buttonVariants(),
                    "self-center flex items-center gap-2"
                  )}
                >
                  Visit our store
                  <ArrowRight size={22} />
                </Link>
              </div>
            ) : (
              <>
                <div className="border-b border-gray-300 my-6" />
                <div className="flex flex-col items-end gap-4 mb-20">
                  <p className="text-xl text-gray-800">
                    Subtotal:{" "}
                    <span className="font-bold">${total.toFixed(2)}</span>
                  </p>
                  <div className="w-full max-w-sm flex justify-between items-center text-lg">
                    <p className="text-gray-700">Tax</p>
                    <p className="text-gray-700">+${tax.toFixed(2)}</p>
                  </div>
                  <div className="w-full max-w-sm border-b border-gray-300" />
                  <div className="w-full max-w-sm flex justify-between items-center text-xl font-semibold text-gray-800">
                    <p>Total</p>
                    <h2>${(total + tax).toFixed(2)}</h2>
                  </div>
                  <Button
                    onClick={handleCheckout}
                    className="w-full max-w-sm bg-indigo-600 hover:bg-indigo-700 text-[15px] font-bold mt-4 flex items-center justify-center gap-2"
                  >
                    Check Out
                    <ArrowRight size={22} />
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

export default CheckoutLogic;
