import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import Link from "next/link";

const SignInPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen grainy-light">
      <div className="p-8 bg-white rounded shadow-md w-96">
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
          <LoginLink
            className="flex items-center justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            authUrlParams={{
              connection_id: process.env.KINDE_CONNECTION_GOOGLE || "",
            }}
          >
            Sign in with Google
          </LoginLink>
          {/* <EmailInput className="w-full px-3 py-2 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300" /> */}
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
