'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import { CategoryForm } from '@/components/admin/CategoryForm';
import { Category } from '@/types';
import { Button } from '@/components/ui/button';

export default function CategoryDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const editParam = searchParams.get('edit');

    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(editParam === 'true');

    useEffect(() => {
        api.get(`/categories/${id}`).then((res) => setCategory(res.data));
    }, [id]);

    useEffect(() => {
        setEditMode(editParam === 'true');
    }, [editParam]);

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            const res = await api.patch(`/categories/${id}`, data);
            setCategory(res.data);
            setEditMode(false);
            router.replace(`/admin/categories/${id}`);
        } catch {
            alert('Error al actualizar categoría');
        } finally {
            setLoading(false);
        }
    };

    if (!category) return <div className="p-6 text-center">Cargando...</div>;

    if (editMode) {
        return (
            <div>
                <h1 className="text-2xl font-bold mb-4">Editar Categoría</h1>
                <CategoryForm initialData={category} onSubmit={onSubmit} isLoading={loading} onCancel={() => {
                    setEditMode(false);
                    router.replace(`/admin/categories/${id}`);
                }} />
            </div>
        );
    }

    return (
        <div className="max-w-2xl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">{category.nombre}</h1>
                <div className="space-x-2">
                    <Button onClick={() => {
                        setEditMode(true);
                        router.replace(`/admin/categories/${id}?edit=true`);
                    }}>
                        Editar
                    </Button>
                    <Link href="/admin/categories">
                        <Button variant="outline">Volver</Button>
                    </Link>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
                <div>
                    <span className="text-sm text-gray-500">Nombre</span>
                    <p className="text-lg font-medium">{category.nombre}</p>
                </div>
                <div>
                    <span className="text-sm text-gray-500">Slug</span>
                    <p className="text-lg font-medium">{category.slug}</p>
                </div>
                <div>
                    <span className="text-sm text-gray-500">Productos asociados</span>
                    <p className="text-lg font-medium">
                        {category._count?.productos ?? category.productos?.length ?? 0}
                    </p>
                </div>
                <div>
                    <span className="text-sm text-gray-500">Estado</span>
                    <p>
                        {category.activo ? (
                            <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">Activo</span>
                        ) : (
                            <span className="inline-block bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded">Inactivo</span>
                        )}
                    </p>
                </div>
                <div>
                    <span className="text-sm text-gray-500">Creado</span>
                    <p className="text-sm text-gray-700">{new Date(category.createdAt).toLocaleDateString('es-CL', { dateStyle: 'long' })}</p>
                </div>
                <div>
                    <span className="text-sm text-gray-500">Actualizado</span>
                    <p className="text-sm text-gray-700">{new Date(category.updatedAt).toLocaleDateString('es-CL', { dateStyle: 'long' })}</p>
                </div>
            </div>
        </div>
    );
}
