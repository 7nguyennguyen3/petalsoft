import type { Metadata } from "next";
import { Recursive } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "@/components/ui/sonner";
import ChatPopup from "@/components/chat/ChatPopUp";

const recursive = Recursive({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PetalSoft - Premium Skincare & Perfumes | Shop Your Essence",
  description:
    "Discover the luxury of PetalSoft's skincare and perfumes. Shop your essence with our exclusive collections and embrace your unique beauty today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={recursive.className}>
        <Navbar />
        <Providers>{children}</Providers>
        <ChatPopup />
        <Footer />
        <Toaster />
        <SpeedInsights />
      </body>
    </html>
  );
}
