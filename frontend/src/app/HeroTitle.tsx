"use client";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const HeroTitle = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="backdrop-blur-lg bg-white/90 p-8 rounded-2xl shadow-2xl max-w-2xl"
    >
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        Unveil Your
        <br />
        Unique Essence
      </h1>

      <p className="text-xl text-zinc-600 mb-8 leading-relaxed">
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
            <span className="text-lg font-medium text-zinc-700">{feature}</span>
          </div>
        ))}
      </div>

      <Link
        href="/store"
        className={cn(
          buttonVariants(),
          "group bg-gradient-to-r from-purple-600 to-blue-600 gap-4 px-8 py-6 text-lg font-bold hover:scale-105 transition-transform"
        )}
      >
        Explore Collection
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Link>
    </motion.div>
  );
};

const features = [
  "Clinical-grade natural formulations",
  "Personalized skin diagnostics",
  "Sustainable luxury packaging",
  "Global customer satisfaction",
];

export default HeroTitle;
