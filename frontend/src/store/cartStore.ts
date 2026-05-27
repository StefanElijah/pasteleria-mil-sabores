import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/axios';
import { CartItem } from '@/types';

interface CartState {
    items: CartItem[];
    total: number;
    cartId: string | null;
    addItem: (productId: string, quantity: number) => Promise<void>;
    removeItem: (productId: string) => Promise<void>;
    updateQuantity: (productId: string, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    fetchCart: () => Promise<void>;
    setCartId: (id: string) => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            total: 0,
            cartId: null,
            addItem: async (productId, quantity) => {
                const cartId = get().cartId;
                const response = await api.post(
                    '/cart/add',
                    { productId, quantity },
                    { headers: cartId ? { 'x-cart-id': cartId } : {} }
                );
                set({
                    items: response.data.items,
                    total: response.data.total,
                    cartId: response.data.cartId,
                });
            },
            removeItem: async (productId) => {
                const cartId = get().cartId;
                if (!cartId) return;
                const response = await api.delete(`/cart/remove/${productId}`, {
                    headers: { 'x-cart-id': cartId },
                });
                set({ items: response.data.items, total: response.data.total });
            },
            updateQuantity: async (productId, quantity) => {
                const cartId = get().cartId;
                if (!cartId) return;
                const response = await api.patch(
                    `/cart/update/${productId}`,
                    { quantity },
                    { headers: { 'x-cart-id': cartId } }
                );
                set({ items: response.data.items, total: response.data.total });
            },
            clearCart: async () => {
                const cartId = get().cartId;
                if (cartId) {
                    await api.delete('/cart/clear', { headers: { 'x-cart-id': cartId } });
                }
                set({ items: [], total: 0, cartId: null });
            },
            fetchCart: async () => {
                const cartId = get().cartId;
                const response = await api.get('/cart', {
                    headers: cartId ? { 'x-cart-id': cartId } : {},
                });
                set({
                    items: response.data.items,
                    total: response.data.total,
                    cartId: response.data.cartId,
                });
            },
            setCartId: (id) => set({ cartId: id }),
        }),
        { name: 'cart-storage' }
    )
);