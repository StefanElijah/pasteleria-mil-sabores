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
    const [allCategories, setAllCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(editParam === 'true');

    useEffect(() => {
        Promise.all([
            api.get(`/categories/${id}`),
            api.get('/categories?activo=all'),
        ]).then(([catRes, allRes]) => {
            setCategory(catRes.data);
            setAllCategories(allRes.data);
        });
    }, [id]);

    useEffect(() => {
        setEditMode(editParam === 'true');
    }, [editParam]);

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            const payload = {
                ...data,
                padreId: data.padreId || null,
            };
            const res = await api.patch(`/categories/${id}`, payload);
            setCategory(res.data);
            setEditMode(false);
            router.replace(`/admin/categories/${id}`);
        } catch {
            alert('Error al actualizar categoría');
        } finally {
            setLoading(false);
        }
    };

    if (!category) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-8 w-8 border-4 border-rose-500 border-t-transparent rounded-full" />
        </div>
    );

    if (editMode) {
        return (
            <div>
                <h1 className="text-2xl font-bold mb-4">Editar Categoría</h1>
                <CategoryForm
                    initialData={category}
                    categories={allCategories}
                    excludeId={category.id}
                    onSubmit={onSubmit}
                    isLoading={loading}
                    onCancel={() => {
                        setEditMode(false);
                        router.replace(`/admin/categories/${id}`);
                    }}
                />
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
                {category.descripcion && (
                    <div>
                        <span className="text-sm text-gray-500">Descripción</span>
                        <p className="text-sm text-gray-700">{category.descripcion}</p>
                    </div>
                )}
                <div>
                    <span className="text-sm text-gray-500">Categoría padre</span>
                    <p className="text-lg font-medium">
                        {category.padre ? (
                            <Link href={`/admin/categories/${category.padre.id}`} className="text-rose-600 hover:underline">
                                {category.padre.nombre}
                            </Link>
                        ) : (
                            <span className="text-gray-400">Ninguna (raíz)</span>
                        )}
                    </p>
                </div>
                <div>
                    <span className="text-sm text-gray-500">Productos asociados</span>
                    <p className="text-lg font-medium">
                        {category._count?.productos ?? category.productos?.length ?? 0}
                    </p>
                </div>
                <div>
                    <span className="text-sm text-gray-500">Subcategorías</span>
                    <p className="text-lg font-medium">
                        {category.subcategorias?.length || 0}
                    </p>
                    {category.subcategorias && category.subcategorias.length > 0 && (
                        <ul className="mt-1 space-y-1">
                            {category.subcategorias.map((sub) => (
                                <li key={sub.id}>
                                    <Link href={`/admin/categories/${sub.id}`} className="text-rose-600 hover:underline text-sm">
                                        {sub.nombre}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div>
                    <span className="text-sm text-gray-500">Orden visual</span>
                    <p className="text-lg font-medium">{category.ordenVisual ?? '—'}</p>
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
