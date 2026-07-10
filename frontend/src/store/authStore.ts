import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/axios';
import { useCartStore } from './cartStore';
import { useCheckoutStore } from './checkoutStore';
import { User } from '@/types';

interface AuthState {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => Promise<void>;
    loadUser: () => Promise<void>;
    updateProfile: (data: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isLoading: true,
            login: async (email, password, rememberMe) => {
                set({ isLoading: true });
                try {
                    const { data } = await api.post('/auth/login', { email, password, rememberMe });
                    set({ user: data.user });
                    // Limpiar carrito y checkout del usuario anterior
                    useCartStore.getState().clearLocal();
                    useCheckoutStore.getState().reset();
                    await useCartStore.getState().fetchCart();
                } finally {
                    set({ isLoading: false });
                }
            },
            register: async (data) => {
                set({ isLoading: true });
                try {
                    await api.post('/auth/register', data);
                } finally {
                    set({ isLoading: false });
                }
            },
            logout: async () => {
                try {
                    await api.post('/auth/logout', {});
                } catch { }
                set({ user: null });
                // Limpiar carrito y checkout del usuario que se desloguea
                useCartStore.getState().clearLocal();
                useCheckoutStore.getState().reset();
            },
            loadUser: async () => {
                set({ isLoading: true });
                try {
                    const { data } = await api.get('/auth/me');
                    set({ user: data });
                } catch {
                    set({ user: null });
                } finally {
                    set({ isLoading: false });
                }
            },
            updateProfile: async (data) => {
                const { data: updatedUser } = await api.patch('/users/profile', data);
                set({ user: updatedUser });
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ user: state.user }),
        }
    )
);
