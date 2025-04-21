"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button, buttonVariants } from "@/components/ui/button";
import { useFetchProduct } from "@/lib/hook";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store";
import { ArrowLeft, ArrowRight, Trash, Loader2, Info } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Confetti from "react-dom-confetti";
import { useMutation } from "@tanstack/react-query";
import { createCheckoutSession } from "./actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "../_store/useAuthStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CheckoutLogic = () => {
  const { authenticated, userId, email, checkStatus } = useAuthStore();

  const { data: addedProducts } = useFetchProduct();
  const {
    cartItems,
    initializeCart,
    decreaseQuantity,
    increaseQuantity,
    removeFromCart,
  } = useCartStore((state) => ({
    cartItems: state.cartItems,
    initializeCart: state.initializeCart,
    decreaseQuantity: state.decreaseQuantity,
    increaseQuantity: state.increaseQuantity,
    removeFromCart: state.removeFromCart,
  }));

  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [checkoutTutorial, setCheckoutTutorial] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [isLoadingGuestLogin, setIsLoadingGuestLogin] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (cartItems.length > 0 && !showConfetti) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    } else if (cartItems.length === 0 && showConfetti) {
      setShowConfetti(false);
    }
  }, [cartItems.length, showConfetti]);

  useEffect(() => {
    const storedCartItemsString = localStorage.getItem("cartItems");
    if (storedCartItemsString) {
      const storedCartItems = JSON.parse(storedCartItemsString);
      if (Array.isArray(storedCartItems)) {
        initializeCart(storedCartItems);
        localStorage.removeItem("cartItems");
      } else {
        console.error("Stored cart items are not an array:", storedCartItems);
        localStorage.removeItem("cartItems");
      }
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
      if (url) {
        router.push(url);
      } else {
        toast.error("Error creating checkout session", {
          description: "Payment URL was not provided.",
          duration: 3000,
        });
        throw new Error("Unable to retrieve payment URL.");
      }
    },
    onError: (error) => {
      console.error("Checkout session creation failed:", error);
      toast.error("Something went wrong", {
        description:
          "There was an error initiating checkout. Please try again.",
        duration: 3000,
      });
    },
  });

  const handleContinueAsGuest = async () => {
    setIsLoadingGuestLogin(true);
    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "guest@demo.com",
          password: process.env.NEXT_PUBLIC_DEMO_PASSWORD,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error("Guest Login Failed", {
          description: data.error || "An error occurred during guest login.",
          duration: 4000,
        });
        console.error("Guest sign-in API error:", data.error);
      } else {
        toast.success("Welcome, Guest!", {
          description: "You can now continue.",
          duration: 3000,
        });

        createPaymentSession({
          cartItems: cartProductDetails,
          tax: tax,
          total: total,
          userId: process.env.NEXT_PUBLIC_DEMO_USERID!,
          userEmail: "guest@demo.com",
        });
        setIsLoginModalOpen(false);
      }
    } catch (error) {
      console.error("Guest sign-in request failed:", error);
      toast.error("Network Error", {
        description: "Could not connect to the server for guest login.",
        duration: 5000,
      });
    } finally {
      setIsLoadingGuestLogin(false);
    }
  };

  const handleCheckout = () => {
    if (authenticated) {
      if (!userId || !email) {
        console.error("Authenticated user data missing in store");
        toast.error("Authentication Error", {
          description: "User data incomplete. Please try logging in again.",
          duration: 3000,
        });
        checkStatus();
        return;
      }
      createPaymentSession({
        cartItems: cartProductDetails,
        tax: tax,
        total: total,
        userId: userId,
        userEmail: email,
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

  const handleRemoveItem = (productId: number) => {
    removeFromCart(productId);
    toast("Item Removed", {
      description: "Product removed from your cart.",
      duration: 2000,
    });
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
          <Dialog onOpenChange={setIsLoginModalOpen} open={isLoginModalOpen}>
            <DialogContent className="flex flex-col items-center p-6 sm:p-8 text-center max-w-md">
              {" "}
              <DialogHeader className="w-full">
                <div className="relative mx-auto w-16 h-16 mb-3">
                  {" "}
                  {/* Slightly smaller logo */}
                  <Image
                    src="/logo.webp"
                    alt="Your Brand Logo"
                    className="object-contain"
                    fill
                    priority
                  />
                </div>
                <DialogTitle className="text-xl md:text-2xl font-bold tracking-tight text-gray-900 mb-1">
                  {" "}
                  {/* Adjusted title size */}
                  Complete Your Order
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-600 max-w-sm mx-auto">
                  {" "}
                  {/* Adjusted description size */}
                  Log in or continue as a guest to finalize your purchase.
                </DialogDescription>
              </DialogHeader>
              {/* Stripe Test Mode Warning */}
              <div className="w-full bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-md flex items-start gap-3 text-left mt-4 mb-6">
                {" "}
                {/* Added warning styles */}
                <Info className="h-5 w-5 flex-shrink-0 text-yellow-600" />{" "}
                {/* Warning icon */}
                <div>
                  <p className="font-semibold text-sm">
                    Stripe Test Mode Active
                  </p>{" "}
                  {/* Warning title */}
                  <p className="text-xs mt-1">
                    No real money will be charged. Use the test card details
                    below:
                  </p>
                  {/* Test Card Details */}
                  <div className="mt-2 p-2 bg-yellow-100 rounded-sm text-yellow-900 text-xs font-mono break-all">
                    {" "}
                    {/* Styles for card details block */}
                    <p className="font-semibold">Card Number:</p>
                    <p className="select-all">4242 4242 4242 4242</p>{" "}
                    {/* Use select-all for easy copying */}
                    <p className="font-semibold mt-1">Expiry / CVC:</p>
                    <p>12/34 / 123</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
                {" "}
                <Link
                  href="/auth/signin"
                  className={buttonVariants({
                    variant: "default", // Primary style for Login
                    size: "lg",
                    className: "w-full",
                  })}
                  onClick={() => setIsLoginModalOpen(false)} // Close modal on navigation
                >
                  Log In to My Account
                </Link>
                {/* Continue as Guest Button */}
                <Button
                  variant="outline" // Secondary style for Guest
                  size="lg"
                  className="w-full"
                  onClick={handleContinueAsGuest}
                  disabled={isLoadingGuestLogin}
                >
                  {isLoadingGuestLogin ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Continue as Guest
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog onOpenChange={setCheckoutTutorial} open={checkoutTutorial}>
            <DialogContent className="flex flex-col items-center p-6 sm:p-8 text-center max-w-md">
              <DialogHeader className="w-full">
                <div className="relative mx-auto w-16 h-16 mb-3">
                  <Image
                    src="/logo.webp"
                    alt="Your Brand Logo"
                    className="object-contain"
                    fill
                    priority
                  />
                </div>
                <DialogTitle className="text-xl md:text-2xl font-bold tracking-tight text-gray-900 mb-1">
                  Complete Your Order
                </DialogTitle>
              </DialogHeader>
              <div className="w-full bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-md flex items-start gap-3 text-left mt-4 mb-6">
                {" "}
                <Info className="h-5 w-5 flex-shrink-0 text-yellow-600" />{" "}
                <div>
                  <p className="font-semibold text-sm">
                    Stripe Test Mode Active
                  </p>{" "}
                  <p className="text-xs mt-1">
                    No real money will be charged. Use the test card details
                    below:
                  </p>
                  <div className="mt-2 p-2 bg-yellow-100 rounded-sm text-yellow-900 text-xs font-mono break-all">
                    {" "}
                    <p className="font-semibold">Card Number:</p>
                    <p className="select-all">4242 4242 4242 4242</p>{" "}
                    <p className="font-semibold mt-1">Expiry / CVC:</p>
                    <p>12/34 / 123</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={handleCheckout}
                  disabled={isLoadingGuestLogin}
                >
                  Continue to Checkout
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <div className="flex flex-col py-10">
            {/* Back to Store Link */}
            <Link
              href="/store"
              className="self-start mb-8 transition-transform hover:scale-105 pt-10"
            >
              <ArrowLeft size={30} className="text-gray-700" />
            </Link>

            {/* Checkout Heading */}
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Checkout</h1>

            {/* Cart Items List */}
            {cartProductDetails.map((item) => (
              <div
                key={item.productId}
                className="flex flex-col sm:flex-row gap-4 items-center mb-6 p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow relative"
              >
                <div className="w-full sm:max-w-[120px] md:max-w-[150px] aspect-square flex-shrink-0">
                  <img
                    src={item.imgSrc}
                    alt={item.title}
                    loading="lazy"
                    className="rounded-md object-cover w-full h-full"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full justify-between items-start sm:items-center">
                  <div className="flex flex-col gap-2 flex-1">
                    <p className="text-lg font-semibold text-gray-800">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2 text-gray-600">
                      <button
                        onClick={() => handleDecreaseQuantity(item.productId)}
                        className="px-2 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 transition-colors"
                      >
                        -
                      </button>
                      <span className="text-base font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleIncreaseQuantity(item.productId)}
                        className="px-2 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-gray-700 text-base">
                      Price:{" "}
                      <span className="font-semibold text-gray-900">
                        ${item.price?.toFixed(2) ?? "N/A"}
                      </span>
                    </p>
                  </div>

                  <div className="flex-shrink-0 sm:self-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 p-2"
                      onClick={() => handleRemoveItem(item.productId)}
                      aria-label={`Remove ${item.title || "item"} from cart`}
                    >
                      <Trash className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {cartProductDetails.length <= 0 ? (
              <div className="flex flex-col gap-4 items-center py-10">
                <p className="text-lg text-gray-600">
                  You currently don't have any products in the cart.
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
                    <h2>{(total + tax).toFixed(2)}</h2>
                  </div>

                  <Button
                    onClick={() => {
                      if (!authenticated && !userId) {
                        handleCheckout();
                      } else {
                        setCheckoutTutorial(true);
                      }
                    }}
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
