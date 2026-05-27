'use client';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { ShoppingCart, User, ChevronDown } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export default function Header() {
    const { user, logout } = useAuthStore();
    const { items } = useCartStore();
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold text-rose-600">
                    Mil Sabores
                </Link>
                <nav className="flex items-center gap-6">
                    <Link href="/" className="hover:text-rose-600">
                        Productos
                    </Link>
                    <Link href="/cart" className="relative hover:text-rose-600">
                        <ShoppingCart className="w-6 h-6" />
                        {itemCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {itemCount}
                            </span>
                        )}
                    </Link>
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex items-center gap-1">
                                    <User className="w-5 h-5" />
                                    <span>{user.primerNombre}</span>
                                    <ChevronDown className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/account/profile" className="cursor-pointer w-full">
                                        Mi Perfil
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/account/orders" className="cursor-pointer w-full">
                                        Mis Pedidos
                                    </Link>
                                </DropdownMenuItem>
                                {user.rol === 'ADMIN' && (
                                    <DropdownMenuItem asChild>
                                        <Link href="/admin/products" className="cursor-pointer w-full">
                                            Administración
                                        </Link>
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer">
                                    Cerrar Sesión
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link href="/auth/login" className="hover:text-rose-600">
                            Iniciar Sesión
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}