"use client";

import type { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import Image from "next/image";
import { buttonVariants, Button } from "./ui/button";
import Link from "next/link";
import { useState } from "react";
// Replace use-toast import with sonner
import { toast } from "sonner"; // Import toast from sonner
import { Loader2 } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onGuestSignInSuccess?: () => void;
}

const LoginModal = ({
  isOpen,
  setIsOpen,
  onGuestSignInSuccess,
}: LoginModalProps) => {
  const [isLoadingGuestLogin, setIsLoadingGuestLogin] = useState(false);

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
        // Use toast.error for destructive messages
        toast.error("Guest Login Failed", {
          description: data.error || "An error occurred during guest login.",
          duration: 4000,
        });
        console.error("Guest sign-in API error:", data.error);
      } else {
        // Use toast.success for success messages
        toast.success("Welcome, Guest!", {
          description: "You can now continue.",
          duration: 3000,
        });

        setIsOpen(false);
        onGuestSignInSuccess?.();
      }
    } catch (error) {
      console.error("Guest sign-in request failed:", error);
      // Use toast.error for network/internal errors
      toast.error("Network Error", {
        description: "Could not connect to the server for guest login.",
        duration: 5000,
      });
    } finally {
      setIsLoadingGuestLogin(false);
    }
  };

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogContent className="flex flex-col items-center p-6 sm:p-8 text-center">
        <DialogHeader className="w-full">
          <div className="relative mx-auto w-20 h-20 mb-4">
            <Image
              src="/logo.webp"
              alt="Your Brand Logo"
              className="object-contain"
              fill
              priority
            />
          </div>
          <DialogTitle className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 mb-2">
            Unlock Full Access
          </DialogTitle>
          <DialogDescription className="text-sm md:text-base text-gray-600 max-w-sm mx-auto">
            Log in or create an account to save your progress and complete
            purchases.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 w-full max-w-xs mx-auto mt-6">
          <Link
            href="/sign-in"
            className={buttonVariants({
              variant: "default",
              size: "lg",
              className: "w-full",
            })}
            onClick={() => setIsOpen(false)}
          >
            Log in
          </Link>

          <Link
            href="/sign-up"
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className: "w-full",
            })}
            onClick={() => setIsOpen(false)}
          >
            Sign up
          </Link>

          <Button
            variant="ghost"
            size="lg"
            className="w-full text-indigo-600 hover:text-indigo-700"
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
  );
};

export default LoginModal;
