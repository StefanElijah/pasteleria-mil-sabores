'use client';
import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useCheckoutStore } from '@/store/checkoutStore';
import { getDraft, updateDraft } from '@/lib/checkout';

export function useCheckoutDraft() {
    const { user } = useAuthStore();
    const shippingInfo = useCheckoutStore((s) => s.shippingInfo);
    const shippingMethod = useCheckoutStore((s) => s.shippingMethod);
    const paymentMethod = useCheckoutStore((s) => s.paymentMethod);
    const setShippingInfo = useCheckoutStore((s) => s.setShippingInfo);
    const setShippingMethod = useCheckoutStore((s) => s.setShippingMethod);
    const setPaymentMethod = useCheckoutStore((s) => s.setPaymentMethod);

    const hydratedRef = useRef(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastSyncedRef = useRef<string>('');

    // Hidratar desde backend al montar
    useEffect(() => {
        if (!user || hydratedRef.current) return;
        hydratedRef.current = true;

        getDraft()
            .then((draft) => {
                if (draft.address && typeof draft.address === 'object') {
                    setShippingInfo(draft.address as any);
                }
                if (draft.recipient && typeof draft.recipient === 'object') {
                    setShippingInfo(draft.recipient as any);
                }
                if (draft.shippingMethod) setShippingMethod(draft.shippingMethod);
                if (draft.paymentMethod) setPaymentMethod(draft.paymentMethod);

                // Marcar el snapshot como ya sincronizado para no reenviar inmediatamente
                lastSyncedRef.current = JSON.stringify({
                    shippingInfo: useCheckoutStore.getState().shippingInfo,
                    shippingMethod: draft.shippingMethod,
                    paymentMethod: draft.paymentMethod,
                });
            })
            .catch(() => { /* ignorar errores de hidratación */ });
    }, [user]);

    // Auto-guardar con debounce
    useEffect(() => {
        if (!user || !hydratedRef.current) return;

        const snapshot = JSON.stringify({ shippingInfo, shippingMethod, paymentMethod });
        if (snapshot === lastSyncedRef.current) return;

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            updateDraft({
                recipient: shippingInfo as any,
                address: shippingInfo as any,
                shippingMethod,
                paymentMethod,
            })
                .then(() => {
                    lastSyncedRef.current = snapshot;
                })
                .catch(() => { /* ignorar errores de auto-save */ });
        }, 500);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [user, shippingInfo, shippingMethod, paymentMethod]);
}
