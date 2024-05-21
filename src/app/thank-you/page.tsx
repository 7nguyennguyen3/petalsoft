"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import React, { useEffect, useState } from "react";
import Confetti from "react-dom-confetti";

const ThankYouPage = () => {
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

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
          <div className="min-h-screen flex flex-col gap-5 pt-40 max-w-[600px] mx-auto">
            <h1 className="xs:text-2xl sm:text-3xl font-bold gra-p-b">
              Thank You For Your Purchase!
            </h1>
            <p className="mt-4 text-lg">
              Your order is confirmed. We are preparing your items for dispatch.
            </p>
            <p className="mt-2 text-lg">
              A confirmation email has been sent to your email. You can expect
              your items to arrive within 3-5 business days.
            </p>
          </div>
        </MaxWidthWrapper>
      </div>
    </>
  );
};

export default ThankYouPage;
