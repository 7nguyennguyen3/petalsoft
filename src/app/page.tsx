import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Check, DollarSign, SquarePlus, Star } from "lucide-react";
import HeroTitle from "./HeroTitle";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

const TOPSELLERS = [
  {
    id: 1,
    title: "Green Tea Moisturizer",
    price: 12.99,
    imgSrc: "/product1.jpg",
    reviews: 234,
  },
  {
    id: 2,
    title: "Anti-Aging Serum",
    price: 11.99,
    imgSrc: "/product4.jpg",
    reviews: 652,
  },
  {
    id: 3,
    title: "Skin Brightening Toner",
    price: 8.99,
    imgSrc: "/product6.jpg",
    reviews: 121,
  },
  {
    id: 4,
    title: "Mineralized Sunscreen SPF 60 Kit",
    price: 22.99,
    imgSrc: "/product7.jpg",
    reviews: 322,
  },
];

export default function Home() {
  return (
    <div>
      <section
        style={{
          backgroundImage: 'url("/product5.jpg")',
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <MaxWidthWrapper>
          <div className="grid items-center py-40">
            <HeroTitle />
          </div>
        </MaxWidthWrapper>
      </section>

      <section className="w-full border grainy-light p-5 py-40">
        <div className="text-section-max-w">
          <h2 className="xs:text-3xl text-4xl gra-p-b font-semibold">
            What Other Said
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-20 mt-10">
            <div className="flex flex-col gap-2">
              <p className="font-bold text-lg">“A Breath of Fresh Air!”</p>
              <div className="flex">
                <Star className="text-yellow-300 fill-yellow-200" />
                <Star className="text-yellow-300 fill-yellow-200" />
                <Star className="text-yellow-300 fill-yellow-200" />
                <Star className="text-yellow-300 fill-yellow-200" />
                <Star className="text-yellow-300 fill-yellow-200" />
              </div>

              <p className="text-medium">
                “I’ve been using PetalSoft’s Green Tea Moisturizer for a few
                months now, and it’s like a breath of fresh air for my skin. The
                natural ingredients have worked wonders, leaving my complexion
                dewy and refreshed. I love that everything is cruelty-free
                too—beauty with a conscience!”
              </p>
              <div className="flex gap-2 items-center">
                <p>— Mia S.</p>
                <Avatar>
                  <AvatarImage src="/user-2.png" />
                  <AvatarFallback>MS</AvatarFallback>
                </Avatar>
              </div>
              <p className="flex gap-2">
                <Check className="text-green-600" /> Verified Purchase
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-bold text-lg">“Elegance in Every Bottle”</p>
              <div className="flex">
                <Star className="text-yellow-300 fill-yellow-200" />
                <Star className="text-yellow-300 fill-yellow-200" />
                <Star className="text-yellow-300 fill-yellow-200" />
                <Star className="text-yellow-300 fill-yellow-200" />
                <Star className="text-yellow-300 fill-yellow-200" />
              </div>

              <p className="text-medium">
                “PetalSoft’s perfumes are a journey in a bottle. Each scent
                tells a story, and ‘Ocean Whispers’ has become my signature
                fragrance. It’s not just a perfume; it’s an experience that
                complements my personality. Plus, their commitment to
                sustainability is truly commendable.”
              </p>
              <div className="flex gap-2 items-center">
                <p>— Mia S.</p>
                <Avatar>
                  <AvatarImage src="/user-3.png" />
                  <AvatarFallback>MS</AvatarFallback>
                </Avatar>
              </div>
              <p className="flex gap-2">
                <Check className="text-green-600" /> Verified Purchase
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[600px] mx-auto py-40 p-5">
        <div className="w-full flex flex-col items-center mb-20">
          <h3 className="text-3xl font-bold gra-p-b">Our Top Sellers!</h3>
        </div>
        <Carousel>
          <CarouselContent>
            {TOPSELLERS.map((product) => (
              <CarouselItem key={product.id} className="w-full h-[700px]">
                <img
                  src={product.imgSrc}
                  className="w-full h-[500px] object-cover rounded-lg"
                  alt={product.title}
                  loading="lazy"
                />
                {/* <Image
                  src={product.imgSrc}
                  alt={product.title}
                  objectFit="cover"
                  className="w-full h-[500px] rounded-lg"
                  width={2000}
                  height={1200}
                /> */}
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
                  <Button className="flex items-center gap-2 bg-custom-purple font-bold text-lg">
                    Add to Cart
                    <SquarePlus />
                  </Button>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="xs:hidden sm:inline" />
          <CarouselNext className="xs:hidden sm:inline " />
        </Carousel>
      </section>

      {/* <section className="w-full border grainy-light p-5 py-40">
        <div className="text-section-max-w">
          <h2 className="xs:text-3xl text-4xl gra-p-b font-semibold">
            PetalSoft & Philosophy
          </h2>
          <p className="text-medium">
            PetalSoft is where nature’s purity meets contemporary beauty. Our
            mission is to harmonize ethical sourcing with the art of self-care,
            offering a range of products from revitalizing skincare to
            captivating perfumes. Each creation is a testament to our dedication
            to quality, inclusivity, and the celebration of individual beauty.
            We believe in nurturing the soul’s true radiance, ensuring every
            product not only enhances your natural allure but also aligns with
            our core values of sustainability and compassion.
          </p>
        </div>
      </section> */}

      <section className="w-full border grainy-light p-5 py-40">
        <div className="text-section-max-w">
          <h3 className="text-3xl gra-p-b font-semibold mt-10">Our Mission</h3>
          <ul className="text-left font-medium flex flex-col">
            <div className="space-y-2">
              <li className="flex gap-1.5 items-center text-left">
                <Star className="h-5 w-5 shrink-0 text-custom-purple fill-custom-purple" />
                To infuse daily beauty routines with the natural elegance and
                purity of botanical ingredients.
              </li>
              <li className="flex gap-1.5 items-center text-left">
                <Star className="h-5 w-5 shrink-0 text-custom-purple fill-custom-purple" />
                To champion ethical sourcing and cruelty-free practices,
                ensuring beauty is kind and conscious.
              </li>
              <li className="flex gap-1.5 items-center text-left">
                <Star className="h-5 w-5 shrink-0 text-custom-purple fill-custom-purple" />
                To create inclusive products that celebrate diversity and cater
                to all skin types and preferences.
              </li>
              <li className="flex gap-1.5 items-center text-left">
                <Star className="h-5 w-5 shrink-0 text-custom-purple fill-custom-purple" />
                To foster a community where beauty is a shared journey, and
                every individual’s story is valued and uplifted.
              </li>
            </div>
          </ul>
        </div>
      </section>
    </div>
  );
}
