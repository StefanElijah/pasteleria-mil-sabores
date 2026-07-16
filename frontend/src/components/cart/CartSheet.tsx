'use client';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2, Minus, Plus, Tag, X } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function CartSheet() {
    const { items, total, subtotal, discount, updateQuantity, removeItem, applyDiscount, removeDiscount } = useCartStore();
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

    const handleRemoveDiscount = async () => {
        try {
            await removeDiscount();
        } catch { }
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="w-5 h-5" />
                    {items.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {items.reduce((acc, i) => acc + i.quantity, 0)}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5" />
                        Mi Carrito
                    </SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                    {items.length === 0 ? (
                        <div className="text-center space-y-4">
                            <p className="text-gray-500">No hay productos en el carrito</p>
                            <SheetClose asChild>
                                <Link href="/">
                                    <Button variant="outline">Ir a comprar</Button>
                                </Link>
                            </SheetClose>
                        </div>
                    ) : (
                        <>
                            {items.map((item) => (
                                <div key={item.productId} className="flex gap-3 border-b pb-3">
                                    <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                                        {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-sm text-gray-600">${item.price.toLocaleString()}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateQuantity(item.productId, item.quantity - 1)} disabled={item.quantity <= 1}>
                                                <Minus className="w-3 h-3" />
                                            </Button>
                                            <span className="text-sm w-6 text-center">{item.quantity}</span>
                                            <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
                                                <Plus className="w-3 h-3" />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500" onClick={() => removeItem(item.productId)}>
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </div>
                                    <p className="font-semibold">${(item.price * item.quantity).toLocaleString()}</p>
                                </div>
                            ))}

                            <div className="border-t pt-3">
                                <div className="flex gap-2 mb-2">
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
                                        <Button variant="outline" size="sm" onClick={handleRemoveDiscount} className="text-red-500">
                                            Quitar
                                        </Button>
                                    ) : (
                                        <Button variant="outline" size="sm" onClick={handleApplyDiscount} disabled={applying || !couponCode.trim()}>
                                            {applying ? '...' : 'Aplicar'}
                                        </Button>
                                    )}
                                </div>
                                {couponError && <p className="text-red-500 text-xs mb-2">{couponError}</p>}
                                {discount && (
                                    <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-md px-3 py-2 text-sm text-green-700 mb-2">
                                        <Tag className="w-4 h-4" />
                                        <span className="font-medium">{discount.codigo}</span>
                                        <span>- {discount.tipo === 'PORCENTAJE' ? `${discount.valor}%` : `$${discount.valor.toLocaleString()}`}</span>
                                    </div>
                                )}
                            </div>

                            <div className="border-t pt-4 mt-2">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal:</span>
                                    <span>${(subtotal || total).toLocaleString()}</span>
                                </div>
                                {discount && (
                                    <div className="flex justify-between text-sm text-green-600">
                                        <span>Descuento:</span>
                                        <span>-${discount.amount.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between font-bold text-lg mt-2">
                                    <span>Total:</span>
                                    <span>${total.toLocaleString()}</span>
                                </div>
                                <div className="space-y-2 mt-4">
                                    <SheetClose asChild>
                                        <Link href="/checkout">
                                            <Button className="w-full">Proceder al Pago</Button>
                                        </Link>
                                    </SheetClose>
                                    <SheetClose asChild>
                                        <Button variant="outline" className="w-full">Continuar Comprando</Button>
                                    </SheetClose>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}