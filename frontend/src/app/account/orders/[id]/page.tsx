'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/axios';
import { Order } from '@/types';
import { useRequireAuth } from '@/hooks/useAuth';

export default function OrderDetailPage() {
    const { id } = useParams();
    const { user } = useRequireAuth();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id && user) {
            api.get(`/orders/${id}`)
                .then(({ data }) => setOrder(data))
                .finally(() => setLoading(false));
        }
    }, [id, user]);

    if (loading) return <div>Cargando...</div>;
    if (!order) return <div>Pedido no encontrado</div>;

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Pedido #{order.numeroPedido}</h1>
            <div className="border rounded p-4 space-y-4">
                <div>
                    <strong>Estado:</strong> {order.estado}
                </div>
                <div>
                    <strong>Fecha:</strong> {new Date(order.createdAt).toLocaleDateString()}
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
                    <strong>Dirección:</strong> {order.direccion.calle} {order.direccion.numero}, {order.direccion.comuna.nombre}, {order.direccion.comuna.region.nombre}
                </div>
                <div>
                    <strong>Envío:</strong> {order.envio.metodoEnvio} - Estimado: {new Date(order.envio.fechaEstimadaEntrega).toLocaleDateString()}
                    {order.envio.numeroTracking && <div>Tracking: {order.envio.numeroTracking}</div>}
                </div>
                <div>
                    <strong>Productos:</strong>
                    <ul className="list-disc pl-5 mt-2">
                        {order.items.map((item) => (
                            <li key={item.id}>
                                {item.cantidad} x {item.nombre} - ${item.total.toLocaleString()}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="border-t pt-2 text-right font-bold">
                    Total: ${order.total.toLocaleString()}
                </div>
            </div>
        </div>
    );
}