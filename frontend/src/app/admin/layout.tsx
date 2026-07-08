'use client';
import { useRequireAdmin } from '@/hooks/useAuth';
import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IdleSessionMonitor } from '@/components/IdleSessionMonitor';

export default function AdminLayout({ children }: { children: ReactNode }) {
    const { isLoading } = useRequireAdmin();
    const pathname = usePathname();

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Cargando...</div>;
    }

    const navItems = [
        { href: '/admin', label: 'Dashboard' },
        { href: '/admin/products', label: 'Productos' },
        { href: '/admin/categories', label: 'Categorías' },
        { href: '/admin/orders', label: 'Pedidos' },
    ];

    return (
        <IdleSessionMonitor>
            <div className="flex min-h-screen bg-gray-100">
                {/* Sidebar */}
                <aside className="w-64 bg-white shadow-md">
                    <div className="p-4 font-bold text-xl border-b">Admin Panel</div>
                    <nav className="p-4 space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`block px-4 py-2 rounded hover:bg-gray-100 ${pathname === item.href ? 'bg-gray-200 font-semibold' : ''
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </aside>
                {/* Main content */}
                <main className="flex-1 p-6">{children}</main>
            </div>
        </IdleSessionMonitor>
    );
}