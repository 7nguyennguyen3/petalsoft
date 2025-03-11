import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Link } from "lucide-react";

const FAQPage = () => {
  return (
    <div className="grainy-light py-20">
      <MaxWidthWrapper className="py-12 px-5 sm:px-6 lg:px-8">
        <article className="prose lg:prose-xl max-w-none">
          <header className="mb-16 text-center">
            <h1 className="text-4xl font-bold gra-p-b mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-gray-600">
              Everything you need to know about PetalSoft products, services,
              and policies. Can't find what you're looking for?{" "}
              <a href="#contact-info" className="text-blue-600 hover:underline">
                Contact our support team
              </a>
            </p>
          </header>

          {/* Packing & Shipping Section */}
          <section aria-labelledby="packing-shipping" className="mb-20">
            <h2
              id="packing-shipping"
              className="text-3xl font-bold gra-p-b mb-8"
            >
              Packaging & Shipping
            </h2>

            <div className="space-y-8 bg-blue-50 p-6 rounded-xl">
              <article className="space-y-3">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Link className="w-5 h-5" />
                  How does PetalSoft ensure eco-friendly delivery?
                </h3>
                <p className="text-gray-700 pl-7 border-l-4 border-blue-200">
                  <strong className="gra-b-s block mb-2">
                    Carbon-Neutral Shipping Program:
                  </strong>
                  We partner with certified eco-friendly carriers and optimize
                  delivery routes to reduce emissions. Every shipment's carbon
                  footprint is offset through renewable energy projects. Our
                  logistics network maintains a 92% on-time delivery rate while
                  reducing transportation emissions by 40% compared to industry
                  standards.
                </p>
              </article>

              <article className="space-y-3">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Link className="w-5 h-5" />
                  What sustainable materials are used in packaging?
                </h3>
                <p className="text-gray-700 pl-7 border-l-4 border-blue-200">
                  <strong className="gra-b-s block mb-2">
                    100% Recyclable Materials:
                  </strong>
                  Our packaging includes:
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li>Post-consumer recycled cardboard boxes</li>
                    <li>Plant-based biodegradable packing peanuts</li>
                    <li>Soy-based ink printed labels</li>
                    <li>Water-activated paper tape</li>
                  </ul>
                  All materials meet ASTM D6400 compostability standards.
                </p>
              </article>

              <article className="space-y-3">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Link className="w-5 h-5" />
                  What is the packaging process?
                </h3>
                <p className="text-gray-700 pl-7 border-l-4 border-blue-200">
                  <strong className="gra-b-s block mb-2">
                    Certified Sustainable Process:
                  </strong>
                  Our 5-step quality packaging procedure:
                  <ol className="list-decimal pl-6 mt-2 space-y-2">
                    <li>Product inspection and cleaning</li>
                    <li>Wrap in recycled tissue paper</li>
                    <li>Cushion with mushroom-based foam</li>
                    <li>Secure with cellulose-based tape</li>
                    <li>Final quality check and sealing</li>
                  </ol>
                  Each package includes a prepaid recycling return label.
                </p>
              </article>
            </div>
          </section>

          {/* Refund Policy Section */}
          <section aria-labelledby="refund-policy" className="mb-20">
            <h2 id="refund-policy" className="text-3xl font-bold gra-p-b mb-8">
              Returns & Refunds
            </h2>

            <div className="space-y-8 bg-green-50 p-6 rounded-xl">
              <article className="space-y-3">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Link className="w-5 h-5" />
                  What is the return policy?
                </h3>
                <div className="text-gray-700 pl-7 border-l-4 border-green-200">
                  <p className="gra-b-s font-semibold mb-2">
                    30-Day Satisfaction Guarantee:
                  </p>
                  <ul className="space-y-2">
                    <li>✓ Full refunds within 30 days of purchase</li>
                    <li>✓ Free return shipping for defective items</li>
                    <li>✓ Exchange option available</li>
                    <li>✗ Opened personal care products cannot be returned</li>
                  </ul>
                  <p className="mt-3 text-sm">
                    Processing time: 5-7 business days after receipt
                  </p>
                </div>
              </article>

              <article className="space-y-3">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Link className="w-5 h-5" />
                  How to initiate a return?
                </h3>
                <div className="text-gray-700 pl-7 border-l-4 border-green-200">
                  <p className="mb-3">Three easy steps:</p>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>Login to your PetalSoft account</li>
                    <li>Select order and items for return</li>
                    <li>Print prepaid shipping label</li>
                  </ol>
                  <p className="mt-3 text-sm">
                    Need help? Chat with our{" "}
                    <a href="#contact-info" className="text-green-700">
                      support team
                    </a>
                  </p>
                </div>
              </article>
            </div>
          </section>

          {/* Product Information Section */}
          <section aria-labelledby="product-info" className="mb-20">
            <h2 id="product-info" className="text-3xl font-bold gra-p-b mb-8">
              Product Expertise
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-purple-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4">
                  Skincare Solutions
                </h3>
                <div className="space-y-4">
                  <p className="gra-b-s font-semibold">
                    Clinical Results (12-week study):
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li>• 89% reported improved skin texture</li>
                    <li>• 78% saw reduced fine lines</li>
                    <li>• 94% experienced better hydration</li>
                  </ul>
                </div>
              </div>

              <div className="bg-orange-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4">
                  Fragrance Technology
                </h3>
                <div className="space-y-4">
                  <p className="gra-b-s font-semibold">Scent Longevity Data:</p>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Eau de Parfum: 8-10 hour longevity</li>
                    <li>• Body Mist: 4-6 hour freshness</li>
                    <li>• Solid Perfume: 6-8 hour wear</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section aria-labelledby="contact-info" className="mb-20">
            <h2 id="contact-info" className="text-3xl font-bold gra-p-b mb-8">
              Customer Support
            </h2>

            <div className="bg-gray-50 p-8 rounded-xl grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Contact Channels</h3>
                <ul className="space-y-3">
                  <li>
                    <strong>Email:</strong>
                    <a
                      href="mailto:support@petalsoft.com"
                      className="text-blue-600 ml-2"
                    >
                      support@petalsoft.com
                    </a>
                  </li>
                  <li>
                    <strong>Live Chat:</strong> Available 24/7 in-app
                  </li>
                  <li>
                    <strong>Phone:</strong> 1-800-PETAL-SOFT (Mon-Fri 9am-7pm
                    EST)
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Social Support</h3>
                <ul className="space-y-3">
                  <li>
                    <strong>Twitter:</strong>
                    <a
                      href="https://twitter.com/petalsoft"
                      className="text-blue-600 ml-2"
                    >
                      @PetalSoftCare
                    </a>
                  </li>
                  <li>
                    <strong>Instagram:</strong>
                    <a
                      href="https://instagram.com/petalsoft"
                      className="text-blue-600 ml-2"
                    >
                      @PetalSoftOfficial
                    </a>
                  </li>
                  <li>
                    <strong>FAQ Knowledge Base:</strong> 850+ articles
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <div className="text-center mt-16">
            <a
              href="#"
              className="inline-flex items-center text-blue-600 hover:underline"
            >
              <Link className="w-5 h-5 mr-2" />
              Back to Top
            </a>
          </div>
        </article>
      </MaxWidthWrapper>
    </div>
  );
};

export default FAQPage;
