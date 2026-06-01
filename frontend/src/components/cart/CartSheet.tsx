'use client';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2, Minus, Plus } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';
import Link from 'next/link';

export default function CartSheet() {
    const { items, total, updateQuantity, removeItem } = useCartStore();

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
                    <SheetTitle>Mi Carrito</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                    {items.length === 0 ? (
                        <p className="text-center text-gray-500">No hay productos en el carrito</p>
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
                            <div className="border-t pt-4 mt-4">
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total:</span>
                                    <span>${total.toLocaleString()}</span>
                                </div>
                                <Link href="/checkout">
                                    <Button className="w-full mt-4">Finalizar compra</Button>
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}