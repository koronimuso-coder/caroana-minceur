import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItemStore {
  productId: string;
  variantId: string | null;
  sku: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface CartStore {
  items: CartItemStore[];
  addItem: (item: Omit<CartItemStore, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: string, variantId: string | null) => void;
  updateQuantity: (productId: string, variantId: string | null, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem) => {
        const items = get().items;
        const existingIndex = items.findIndex(
          (item) => item.productId === newItem.productId && item.variantId === newItem.variantId
        );

        const qtyToAdd = newItem.quantity ?? 1;

        if (existingIndex > -1) {
          const updated = [...items];
          const exist = updated[existingIndex];
          if (exist) {
            updated[existingIndex] = {
              ...exist,
              quantity: exist.quantity + qtyToAdd,
            };
            set({ items: updated });
          }
        } else {
          set({ items: [...items, { ...newItem, quantity: qtyToAdd }] });
        }
      },
      removeItem: (productId, variantId) => {
        set({
          items: get().items.filter(
            (item) => !(item.productId === productId && item.variantId === variantId)
          ),
        });
      },
      updateQuantity: (productId, variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.productId === productId && item.variantId === variantId
              ? { ...item, quantity }
              : item
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      getItemCount: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },
      getSubtotal: () => {
        return get().items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      },
    }),
    {
      name: "caroana-minceur-cart", // LocalStorage key
    }
  )
);
