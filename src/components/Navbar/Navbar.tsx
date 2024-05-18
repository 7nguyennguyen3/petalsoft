import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { CircleUser, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import MaxWidthWrapper from "../MaxWidthWrapper";
import { buttonVariants } from "../ui/button";
import Cart from "./Cart";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const Navbar = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <nav
      className="sticky z-[100] h-14 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/75
      backdrop-blur-lg transition-all"
    >
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href="/" className="pt-2">
            <Image src="/logo.png" alt="logo" width={100} height={100} />
          </Link>

          <div className="flex items-center gap-3 relative">
            <DropdownMenu>
              <DropdownMenuTrigger>
                {!user ? (
                  <Menu />
                ) : (
                  <p
                    className={buttonVariants({
                      variant: "outline",
                    })}
                  >
                    {user.given_name}
                  </p>
                )}
              </DropdownMenuTrigger>
              {!user ? (
                <DropdownMenuContent className="z-[200]">
                  <DropdownMenuItem className="flex items-center justify-center text-custom-purple">
                    <Link
                      href="/store"
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "h-8"
                      )}
                    >
                      Visit Store
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center justify-center text-custom-purple">
                    <Link
                      href="/api/auth/login"
                      className={buttonVariants({
                        size: "sm",
                        variant: "ghost",
                      })}
                    >
                      Login
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center justify-center text-custom-purple">
                    <Link
                      href="/api/auth/register"
                      className={buttonVariants({
                        size: "sm",
                        variant: "ghost",
                      })}
                    >
                      Sign up
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              ) : (
                <DropdownMenuContent className="z-[200]">
                  <DropdownMenuItem className="flex items-center justify-center text-custom-purple">
                    <Link
                      href="/store"
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "h-8"
                      )}
                    >
                      Visit Store
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
