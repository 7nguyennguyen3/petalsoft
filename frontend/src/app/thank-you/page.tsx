"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store";
import { ArrowRight, CheckCircle } from "lucide-react"; // Added CheckCircle icon
import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import Confetti from "react-dom-confetti";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const ThankYouPage = ({ searchParams }: PageProps) => {
  const { clearCart } = useCartStore();
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [isValidToken, setIsValidToken] = useState<{
    isValid: boolean;
    orderId?: string;
    error?: string; // Added error state for verification
  }>({ isValid: false, orderId: "" });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { token } = searchParams;

  if (!token) {
    notFound();
  }

  useEffect(() => {
    const verifyToken = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/token-verification?token=${token}`);
        const data = await res.json();

        if (!res.ok) {
          // Handle cases where the API returns a non-200 status
          setIsValidToken({
            isValid: false,
            error: data.error || "Invalid or expired token.",
          });
          // Optionally redirect here if an invalid token means they shouldn't stay on this URL
          // router.push('/checkout'); // Example redirect
        } else {
          // Assuming the API returns { isValid: boolean, orderId?: string }
          if (data.isValid) {
            setIsValidToken({ isValid: true, orderId: data.orderId });
            setShowConfetti(true); // Trigger confetti on successful verification
            localStorage.removeItem("cartItems");
            clearCart();
          } else {
            // API returned 200 but isValid is false
            setIsValidToken({
              isValid: false,
              error: data.error || "Invalid or expired token.",
            });
          }
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        setIsValidToken({ isValid: false, error: "Could not verify token." });
      } finally {
        setIsLoading(false);
      }
    };

    // Only verify if token is present (checked above, but defensive)
    if (token && typeof token === "string") {
      verifyToken();
    } else if (!token) {
      setIsLoading(false); // Stop loading if token is missing
    }

    // Cleanup timer on unmount
    return () => {
      const timer = setTimeout(() => setShowConfetti(false), 3000); // Define timer locally
      clearTimeout(timer);
    };
  }, [token]); // Depend on token

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <MaxWidthWrapper className="w-full max-w-2xl text-center">
          <Skeleton circle height={80} width={80} className="mb-6 mx-auto" />
          <Skeleton height={40} width={300} className="mb-4 mx-auto" />
          <Skeleton
            count={2}
            height={20}
            width="80%"
            className="mb-2 mx-auto"
          />
          <Skeleton height={20} width="60%" className="mb-8 mx-auto" />
          <Skeleton height={50} width={200} className="mx-auto" />
        </MaxWidthWrapper>
      </div>
    );
  }

  // Handle Invalid Token State
  if (!isValidToken.isValid) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 text-center">
        <MaxWidthWrapper className="w-full max-w-md">
          <CheckCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Order Not Found
          </h1>
          <p className="text-base text-gray-600 mb-6">
            The link is invalid or has expired. Please check your order history
            or contact support if you have questions.
          </p>
          {isValidToken.error && (
            <p className="text-sm text-red-500 mb-6">{isValidToken.error}</p>
          )}
          <Link
            href="/my-order" // Link to order history
            className={cn(
              buttonVariants({ variant: "outline" }), // Use outline variant for secondary action
              "mt-4"
            )}
          >
            Go to My Orders
          </Link>
          <Link
            href="/store"
            className="block mt-4 text-sm text-indigo-600 hover:underline"
          >
            Continue Shopping
          </Link>
        </MaxWidthWrapper>
      </div>
    );
  }

  // Successful Verification - Display Thank You
  return (
    <>
      {/* Confetti container - kept for effect */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-0 overflow-hidden flex justify-center"
      >
        {/* Confetti active state is now controlled by isValidToken success */}
        <Confetti
          active={showConfetti}
          config={{ elementCount: 200, spread: 90 }}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        {" "}
        {/* Added flex, alignment, padding, background */}
        <MaxWidthWrapper className="w-full max-w-2xl text-center bg-white p-8 md:p-10 rounded-lg shadow-xl">
          {" "}
          {/* Added background, padding, rounded corners, shadow */}
          {/* Success Icon */}
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />{" "}
          {/* Increased size, added color, centered, margin */}
          {/* Thank You Heading */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            {" "}
            {/* Adjusted font size, color, margin */}
            Thank You For Your Purchase!
          </h1>
          {/* Order ID Section */}
          <div className="bg-gray-100 p-4 rounded-md inline-block mb-6">
            {" "}
            {/* Added background, padding, rounded corners, inline block */}
            <p className="text-sm font-medium text-gray-600">Order ID:</p>
            <p className="text-xl font-semibold text-gray-800">
              {isValidToken.orderId}
            </p>{" "}
            {/* Made Order ID more prominent */}
          </div>
          {/* Confirmation Messages */}
          <p className="text-base text-gray-700 mb-4">
            {" "}
            {/* Adjusted text size, color, margin */}
            Your order is confirmed. We are preparing your items for dispatch.
          </p>
          <p className="text-base text-gray-700 mb-8">
            {" "}
            {/* Adjusted text size, color, margin */}A confirmation email has
            been sent. You can expect your items to arrive within 3-5 business
            days.
          </p>
          {/* Call to Action Button */}
          <Link
            href="/my-order"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }), // Larger button
              "bg-indigo-600 hover:bg-indigo-700 text-white gap-2 mt-4" // Custom button styles
            )}
          >
            Go To Your Order!
            <ArrowRight size={20} />
          </Link>
          {/* Optional: Continue Shopping Link */}
          <Link
            href="/store"
            className="block mt-4 text-sm text-indigo-600 hover:underline"
          >
            Continue Shopping
          </Link>
        </MaxWidthWrapper>
      </div>
    </>
  );
};

export default ThankYouPage;
