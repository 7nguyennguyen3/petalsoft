"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import axios from "axios";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Confetti from "react-dom-confetti";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from "react-loading-skeleton";

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const ThankYouPage = ({ searchParams }: PageProps) => {
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [isValidToken, setIsValidToken] = useState<{
    isValid: boolean;
    orderId?: string;
  }>({ isValid: false, orderId: "" });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { token } = searchParams;

  if (!token) notFound();

  useEffect(() => {
    const verifyToken = async () => {
      setIsLoading(true);
      const response = await axios
        .get(`/api/token-verification?token=${token}`)
        .then((res) => res.data);
      console.log(response);
      setIsValidToken(response);
      setIsLoading(false);
    };

    if (token) {
      verifyToken();
    }
  }, [token]);

  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="grainy-light">
        <MaxWidthWrapper>
          <div className="min-h-screen flex flex-col gap-5 pt-40 max-w-[600px] mx-auto">
            <Skeleton height={50} width={400} />
            <Skeleton count={2} height={40} />
            <Skeleton count={2} height={40} />
            <Skeleton height={50} width={300} />
          </div>
        </MaxWidthWrapper>
      </div>
    );
  }

  return !isValidToken.isValid ? (
    notFound()
  ) : (
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
          <div className="min-h-screen flex flex-col gap-5 pt-40 max-w-[600px] mx-auto">
            <h1 className="xs:text-2xl sm:text-3xl font-bold gra-p-b">
              Thank You For Your Purchase!
            </h1>
            <p>Order ID: {isValidToken.orderId}</p>
            <p className="mt-4 text-lg">
              Your order is confirmed. We are preparing your items for dispatch.
            </p>
            <p className="mt-2 text-lg">
              A confirmation email has been sent to your email. You can expect
              your items to arrive within 3-5 business days.
            </p>
            <Link
              href="/my-order"
              className={cn(
                buttonVariants({ variant: "default" }),
                "bg-custom-purple gap-2 self-start"
              )}
            >
              Go To Your Order!
              <ArrowRight size={20} />
            </Link>
          </div>
        </MaxWidthWrapper>
      </div>
    </>
  );
};

export default ThankYouPage;
