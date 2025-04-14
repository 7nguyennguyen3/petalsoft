"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AddToCart from "@/components/AddToCart";
import { useFetchProduct } from "@/lib/hook";
import { useCartStore } from "@/store";
import { Star } from "lucide-react";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

const ProductCarousel = () => {
  const { data: products, isLoading } = useFetchProduct();
  const addToCart = useCartStore((state) => state.addToCart);
  const topSellers = products?.filter((product) =>
    [1, 2, 3, 4, 6, 8, 9, 10].includes(product.id)
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center", // Center the slide
    containScroll: "trimSnaps", // Prevent extra scrolling
  });

  const nextSlide = () => emblaApi && emblaApi.scrollNext();
  const prevSlide = () => emblaApi && emblaApi.scrollPrev();

  if (isLoading) {
    return (
      <section className="py-24 bg-zinc-50">
        <MaxWidthWrapper className="px-4 sm:px-6">
          <div className="text-center mb-16">
            <Skeleton width={300} height={50} className="mx-auto mb-4" />
            <Skeleton width={400} height={30} className="mx-auto" />
          </div>
          <div className="grid md:grid-cols-1 gap-8">
            {[...Array(1)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-lg"
              >
                <Skeleton height={400} />
                <div className="p-6">
                  <Skeleton width={200} height={28} className="mb-4" />
                  <Skeleton width={150} height={24} />
                  <Skeleton width={100} height={20} className="mt-4" />
                </div>
              </div>
            ))}
          </div>
        </MaxWidthWrapper>
      </section>
    );
  }

  return (
    <div className="relative group">
      {/* Navigation Arrows */}
      {topSellers?.length && topSellers.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-3 
        rounded-full shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100
        ml-4"
            aria-label="Previous slide"
          >
            ←
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-3 
        rounded-full shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100
        mr-4"
            aria-label="Next slide"
          >
            →
          </button>
        </>
      )}

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {topSellers?.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 p-2"
              style={{ width: "90%", margin: "2% 2%", maxWidth: "400px" }} // Show slight parts of next and previous slides
            >
              {/* Imports assumed: Link, Star, AddToCart, product object */}

              <div
                className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 
                 transition-all duration-300 ease-in-out hover:-translate-y-1"
              >
                {/* Link wraps only the image area as per original structure */}
                <Link
                  href={`/store/${product.id}`}
                  aria-label={`View details for ${product.title}`}
                >
                  {/* Image container - Retained vh height as requested, adjusted rounding */}
                  <div className="relative w-full h-[50vh] min-h-[200px] max-h-[300px] overflow-hidden rounded-t-xl">
                    <img
                      src={product.imgSrc}
                      className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                      alt={product.title}
                    />
                    {/* Slightly subtler gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                </Link>

                {/* Content Area - Reduced padding, added flex-col structure */}
                <div className="p-4 flex flex-col flex-grow">
                  {/* Title and Badge */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    {" "}
                    {/* Adjusted spacing, items-start */}
                    <h4
                      className="text-lg font-semibold text-gray-800 leading-tight truncate mr-2"
                      title={product.title}
                    >
                      {" "}
                      {/* Adjusted size/leading, added truncate, margin */}
                      {product.title}
                    </h4>
                    {/* Slightly different badge style */}
                    <span className="flex-shrink-0 bg-indigo-50 text-indigo-600 px-2.5 py-0.5 rounded-full text-xs font-medium">
                      Bestseller
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-1 mb-3">
                    {" "}
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-amber-500 fill-current"
                      />
                    ))}
                    <span className="ml-1.5 text-xs text-gray-500">
                      ({product.reviews} reviews)
                    </span>
                  </div>

                  <div className="flex items-baseline space-x-2 mb-4">
                    {" "}
                    <p className="text-xl font-bold text-gray-600">
                      ${product.price}
                    </p>
                    <p className="text-xs text-gray-400 line-through">
                      ${(product.price + 7).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex-grow" />

                  <div className="mt-auto pt-2 max-w-[200px]">
                    <AddToCart
                      addToCart={addToCart}
                      product={product}
                      showQuantity={false}
                      showBuyNow={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCarousel;
