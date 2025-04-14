// src/app/page.tsx
"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Check,
  Star,
  Quote,
  ArrowRight,
  FlaskConical,
  Sparkles,
  Recycle,
  Users,
  Leaf,
  Heart,
} from "lucide-react";
import HeroTitle from "./HeroTitle";
import ProductCarousel from "./ProductCarousel";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { toast } from "sonner";

// --- Data (Keep as before) ---
const features = [
  {
    id: "f1",
    icon: FlaskConical,
    title: "Science-Backed Botanicals",
    description:
      "Clinical-grade natural ingredients delivering visible results.",
  },
  {
    id: "f2",
    icon: Sparkles,
    title: "Personalized Solutions",
    description: "Skincare and fragrances adapting to your unique needs.",
  },
  {
    id: "f3",
    icon: Recycle,
    title: "Sustainable Luxury",
    description: "Premium experiences with eco-conscious packaging.",
  },
  {
    id: "f4",
    icon: Users,
    title: "Community Trusted",
    description: "Join over 500,000 satisfied customers worldwide.",
  },
];
const testimonials = [
  {
    id: "t1",
    quote:
      "This moisturizer is magic! My skin has never felt so hydrated and refreshed. The natural scent is divine.",
    author: "Elena R.",
    avatar: "/user-2.webp",
    initials: "ER",
  },
  {
    id: "t2",
    quote:
      "The anti-aging serum delivers! Noticeable difference in just a few weeks. Plus, I love their commitment to sustainability.",
    author: "Marcus T.",
    avatar: "/user-3.webp",
    initials: "MT",
  },
];
const ingredients = [
  {
    id: "i1",
    icon: Leaf,
    name: "Green Tea Extract",
    description: "Rich in antioxidants to protect and soothe skin.",
    bgColor: "from-green-100 to-teal-100",
    iconColor: "text-green-700",
  },
  {
    id: "i2",
    icon: Sparkles,
    name: "Hyaluronic Acid",
    description: "Intensely hydrates and plumps for a youthful look.",
    bgColor: "from-pink-100 to-rose-100",
    iconColor: "text-pink-700",
  },
  {
    id: "i3",
    icon: FlaskConical,
    name: "Niacinamide",
    description: "Visibly improves pores, tone, and skin barrier.",
    bgColor: "from-indigo-100 to-purple-100",
    iconColor: "text-indigo-700",
  },
];

// --- Reusable Card Components (Keep definitions as before) ---
interface FeatureItem {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
}
function FeatureCard({ item, index }: { item: FeatureItem; index: number }) {
  const IconComponent = item.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5, scale: 1.03 }}
      className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="p-3 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full mb-4">
        {" "}
        <IconComponent className="w-7 h-7 text-purple-700" />{" "}
      </div>
      <h4 className="text-lg font-semibold text-zinc-900 mb-2">{item.title}</h4>
      <p className="text-sm text-zinc-600 leading-relaxed">
        {item.description}
      </p>
    </motion.div>
  );
}
interface Testimonial {
  id: string;
  quote: string;
  author: string;
  avatar: string;
  initials: string;
}
function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-purple-50 p-6 rounded-2xl shadow-sm border border-purple-100 flex flex-col h-full"
    >
      <div className="flex gap-1 mb-3">
        {" "}
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
        ))}{" "}
      </div>
      <blockquote className="text-base font-medium leading-relaxed text-zinc-700 mb-5 relative italic grow">
        {" "}
        <Quote
          className="w-5 h-5 text-purple-200 absolute -left-1 -top-1"
          aria-hidden="true"
        />{" "}
        "{testimonial.quote}"{" "}
      </blockquote>
      <div className="flex items-center gap-3 mt-auto pt-4 border-t border-purple-100">
        <Avatar className="w-10 h-10">
          {" "}
          <AvatarImage
            src={testimonial.avatar}
            alt={`${testimonial.author} avatar`}
          />{" "}
          <AvatarFallback>{testimonial.initials}</AvatarFallback>{" "}
        </Avatar>
        <div>
          {" "}
          <p className="font-semibold text-sm text-zinc-900">
            {testimonial.author}
          </p>{" "}
          <p className="flex items-center gap-1 text-xs text-green-700 font-medium mt-0.5">
            <Check className="w-3 h-3" /> Verified Customer
          </p>{" "}
        </div>
      </div>
    </motion.div>
  );
}
interface IngredientItem {
  id: string;
  icon: React.ElementType;
  name: string;
  description: string;
  bgColor: string;
  iconColor: string;
}
function IngredientCard({ item }: { item: IngredientItem }) {
  const IconComponent = item.icon;
  return (
    <div className="flex items-start gap-4 p-5 border border-zinc-200 rounded-lg hover:border-purple-300 hover:bg-purple-50/30 transition-colors">
      <div
        className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br",
          item.bgColor
        )}
      >
        {" "}
        <IconComponent className={cn("w-6 h-6", item.iconColor)} />{" "}
      </div>
      <div>
        {" "}
        <h4 className="font-semibold text-lg mb-1 text-zinc-800">
          {item.name}
        </h4>{" "}
        <p className="text-sm text-zinc-600">{item.description}</p>{" "}
      </div>
    </div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Stagger animation of children
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
};

// --- Homepage Component ---
export default function Home() {
  const [email, setEmail] = useState("");

  // Handler for Newsletter Submission
  const handleSubscribe = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Demo subscribe with:", email);
    // --- Updated Toast Message ---
    toast.success("Subscribed! (This is a demo - no email stored)");
    setEmail("");
  };

  // Handler for "More Reviews" Button Click
  const handleMoreReviewsClick = () => {
    // --- Updated Toast Message ---
    toast.info("Thanks for your interest! This page is under construction.");
  };

  // --- New Handler for "Learn Ingredients" Button Click ---
  const handleLearnIngredientsClick = () => {
    toast.info("Coming Soon! We're preparing detailed ingredient information.");
  };
  // --- End New Handler ---

  return (
    <div className="overflow-x-hidden bg-white text-zinc-900">
      {/* === Hero Section === */}
      <section className="relative h-[95vh] min-h-[650px] max-h-[900px] flex flex-col text-center text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/cleanser.jpg"
            fill
            priority
            quality={90}
            sizes="100vw"
            className="object-cover object-center"
            alt="Elegant display of PetalSoft skincare products"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
        </div>
        <MaxWidthWrapper className="relative z-10 flex flex-col items-center justify-center flex-grow h-full px-4">
          <HeroTitle />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-4 max-w-xl text-lg sm:text-xl text-zinc-200 text-shadow-sm"
          >
            Luxury skincare & fragrances crafted with science-backed natural
            ingredients. Your personalized path to radiance.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8"
          >
            <Link
              href="/store"
              className={cn(
                buttonVariants({ size: "lg" }),
                "group bg-gradient-to-r from-purple-600 to-blue-600 text-white",
                "hover:from-purple-700 hover:to-blue-700",
                "gap-2 px-8 py-3 text-base sm:text-lg font-semibold",
                "transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
              )}
            >
              Explore The Collection
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </MaxWidthWrapper>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 text-white animate-bounce">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            {" "}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m19.5 8.25-7.5 7.5-7.5-7.5"
            />{" "}
          </svg>
        </div>
      </section>

      {/* === Trust Signals === */}
      <section className="py-12 sm:py-16 bg-white">
        <MaxWidthWrapper className="px-4 sm:px-6">
          <h3 className="text-center text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">
            Trusted & Recognized
          </h3>
          {/* Optional: Add a small descriptive line */}
          <p className="text-center text-zinc-600 text-sm mb-8 max-w-md mx-auto">
            We are committed to ethical practices and creating products you can
            feel good about.
          </p>

          {/* Stagger animation container */}
          <motion.div
            className="flex flex-wrap justify-center items-center gap-4 sm:gap-6" // Reduced gap slightly
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }} // Trigger when 30% is visible
          >
            {/* Styled Badges */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-2 bg-white border border-zinc-200 px-3 py-1.5 rounded-full shadow-sm hover:shadow-md transition-shadow cursor-default" // Added bg, border, shadow, rounded-full
            >
              <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-zinc-700">
                Cruelty-Free
              </span>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-2 bg-white border border-zinc-200 px-3 py-1.5 rounded-full shadow-sm hover:shadow-md transition-shadow cursor-default" // Added bg, border, shadow, rounded-full
            >
              <Recycle className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-zinc-700">
                Recyclable Packaging
              </span>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-2 bg-white border border-zinc-200 px-3 py-1.5 rounded-full shadow-sm hover:shadow-md transition-shadow cursor-default"
            >
              <Leaf className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-zinc-700">
                Vegan Friendly
              </span>
            </motion.div>
          </motion.div>
        </MaxWidthWrapper>
      </section>

      {/* === Why Choose Us / Features Section === */}
      <section id="features" className="py-16 sm:py-24 bg-zinc-50">
        <MaxWidthWrapper className="px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-4">
              Experience the PetalSoft Difference
            </h2>
            <p className="text-lg sm:text-xl text-zinc-600">
              Discover why our customers choose our unique blend of nature and
              science.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={feature.id} item={feature} index={index} />
            ))}
          </div>
        </MaxWidthWrapper>
      </section>

      {/* === Ingredient Spotlight === */}
      <section id="ingredients" className="py-16 sm:py-24 bg-white">
        <MaxWidthWrapper className="px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-4">
              Powered by Nature, Perfected by Science
            </h2>
            <p className="text-lg sm:text-xl text-zinc-600">
              We carefully select potent botanicals and proven actives for
              visible results.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {ingredients.map((ingredient) => (
              <IngredientCard key={ingredient.id} item={ingredient} />
            ))}
          </div>
          <div className="mt-12 text-center">
            {/* --- Added onClick Handler --- */}
            <Button
              variant="secondary"
              size="lg"
              onClick={handleLearnIngredientsClick}
              className="hover:bg-gray-300"
            >
              Learn About Our Ingredients
            </Button>
            {/* --- End Added Handler --- */}
          </div>
        </MaxWidthWrapper>
      </section>

      {/* === Products Carousel Section === */}
      <section id="shop" className="py-16 sm:py-24 bg-zinc-50">
        <MaxWidthWrapper className="px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-4">
              Curated For You
            </h2>
            <p className="text-lg sm:text-xl text-zinc-600">
              Handpicked favorites and best-sellers from our collection.
            </p>
          </div>
          <ProductCarousel />
        </MaxWidthWrapper>
      </section>

      {/* === Testimonials Section === */}
      <section
        id="reviews"
        className="py-16 sm:py-24 bg-gradient-to-b from-purple-50 via-white to-white"
      >
        <MaxWidthWrapper className="px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-4">
              Don't Just Take Our Word For It
            </h2>
            <p className="text-lg sm:text-xl text-zinc-600">
              See what our glowing community is saying.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.slice(0, 2).map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
          <div className="mt-12 text-center">
            {/* Keep onClick handler */}
            <Button
              variant="outline"
              size="lg"
              className="border-purple-300 text-purple-700 hover:bg-purple-100"
              onClick={handleMoreReviewsClick} // Keep onClick handler
            >
              More Customer Stories
            </Button>
          </div>
        </MaxWidthWrapper>
      </section>

      {/* === Newsletter Signup === */}
      <section id="connect" className="py-16 sm:py-24 bg-zinc-100">
        <MaxWidthWrapper className="px-4 sm:px-6">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-4">
              Stay In The Glow
            </h2>
            <p className="text-lg sm:text-xl text-zinc-600 mb-8">
              Get exclusive offers, skincare tips, and new product alerts
              delivered to your inbox.
            </p>
            {/* Keep form with onSubmit */}
            <form
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              onSubmit={handleSubscribe}
            >
              <label htmlFor="email-signup" className="sr-only">
                Email address
              </label>
              <Input
                id="email-signup"
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow text-base"
                aria-label="Email for newsletter" // Added aria-label
              />
              <Button
                type="submit"
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto"
              >
                Subscribe
              </Button>
            </form>
            {/* --- Updated Disclaimer --- */}
            <p className="text-xs text-zinc-500 mt-4">
              Demo signup. No email will be stored. Unsubscribe anytime
              (theoretically!).
            </p>
            {/* --- End Updated Disclaimer --- */}
          </div>
        </MaxWidthWrapper>
      </section>
    </div>
  );
}
