'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';

export default function ProductCard({ product }: { product: Product }) {
    const addItem = useCartStore((state) => state.addItem);
    const [isLoading, setIsLoading] = useState(false);

    const handleAddToCart = async () => {
        setIsLoading(true);
        try {
            await addItem(product.id, 1);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition">
            <Link href={`/products/${product.slug}`}>
                <div className="relative h-48 bg-gray-200">
                    {product.imagenes && product.imagenes[0] ? (
                        <Image
                            src={product.imagenes[0]}
                            alt={product.nombre}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            Sin imagen
                        </div>
                    )}
                </div>
            </Link>
            <div className="p-4">
                <Link href={`/products/${product.slug}`}>
                    <h2 className="text-lg font-semibold hover:text-rose-600">{product.nombre}</h2>
                </Link>
                <p className="text-gray-600 mt-1">${product.precio.toLocaleString()}</p>
                <Button onClick={handleAddToCart} disabled={isLoading} className="w-full mt-3">
                    {isLoading ? 'Agregando...' : 'Agregar al Carrito'}
                </Button>
            </div>
        </div>
    );
}