'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { CategoryForm } from '@/components/admin/CategoryForm';
import { Category } from '@/types';

export default function EditCategoryPage() {
    const { id } = useParams();
    const router = useRouter();
    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        api.get(`/categories/${id}`).then((res) => setCategory(res.data));
    }, [id]);

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            await api.patch(`/categories/${id}`, data);
            router.push('/admin/categories');
        } catch (error) {
            alert('Error al actualizar categoría');
        } finally {
            setLoading(false);
        }
    };

    if (!category) return <div>Cargando...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Editar Categoría</h1>
            <CategoryForm initialData={category} onSubmit={onSubmit} isLoading={loading} />
        </div>
    );
}
