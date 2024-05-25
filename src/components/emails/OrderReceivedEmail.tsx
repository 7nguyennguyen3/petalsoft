import { ShippingAddress } from "@prisma/client";
import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

const OrderReceivedEmail = ({
  shippingAddress,
  orderId,
  orderDate,
}: {
  shippingAddress: ShippingAddress;
  orderId: string;
  orderDate: string;
}) => {
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://ecommerce-web-app-flax.vercel.app";

  return (
    <Html>
      <Head />
      <Preview>Your order summary and estimated delivery date</Preview>
      <Body>
        <Container>
          <Section className="text-center py-6">
            <Img
              src={`${baseUrl}/email-favicon.webp`}
              width="50"
              height="50"
              alt="PetalSoft logo"
              className="mx-auto"
            />
            <Heading className="text-xl font-bold my-4 text-custom-purple">
              Thank you for your order!
            </Heading>
            <Text className="text-center">
              We're preparing everything for delivery and will notify you once
              your package has been shipped. Packaging usually takes 1-2 days
              and 2-3 days for delivery.
            </Text>
            <Text className="mt-6">
              If you have any questions regarding your order, please feel free
              to contact us with your order number and we're here to help.
            </Text>
          </Section>
          <Hr />
          <Section className="py-4">
            <Text className="font-bold">
              Shipping to: {shippingAddress.name}
            </Text>
            <Text className="text-sm">{shippingAddress.street},</Text>
            <Text>{shippingAddress.city},</Text>
            <Text>
              {shippingAddress.state} {shippingAddress.postalCode}
            </Text>
          </Section>
          <Hr />
          <Section className="py-4">
            <Row className="flex justify-between mb-10">
              <Column className="w-40">
                <Text className="font-bold">Order Number</Text>
                <Text>{orderId}</Text>
              </Column>
              <Column>
                <Text className="font-bold">Order Date</Text>
                <Text>{orderDate}</Text>
              </Column>
            </Row>
          </Section>
          <Hr />

          <Section className="py-4">
            <Row>
              <Text className="pt-8 pb-8">
                Please contact us if you have any questions. (If you reply to
                this email, we won't be able to see it.)
              </Text>
            </Row>
            <Row>
              <Text>© PetalSoft, Inc. All Rights Reserved.</Text>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default OrderReceivedEmail;
