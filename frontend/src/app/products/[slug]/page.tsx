'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/axios';
import { Product } from '@/types';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';

export default function ProductDetailPage() {
    const { slug } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const addItem = useCartStore((state) => state.addItem);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        if (slug) {
            api.get(`/products/slug/${slug}`)
                .then(({ data }) => setProduct(data))
                .finally(() => setLoading(false));
        }
    }, [slug]);

    const handleAddToCart = async () => {
        if (!product) return;
        setIsAdding(true);
        try {
            await addItem(product.id, quantity);
        } finally {
            setIsAdding(false);
        }
    };

    if (loading) return <div className="text-center py-10">Cargando...</div>;
    if (!product) return <div className="text-center py-10">Producto no encontrado</div>;

    return (
        <div className="grid md:grid-cols-2 gap-8">
            {/* Galería de imágenes */}
            <div className="space-y-4">
                {product.imagenes && product.imagenes.length > 0 ? (
                    <>
                        <div className="relative h-96 bg-gray-100 rounded-lg">
                            <Image
                                src={product.imagenes[0]}
                                alt={product.nombre}
                                fill
                                className="object-contain"
                            />
                        </div>
                        {product.imagenes.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto">
                                {product.imagenes.slice(1).map((url, idx) => (
                                    <div key={idx} className="relative w-24 h-24 bg-gray-100 rounded">
                                        <Image src={url} alt={`${product.nombre} ${idx + 2}`} fill className="object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">Sin imagen</div>
                )}
            </div>
            <div>
                <h1 className="text-3xl font-bold">{product.nombre}</h1>
                <p className="text-2xl text-rose-600 mt-2">${product.precio.toLocaleString()}</p>
                {product.precioComparacion && (
                    <p className="text-gray-400 line-through">${product.precioComparacion.toLocaleString()}</p>
                )}
                <p className="text-gray-600 mt-4">{product.descripcion}</p>
                <div className="mt-6 flex items-center gap-4">
                    <div className="flex items-center border rounded">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="px-3 py-1 border-r"
                        >
                            -
                        </button>
                        <span className="px-4 py-1">{quantity}</span>
                        <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="px-3 py-1 border-l"
                        >
                            +
                        </button>
                    </div>
                    <Button onClick={handleAddToCart} disabled={isAdding}>
                        {isAdding ? 'Agregando...' : 'Agregar al Carrito'}
                    </Button>
                </div>
                <p className="text-sm text-gray-500 mt-4">Stock disponible: {product.stock}</p>
            </div>
        </div>
    );
}