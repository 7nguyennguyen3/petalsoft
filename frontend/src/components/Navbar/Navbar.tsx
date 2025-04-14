import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Assuming you have an Avatar component
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import {
  HelpCircle,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  ShoppingBag,
  Store,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import MaxWidthWrapper from "../MaxWidthWrapper";
import Cart from "./Cart";

const Navbar = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const renderCommonMenuItems = () => (
    <>
      <DropdownMenuItem asChild>
        <Link href="/store" className="flex items-center gap-2 cursor-pointer">
          <Store className="h-4 w-4" />
          <span>Visit Store</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 cursor-pointer"
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>Admin Dashboard</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href="/faq" className="flex items-center gap-2 cursor-pointer">
          <HelpCircle className="h-4 w-4" />
          <span>FAQ</span>
        </Link>
      </DropdownMenuItem>
    </>
  );

  return (
    <nav
      className="sticky z-[100] h-16 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/85
       backdrop-blur-lg transition-all" // Slightly increased height for better spacing, adjusted opacity
    >
      <MaxWidthWrapper>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-1">
            <Image
              src="/logo.webp"
              alt="Your Brand Logo" // More descriptive alt text
              width={90} // Adjusted size for navbar height
              height={90}
              className="object-contain" // Ensure logo scales nicely
            />
          </Link>

          <div className="flex items-center gap-4">
            {" "}
            {/* Increased gap */}
            {/* Cart Icon - Kept separate for prominence */}
            <Cart />
            {/* User/Auth Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {/* More visually appealing trigger */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative flex items-center justify-center rounded-full h-10 w-10 focus:ring-2 focus:ring-ring focus:ring-offset-2" // Standard sizing and focus indicator
                  aria-label="User menu" // Accessibility
                >
                  {user ? (
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user.picture ?? undefined}
                        alt={`${user.given_name}'s profile picture`}
                      />
                      <AvatarFallback>
                        {/* Show initials or fallback icon */}
                        {user.given_name ? (
                          user.given_name.substring(0, 1).toUpperCase()
                        ) : (
                          <User className="h-5 w-5" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <Menu className="h-6 w-6" /> // Standard menu icon for guests
                  )}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56 z-[110]" align="end">
                {" "}
                {/* Increased z-index, width, aligned end */}
                {user ? (
                  <>
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.given_name} {user.family_name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/my-order"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        {" "}
                        {/* Corrected link, added icon */}
                        <ShoppingBag className="h-4 w-4" />
                        <span>My Orders</span>
                      </Link>
                    </DropdownMenuItem>
                    {renderCommonMenuItems()} {/* Render common links */}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        href="/api/auth/logout"
                        className="flex items-center gap-2 text-red-600 hover:text-red-700 cursor-pointer"
                      >
                        {" "}
                        {/* Added icon, color */}
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuLabel>Menu</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {renderCommonMenuItems()} {/* Render common links */}
                    <DropdownMenuItem asChild>
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        href="/sign-in"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <LogIn className="h-4 w-4" />
                        <span>Login / Sign Up</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
