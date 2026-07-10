'use client';
import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useCheckoutStore } from '@/store/checkoutStore';

export function Providers({ children }: { children: React.ReactNode }) {
    const loadUser = useAuthStore((state) => state.loadUser);
    const fetchCart = useCartStore((state) => state.fetchCart);
    const user = useAuthStore((state) => state.user);
    const previousUserIdRef = useRef<string | null | undefined>(undefined);

    useEffect(() => {
        // Carga inicial: solo una vez al montar
        if (previousUserIdRef.current === undefined) {
            loadUser();
            fetchCart();
        }

        // Si el userId cambió (login, logout, switch de cuenta), limpiar checkoutStore
        // para evitar que se muestren datos del usuario anterior
        if (previousUserIdRef.current !== undefined && previousUserIdRef.current !== user?.id) {
            useCheckoutStore.getState().reset();
        }

        previousUserIdRef.current = user?.id;
    }, [user, loadUser, fetchCart]);

    return <>{children}</>;
}