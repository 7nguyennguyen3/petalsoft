export const TOPSELLERS = [
  {
    id: 1,
    title: "Green Tea Moisturizer",
    price: 12.99,
    imgSrc:
      "https://res.cloudinary.com/dzzdvsy7c/image/upload/v1715976639/product1_dxakah.webp",
    reviews: 234,
  },
  {
    id: 2,
    title: "Anti-Aging Serum",
    price: 34.99,
    imgSrc:
      "https://res.cloudinary.com/dzzdvsy7c/image/upload/v1715976639/product4_pfug24.webp",
    reviews: 652,
  },
  {
    id: 3,
    title: "Skin Brightening Toner",
    price: 8.99,
    imgSrc:
      "https://res.cloudinary.com/dzzdvsy7c/image/upload/v1715976639/product6_hofh9c.webp",
    reviews: 121,
  },
  {
    id: 6,
    title: "Zinc Boost",
    price: 11.99,
    imgSrc:
      "https://res.cloudinary.com/dzzdvsy7c/image/upload/v1715976639/product3_ti1rps.webp",
    reviews: 652,
  },
];

export const COSMETICS = [
  ...TOPSELLERS,
  {
    id: 5,
    title: "Sunflower",
    price: 11.99,
    imgSrc:
      "https://res.cloudinary.com/dzzdvsy7c/image/upload/v1715976639/product2_h8ujiq.webp",
    reviews: 652,
  },

  {
    id: 7,
    title: "Ocean Breeze",
    price: 11.99,
    imgSrc:
      "https://res.cloudinary.com/dzzdvsy7c/image/upload/v1715976639/product5_ikxduf.webp",
    reviews: 652,
  },
  {
    id: 4,
    title: "Mineralized Sunscreen",
    price: 22.99,
    imgSrc:
      "https://res.cloudinary.com/dzzdvsy7c/image/upload/v1715976639/product7_bontmc.webp",
    reviews: 322,
  },
];

export interface PRODUCTS {
  id: number;
  title: string;
  price: number;
  imgSrc: string;
  reviews?: number;
  description?: string;
  category?: string;
  stock?: number;
}

export const productIdTitle = [
  ...TOPSELLERS,
  ...COSMETICS.filter(
    (item) => !TOPSELLERS.find((topSeller) => topSeller.id === item.id)
  ),
].map(({ id, title }) => ({ id, title }));
