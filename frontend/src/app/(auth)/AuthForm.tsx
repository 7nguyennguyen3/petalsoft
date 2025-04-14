"use client";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  LoginLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import React, { useState } from "react"; // Import React for SVG Props typing
// Removed: import { Icons } from "@/components/icons";

interface AuthFormProps {
  emailConnectionId: string;
  googleConnectionId: string;
  isSignUp: boolean;
}

// Define the GoogleIcon functional component directly in this file
// We use React.SVGProps for standard SVG attributes like className, width, height etc.
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <title>Google</title>
    <path
      d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.05 1.05-2.86 3.18-7.84 3.18-4.7 0-8.54-3.83-8.54-8.53 0-4.7 3.83-8.53 8.54-8.53 2.75 0 4.49.99 5.65 2.12l2.58-2.58C18.14 1.01 15.48 0 12.48 0 5.88 0 0 5.88 0 12.48s5.88 12.48 12.48 12.48c7.47 0 11.07-5.08 11.52-9.72h-11.52z"
      fill="currentColor"
    />
  </svg>
);

const AuthForm: React.FC<AuthFormProps> = ({
  emailConnectionId,
  googleConnectionId,
  isSignUp,
}) => {
  const [email, setEmail] = useState("");

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const emailButtonText = isSignUp
    ? "Sign Up with Email"
    : "Sign In with Email";
  const googleButtonText = "Continue with Google";

  return (
    <div className="space-y-4">
      {/* Email Section */}
      {!isSignUp && (
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            required
            value={email}
            onChange={handleEmailChange}
          />
        </div>
      )}

      {isSignUp ? (
        <RegisterLink
          authUrlParams={{
            connection_id: emailConnectionId,
          }}
          className={cn(
            buttonVariants({ variant: "default", size: "default" }),
            "w-full"
          )}
        >
          {emailButtonText}
        </RegisterLink>
      ) : (
        <LoginLink
          authUrlParams={{
            connection_id: emailConnectionId,
            login_hint: email,
          }}
          className={cn(
            buttonVariants({ variant: "default", size: "default" }),
            "w-full",
            !email && "opacity-50 pointer-events-none"
          )}
          aria-disabled={!email}
        >
          {emailButtonText}
        </LoginLink>
      )}

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      {/* Google Button */}
      <LoginLink
        authUrlParams={{
          connection_id: googleConnectionId,
        }}
        className={cn(
          buttonVariants({ variant: "outline", size: "default" }),
          "w-full flex items-center justify-center gap-2" // Added flex gap
        )}
      >
        {/* Use the GoogleIcon defined above */}
        <GoogleIcon className="h-4 w-4" />
        {googleButtonText}
      </LoginLink>
    </div>
  );
};

export default AuthForm;
