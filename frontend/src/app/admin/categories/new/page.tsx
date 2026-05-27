'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import api from '@/lib/axios';
import { CategoryForm } from '@/components/admin/CategoryForm';

export default function NewCategoryPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            await api.post('/categories', data);
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
            <CategoryForm onSubmit={onSubmit} isLoading={loading} />
        </div>
    );
}