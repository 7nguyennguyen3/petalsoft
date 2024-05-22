"use client";
import AddToCart from "@/components/AddToCart";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useFetchProduct } from "@/lib/hook";
import { useCartStore } from "@/store";
import { Star, Check, DollarSign, SquarePlus } from "lucide-react";

const ProductCarousel = () => {
  const { data: products, isLoading } = useFetchProduct();
  const addToCart = useCartStore((state) => state.addToCart);

  const topSellers = products?.filter(
    (product) => product.id < 4 || product.id > 5
  );

  return isLoading ? (
    <Loading />
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
                <img
                  src={product.imgSrc}
                  className="w-full h-[500px] object-cover rounded-lg"
                  alt={product.title}
                  loading="lazy"
                />

                <div className="flex flex-col items-center py-3 gap-2">
                  <h4 className="font-bold text-xl text-zinc-700">
                    {product.title}
                  </h4>
                  <div className="flex items-center mx-auto">
                    <Star className="text-yellow-300 fill-yellow-200" />
                    <Star className="text-yellow-300 fill-yellow-200" />
                    <Star className="text-yellow-300 fill-yellow-200" />
                    <Star className="text-yellow-300 fill-yellow-200" />
                    <Star className="text-yellow-300 fill-yellow-200" />
                  </div>
                  <p className="ml-2 flex items-center gap-2">
                    <Check className="text-green-600" /> {product.reviews}{" "}
                    Reviews
                  </p>
                  <p className="flex items-center font-semibold text-lg">
                    <DollarSign size="20" /> {product.price}
                  </p>
                  <AddToCart addToCart={addToCart} product={product} />
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
