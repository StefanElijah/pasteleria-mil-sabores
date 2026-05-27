const statusColors = {
    PENDIENTE: 'bg-yellow-100 text-yellow-800',
    PREPARANDO: 'bg-blue-100 text-blue-800',
    ENVIADO: 'bg-purple-100 text-purple-800',
    ENTREGADO: 'bg-green-100 text-green-800',
    CANCELADO: 'bg-red-100 text-red-800',
};

export function OrderStatusBadge({ status }: { status: keyof typeof statusColors }) {
    return (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[status]}`}>
            {status}
        </span>
    );
}