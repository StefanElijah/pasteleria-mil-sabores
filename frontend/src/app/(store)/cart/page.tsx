'use client';
import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Trash2, Minus, Plus, Tag, X } from 'lucide-react';
import { useState } from 'react';

export default function CartPage() {
    const { items, total, subtotal, discount, updateQuantity, removeItem, clearCart, applyDiscount, removeDiscount } = useCartStore();
    const [couponCode, setCouponCode] = useState('');
    const [couponError, setCouponError] = useState('');
    const [applying, setApplying] = useState(false);

    const handleApplyDiscount = async () => {
        if (!couponCode.trim()) return;
        setCouponError('');
        setApplying(true);
        try {
            await applyDiscount(couponCode.trim().toUpperCase());
            setCouponCode('');
        } catch (err: any) {
            setCouponError(err.response?.data?.message || 'Cupón no válido');
        } finally {
            setApplying(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 sm:px-8 md:px-16 lg:px-24 xl:px-28 2xl:px-32 py-8 text-center">
                <h1 className="text-2xl font-bold mb-4">Tu carrito está vacío</h1>
                <Link href="/">
                    <Button>Ir a comprar</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 sm:px-8 md:px-16 lg:px-24 xl:px-28 2xl:px-32 py-8 max-w-4xl">
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

            <div className="mt-4 max-w-md">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => { setCouponCode(e.target.value); setCouponError(''); }}
                            placeholder="Código de cupón"
                            disabled={!!discount}
                            className="w-full border rounded-md px-3 py-2 text-sm pr-8"
                        />
                        {couponCode && (
                            <button
                                onClick={() => setCouponCode('')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                    {discount ? (
                        <Button variant="outline" onClick={removeDiscount} className="text-red-500">
                            Quitar
                        </Button>
                    ) : (
                        <Button variant="outline" onClick={handleApplyDiscount} disabled={applying || !couponCode.trim()}>
                            {applying ? '...' : 'Aplicar'}
                        </Button>
                    )}
                </div>
                {couponError && <p className="text-red-500 text-xs mt-1">{couponError}</p>}
                {discount && (
                    <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-md px-3 py-2 text-sm text-green-700 mt-2">
                        <Tag className="w-4 h-4" />
                        <span className="font-medium">{discount.codigo}</span>
                        <span>- {discount.tipo === 'PORCENTAJE' ? `${discount.valor}%` : `$${discount.valor.toLocaleString()}`}</span>
                    </div>
                )}
            </div>

            <div className="mt-6 border-t pt-4 max-w-md">
                <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span>${(subtotal || total).toLocaleString()}</span>
                </div>
                {discount && (
                    <div className="flex justify-between text-green-600">
                        <span>Descuento:</span>
                        <span>-${discount.amount.toLocaleString()}</span>
                    </div>
                )}
                <div className="flex justify-between text-xl font-bold mt-2">
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