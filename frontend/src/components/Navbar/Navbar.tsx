import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Menu, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import MaxWidthWrapper from "../MaxWidthWrapper";
import { buttonVariants } from "../ui/button";
import Cart from "./Cart";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const Navbar = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  // const adminEmails = process.env.ADMIN_EMAIL!.split(",");

  return (
    <nav
      className="sticky z-[100] h-14 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/75
      backdrop-blur-lg transition-all"
    >
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href="/" className="pt-2">
            <Image src="/logo.webp" alt="logo" width={100} height={100} />
          </Link>

          <div className="flex items-center gap-3 relative">
            <DropdownMenu>
              <DropdownMenuTrigger>
                {!user ? (
                  <Menu size={28} />
                ) : (
                  <p
                    className={cn(
                      buttonVariants({
                        variant: "outline",
                      }),
                      "shadow-lg"
                    )}
                  >
                    {user.given_name !== undefined ? user.given_name : <User />}
                  </p>
                )}
              </DropdownMenuTrigger>
              {!user ? (
                <DropdownMenuContent className="z-[200]">
                  <DropdownMenuItem className="flex items-center justify-center text-custom-purple">
                    <Link
                      href="/dashboard"
                      className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "h-8"
                      )}
                    >
                      Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center justify-center text-custom-purple">
                    <Link
                      href="/store"
                      className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "h-8"
                      )}
                    >
                      Visit Store
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center justify-center text-custom-purple">
                    <Link
                      href="/sign-in"
                      className={buttonVariants({
                        size: "sm",
                        variant: "ghost",
                      })}
                    >
                      Login / Sign Up
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="flex items-center justify-center text-custom-purple">
                    <Link
                      href="/faq"
                      className={buttonVariants({
                        size: "sm",
                        variant: "ghost",
                      })}
                    >
                      FAQ
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              ) : (
                <DropdownMenuContent className="z-[200]">
                  {
                    // user && user.email && adminEmails.includes(user.email) &&
                    <DropdownMenuItem className="flex items-center justify-center text-custom-purple">
                      <Link
                        href="/dashboard"
                        className={cn(
                          buttonVariants({ variant: "ghost" }),
                          "h-8"
                        )}
                      >
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  }
                  <DropdownMenuItem className="flex items-center justify-center text-custom-purple">
                    <Link
                      href="/store"
                      className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "h-8"
                      )}
                    >
                      Visit Store
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center justify-center text-custom-purple">
                    <Link
                      href="/my-order"
                      className={buttonVariants({
                        size: "sm",
                        variant: "ghost",
                      })}
                    >
                      My Order
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center justify-center text-custom-purple">
                    <Link
                      href="/faq"
                      className={buttonVariants({
                        size: "sm",
                        variant: "ghost",
                      })}
                    >
                      FAQ
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center justify-center text-custom-purple">
                    <Link
                      href="/api/auth/logout"
                      className={buttonVariants({
                        size: "sm",
                        variant: "ghost",
                      })}
                    >
                      Logout
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              )}
            </DropdownMenu>
            <Cart />
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
