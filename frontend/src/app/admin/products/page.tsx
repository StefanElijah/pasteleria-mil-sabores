'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        const { data } = await api.get('/products?activo=all'); // para que admin vea todos, incluso inactivos
        setProducts(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const toggleActive = async (id: string, currentActive: boolean) => {
        await api.patch(`/products/${id}`, { activo: !currentActive });
        fetchProducts();
    };

    const deleteProduct = async (id: string) => {
        if (confirm('¿Desactivar este producto? (soft delete)')) {
            await api.delete(`/products/${id}`);
            fetchProducts();
        }
    };

    if (loading) return <div>Cargando...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Productos</h1>
                <Link href="/admin/products/new">
                    <Button>Nuevo Producto</Button>
                </Link>
            </div>
            <div className="bg-white rounded shadow overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-3">Nombre</th>
                            <th className="p-3">Slug</th>
                            <th className="p-3">Precio</th>
                            <th className="p-3">Stock</th>
                            <th className="p-3">Categoría</th>
                            <th className="p-3">Activo</th>
                            <th className="p-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id} className="border-b hover:bg-gray-50">
                                <td className="p-3">{product.nombre}</td>
                                <td className="p-3">{product.slug}</td>
                                <td className="p-3">${product.precio.toLocaleString()}</td>
                                <td className="p-3">{product.stock}</td>
                                <td className="p-3">{product.categoria?.nombre}</td>
                                <td className="p-3">
                                    <Switch checked={product.activo} onCheckedChange={() => toggleActive(product.id, product.activo)} />
                                </td>
                                <td className="p-3 space-x-2">
                                    <Link href={`/admin/products/${product.id}/edit`}>
                                        <Button variant="outline" size="sm">Editar</Button>
                                    </Link>
                                    <Button variant="destructive" size="sm" onClick={() => deleteProduct(product.id)}>
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