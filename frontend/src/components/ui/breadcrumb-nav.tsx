// components/ui/breadcrumb-nav.tsx
'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useBreadcrumbStore } from '@/store/breadcrumbStore';
import { breadcrumbLabels } from '@/lib/breadcrumbLabels';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

// Función auxiliar para formatear un segmento no encontrado
function formatSegment(segment: string): string {
    return decodeURIComponent(segment)
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function BreadcrumbNav() {
    const pathname = usePathname();
    const customLastLabel = useBreadcrumbStore((state) => state.customLastLabel);
    const paths = pathname.split('/').filter(Boolean);

    if (paths.length === 0) return null;

    const breadcrumbs = paths.map((segment, index) => {
        const href = '/' + paths.slice(0, index + 1).join('/');
        const isLast = index === paths.length - 1;
        // Si es el último y hay un label personalizado, usarlo
        const label = isLast && customLastLabel
            ? customLastLabel
            : breadcrumbLabels[segment] || formatSegment(segment);
        return { href, label, isLast };
    });

    return (
        <Breadcrumb className="mb-6">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="/">Inicio</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                {breadcrumbs.map((crumb) => (
                    <BreadcrumbItem key={crumb.href}>
                        <BreadcrumbSeparator />
                        {crumb.isLast ? (
                            <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                        ) : (
                            <BreadcrumbLink asChild>
                                <Link href={crumb.href}>{crumb.label}</Link>
                            </BreadcrumbLink>
                        )}
                    </BreadcrumbItem>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}