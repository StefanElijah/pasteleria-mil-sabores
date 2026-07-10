'use client';
import type { ColorKey, OrderStatusInfo } from '@/hooks/useOrderStatus';

const COLOR_CLASSES: Record<ColorKey, string> = {
    yellow: 'bg-yellow-100 text-yellow-800',
    blue: 'bg-blue-100 text-blue-800',
    purple: 'bg-purple-100 text-purple-800',
    indigo: 'bg-indigo-100 text-indigo-800',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    orange: 'bg-orange-100 text-orange-800',
    gray: 'bg-gray-100 text-gray-800',
};

interface Props {
    status: string;
    statusInfo?: OrderStatusInfo;
}

export function OrderStatusBadge({ status, statusInfo }: Props) {
    const label = statusInfo?.labels?.[status as keyof typeof statusInfo.labels] || status;
    const colorKey = (statusInfo?.colors?.[status as keyof typeof statusInfo.colors] as ColorKey) || 'gray';
    const colorClass = COLOR_CLASSES[colorKey] || COLOR_CLASSES.gray;

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
            {label}
        </span>
    );
}
