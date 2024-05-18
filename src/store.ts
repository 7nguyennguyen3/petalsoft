import { create } from "zustand";

type CartItem = {
  productId: number;
  quantity: number;
};

type CartStore = {
  cartItems: CartItem[];
  addToCart: (productId: number, quantity: number) => void;
  initializeCart: (items: CartItem[]) => void;
};

export const useCartStore = create<CartStore>((set) => ({
  cartItems: [],
  addToCart: (productId, quantity) => {
    set((state) => {
      // Check if the product is already in the cart
      const existingItemIndex = state.cartItems.findIndex(
        (item) => item.productId === productId
      );

      // If it is, update the quantity
      if (existingItemIndex !== -1) {
        const updatedCartItems = state.cartItems.map((item, index) => {
          if (index === existingItemIndex) {
            return { ...item, quantity: item.quantity + quantity };
          }
          return item;
        });

        return { cartItems: updatedCartItems };
      }

      // If it's not, add the new item to the cart
      const newItem = { productId, quantity };
      return { cartItems: [...state.cartItems, newItem] };
    });
  },
  initializeCart: (items) => {
    set(() => ({
      cartItems: items,
    }));
  },
}));
