"use client";
import AddToCart from "@/components/AddToCart";
import { useFetchProduct } from "@/lib/hook";
import { useCartStore } from "@/store";
import { ArrowLeft, Check, DollarSign, Star } from "lucide-react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const ProductDetailPage = () => {
  const { data: products, isLoading } = useFetchProduct();
  const [slidesPerView, setSlidesPerView] = useState(1);

  useEffect(() => {
    const updateSlidesPerView = () => {
      setSlidesPerView(Math.min(3, Math.max(1, window.innerWidth / 200)));
    };

    updateSlidesPerView();
    window.addEventListener("resize", updateSlidesPerView);

    return () => {
      window.removeEventListener("resize", updateSlidesPerView);
    };
  }, []);

  const searchParams = useParams();
  const itemId = searchParams.item;

  const displayProduct = products?.find(
    (product) => product.id.toString() === itemId
  );

  if (products && !displayProduct) notFound();

  const addToCart = useCartStore((state) => state.addToCart);

  const recommendedProducts = products
    ?.filter((product) => product.id !== displayProduct?.id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  return (
    <div className="grainy-light">
      {isLoading ? (
        <div className="min-h-screen max-w-[700px] mx-auto p-5 flex flex-col items-center justify-center gap-3">
          <Skeleton height={400} width={600} />
          <Skeleton height={30} width={200} />
          <Skeleton height={20} width={400} count={3} />
          <Skeleton height={20} width={100} />
        </div>
      ) : (
        <div
          className="min-h-screen max-w-[700px] mx-auto p-5
      flex flex-col items-center justify-center gap-3"
        >
          <Link href="/store" className="self-start mb-10 hover:scale-105">
            <ArrowLeft size={30} />
          </Link>
          <div className="w-[80%] max-w-[600px] h-full max-h-[400px]">
            <img
              src={displayProduct?.imgSrc}
              className="rounded-lg"
              loading="lazy"
              alt={displayProduct?.title}
            />
          </div>
          <h1 className="font-bold xs:text-3xl sm:text-5xl gra-p-b text-center">
            {displayProduct?.title}
          </h1>
          <p className="tracking-tighter text-lg text-center">
            {displayProduct?.description}
          </p>
          <p className="flex items-center font-semibold text-xl">
            <DollarSign size="24" /> {displayProduct?.price}{" "}
            <span className="ml-3 line-through font-medium text-xl">
              {displayProduct && (displayProduct.price + 7.0).toFixed(2)}
            </span>
          </p>
          <div className="flex items-center mx-auto">
            <Star className="text-yellow-300 fill-yellow-200" />
            <Star className="text-yellow-300 fill-yellow-200" />
            <Star className="text-yellow-300 fill-yellow-200" />
            <Star className="text-yellow-300 fill-yellow-200" />
            <Star className="text-yellow-300 fill-yellow-200" />
          </div>
          <p className="ml-2 flex items-center gap-2">
            <Check className="text-green-600" /> {displayProduct?.reviews}{" "}
            Reviews
          </p>
          <AddToCart
            addToCart={addToCart}
            product={displayProduct!}
            showQuantity={true}
            showBuyNow={true}
          />

          <h2 className="mt-40 text-2xl font-semibold text-center">
            Others also bought
          </h2>

          <Swiper
            className="w-full h-[240px] mt-5"
            spaceBetween={20}
            slidesPerView={slidesPerView}
            pagination={{ clickable: true }}
            modules={[Pagination]}
          >
            {recommendedProducts &&
              recommendedProducts.map((product) => (
                <SwiperSlide key={product.id}>
                  <Link href={`/store/${product.id}`}>
                    <div className="w-48 h-48 flex justify-center items-center p-2 border rounded-lg">
                      <img
                        loading="lazy"
                        src={product.imgSrc}
                        alt={product.title}
                        className="object-cover w-full h-full rounded-lg"
                      />
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
