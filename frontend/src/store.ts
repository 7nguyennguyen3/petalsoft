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
  reduceQuantity: (productId: number) => {
    set((state) => {
      // Find the item in the cart
      const existingItemIndex = state.cartItems.findIndex(
        (item) => item.productId === productId
      );

      // If the item is not in the cart, do nothing
      if (existingItemIndex === -1) {
        return state;
      }

      // If the item is in the cart, reduce its quantity
      const updatedCartItems = state.cartItems.map((item, index) => {
        if (index === existingItemIndex) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      });

      // Remove items with a quantity of 0 or less
      const finalCartItems = updatedCartItems.filter(
        (item) => item.quantity > 0
      );

      return { cartItems: finalCartItems };
    });
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
      const updatedCartItems = state.cartItems
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.max(0, item.quantity - 1) }
            : item
        )
        .filter((item) => item.quantity > 0);
      return { cartItems: updatedCartItems };
    });
  },
}));
