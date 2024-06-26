import Link from "next/link";
import AuthForm from "../AuthForm";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const SignUpPage = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return !user ? (
    <div className="flex items-center justify-center min-h-screen grainy-light">
      <div className="p-8 bg-zinc-300 rounded shadow-md max-w-[400px] w-[90%]">
        <div className="flex justify-center items-center my-5">
          <img
            loading="lazy"
            decoding="async"
            src="/logo.webp"
            alt="Logo"
            className="w-28 h-8"
          />
          <img
            loading="lazy"
            decoding="async"
            src="/email-favicon.webp"
            alt="Logo"
            className="w-10 h-10"
          />
        </div>
        <AuthForm
          isSignUp={true}
          title="Sign Up with Email"
          emailConnectionId={
            process.env.KINDE_CONNECTION_EMAIL_PASSWORDLESS || ""
          }
          googleConnectionId={process.env.KINDE_CONNECTION_GOOGLE || ""}
          buttonText="Sign up with Email"
        />
        <div className="mt-4 text-center">
          <span>
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="text-indigo-600 hover:text-indigo-500"
            >
              Sign in
            </Link>
          </span>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center min-h-screen grainy-light">
      <p className="font-semibold text-lg">You are already registered!</p>
      <div className="mt-4 flex items-center gap-4">
        <Link href="/store" className={cn(buttonVariants(), "w-[120px]")}>
          Visit Store
        </Link>
        <Link href="/" className={cn(buttonVariants(), "w-[120px]")}>
          Home
        </Link>
      </div>
    </div>
  );
};

export default SignUpPage;
