import MaxWidthWrapper from "@/components/MaxWidthWrapper";

const FAQPage = () => {
  return (
    <div className="grainy-light py-20">
      <MaxWidthWrapper className="py-10 px-5">
        <div className="min-h-screen flex flex-col gap-10 ">
          <h1 className="text-3xl font-bold gra-p-b">
            Frequently Asked Questions (FAQs)
          </h1>

          <section
            aria-labelledby="packing-shipping"
            className="space-y-5 my-8"
          >
            <h2 id="packing-shipping" className="text-2xl font-bold gra-p-b">
              Packing & Shipping
            </h2>
            <div className="space-y-3">
              <p className="font-bold text-lg">
                How does PetalSoft ensure eco-friendly delivery?
              </p>
              <p>
                <span className="font-bold gra-b-s">
                  We are committed to sustainability.
                </span>{" "}
                Our delivery process is designed to minimize carbon emissions by
                optimizing route planning and partnering with green logistics
                providers. We also offset our carbon footprint by investing in
                environmental initiatives.
              </p>
            </div>
            <div className="space-y-3">
              <p className="font-bold text-lg">
                What eco-friendly materials does PetalSoft use for packaging?
              </p>
              <p>
                <span className="font-bold gra-b-s">
                  Our packaging is crafted from recycled and biodegradable
                  materials,
                </span>{" "}
                ensuring that we not only reduce waste but also support the
                circular economy. From the boxes to the protective fillers, all
                components are chosen with the planet in mind.
              </p>
            </div>
            <div className="space-y-3">
              <p className="font-bold text-lg">
                Can you describe PetalSoft's packaging process?
              </p>
              <p>
                Absolutely! Each product is carefully wrapped in recycled paper,
                cushioned with biodegradable packing peanuts, and placed in a
                sturdy, recyclable cardboard box. We use paper-based tapes to
                secure the packages, ensuring that the entire package is 100%
                recyclable.
              </p>
            </div>
          </section>

          <section aria-labelledby="refund-policy" className="space-y-5 my-8">
            <h2 id="refund-policy" className="text-2xl font-bold gra-p-b">
              Refund Policy
            </h2>
            <div className="space-y-3">
              <p className="font-bold text-lg">
                What is PetalSoft's refund policy?
              </p>
              <p>
                <span className="font-bold gra-b-s">
                  Customer satisfaction is paramount to us.
                </span>{" "}
                If you’re not completely happy with your purchase, you can
                return the product within 30 days for a full refund. Please note
                that items must be unopened and in their original packaging.
              </p>
            </div>
            <div className="space-y-3">
              <p className="font-bold text-lg">
                How can I return a product to PetalSoft?
              </p>
              <p>
                To initiate a return, please contact our customer service team
                with your order number and the reason for the return. We will
                provide you with a prepaid return label and instructions on how
                to send back the product.
              </p>
            </div>

            <div className="space-y-3">
              <p className="font-bold text-lg">
                How long does it take to process a refund at PetalSoft?
              </p>
              <p>
                Once we receive your returned item, we will inspect it and
                process your refund within 5-7 business days. The refund will be
                issued to the original payment method.
              </p>
            </div>
          </section>

          <section
            aria-labelledby="product-questions"
            className="space-y-5 my-8"
          >
            <h2 id="product-questions" className="text-2xl font-bold gra-p-b">
              Product Questions
            </h2>
            <div className="space-y-3">
              <p className="font-bold text-lg">
                What are the top-selling products at PetalSoft?
              </p>
              <p>
                Our customers love the Green Tea Moisturizer for its refreshing
                feel, the Anti-Aging Serum for its rejuvenating properties, the
                Skin Brightening Toner for a radiant complexion, and the Zinc
                Boost for its protective qualities.
              </p>
            </div>
            <div className="space-y-3">
              <p className="font-bold text-lg">
                Are PetalSoft products suitable for all skin types?
              </p>
              <p>
                Yes, our products are formulated to be gentle yet effective for
                all skin types. We use high-quality, non-irritating ingredients
                to ensure compatibility with sensitive, oily, dry, and
                combination skin.
              </p>
            </div>
            <div className="space-y-3">
              <p className="font-bold text-lg">
                How can I find the right PetalSoft product for my skin concerns?
              </p>
              <p>
                We recommend exploring our product descriptions and reviews to
                find items that target your specific skin concerns. For
                personalized advice, our customer service team is always ready
                to assist you in selecting the perfect product.
              </p>
            </div>
          </section>

          <section
            aria-labelledby="order-processing"
            className="space-y-5 my-8"
          >
            <h2 id="order-processing" className="text-2xl font-bold gra-p-b">
              Order Processing and Timelines
            </h2>
            <div className="space-y-3">
              <p className="font-bold text-lg">
                How long does it take to process an order?
              </p>
              <p>
                Orders are typically processed within 1-2 days after receipt.
                Once packaged, shipping takes an additional 2-3 days for the
                products to arrive at your doorstep.
              </p>
            </div>
            <div className="space-y-3">
              <p className="font-bold text-lg">Can I expedite my order?</p>
              <p>
                Yes, expedited shipping options are available at checkout for an
                additional fee. This will prioritize your order in our
                processing queue and shorten the delivery time.
              </p>
            </div>
            <div className="space-y-3">
              <p className="font-bold text-lg">
                What happens if there's a delay in my order?
              </p>
              <p>
                In the rare event of a delay, we will notify you immediately and
                provide updates as we work to get your order to you as quickly
                as possible.
              </p>
            </div>
          </section>

          <section aria-labelledby="usage-storage" className="space-y-5 my-8">
            <h2 id="usage-storage" className="text-2xl font-bold gra-p-b">
              Usage and Storage Tips
            </h2>
            <div className="space-y-3">
              <p className="font-bold text-lg">
                What are the best ways to use and store PetalSoft products?
              </p>
              <p>
                To ensure the longevity and efficacy of your PetalSoft products,
                store them in a cool, dry place away from direct sunlight. Use
                products as directed on the label, and make sure to seal caps
                and lids tightly after use to maintain freshness.
              </p>
            </div>
            <div className="space-y-3">
              <p className="font-bold text-lg">
                How often should I use PetalSoft skincare products?
              </p>
              <p>
                For optimal results, we recommend using our skincare products as
                part of your daily morning and evening routines. Specific usage
                instructions can be found on each product's label.
              </p>
            </div>
            <div className="space-y-3">
              <p className="font-bold text-lg">
                Can PetalSoft products be used with makeup?
              </p>
              <p>
                Absolutely! Our skincare products are designed to be compatible
                with makeup. We suggest applying our moisturizers or serums as a
                base to help protect and hydrate your skin.
              </p>
            </div>
          </section>

          <section aria-labelledby="contact-info" className="space-y-5 my-8">
            <h2 id="contact-info" className="text-2xl font-bold gra-p-b">
              Contact Information
            </h2>
            <div className="space-y-3">
              <p className="font-bold text-lg">
                How can I get in touch with PetalSoft for more questions?
              </p>
              <p>
                For any further inquiries, you can reach us at{" "}
                <span className="font-semibold gra-b-s">
                  support@petalsoft.com
                </span>
                . Additionally, our chatbot is available to assist you with
                immediate questions and support.
              </p>
            </div>
            <div className="space-y-3">
              <p className="font-bold text-lg">
                What are PetalSoft's customer service hours?
              </p>
              <p>
                Our customer service team is available to assist you Monday
                through Friday, from 9 AM to 5 PM EST. Outside these hours, our
                chatbot can help answer many common questions.
              </p>
            </div>
            <div className="space-y-3">
              <p className="font-bold text-lg">
                Is there a physical store I can visit?
              </p>
              <p>
                Currently, PetalSoft operates exclusively online to keep our
                products accessible and affordable. However, we are exploring
                options for pop-up shops and retail partnerships in the future.
              </p>
            </div>
          </section>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default FAQPage;
