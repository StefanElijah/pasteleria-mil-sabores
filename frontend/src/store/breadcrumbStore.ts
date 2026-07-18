import { create } from 'zustand';

interface BreadcrumbState {
    customLastLabel: string | null;
    customMiddleLabel: string | null;
    customMiddleHref: string | null;
    setLastLabel: (label: string) => void;
    setMiddle: (label: string, href: string) => void;
    clearAll: () => void;
}

export const useBreadcrumbStore = create<BreadcrumbState>((set) => ({
    customLastLabel: null,
    customMiddleLabel: null,
    customMiddleHref: null,
    setLastLabel: (label) => set({ customLastLabel: label }),
    setMiddle: (label, href) => set({ customMiddleLabel: label, customMiddleHref: href }),
    clearAll: () => set({ customLastLabel: null, customMiddleLabel: null, customMiddleHref: null }),
}));
