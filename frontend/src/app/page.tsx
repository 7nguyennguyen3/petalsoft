"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, Star } from "lucide-react";
import HeroTitle from "./HeroTitle";
import ProductCarousel from "./ProductCarousel";
import Image from "next/image";

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[600px]">
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Background fallback for older browsers */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/cleanser.jpg)" }}
        >
          {/* Modern image with quality optimization */}
          <Image
            src="/cleanser.jpg"
            fill
            priority
            quality={90}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1400px"
            className="object-cover object-center"
            alt="Woman enjoying PetalSoft skincare products"
            placeholder="blur"
            blurDataURL="/cleanser-lowres.jpg"
          />
        </div>

        <MaxWidthWrapper className="relative h-full flex items-center">
          <HeroTitle />
        </MaxWidthWrapper>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gradient-to-b from-zinc-50 to-white py-24">
        <MaxWidthWrapper className="px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold gra-p-b mb-4">
              Loved By Thousands
            </h2>
            <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
              Join our community of 500,000+ satisfied customers worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex gap-3 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-6 h-6 text-amber-400 fill-amber-400"
                    />
                  ))}
                </div>
                <blockquote className="text-2xl font-medium leading-relaxed text-zinc-800 mb-6">
                  {testimonial.quote}
                </blockquote>
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={testimonial.avatar} />
                    <AvatarFallback>{testimonial.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-lg">
                      {testimonial.author}
                    </p>
                    <p className="flex items-center gap-2 text-sm text-green-600">
                      <Check className="w-4 h-4" /> Verified Customer
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </MaxWidthWrapper>
      </section>

      {/* Products Carousel */}
      <ProductCarousel />

      {/* Mission Section */}
      <section className="bg-zinc-900 text-white py-24">
        <MaxWidthWrapper className="px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-4xl font-bold mb-12">Our Core Promise</h3>
            <div className="grid md:grid-cols-2 gap-8">
              {missionItems.map((item, index) => (
                <div
                  key={index}
                  className="p-6 bg-white/5 rounded-xl backdrop-blur-sm hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-custom-purple/20 rounded-lg">
                      <item.icon className="w-8 h-8 text-custom-purple" />
                    </div>
                    <h4 className="text-xl font-semibold">{item.title}</h4>
                  </div>
                  <p className="text-zinc-300 text-left">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </MaxWidthWrapper>
      </section>
    </div>
  );
}

const testimonials = [
  {
    quote:
      "I’ve been using PetalSoft’s Green Tea Moisturizer for a few months now, and it’s transformed my skincare routine. The natural ingredients leave my complexion dewy and refreshed!",
    author: "Mia S.",
    avatar: "/user-2.webp",
    initials: "MS",
  },
  {
    quote:
      "PetalSoft’s anti-aging serum is a revelation. It's become my daily ritual, combining luxury with visible results. Their eco-conscious approach makes me feel good about my purchase.",
    author: "Jasmine A.",
    avatar: "/user-3.webp",
    initials: "JA",
  },
];

const missionItems = [
  {
    icon: Star,
    title: "Botanical Innovation",
    description:
      "Harnessing nature's power through clinically-proven plant extracts and sustainable sourcing.",
  },
  {
    icon: Check,
    title: "Ethical Beauty",
    description:
      "Cruelty-free formulations and recyclable packaging that respects our planet.",
  },
  {
    icon: Star,
    title: "Inclusive Beauty",
    description:
      "Formulated for all skin types and tones, celebrating diversity in every bottle.",
  },
  {
    icon: Check,
    title: "Community First",
    description:
      "Building a beauty movement that empowers and educates through every product.",
  },
];
