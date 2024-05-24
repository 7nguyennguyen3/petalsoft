import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className="grainy-light">
      <MaxWidthWrapper>
        <div className="min-h-screen flex flex-col justify-center items-center max-w-[600px] mx-auto">
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
              src="../favicon.ico"
              alt="Logo"
              className="w-10 h-10"
            />
          </div>
          <h1 className="text-3xl font-bold mb-4">
            Sorry! This page does not exist.
          </h1>
          <p className="text-lg my-2 text-center">
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>
          <Link href="/" className={cn(buttonVariants(), "gap-2 mt-4")}>
            Go to Home Page <ArrowRight size={20} />
          </Link>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default NotFoundPage;
