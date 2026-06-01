'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/axios';
import { Product, Category } from '@/types';
import ProductCard from '@/components/products/ProductCard';

export default function CategoriaPage() {
    const { slug } = useParams();
    const [category, setCategory] = useState<Category | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (slug) {
            const fetchCategory = async () => {
                try {
                    const { data } = await api.get(`/categories/slug/${slug}`);
                    setCategory(data);
                    setProducts(data.productos || []);
                } catch (err) {
                    console.error(err);
                    setError('Categoría no encontrada');
                } finally {
                    setLoading(false);
                }
            };
            fetchCategory();
        }
    }, [slug]);

    if (loading) {
        return <div className="text-center py-10">Cargando productos...</div>;
    }

    if (error || !category) {
        return <div className="text-center py-10 text-red-600">{error || 'Categoría no disponible'}</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2">{category.nombre}</h1>
            {category.icono && <p className="text-2xl mb-4">{category.icono}</p>}
            <p className="text-gray-600 mb-6">
                {products.length} producto{products.length !== 1 ? 's' : ''} encontrado{products.length !== 1 ? 's' : ''}
            </p>
            {products.length === 0 ? (
                <p className="text-center text-gray-500 py-10">No hay productos en esta categoría.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}