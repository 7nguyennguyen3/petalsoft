"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { useFetchProduct } from "@/lib/hook";
import { useRouter } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const StorePage = () => {
  const { data: products, isLoading } = useFetchProduct();
  const router = useRouter();

  // Helper function to render product categories
  const renderCategory = (categoryName: string, displayName: string) => (
    <>
      <h2 className="text-4xl font-bold gra-p-b mb-6 mt-20">{displayName}</h2>
      <div className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {products
          ?.filter((product) => product.category === categoryName)
          .map((product) => (
            <div
              key={product.id}
              className="w-full h-[300px] hover:scale-[1.02] cursor-pointer 
              flex flex-col items-center p-4 bg-white rounded-lg shadow-sm
              transition-transform duration-200 ease-in-out"
              onClick={() => router.push(`/store/${product.id}`)}
            >
              <div className="w-full h-[200px] overflow-hidden rounded-lg">
                <img
                  src={product.imgSrc}
                  className="w-full h-full object-cover"
                  alt={product.title}
                  loading="lazy"
                />
              </div>
              <p className="font-semibold text-lg mt-3 text-center">
                {product.title}
              </p>
            </div>
          ))}
      </div>
    </>
  );

  return (
    <MaxWidthWrapper className="p-5">
      {isLoading ? (
        <div className="min-h-screen py-28">
          <h2 className="text-4xl font-bold gra-p-b mb-10">
            <Skeleton height={60} width={200} />
          </h2>
          <div className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="w-full h-[300px] flex flex-col items-center p-4"
              >
                <Skeleton height={200} width="100%" className="rounded-lg" />
                <Skeleton height={24} width={120} className="mt-3" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="min-h-screen py-28">
          {renderCategory("Skincare", "Skin Care")}
          {renderCategory("Fragrance", "Perfume")}
          {renderCategory("Supplements", "Supplements")}
        </div>
      )}
    </MaxWidthWrapper>
  );
};

export default StorePage;
