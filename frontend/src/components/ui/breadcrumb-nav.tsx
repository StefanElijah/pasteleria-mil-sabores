'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home } from 'lucide-react';
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

function formatSegment(segment: string): string {
    return decodeURIComponent(segment)
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function BreadcrumbNav() {
    const pathname = usePathname();
    const { customLastLabel, customMiddleLabel, customMiddleHref } = useBreadcrumbStore();
    const paths = pathname.split('/').filter(Boolean);

    if (paths.length === 0) return null;

    function HomeCrumb() {
        return (
            <BreadcrumbItem>
                <BreadcrumbLink asChild>
                    <Link href="/" className="flex items-center gap-1">
                        <Home className="w-3.5 h-3.5" />
                        Inicio
                    </Link>
                </BreadcrumbLink>
            </BreadcrumbItem>
        );
    }

    function Crumb({ href, label, isLast }: { href: string; label: string; isLast: boolean }) {
        return (
            <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    {isLast ? (
                        <BreadcrumbPage>{label}</BreadcrumbPage>
                    ) : (
                        <BreadcrumbLink asChild>
                            <Link href={href}>{label}</Link>
                        </BreadcrumbLink>
                    )}
                </BreadcrumbItem>
            </>
        );
    }

    // /products/torta-chocolate → Inicio > Productos > [Categoría] > [Producto]
    if (paths[0] === 'products' && paths.length >= 2) {
        const productLabel = customLastLabel || formatSegment(paths[paths.length - 1]);
        return (
            <Breadcrumb className="mb-6">
                <BreadcrumbList>
                    <HomeCrumb />
                    <Crumb href="/products" label="Productos" isLast={false} />
                    {customMiddleLabel && (
                        <Crumb
                            href={customMiddleHref || pathname}
                            label={customMiddleLabel}
                            isLast={false}
                        />
                    )}
                    <Crumb href={pathname} label={productLabel} isLast={true} />
                </BreadcrumbList>
            </Breadcrumb>
        );
    }

    // /products → Inicio > Productos
    if (paths[0] === 'products') {
        return (
            <Breadcrumb className="mb-6">
                <BreadcrumbList>
                    <HomeCrumb />
                    <Crumb href="/products" label="Productos" isLast={true} />
                </BreadcrumbList>
            </Breadcrumb>
        );
    }

    // /categoria/tortas → Inicio > Tortas
    if (paths[0] === 'categoria') {
        const label = customLastLabel || formatSegment(paths[paths.length - 1]);
        return (
            <Breadcrumb className="mb-6">
                <BreadcrumbList>
                    <HomeCrumb />
                    <Crumb href={pathname} label={label} isLast={true} />
                </BreadcrumbList>
            </Breadcrumb>
        );
    }

    // Default fallback for other routes
    const breadcrumbs = paths.map((segment, index) => {
        const href = '/' + paths.slice(0, index + 1).join('/');
        const isLast = index === paths.length - 1;
        const label = isLast && customLastLabel
            ? customLastLabel
            : breadcrumbLabels[segment] || formatSegment(segment);
        return { href, label, isLast };
    });

    return (
        <Breadcrumb className="mb-6">
            <BreadcrumbList>
                <HomeCrumb />
                {breadcrumbs.map((crumb) => (
                    <Crumb key={crumb.href} {...crumb} />
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
