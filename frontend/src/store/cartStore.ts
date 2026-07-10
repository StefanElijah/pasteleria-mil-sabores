import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import api from '@/lib/axios';
import { CartItem } from '@/types';

interface AppliedDiscount {
    id: string;
    codigo: string;
    nombre: string;
    tipo: string;
    valor: number;
    amount: number;
}

interface CartState {
    items: CartItem[];
    total: number;
    subtotal: number;
    discount: AppliedDiscount | null;
    cartId: string | null;
    isHydrated: boolean;
    addItem: (productId: string, quantity: number) => Promise<void>;
    removeItem: (productId: string) => Promise<void>;
    updateQuantity: (productId: string, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    fetchCart: () => Promise<void>;
    clearLocal: () => void;
    setHydrated: () => void;
    applyDiscount: (codigo: string) => Promise<void>;
    removeDiscount: () => Promise<void>;
}

export const useCartStore = create<CartState>()(
    persist(
        (set) => ({
            items: [],
            total: 0,
            subtotal: 0,
            discount: null,
            cartId: null,
            isHydrated: false,
            addItem: async (productId, quantity) => {
                const response = await api.post('/cart/add', { productId, quantity });
                set({
                    items: response.data.items,
                    total: response.data.total,
                    subtotal: response.data.subtotal || response.data.total,
                    discount: response.data.discount || null,
                    cartId: response.data.cartId,
                });
            },
            removeItem: async (productId) => {
                const response = await api.delete(`/cart/remove/${productId}`);
                set({
                    items: response.data.items,
                    total: response.data.total,
                    subtotal: response.data.subtotal || response.data.total,
                    discount: response.data.discount || null,
                });
            },
            updateQuantity: async (productId, quantity) => {
                const response = await api.patch(`/cart/update/${productId}`, { quantity });
                set({
                    items: response.data.items,
                    total: response.data.total,
                    subtotal: response.data.subtotal || response.data.total,
                    discount: response.data.discount || null,
                });
            },
            clearCart: async () => {
                await api.delete('/cart/clear');
                set({ items: [], total: 0, subtotal: 0, discount: null, cartId: null });
            },
            fetchCart: async () => {
                const response = await api.get('/cart');
                set({
                    items: response.data.items,
                    total: response.data.total,
                    subtotal: response.data.subtotal || response.data.total,
                    discount: response.data.discount || null,
                    cartId: response.data.cartId,
                    isHydrated: true,
                });
            },
            clearLocal: () => {
                set({ items: [], total: 0, subtotal: 0, discount: null, cartId: null });
            },
            setHydrated: () => set({ isHydrated: true }),
            applyDiscount: async (codigo) => {
                const response = await api.post('/cart/discount', { codigo });
                set({
                    items: response.data.items,
                    total: response.data.total,
                    subtotal: response.data.subtotal,
                    discount: response.data.discount,
                });
            },
            removeDiscount: async () => {
                const response = await api.delete('/cart/discount');
                set({
                    items: response.data.items,
                    total: response.data.total,
                    subtotal: response.data.subtotal || response.data.total,
                    discount: null,
                });
            },
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ cartId: state.cartId }),
        }
    )
);
