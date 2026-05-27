import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/axios';
import { User } from '@/types';

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (email: string, password: string, anonCartId?: string) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => void;
    loadUser: () => Promise<void>;
    updateProfile: (data: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isLoading: false,
            login: async (email, password, anonCartId) => {
                set({ isLoading: true });
                try {
                    const headers = anonCartId ? { 'x-cart-id': anonCartId } : {};
                    const { data } = await api.post('/auth/login', { email, password }, { headers });
                    localStorage.setItem('access_token', data.access_token);
                    set({ user: data.user, token: data.access_token });
                } catch (error) {
                    throw error;
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
            logout: () => {
                localStorage.removeItem('access_token');
                set({ user: null, token: null });
            },
            loadUser: async () => {
                const token = localStorage.getItem('access_token');
                if (!token) return;
                set({ isLoading: true });
                try {
                    const { data } = await api.get('/auth/me');
                    set({ user: data, token });
                } catch {
                    set({ user: null, token: null });
                    localStorage.removeItem('access_token');
                } finally {
                    set({ isLoading: false });
                }
            },
            updateProfile: async (data) => {
                const { data: updatedUser } = await api.patch('/users/profile', data);
                set({ user: updatedUser });
            },
        }),
        { name: 'auth-storage' }
    )
);