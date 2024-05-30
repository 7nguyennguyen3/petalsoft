"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { useFetchProduct } from "@/lib/hook";
import { useRouter } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const StorePage = () => {
  const { data: products, isLoading } = useFetchProduct();
  const router = useRouter();

  return (
    <MaxWidthWrapper className="p-5">
      {isLoading ? (
        <>
          <div className="min-h-screen py-28">
            <h2 className="text-4xl font-bold gra-p-b mb-10">
              <Skeleton height={60} width={200} />
            </h2>
            <div className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="w-full max-w-[600px] mb-2 h-full max-h-[400px]
                  hover:scale-105 cursor-pointer flex items-center justify-center flex-col"
                >
                  <Skeleton height={200} width={300} className="rounded-lg" />
                  <Skeleton height={30} width={120} />
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="min-h-screen py-28 ">
            <h2 className="text-4xl font-bold gra-p-b mb-10">Skin Care</h2>
            <div className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products
                ?.filter((product) => product.id < 10)
                .map((cosmetic) => (
                  <div
                    className="w-full max-w-[600px] mb-2 h-full max-h-[400px]
                  hover:scale-105 cursor-pointer flex items-center justify-center flex-col"
                    key={cosmetic.id}
                    onClick={() => router.push(`/store/${cosmetic.id}`)}
                  >
                    <img
                      src={cosmetic.imgSrc}
                      className="h-[85%] rounded-lg"
                      alt={cosmetic.title}
                    />
                    <p className="font-semibold text-lg mt-2 shadow-md">
                      {cosmetic.title}
                    </p>
                  </div>
                ))}
            </div>
          </div>
          <h2 className="text-4xl font-bold gra-p-b mb-10">Perfume</h2>
          <div className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-28">
            {products
              ?.filter((product) => product.id >= 10)
              .map((cosmetic) => (
                <div
                  className="w-full max-w-[600px] mb-2 h-full max-h-[400px]
                  hover:scale-105 cursor-pointer flex items-center justify-center flex-col"
                  key={cosmetic.id}
                  onClick={() => router.push(`/store/${cosmetic.id}`)}
                >
                  <img
                    src={cosmetic.imgSrc}
                    className="h-[85%] rounded-lg"
                    alt={cosmetic.title}
                  />
                  <p className="font-semibold text-lg mt-2 shadow-md">
                    {cosmetic.title}
                  </p>
                </div>
              ))}
          </div>
        </>
      )}
    </MaxWidthWrapper>
  );
};

export default StorePage;
