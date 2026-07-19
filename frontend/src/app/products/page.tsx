// app/products/page.tsx
'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Product } from '@/types';
import ProductCard from '@/components/products/ProductCard';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/products')
            .then(({ data }) => setProducts(data))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-10 flex justify-center items-center min-h-[50vh]">
                <div className="text-rose-600 text-lg font-medium animate-pulse">
                    Cargando nuestro catálogo...
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 sm:px-8 md:px-16 lg:px-24 xl:px-28 2xl:px-32 py-8">
            <BreadcrumbNav />

            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-900">Todos nuestros productos</h1>
                <p className="text-gray-600 mt-2">
                    Explora nuestra selección completa de pastelería artesanal.
                </p>
            </div>

            {products.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                    No se encontraron productos en este momento.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}