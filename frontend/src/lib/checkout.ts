import api from '@/lib/axios';

export interface Draft {
    id: string;
    usuarioId: string | null;
    cartId: string | null;
    recipient: Record<string, any> | null;
    address: Record<string, any> | null;
    shippingMethod: string | null;
    paymentMethod: string | null;
    createdAt: string;
    updatedAt: string;
}

export const getDraft = async (): Promise<Draft> => {
    const { data } = await api.get('/checkout/draft');
    return data;
};

export const updateDraft = async (payload: {
    recipient?: Record<string, any>;
    address?: Record<string, any>;
    shippingMethod?: string;
    paymentMethod?: string;
}): Promise<Draft> => {
    const { data } = await api.patch('/checkout/draft', payload);
    return data;
};

export const deleteDraft = async (): Promise<{ message: string }> => {
    const { data } = await api.delete('/checkout/draft');
    return data;
};
