import { ShippingAddress } from "@prisma/client";
import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { ArrowRight, Flower } from "lucide-react";

const OrderReceivedEmail = () => {
  const shippingAddress: ShippingAddress = {
    id: "1",
    name: "John Doe",
    street: "123 Main St",
    city: "Anytown",
    state: "Anystate",
    postalCode: "12345",
    country: "USA",
    phoneNumber: "123-456-7890",
  };
  const orderId = "12345lsjdklsdl;akdl;askdaksjdlkasdhwqn123lk13j21lk316";
  const orderDate = new Date().toLocaleDateString();
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://ecommerce-web-app-flax.vercel.app";

  return (
    <Html>
      <Head />
      <Preview>Your order summary and estimated delivery date 📦</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                customPurple: "#99a5f7",
                customGray: "#F5F5F5",
              },
            },
          },
        }}
      >
        <Body>
          <Container className="w-full max-w-[600px] text-center bg-customGray p-8">
            <Section className="py-6">
              <Text className="text-3xl font-bold text-customPurple">
                <Flower /> PetalSoft <Flower />
              </Text>
              <Heading className="text-3xl font-bold my-4 text-purple-300">
                Thank you for your order! 🎉
              </Heading>
              <Text className="text-lg">
                We're preparing everything for delivery 🚚 and will notify you
                once your package has been shipped. Packaging usually takes{" "}
                <span className="text-blue-500">1-2 days</span> and{" "}
                <span className="text-blue-500">2-3 days</span> for delivery.
              </Text>
              <Text className="mt-4">
                If you have any questions regarding your order, please feel free
                to contact us with your order number and we're here to help. 💬
              </Text>
              <Row>
                <a
                  href={`${baseUrl}/my-order`}
                  className="bg-customPurple text-white font-semibold 
                  flex items-center gap-2 justify-center text-[14px] py-2 px-4 rounded"
                  style={{ textDecoration: "none" }}
                >
                  Visit your order page!
                  <ArrowRight />
                </a>
              </Row>
            </Section>
            <Hr className="my-4 border-t-2 border-customPurple" />
            <Section className="py-4">
              <Text className="font-bold text-lg">
                Shipping to: {shippingAddress.name} 🏠
              </Text>
              <Text className="text-sm">
                {shippingAddress.street}, {shippingAddress.city}
              </Text>
              <Text>
                {shippingAddress.state} {shippingAddress.postalCode}
              </Text>
            </Section>
            <Hr className="my-4 border-t-2 border-customPurple" />
            <Section className="py-4">
              <Row className="mb-4">
                <Column className="w-full">
                  <Text className="font-bold text-lg">Order Number 🔢</Text>
                  <Text className="break-all">{orderId}</Text>
                </Column>
              </Row>
              <Row>
                <Column className="w-full">
                  <Text className="font-bold text-lg">Order Date 📅</Text>
                  <Text>{orderDate}</Text>
                </Column>
              </Row>
            </Section>
            <Hr className="my-4 border-t-2 border-customPurple" />

            <Section className="py-4">
              <Row>
                <Text className="pt-4">
                  Please contact us if you have any questions.
                </Text>
                <Text>
                  (If you reply to this email, we won't be able to see it.) 📧
                </Text>
              </Row>
              <Row>
                <Text>© PetalSoft, Inc. All Rights Reserved. ✨</Text>
              </Row>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default OrderReceivedEmail;
