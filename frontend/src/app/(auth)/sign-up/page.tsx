import Link from "next/link";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AuthForm from "../AuthForm"; // Assuming AuthForm is in the correct relative path
import Image from "next/image"; // Use Next.js Image for optimization

const SignUpPage = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (user) {
    // Already Logged In State - Same as SignInPage
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Already Signed In</CardTitle>
            <CardDescription>
              You are already signed in as {user.email}.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/store"
              className={cn(
                buttonVariants({ variant: "default" }),
                "w-full sm:w-auto"
              )}
            >
              Visit Store
            </Link>
            <Link
              href="/"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "w-full sm:w-auto"
              )}
            >
              Go Home
            </Link>
            {/* Optional: Add Logout Button Here */}
            {/* <LogoutLink className={cn(buttonVariants({ variant: "destructive" }), "w-full sm:w-auto")}>Log out</LogoutLink> */}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Sign Up Form State
  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {/* Single Logo */}
          <div className="flex justify-center mb-4">
            <Image
              priority
              src="/logo.webp" // Assuming this is your main logo
              alt="Your Brand Logo"
              width={112} // w-28
              height={32} // h-8
              style={{ width: "auto", height: "32px" }}
            />
          </div>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>
            Sign up for an account using your email or Google.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm
            isSignUp={true}
            // Title is handled by CardHeader now
            emailConnectionId={
              process.env.KINDE_CONNECTION_EMAIL_PASSWORDLESS || ""
            }
            googleConnectionId={process.env.KINDE_CONNECTION_GOOGLE || ""}
            // Button text handled within AuthForm
          />
        </CardContent>
        <CardFooter className="flex justify-center text-sm">
          <p className="text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-medium text-primary hover:underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUpPage;
