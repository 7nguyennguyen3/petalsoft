"use client";
import AddToCart from "@/components/AddToCart";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { useFetchProduct } from "@/lib/hook";
import { useCartStore } from "@/store";
import { ArrowLeft, Check, DollarSign, SquarePlus, Star } from "lucide-react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";

const ProductDetailPage = () => {
  const { data: products, isLoading } = useFetchProduct();

  const searchParams = useParams();
  const itemId = searchParams.item;

  const displayProduct = products?.find(
    (product) => product.id.toString() === itemId
  );

  if (products && !displayProduct) notFound();

  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <div className="grainy-light">
      {isLoading ? (
        <Loading />
      ) : (
        <div
          className="min-h-screen max-w-[700px] mx-auto p-5
      flex flex-col items-center justify-center gap-3"
        >
          <Link href="/store" className="self-start mb-10 hover:scale-105">
            <ArrowLeft size={30} />
          </Link>
          <div className="w-full max-w-[600px] h-full max-h-[400px]">
            <img
              src={displayProduct?.imgSrc}
              className="rounded-lg"
              alt={displayProduct?.title}
            />
          </div>
          <h1 className="font-bold xs:text-3xl sm:text-5xl gra-p-b">
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
          <AddToCart addToCart={addToCart} product={displayProduct!} />
          <div className="grid grid-cols-3"></div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
