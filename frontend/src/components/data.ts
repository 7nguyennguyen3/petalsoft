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
  { id: 1, title: "Green Tea Moisturizer" },
  { id: 2, title: "Anti-Aging Serum" },
  { id: 3, title: "Skin Brightening Toner" },
  { id: 4, title: "Mineralized Sunscreen" },
  { id: 5, title: "Sunflower" },
  { id: 6, title: "Zinc Boost" },
  { id: 7, title: "Ocean Breeze" },
  { id: 8, title: "Radiant Glow Nourishing Cream" },
  { id: 9, title: "Purifying Exfoliating Cleanser" },
  { id: 10, title: "Lotus Blossom Eau de Parfum" },
  { id: 11, title: "Amber Elegance Fragrance" },
  { id: 12, title: "Camille Bliss Perfume" },
  { id: 13, title: "Verdant Mint Eau de Toilette" },
];
