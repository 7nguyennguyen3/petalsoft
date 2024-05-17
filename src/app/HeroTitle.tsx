import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const HeroTitle = () => {
  return (
    <div className="w-full max-w-[500px] bg-zinc-100/80 rounded-md tracking-tight p-5">
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold py-5">
        Unveil Your <span className="gra-p-b">Unique Essence</span>
      </h1>
      <p className="text-lg">
        Dive into the world of PetalSoft, where luxury meets self-care. Explore
        our exquisite selection of{" "}
        <span className="font-semibold">perfumes and skincare products</span>{" "}
        designed to{" "}
        <span className="gra-p-b font-extrabold">
          elevate your daily ritual
        </span>
        .
      </p>
      <ul className="my-8 text-left font-medium flex flex-col">
        <div className="space-y-2">
          <li className="flex gap-1.5 items-center text-left">
            <Check className="h-5 w-5 shrink-0 text-custom-purple" />
            Clean, natural ingredients for healthy beauty
          </li>
          <li className="flex gap-1.5 items-center text-left">
            <Check className="h-5 w-5 shrink-0 text-custom-purple" />
            Tailor-made beauty rituals for every skin type
          </li>
          <li className="flex gap-1.5 items-center text-left">
            <Check className="h-5 w-5 shrink-0 text-custom-purple" />
            Turn back time with advanced anti-aging solutions
          </li>
          <li className="flex gap-1.5 items-center text-left">
            <Check className="h-5 w-5 shrink-0 text-custom-purple" />
            Celebrated worldwide for quality and results
          </li>
        </div>
      </ul>
      <Link
        href="/store"
        className={cn(
          buttonVariants(),
          "bg-custom-purple flex-1 items-center gap-2 w-[240px] h-[50px] font-bold text-lg"
        )}
      >
        Explore our shop
        <ArrowRight />
      </Link>
    </div>
  );
};

export default HeroTitle;
