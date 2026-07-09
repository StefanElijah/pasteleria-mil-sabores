'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCategories = async () => {
        const { data } = await api.get('/categories?activo=all');
        setCategories(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const toggleActive = async (id: string, currentActive: boolean) => {
        try {
            await api.patch(`/categories/${id}`, { activo: !currentActive });
            fetchCategories();
        } catch {
            alert('Error al cambiar el estado de la categoría');
        }
    };

    const deleteCategory = async (id: string) => {
        if (confirm('¿Desactivar esta categoría?')) {
            try {
                await api.delete(`/categories/${id}`);
                fetchCategories();
            } catch (err: any) {
                const msg = err?.response?.data?.message || 'Error al desactivar la categoría';
                alert(msg);
            }
        }
    };

    if (loading) return <div>Cargando...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Categorías</h1>
                <Link href="/admin/categories/new">
                    <Button>Nueva Categoría</Button>
                </Link>
            </div>
            <div className="bg-white rounded shadow overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-3">Nombre</th>
                            <th className="p-3">Slug</th>
                            <th className="p-3">Productos</th>
                            <th className="p-3">Activo</th>
                            <th className="p-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((cat) => (
                            <tr key={cat.id} className="border-b">
                                <td className="p-3">{cat.nombre}</td>
                                <td className="p-3">{cat.slug}</td>
                                <td className="p-3">{cat._count?.productos ?? 0}</td>
                                <td className="p-3">
                                    <Switch checked={cat.activo} onCheckedChange={() => toggleActive(cat.id, cat.activo)} />
                                </td>
                                <td className="p-3 space-x-2">
                                    <Link href={`/admin/categories/${cat.id}`}>
                                        <Button variant="outline" size="sm">Ver</Button>
                                    </Link>
                                    <Link href={`/admin/categories/${cat.id}?edit=true`}>
                                        <Button variant="outline" size="sm">Editar</Button>
                                    </Link>
                                    <Button variant="destructive" size="sm" onClick={() => deleteCategory(cat.id)}>
                                        Desactivar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
