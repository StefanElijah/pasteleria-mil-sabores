'use client';
import { useRequireAuth, useRequireAdmin } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isLoading } = useRequireAuth();

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 mx-auto animate-spin text-rose-600" />
                    <p className="mt-2 text-sm text-gray-500">Cargando...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}

export function AdminRoute({ children }: { children: React.ReactNode }) {
    const { isLoading } = useRequireAdmin();

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 mx-auto animate-spin text-rose-600" />
                    <p className="mt-2 text-sm text-gray-500">Cargando...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
