'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { Order } from '@/types';
import { OrderStatusBadge } from '@/components/admin/OrderStatusBadge';
import { Button } from '@/components/ui/button';

const statusOptions = ['PENDIENTE', 'PREPARANDO', 'ENVIADO', 'ENTREGADO', 'CANCELADO'];

export default function AdminOrderDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const fetchOrder = async () => {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const handleStatusChange = async (newStatus: string) => {
        setUpdating(true);
        await api.patch(`/orders/${id}/status`, { estado: newStatus });
        fetchOrder();
        setUpdating(false);
    };

    if (loading) return <div>Cargando...</div>;
    if (!order) return <div>Pedido no encontrado</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Pedido #{order.numeroPedido}</h1>
                <Button variant="outline" onClick={() => router.back()}>Volver</Button>
            </div>
            <div className="bg-white p-4 rounded shadow space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div><strong>Fecha:</strong> {new Date(order.createdAt).toLocaleString()}</div>
                    <div><strong>Estado:</strong> <OrderStatusBadge status={order.estado} /></div>
                    <div><strong>Destinatario:</strong> {order.primerNombreDestinatario} {order.primerApellidoDestinatario}</div>
                    <div><strong>Email:</strong> {order.emailDestinatario}</div>
                    <div><strong>Teléfono:</strong> {order.telefonoDestinatario}</div>
                    <div><strong>Dirección:</strong> {order.direccion.calle} {order.direccion.numero}, {order.direccion.comuna.nombre}, {order.direccion.comuna.region.nombre}</div>
                    <div><strong>Método de pago:</strong> {order.metodoPago}</div>
                    <div><strong>Envío:</strong> {order.envio.metodoEnvio} - Estimado: {new Date(order.envio.fechaEstimadaEntrega).toLocaleDateString()}</div>
                </div>
                <div>
                    <strong>Productos:</strong>
                    <table className="w-full mt-2 border">
                        <thead className="bg-gray-100">
                            <tr><th className="p-2">Producto</th><th>Cantidad</th><th>Precio</th><th>Total</th></tr>
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
                <div className="flex gap-2 flex-wrap">
                    {statusOptions.map((status) => (
                        <Button
                            key={status}
                            variant={order.estado === status ? 'default' : 'outline'}
                            onClick={() => handleStatusChange(status)}
                            disabled={updating}
                        >
                            {status}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
}