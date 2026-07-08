// components/products/ProductCard.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/format';

export default function ProductCard({ product }: { product: Product }) {
    const addItem = useCartStore((state) => state.addItem);
    const [isLoading, setIsLoading] = useState(false);

    const handleAddToCart = async () => {
        if (product.stock === 0) return;
        setIsLoading(true);
        try {
            await addItem(product.id, 1);
        } finally {
            setIsLoading(false);
        }
    };

    // Si el producto está inactivo, no debería mostrarse (seguridad extra)
    if (!product.activo) return null;

    const isOutOfStock = product.stock === 0;

    return (
        <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition relative">
            {isOutOfStock && (
                <div className="absolute top-2 right-2 z-10 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Sin stock
                </div>
            )}
            <Link href={`/products/${product.slug}`}>
                <div className="relative h-48 bg-gray-200">
                    {(() => {
                        const imgSrc = product.imagenPrincipal || product.imagenes?.[0];
                        return imgSrc ? (
                            <Image
                                src={imgSrc}
                                alt={product.nombre}
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 25vw"
                                loading="eager"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                Sin imagen
                            </div>
                        );
                    })()}
                </div>
            </Link>
            <div className="p-4">
                <Link href={`/products/${product.slug}`}>
                    <h2 className="text-lg font-semibold hover:text-rose-600">{product.nombre}</h2>
                </Link>
                <p className="text-gray-600 mt-1">${formatPrice(product.precio)}</p>
                <Button
                    onClick={handleAddToCart}
                    disabled={isLoading || isOutOfStock}
                    className="w-full mt-3"
                >
                    {isOutOfStock ? 'Sin stock' : isLoading ? 'Agregando...' : 'Agregar al Carrito'}
                </Button>
            </div>
        </div>
    );
}