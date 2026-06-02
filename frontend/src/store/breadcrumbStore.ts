import { create } from 'zustand';

interface BreadcrumbState {
    customLastLabel: string | null;
    setLastLabel: (label: string) => void;
    clearLastLabel: () => void;
}

export const useBreadcrumbStore = create<BreadcrumbState>((set) => ({
    customLastLabel: null,
    setLastLabel: (label) => set({ customLastLabel: label }),
    clearLastLabel: () => set({ customLastLabel: null }),
}));