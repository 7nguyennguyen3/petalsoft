"use client";
import { useState, useEffect, useCallback } from "react";
import AddToCart from "@/components/AddToCart";
import { useFetchProduct } from "@/lib/hook";
import { useCartStore } from "@/store";
import { Check, DollarSign, Star } from "lucide-react";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

const ProductCarousel = () => {
  const { data: products, isLoading } = useFetchProduct();
  const addToCart = useCartStore((state) => state.addToCart);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(1);
  const topSellers = products?.filter((product) =>
    [1, 2, 3, 4, 6, 8, 9, 10].includes(product.id)
  );

  const updateSlidesToShow = () => {
    if (window.innerWidth >= 1024) setSlidesToShow(3);
    else if (window.innerWidth >= 768) setSlidesToShow(2);
    else setSlidesToShow(1);
  };

  useEffect(() => {
    updateSlidesToShow();
    window.addEventListener("resize", updateSlidesToShow);
    return () => window.removeEventListener("resize", updateSlidesToShow);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % (topSellers?.length || 1));
  }, [topSellers?.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(
      (prev) =>
        (prev - 1 + (topSellers?.length || 1)) % (topSellers?.length || 1)
    );
  }, [topSellers?.length]);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  if (isLoading) {
    return (
      <section className="py-24 bg-zinc-50">
        <MaxWidthWrapper className="px-4 sm:px-6">
          <div className="text-center mb-16">
            <Skeleton width={300} height={50} className="mx-auto mb-4" />
            <Skeleton width={400} height={30} className="mx-auto" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
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
    <section className="py-24 bg-zinc-50">
      <MaxWidthWrapper className="px-4 sm:px-6">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold gra-p-b mb-4">
            Bestselling Favorites
          </h3>
          <p className="text-xl text-zinc-600">
            Discover our most-loved products
          </p>
        </div>

        <div className="relative overflow-hidden group">
          {/* Navigation Arrows */}
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

          {/* Carousel Track */}
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / slidesToShow)}%)`,
              width: `${(topSellers?.length || 0) * (100 / slidesToShow)}%`,
            }}
          >
            {topSellers?.map((product) => (
              <div
                key={product.id}
                className="flex-shrink-0 p-4"
                style={{ width: `${100 / slidesToShow}%` }}
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  <Link href={`/store/${product.id}`}>
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={product.imgSrc}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                        alt={product.title}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    </div>
                  </Link>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-xl font-bold">{product.title}</h4>
                      <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">
                        Bestseller
                      </span>
                    </div>

                    <div className="flex items-center mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 text-amber-400 fill-amber-400"
                        />
                      ))}
                      <span className="ml-2 text-sm text-zinc-600">
                        ({product.reviews} reviews)
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                      <p className="text-2xl font-bold text-custom-purple">
                        ${product.price}
                      </p>
                      <p className="text-zinc-400 line-through">
                        ${(product.price + 7).toFixed(2)}
                      </p>
                    </div>

                    <AddToCart
                      addToCart={addToCart}
                      product={product}
                      showQuantity={false}
                      showBuyNow={false}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  );
};

export default ProductCarousel;
