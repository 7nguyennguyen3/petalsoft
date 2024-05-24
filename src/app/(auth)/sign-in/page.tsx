"use client";
import { useState } from "react";
import Link from "next/link";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";

const SignInPage = () => {
  const [email, setEmail] = useState("");

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  return (
    <div className="flex items-center justify-center min-h-screen grainy-light">
      <div className="p-8 bg-zinc-300 rounded shadow-md w-96">
        <div className="flex justify-center items-center my-5">
          <img
            loading="lazy"
            decoding="async"
            src="/logo.webp"
            alt="Logo"
            className="w-24 h-10"
          />
          <img
            loading="lazy"
            decoding="async"
            src="../favicon.ico"
            alt="Logo"
            className="w-10 h-10"
          />
        </div>
        <h1 className="text-2xl font-bold text-center mb-4">Custom Sign In</h1>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={handleEmailChange}
            className="w-full px-3 py-2 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300"
          />
          <LoginLink
            authUrlParams={{
              connection_id:
                process.env.KINDE_CONNECTION_EMAIL_PASSWORDLESS || "",
              login_hint: email,
            }}
            className="flex items-center justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Sign in with Email
          </LoginLink>
          <LoginLink
            authUrlParams={{
              connection_id: process.env.KINDE_CONNECTION_GOOGLE || "",
              login_hint: email,
            }}
            className="flex items-center justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
          >
            Sign in with Google
          </LoginLink>
        </div>
        <div className="mt-4 text-center">
          <span>
            Don't have an account?{" "}
            <Link
              href="/sign-up"
              className="text-indigo-600 hover:text-indigo-500"
            >
              Create account
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
