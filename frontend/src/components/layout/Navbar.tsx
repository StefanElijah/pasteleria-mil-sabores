'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Search, User, LogOut, ShieldCheck, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useSearch } from '@/hooks/useSearch';
import api from '@/lib/axios';
import CartSheet from '@/components/cart/CartSheet';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Category } from '@/types';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const { items } = useCartStore();
    const { searchTerm, setSearchTerm, suggestions, isSearching } = useSearch();
    const searchRef = useRef<HTMLDivElement>(null);
    const cartCount = items.reduce((acc, i) => acc + i.quantity, 0);

    // Cargar categorías activas desde el backend
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await api.get('/categories?activo=true');
                setCategories(data);
            } catch (error) {
                console.error('Error cargando categorías:', error);
            } finally {
                setIsLoadingCategories(false);
            }
        };
        fetchCategories();
    }, [pathname]);

    // Cerrar sugerencias al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/buscar?q=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm('');
            setShowSuggestions(false);
            setIsMenuOpen(false);
        }
    };

    const handleSuggestionClick = (productId: string) => {
        router.push(`/products/${productId}`);
        setSearchTerm('');
        setShowSuggestions(false);
        setIsMenuOpen(false);
    };

    const handleLogout = () => {
        logout();
        router.push('/');
        setIsMenuOpen(false);
    };

    const navLinks = [
        { href: '/', label: 'Inicio' },
        { href: '/products', label: 'Productos' },
        { href: '/nosotros', label: 'Nosotros' },
        { href: '/contacto', label: 'Contacto' },
    ];

    return (
        <nav className="bg-white sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                        <img src="https://res.cloudinary.com/dtkxwlj5g/image/upload/q_auto/f_auto/v1780357889/logo_pasteleria_sin_fondo_asbb6y.png" alt="Logo" className="h-12 w-auto" />
                        <span className="font-bold text-xl text-rose-600 hidden md:inline">Pastelería Mil Sabores</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`hover:text-rose-600 transition ${pathname === link.href ? 'text-rose-600 font-semibold' : ''}`}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {/* Dropdown Categorías dinámico */}
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="hover:text-rose-600 flex items-center gap-1">
                                    Categorías <ChevronDown className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-56">
                                <DropdownMenuLabel>Todas las categorías</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {isLoadingCategories ? (
                                    <DropdownMenuItem disabled>Cargando...</DropdownMenuItem>
                                ) : categories.length === 0 ? (
                                    <DropdownMenuItem disabled>No hay categorías</DropdownMenuItem>
                                ) : (
                                    categories.map((cat) => (
                                        <DropdownMenuItem key={cat.id} asChild>
                                            <Link href={`/categoria/${cat.slug}`} className="cursor-pointer">
                                                {cat.nombre}
                                            </Link>
                                        </DropdownMenuItem>
                                    ))
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Desktop Right Section */}
                    <div className="hidden lg:flex items-center gap-4">
                        {/* Buscador */}
                        <div className="relative" ref={searchRef}>
                            <form onSubmit={handleSearchSubmit} className="flex">
                                <Input
                                    type="search"
                                    placeholder="Buscar productos..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        if (e.target.value.length > 1) setShowSuggestions(true);
                                        else setShowSuggestions(false);
                                    }}
                                    className="w-72 md:w-80 lg:w-96 rounded-r-none"
                                />
                                <Button type="submit" variant="default" className="rounded-l-none">
                                    <Search className="w-4 h-4" />
                                </Button>
                            </form>
                            {showSuggestions && (
                                <div className="absolute top-full left-0 right-0 bg-white shadow-lg border rounded-md mt-1 z-50 max-h-80 overflow-y-auto">
                                    {isSearching ? (
                                        <div className="p-2 text-center text-gray-500">Buscando...</div>
                                    ) : suggestions.length > 0 ? (
                                        <>
                                             {suggestions.map((product) => (
                                                <div
                                                    key={product.id}
                                                    className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
                                                    onClick={() => handleSuggestionClick(product.id)}
                                                >
                                                    <div className="relative w-10 h-10 rounded-md overflow-hidden bg-gray-100 shrink-0">
                                                        {(() => {
                                                            const img = product.imagenPrincipal || product.imagenes?.[0];
                                                            return img ? (
                                                                <Image
                                                                    src={img}
                                                                    alt={product.nombre}
                                                                    fill
                                                                    className="object-cover"
                                                                    sizes="40px"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                                    <Search className="w-4 h-4" />
                                                                </div>
                                                            );
                                                        })()}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-medium truncate">{product.nombre}</p>
                                                        <p className="text-xs text-gray-500">${product.precio.toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            <div
                                                className="p-2 text-center text-rose-600 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => router.push(`/buscar?q=${encodeURIComponent(searchTerm)}`)}
                                            >
                                                Ver todos los resultados
                                            </div>
                                        </>
                                    ) : searchTerm.length > 1 ? (
                                        <div className="p-2 text-center text-gray-500">No se encontraron productos</div>
                                    ) : null}
                                </div>
                            )}
                        </div>

                        {/* Carrito */}
                        <CartSheet />

                        {/* Usuario */}
                        {user ? (
                            <DropdownMenu modal={false}>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        <span>{user.primerNombre} {user.primerApellido?.charAt(0)}.</span>
                                        {user.rol === 'ADMIN' && <ShieldCheck className="w-4 h-4 text-red-600" />}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {user.rol === 'ADMIN' ? (
                                        <DropdownMenuItem asChild>
                                            <Link href="/admin">Panel Administrador</Link>
                                        </DropdownMenuItem>
                                    ) : (
                                        <>
                                            <DropdownMenuItem asChild>
                                                <Link href="/account/profile">Mi Perfil</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href="/account/orders">Mis Pedidos</Link>
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                                        <LogOut className="w-4 h-4 mr-2" /> Cerrar sesión
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <DropdownMenu modal={false}>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <User className="w-5 h-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/auth/login">Iniciar sesión</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/auth/register">Registrarse</Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="lg:hidden p-2 rounded-md hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="lg:hidden py-4 border-t space-y-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`block py-2 hover:text-rose-600 ${pathname === link.href ? 'text-rose-600 font-semibold' : ''}`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {/* Mobile categorías dinámicas */}
                        <div>
                            <p className="font-semibold py-2">Categorías</p>
                            {isLoadingCategories ? (
                                <p className="text-gray-500 text-sm py-1">Cargando...</p>
                            ) : categories.length === 0 ? (
                                <p className="text-gray-500 text-sm py-1">No hay categorías</p>
                            ) : (
                                <div className="pl-4 space-y-2">
                                    {categories.map((cat) => (
                                        <Link
                                            key={cat.id}
                                            href={`/categoria/${cat.slug}`}
                                            className="block py-1 text-sm hover:text-rose-600"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {cat.nombre}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Mobile search */}
                        <form onSubmit={handleSearchSubmit} className="flex mt-4">
                            <Input
                                type="search"
                                placeholder="Buscar productos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex-1 rounded-r-none"
                            />
                            <Button type="submit" className="rounded-l-none">
                                <Search className="w-4 h-4" />
                            </Button>
                        </form>

                        {/* Mobile user actions */}
                        <div className="pt-4 border-t">
                            {user ? (
                                <>
                                    <p className="mb-2">Hola, {user.primerNombre}</p>
                                    {user.rol === 'ADMIN' ? (
                                        <Link href="/admin" className="block py-2 hover:text-rose-600" onClick={() => setIsMenuOpen(false)}>
                                            Panel Administrador
                                        </Link>
                                    ) : (
                                        <>
                                            <Link href="/account/profile" className="block py-2 hover:text-rose-600" onClick={() => setIsMenuOpen(false)}>
                                                Mi Perfil
                                            </Link>
                                            <Link href="/account/orders" className="block py-2 hover:text-rose-600" onClick={() => setIsMenuOpen(false)}>
                                                Mis Pedidos
                                            </Link>
                                        </>
                                    )}
                                    <button onClick={handleLogout} className="block py-2 text-red-600">
                                        Cerrar sesión
                                    </button>
                                </>
                            ) : (
                                <div className="flex gap-3">
                                    <Link href="/auth/login" className="py-2 hover:text-rose-600" onClick={() => setIsMenuOpen(false)}>
                                        Iniciar sesión
                                    </Link>
                                    <Link href="/auth/register" className="py-2 hover:text-rose-600" onClick={() => setIsMenuOpen(false)}>
                                        Registrarse
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}