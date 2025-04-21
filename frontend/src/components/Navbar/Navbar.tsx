"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useAuthStore } from "@/app/_store/useAuthStore";
import { useEffect } from "react";

const Navbar = () => {
  const { authenticated, name, email, logout, checkStatus, userId } =
    useAuthStore();

  useEffect(() => {
    checkStatus();
  }, [checkStatus]); // checkStatus is a stable action from Zustand, safe dependency

  const renderCommonMenuItems = () => (
    <>
      <DropdownMenuItem asChild>
        <Link href="/store" className="flex items-center gap-2 cursor-pointer">
          <Store className="h-4 w-4" />
          <span>Visit Store</span>
        </Link>
      </DropdownMenuItem>
      {/*
        Admin Dashboard link:
        Kept here in common items based on previous structure.
        If the page /dashboard is truly accessible to anyone without auth,
        showing this link to everyone is okay, but the "Admin Dashboard" label
        can be misleading if non-admins only see limited content.
        Consider conditionally showing/labeling based on `role` from your store if needed.
      */}
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

  // Determine avatar fallback text - use first initial if name is available
  const avatarFallbackText = name ? (
    name.substring(0, 1).toUpperCase()
  ) : (
    <User className="h-5 w-5" />
  );

  return (
    <nav
      className="sticky z-[100] h-16 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/85
           backdrop-blur-lg transition-all"
    >
      <MaxWidthWrapper>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-1">
            <Image
              src="/logo.webp"
              alt="Your Brand Logo"
              width={90}
              height={90}
              className="object-contain"
            />
          </Link>

          <div className="flex items-center gap-4">
            <Cart /> {/* Cart Icon */}
            {/* User/Auth Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative flex items-center justify-center rounded-full h-10 w-10 focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  aria-label="User menu"
                >
                  {/* Show Avatar if authenticated, otherwise show Menu icon */}
                  {authenticated ? (
                    <Avatar className="h-8 w-8">
                      {/* If you had a picture URL in your store state: */}
                      {/* <AvatarImage src={pictureUrl} alt={`${name}'s profile picture`} /> */}
                      {/* Fallback to initials or generic user icon */}
                      <AvatarFallback>{avatarFallbackText}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56 z-[110]" align="end">
                {authenticated ? (
                  <>
                    {/* Display user name and email if authenticated */}
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {/* Links specific to authenticated users */}
                    {/* Removed duplicate Admin Dashboard link here */}
                    <DropdownMenuItem asChild>
                      <Link
                        href="/my-order"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <ShoppingBag className="h-4 w-4" />
                        <span>My Orders</span>
                      </Link>
                    </DropdownMenuItem>
                    {renderCommonMenuItems()}{" "}
                    {/* Render common links (includes Dashboard) */}
                    <DropdownMenuSeparator />
                    {/* Logout button - triggers the store's logout action */}
                    <DropdownMenuItem
                      onClick={() => logout()} // Call the logout function from the store
                      className="flex items-center gap-2 text-red-600 hover:text-red-700 cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    {/* Links for guests */}
                    <DropdownMenuLabel>Menu</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {renderCommonMenuItems()}{" "}
                    {/* Render common links (includes Dashboard) */}
                    {/* Removed duplicate Admin Dashboard link here */}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      {/* Link to your sign-in page */}
                      <Link
                        href="/auth/signin" // Assuming this is your sign-in route
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
