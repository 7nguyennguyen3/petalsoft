import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, Star } from "lucide-react";
import HeroTitle from "./HeroTitle";
import ProductCarousel from "./ProductCarousel";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <section className="relative">
        <Image
          src="/hero-bg2.webp"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          alt="Background image"
        />
        <MaxWidthWrapper className="z-20 relative">
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
                  <AvatarImage src="/user-2.webp" />
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
                “PetalSoft’s anti-aging serum is a fountain of youth in a
                bottle. Each application unfolds a narrative of rejuvenation, it
                has become my go-to secret. It’s not just a skincare product;
                it’s a ritual that enhances my essence. Moreover, their
                dedication to eco-friendly practices is truly admirable.”
              </p>
              <div className="flex gap-2 items-center">
                <p>— Jasmine A.</p>
                <Avatar>
                  <AvatarImage src="/user-3.webp" />
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

      <ProductCarousel />

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
