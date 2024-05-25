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
              alt="Company Logo"
              className="w-28 h-8"
            />

            <img
              loading="lazy"
              decoding="async"
              src="../favicon.ico"
              alt="Company Favicon"
              className="w-10 h-10"
            />
          </div>
          <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
          <p className="text-lg my-2 text-center">
            We're unable to locate the page you requested. It may have been
            deleted, renamed, or is temporarily inaccessible.
          </p>
          <Link href="/" className={cn(buttonVariants(), "gap-2 mt-4")}>
            Return to Home Page <ArrowRight size={20} />
          </Link>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default NotFoundPage;
