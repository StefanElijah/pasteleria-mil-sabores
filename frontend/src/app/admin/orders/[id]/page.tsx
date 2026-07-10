'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { Order } from '@/types';
import { OrderStatusBadge } from '@/components/admin/OrderStatusBadge';
import { StatusChangeDialog } from '@/components/admin/StatusChangeDialog';
import { useOrderStatus } from '@/hooks/useOrderStatus';
import { Button } from '@/components/ui/button';

export default function AdminOrderDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [pendingChange, setPendingChange] = useState<{ from: string; to: string } | null>(null);
    const statusInfo = useOrderStatus();

    const fetchOrder = async () => {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const handleStatusClick = (newStatus: string) => {
        if (!order) return;
        if (order.estado === newStatus) return;
        setPendingChange({ from: order.estado, to: newStatus });
    };

    const confirmChange = async () => {
        if (!pendingChange) return;
        await api.patch(`/orders/${id}/status`, { estado: pendingChange.to });
        setPendingChange(null);
        await fetchOrder();
    };

    if (loading) return <div>Cargando...</div>;
    if (!order) return <div>Pedido no encontrado</div>;

    const allStatuses = Object.keys(statusInfo?.labels || {}) as Array<keyof typeof statusInfo.labels>;
    const allowedTransitions = (statusInfo?.transitions?.[order.estado as keyof typeof statusInfo.transitions] || []) as string[];
    const isFinal = allowedTransitions.length === 0;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Pedido #{order.numeroPedido}</h1>
                <Button variant="outline" onClick={() => router.back()}>
                    Volver
                </Button>
            </div>
            <div className="bg-white p-4 rounded shadow space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <strong>Fecha:</strong> {new Date(order.createdAt).toLocaleString()}
                    </div>
                    <div>
                        <strong>Estado:</strong> <OrderStatusBadge status={order.estado} statusInfo={statusInfo} />
                    </div>
                    <div>
                        <strong>Destinatario:</strong> {order.primerNombreDestinatario} {order.primerApellidoDestinatario}
                    </div>
                    <div>
                        <strong>Email:</strong> {order.emailDestinatario}
                    </div>
                    <div>
                        <strong>Teléfono:</strong> {order.telefonoDestinatario}
                    </div>
                    <div>
                        <strong>Dirección:</strong> {order.direccion.calle} {order.direccion.numero},{' '}
                        {order.direccion.comuna.nombre}, {order.direccion.comuna.region.nombre}
                    </div>
                    <div>
                        <strong>Método de pago:</strong> {order.metodoPago}
                    </div>
                    <div>
                        <strong>Envío:</strong> {order.envio.metodoEnvio} - Estimado:{' '}
                        {new Date(order.envio.fechaEstimadaEntrega).toLocaleDateString()}
                    </div>
                </div>
                <div>
                    <strong>Productos:</strong>
                    <table className="w-full mt-2 border">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 text-left">Producto</th>
                                <th className="p-2 text-left">Cantidad</th>
                                <th className="p-2 text-left">Precio</th>
                                <th className="p-2 text-left">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items.map((item) => (
                                <tr key={item.id} className="border-t">
                                    <td className="p-2">{item.nombre}</td>
                                    <td className="p-2">{item.cantidad}</td>
                                    <td className="p-2">${item.precio.toLocaleString()}</td>
                                    <td className="p-2">${item.total.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="text-right font-bold text-xl">Total: ${order.total.toLocaleString()}</div>
            </div>

            <div className="bg-white p-4 rounded shadow">
                <h3 className="font-bold mb-2">Cambiar estado del pedido</h3>
                {isFinal ? (
                    <div className="bg-gray-50 border border-gray-200 rounded p-3">
                        <p className="text-sm text-gray-600">
                            Estado final (<strong>{statusInfo?.labels?.[order.estado as keyof typeof statusInfo.labels]}</strong>). No permite más transiciones.
                        </p>
                    </div>
                ) : (
                    <>
                        <p className="text-xs text-gray-500 mb-3">
                            Solo se permiten las transiciones desde el estado actual. Selecciona una opción:
                        </p>
                        <div className="flex gap-2 flex-wrap">
                            {allStatuses.map((status) => {
                                const isCurrent = order.estado === status;
                                const isAllowed = allowedTransitions.includes(status);
                                return (
                                    <Button
                                        key={status}
                                        variant={isCurrent ? 'default' : 'outline'}
                                        onClick={() => handleStatusClick(status)}
                                        disabled={!isAllowed}
                                        title={!isAllowed && !isCurrent ? 'Transición no permitida' : isCurrent ? 'Estado actual' : ''}
                                        className={isCurrent ? 'bg-rose-600 hover:bg-rose-700' : ''}
                                    >
                                        {statusInfo?.labels?.[status]}
                                    </Button>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>

            <StatusChangeDialog
                isOpen={!!pendingChange}
                fromStatus={pendingChange?.from || ''}
                toStatus={pendingChange?.to || ''}
                fromLabel={statusInfo?.labels?.[pendingChange?.from as keyof typeof statusInfo.labels] || ''}
                toLabel={statusInfo?.labels?.[pendingChange?.to as keyof typeof statusInfo.labels] || ''}
                onConfirm={confirmChange}
                onCancel={() => setPendingChange(null)}
            />
        </div>
    );
}
