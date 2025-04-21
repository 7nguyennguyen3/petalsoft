import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware"; // Import persist and createJSONStorage

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
  removeFromCart: (productId: number) => void;
  clearCart: () => void; // <-- Add the clearCart function definition
};

export const useCartStore = create<CartStore>()(
  persist(
    // Wrap your store logic with persist
    (set) => ({
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
              ? { ...item, quantity: Math.max(1, item.quantity - 1) }
              : item
          );
          return { cartItems: updatedCartItems };
        });
      },
      removeFromCart: (productId: number) => {
        set((state) => ({
          cartItems: state.cartItems.filter(
            (item) => item.productId !== productId
          ),
        }));
      },
      // Implement the clearCart function
      clearCart: () => {
        set({ cartItems: [] });
      },
    }),
    {
      name: "cart-storage", // unique store name
      storage: createJSONStorage(() => localStorage), // specify localStorage
      // Optionally, specify which parts of the state to persist or exclude
      // partialize: (state) => ({ cartItems: state.cartItems }),
    }
  )
);
