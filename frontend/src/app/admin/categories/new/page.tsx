'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Category } from '@/types';
import { CategoryForm } from '@/components/admin/CategoryForm';

export default function NewCategoryPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        api.get('/categories?activo=all').then(({ data }) => setCategories(data));
    }, []);

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            const payload = {
                ...data,
                padreId: data.padreId || undefined,
            };
            await api.post('/categories', payload);
            router.push('/admin/categories');
        } catch (err) {
            alert('Error al crear categoría');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Nueva Categoría</h1>
            <CategoryForm onSubmit={onSubmit} isLoading={loading} categories={categories} />
        </div>
    );
}
