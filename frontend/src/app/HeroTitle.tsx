"use client";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const HeroTitle = () => {
  return (
    <>
      {/* Full version for sm and larger screens */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden sm:block backdrop-blur-lg bg-white/90 p-8 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[800px]"
      >
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Unveil Your
          <br />
          Unique Essence
        </h1>

        <p className="text-lg text-zinc-600 mb-8 leading-relaxed">
          Discover luxury skincare and fragrances crafted with
          scientifically-proven natural ingredients. Experience personalized
          beauty solutions that adapt to your unique needs.
        </p>

        <div className="space-y-4 mb-10">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="p-2 bg-custom-purple/10 rounded-lg">
                <Check className="w-6 h-6 text-custom-purple animate-pulse" />
              </div>
              <span className="text-lg font-medium text-zinc-700">
                {feature}
              </span>
            </div>
          ))}
        </div>

        <Link
          href="/store"
          className={cn(
            buttonVariants(),
            "group bg-gradient-to-r from-purple-600 to-blue-600 gap-4 px-8 py-6 text-lg font-bold hover:scale-105 transition-transform w-auto text-center"
          )}
        >
          Explore Collection
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>

      {/* Compact version for xs screens */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="sm:hidden backdrop-blur-lg bg-white/90 p-4 rounded-xl shadow-lg max-w-md w-full mx-4"
      >
        <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Unveil Your Essence
        </h1>

        <p className="text-sm text-zinc-600 mb-4 leading-snug">
          Luxury skincare with clinically-proven natural ingredients.
        </p>

        <div className="space-y-2 mb-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="p-1 bg-custom-purple/10 rounded-md">
                <Check className="w-4 h-4 text-custom-purple" />
              </div>
              <span className="text-sm font-medium text-zinc-700">
                {feature}
              </span>
            </div>
          ))}
        </div>

        <Link
          href="/store"
          className={cn(
            buttonVariants(),
            "group bg-gradient-to-r from-purple-600 to-blue-600 gap-2 px-5 py-3 text-sm font-bold hover:scale-105 transition-transform w-full text-center"
          )}
        >
          Shop Now
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>
    </>
  );
};

const features = [
  "Clinical-grade natural formulations",
  "Personalized skin diagnostics",
  "Sustainable luxury packaging",
  "Global customer satisfaction",
];

export default HeroTitle;
