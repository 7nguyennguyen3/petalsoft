"use client";
import AddToCart from "@/components/AddToCart";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useFetchProduct } from "@/lib/hook";
import { useCartStore } from "@/store";
import { Check, DollarSign, Star } from "lucide-react";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProductCarousel = () => {
  const { data: products, isLoading } = useFetchProduct();
  const addToCart = useCartStore((state) => state.addToCart);

  const topSellers = products?.filter(
    (product) => ![4, 5, 6].includes(product.id)
  );

  return isLoading ? (
    <section className="max-w-[600px] mx-auto py-40 p-5">
      <div className="w-full flex flex-col items-center mb-20">
        <Skeleton width={300} height={40} />
      </div>

      <Carousel>
        <CarouselContent>
          {[...Array(5)].map((_, index) => (
            <CarouselItem key={index} className="w-full h-[700px]">
              <Skeleton height={400} />
              <div className="flex flex-col items-center py-3 gap-2">
                <Skeleton width={200} height={30} />
                <Skeleton width={100} height={20} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  ) : (
    <section className="max-w-[600px] mx-auto py-40 p-5">
      <div className="w-full flex flex-col items-center mb-20">
        <h3 className="text-3xl font-bold gra-p-b">Our Top Sellers!</h3>
      </div>

      <Carousel>
        <CarouselContent>
          {topSellers &&
            topSellers.map((product) => (
              <CarouselItem key={product.id} className="w-full h-[700px]">
                <Link href={`/store/${product.id}`}>
                  <img
                    src={product.imgSrc}
                    className="w-full h-[400px] object-cover rounded-lg"
                    alt={product.title}
                    loading="lazy"
                  />
                </Link>

                <div className="flex flex-col items-center py-3 gap-2">
                  <h4 className="font-bold text-2xl text-zinc-700 shadow-md">
                    {product.title}
                  </h4>
                  <div className="flex items-center mx-auto">
                    <Star className="text-yellow-300 fill-yellow-200" />
                    <Star className="text-yellow-300 fill-yellow-200" />
                    <Star className="text-yellow-300 fill-yellow-200" />
                    <Star className="text-yellow-300 fill-yellow-200" />
                    <Star className="text-yellow-300 fill-yellow-200" />
                  </div>
                  <p className="ml-2 flex items-center gap-2 text-sm text-gray-600">
                    <Check className="text-green-600" /> {product.reviews}{" "}
                    Reviews
                  </p>
                  <p className="flex items-center font-semibold text-xl">
                    <DollarSign size="24" /> {product?.price}{" "}
                    <span className="ml-3 line-through font-medium text-xl">
                      {product && (product.price + 7.0).toFixed(2)}
                    </span>
                  </p>
                  <AddToCart
                    addToCart={addToCart}
                    product={product}
                    showQuantity={false}
                    showBuyNow={true}
                  />
                </div>
              </CarouselItem>
            ))}
        </CarouselContent>
        <CarouselPrevious className="xs:hidden sm:inline" />
        <CarouselNext className="xs:hidden sm:inline " />
      </Carousel>
    </section>
  );
};

export default ProductCarousel;
