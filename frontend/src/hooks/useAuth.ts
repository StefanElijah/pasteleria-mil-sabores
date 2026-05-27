import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export const useRequireAuth = () => {
    const { user, isLoading } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/auth/login');
        }
    }, [user, isLoading, router]);

    return { user, isLoading };
};

export const useRequireAdmin = () => {
    const { user, isLoading } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && (!user || user.rol !== 'ADMIN')) {
            router.push('/');
        }
    }, [user, isLoading, router]);

    return { user, isLoading };
};