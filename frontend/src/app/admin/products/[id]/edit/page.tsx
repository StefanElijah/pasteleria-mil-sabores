'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { ProductForm } from '@/components/admin/ProductForm';
import { Category, Product } from '@/types';

export default function EditProductPage() {
    const { id } = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        Promise.all([api.get(`/products/${id}`), api.get('/categories')]).then(([prodRes, catRes]) => {
            const productData = prodRes.data;
            productData.imagenes = productData.imagenes || [];
            productData.imagenPrincipal = productData.imagenPrincipal || null;
            setProduct(productData);
            setCategories(catRes.data);
        });
    }, [id]);

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            await api.patch(`/products/${id}`, data);
            router.push('/admin/products');
        } catch (error) {
            alert('Error al actualizar');
        } finally {
            setLoading(false);
        }
    };

    if (!product) return <div>Cargando...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Editar Producto</h1>
            <ProductForm initialData={product} categories={categories} onSubmit={onSubmit} isLoading={loading} />
        </div>
    );
}