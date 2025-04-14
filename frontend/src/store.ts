// In your zustand store file
import { create } from "zustand";

type CartItem = {
  productId: number;
  quantity: number;
};

type CartStore = {
  cartItems: CartItem[];
  addToCart: (productId: number, quantity: number) => void;
  initializeCart: (items: CartItem[]) => void;
  increaseQuantity: (productId: number) => void;
  decreaseQuantity: (productId: number) => void;
  removeFromCart: (productId: number) => void; // <-- Add this
};

export const useCartStore = create<CartStore>((set) => ({
  cartItems: [],
  addToCart: (productId, quantity) => {
    set((state) => {
      const existingItemIndex = state.cartItems.findIndex(
        (item) => item.productId === productId
      );
      if (existingItemIndex !== -1) {
        const updatedCartItems = state.cartItems.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        return { cartItems: updatedCartItems };
      }
      const newItem = { productId, quantity };
      return { cartItems: [...state.cartItems, newItem] };
    });
  },
  initializeCart: (items) => {
    set(() => ({ cartItems: items }));
  },
  increaseQuantity: (productId: number) => {
    set((state) => {
      const updatedCartItems = state.cartItems.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      return { cartItems: updatedCartItems };
    });
  },
  decreaseQuantity: (productId: number) => {
    set((state) => {
      const updatedCartItems = state.cartItems.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.max(1, item.quantity - 1) } // Prevent going below 1 with +/-
          : item
      );
      // Keep the item even if quantity is 1 after decrease.
      // Removal should be explicit via removeFromCart
      return { cartItems: updatedCartItems };
    });
  },
  // New function to explicitly remove item
  removeFromCart: (productId: number) => {
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.productId !== productId),
    }));
  },
}));
