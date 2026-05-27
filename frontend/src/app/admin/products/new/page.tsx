'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { ProductForm } from '@/components/admin/ProductForm';
import { Category } from '@/types';

export default function NewProductPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        api.get('/categories').then((res) => setCategories(res.data));
    }, []);

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            await api.post('/products', data);
            router.push('/admin/products');
        } catch (error) {
            alert('Error al crear producto');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Nuevo Producto</h1>
            <ProductForm categories={categories} onSubmit={onSubmit} isLoading={loading} />
        </div>
    );
}