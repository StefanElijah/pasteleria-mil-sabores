'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/axios';
import ProductCard from '@/components/products/ProductCard';
import { Product } from '@/types';

function BuscarContent() {
    const searchParams = useSearchParams();
    const q = searchParams.get('q') || '';
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!q.trim()) {
            setProducts([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        api.get(`/products?search=${encodeURIComponent(q)}`)
            .then(({ data }) => setProducts(data))
            .catch(() => setProducts([]))
            .finally(() => setLoading(false));
    }, [q]);

    return (
        <div className="container mx-auto px-4 sm:px-8 md:px-16 lg:px-24 xl:px-28 2xl:px-32 py-8">
            <h1 className="text-2xl font-bold mb-2 text-center">
                {q ? `Resultados para "${q}"` : 'Buscar productos'}
            </h1>
            {loading ? (
                <p className="text-gray-500 mt-4">Buscando...</p>
            ) : q && products.length === 0 ? (
                <p className="text-gray-500 mt-4">No se encontraron productos para "{q}".</p>
            ) : products.length > 0 ? (
                <>
                    <p className="text-gray-500 mb-6">{products.length} producto{products.length !== 1 ? 's' : ''} encontrado{products.length !== 1 ? 's' : ''}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </>
            ) : null}
        </div>
    );
}

export default function BuscarPage() {
    return (
        <Suspense fallback={<div className="container mx-auto px-4 sm:px-8 md:px-16 lg:px-24 xl:px-28 2xl:px-32 py-8"><p className="text-gray-500">Cargando...</p></div>}>
            <BuscarContent />
        </Suspense>
    );
}
