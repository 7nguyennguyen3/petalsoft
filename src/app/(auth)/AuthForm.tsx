"use client";
import { useState } from "react";
import {
  LoginLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/components";

interface AuthFormProps {
  title: string;
  emailConnectionId: string;
  googleConnectionId: string;
  buttonText: string;
  isSignUp: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({
  title,
  emailConnectionId,
  googleConnectionId,
  buttonText,
  isSignUp,
}) => {
  const [email, setEmail] = useState("");

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-center mb-4">{title}</h1>

      {!isSignUp && (
        <>
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
              connection_id: emailConnectionId,
              login_hint: email,
            }}
            className="flex items-center justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            {buttonText}
          </LoginLink>
        </>
      )}
      {isSignUp && (
        <RegisterLink className="flex items-center justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
          Sign Up with Email
        </RegisterLink>
      )}
      <div className="flex items-center gap-2">
        <div className="h-[0.5px] w-[45%] bg-zinc-500" />
        <p>or</p>
        <div className="h-[0.5px] w-[45%] bg-zinc-500" />
      </div>
      <LoginLink
        authUrlParams={{
          connection_id: googleConnectionId,
        }}
        className="flex items-center justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
      >
        Continue with Google
      </LoginLink>
    </div>
  );
};

export default AuthForm;
