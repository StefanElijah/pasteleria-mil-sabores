'use client';
import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Trash2, Minus, Plus } from 'lucide-react';

export default function CartPage() {
    const { items, total, updateQuantity, removeItem, clearCart } = useCartStore();

    if (items.length === 0) {
        return (
            <div className="text-center py-12">
                <h1 className="text-2xl font-bold mb-4">Tu carrito está vacío</h1>
                <Link href="/">
                    <Button>Ir a comprar</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Mi Carrito</h1>
            <div className="space-y-4">
                {items.map((item) => (
                    <div key={item.productId} className="flex items-center gap-4 border-b pb-4">
                        <div className="relative w-20 h-20 bg-gray-100 rounded">
                            {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold">{item.name}</h3>
                            <p className="text-gray-600">${item.price.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} disabled={item.quantity <= 1}>
                                <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="w-24 text-right font-semibold">${(item.price * item.quantity).toLocaleString()}</p>
                        <button onClick={() => removeItem(item.productId)} className="text-red-500">
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>
            <div className="mt-6 border-t pt-4">
                <div className="flex justify-between text-xl font-bold">
                    <span>Total:</span>
                    <span>${total.toLocaleString()}</span>
                </div>
                <div className="flex gap-4 mt-6">
                    <Link href="/">
                        <Button variant="outline">Seguir comprando</Button>
                    </Link>
                    <Button onClick={clearCart} variant="destructive">Vaciar carrito</Button>
                    <Link href="/checkout">
                        <Button>Proceder al pago</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}