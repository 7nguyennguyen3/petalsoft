import { ShippingAddress } from "@prisma/client";
import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
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
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Flower style={flowerIcon} />
            <Text style={brandText}>PetalSoft</Text>
            <Flower style={flowerIcon} />
          </Section>

          <Heading style={heading}>Thank you for your order! 🎉</Heading>

          <Text style={paragraph}>
            We're preparing everything for delivery 🚚 and will notify you once
            your package has been shipped. Packaging usually takes{" "}
            <strong style={highlight}>1-2 days</strong> and{" "}
            <strong style={highlight}>2-3 days</strong> for delivery.
          </Text>

          <Button href={`${baseUrl}/my-order`} style={button}>
            Track Your Order
            <ArrowRight style={arrowIcon} />
          </Button>

          <Hr style={divider} />

          <Section style={shippingSection}>
            <Text style={sectionHeading}>Shipping Details 🏠</Text>
            <Text style={addressText}>
              {shippingAddress.name}
              <br />
              {shippingAddress.street}
              <br />
              {shippingAddress.city}, {shippingAddress.state}{" "}
              {shippingAddress.postalCode}
            </Text>
          </Section>

          <Hr style={divider} />

          <Section style={orderDetails}>
            <Row>
              <Column>
                <Text style={detailLabel}>Order Number 🔢</Text>
                <Text style={detailValue}>{orderId}</Text>
              </Column>
              <Column>
                <Text style={detailLabel}>Order Date 📅</Text>
                <Text style={detailValue}>{orderDate}</Text>
              </Column>
            </Row>
          </Section>

          <Hr style={divider} />

          <Section style={footer}>
            <Text style={footerText}>
              Need help? Contact our support team at{" "}
              <Link href="mailto:support@petalsoft.com" style={link}>
                support@petalsoft.com
              </Link>
            </Text>
            <Text style={copyright}>
              © 2024 PetalSoft, Inc. All Rights Reserved
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styled components
const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "600px",
};

const header = {
  textAlign: "center" as const,
  marginBottom: "32px",
};

const flowerIcon = {
  width: "32px",
  height: "32px",
  color: "#99a5f7",
  display: "inline-block",
  verticalAlign: "middle",
};

const brandText = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#99a5f7",
  margin: "0 16px",
  display: "inline-block",
  verticalAlign: "middle",
};

const heading = {
  fontSize: "28px",
  fontWeight: "bold",
  color: "#333333",
  textAlign: "center" as const,
  margin: "0 0 24px 0",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "1.5",
  color: "#666666",
  margin: "0 0 24px 0",
};

const highlight = {
  color: "#2d8cf0",
  fontWeight: "600",
};

const button = {
  backgroundColor: "#99a5f7",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "bold",
  padding: "12px 24px",
  borderRadius: "6px",
  textDecoration: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  margin: "0 auto 32px auto",
};

const arrowIcon = {
  width: "18px",
  height: "18px",
};

const divider = {
  borderColor: "#e6e6e6",
  margin: "32px 0",
};

const shippingSection = {
  marginBottom: "32px",
};

const sectionHeading = {
  fontSize: "20px",
  fontWeight: "600",
  color: "#333333",
  margin: "0 0 16px 0",
};

const addressText = {
  fontSize: "16px",
  lineHeight: "1.5",
  color: "#666666",
};

const orderDetails = {
  marginBottom: "32px",
};

const detailLabel = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#999999",
  margin: "0 0 8px 0",
};

const detailValue = {
  fontSize: "16px",
  color: "#333333",
  margin: "0",
};

const footer = {
  textAlign: "center" as const,
  marginTop: "32px",
};

const footerText = {
  fontSize: "14px",
  color: "#999999",
  margin: "0 0 8px 0",
};

const link = {
  color: "#99a5f7",
  textDecoration: "underline",
};

const copyright = {
  fontSize: "12px",
  color: "#cccccc",
  margin: "16px 0 0 0",
};

export default OrderReceivedEmail;
