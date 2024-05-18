"use client";
import Loading from "@/components/Loading";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { useFetchProduct } from "@/lib/hook";
import { useRouter } from "next/navigation";

const StorePage = () => {
  const { data: products, isLoading } = useFetchProduct();
  const router = useRouter();

  return (
    <MaxWidthWrapper className="p-5">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="min-h-screen py-28">
            <h2 className="text-4xl font-bold gra-p-b">Skin Care</h2>
            <div className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {products?.map((cosmetic) => (
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
                  <p>{cosmetic.title}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </MaxWidthWrapper>
  );
};

export default StorePage;
