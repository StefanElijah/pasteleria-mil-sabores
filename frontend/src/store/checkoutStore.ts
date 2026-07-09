import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ShippingInfo {
    primerNombreDestinatario: string;
    primerApellidoDestinatario: string;
    emailDestinatario: string;
    telefonoDestinatario: string;
    calle: string;
    numero: string;
    comunaId: string;
    tipoVivienda: string;
    ciudad: string;
    codigoPostal: string;
    telefonoDomicilio: string;
}

interface CheckoutState {
    shippingInfo: ShippingInfo;
    paymentMethod: string;
    shippingMethod: string;
    shippingCost: number | null;
    setShippingInfo: (info: Partial<ShippingInfo>) => void;
    setPaymentMethod: (method: string) => void;
    setShippingMethod: (method: string) => void;
    setShippingCost: (cost: number) => void;
    reset: () => void;
}

const defaultShippingInfo: ShippingInfo = {
    primerNombreDestinatario: '',
    primerApellidoDestinatario: '',
    emailDestinatario: '',
    telefonoDestinatario: '',
    calle: '',
    numero: '',
    comunaId: '',
    tipoVivienda: 'CASA',
    ciudad: '',
    codigoPostal: '',
    telefonoDomicilio: '',
};

export const useCheckoutStore = create<CheckoutState>()(
    persist(
        (set) => ({
            shippingInfo: defaultShippingInfo,
            paymentMethod: 'EFECTIVO',
            shippingMethod: 'Chilexpress',
            shippingCost: null,
            setShippingInfo: (info) =>
                set((state) => ({ shippingInfo: { ...state.shippingInfo, ...info } })),
            setPaymentMethod: (method) => set({ paymentMethod: method }),
            setShippingMethod: (method) => set({ shippingMethod: method }),
            setShippingCost: (cost) => set({ shippingCost: cost }),
            reset: () =>
                set({
                    shippingInfo: defaultShippingInfo,
                    paymentMethod: 'EFECTIVO',
                    shippingMethod: 'Chilexpress',
                    shippingCost: null,
                }),
        }),
        { name: 'checkout-storage', storage: createJSONStorage(() => localStorage) }
    )
);
