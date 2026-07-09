'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/axios';
import { Order } from '@/types';
import { Loader2, Package, MapPin, CreditCard, Truck, CheckCircle } from 'lucide-react';

const ESTADO_LABELS: Record<string, string> = {
    PENDIENTE: 'Pendiente',
    PREPARANDO: 'Preparando',
    ENVIADO: 'Enviado',
    ENTREGADO: 'Entregado',
    CANCELADO: 'Cancelado',
};

const ESTADO_COLORS: Record<string, string> = {
    PENDIENTE: 'bg-yellow-100 text-yellow-800',
    PREPARANDO: 'bg-blue-100 text-blue-800',
    ENVIADO: 'bg-purple-100 text-purple-800',
    ENTREGADO: 'bg-green-100 text-green-800',
    CANCELADO: 'bg-red-100 text-red-800',
};

export default function TrackOrderPage() {
    const { token } = useParams();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (token && typeof token === 'string') {
            api.get(`/orders/track/${token}`)
                .then(({ data }) => setOrder(data))
                .catch((err) => {
                    if (err.response?.status === 404) {
                        setError('Pedido no encontrado. Verifica que el enlace sea correcto.');
                    } else {
                        setError('Error al cargar el pedido.');
                    }
                })
                .finally(() => setLoading(false));
        }
    }, [token]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-rose-600" />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="max-w-md mx-auto text-center py-12">
                <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h1 className="text-2xl font-bold mb-2">No encontramos tu pedido</h1>
                <p className="text-gray-500">{error || 'El enlace puede haber expirado o ser incorrecto.'}</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-6 flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                    <h1 className="text-2xl font-bold">Pedido {order.numeroPedido}</h1>
                    <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium mt-1 ${ESTADO_COLORS[order.estado] || 'bg-gray-100'}`}>
                        {ESTADO_LABELS[order.estado] || order.estado}
                    </span>
                </div>
            </div>

            <div className="border rounded-lg p-4 space-y-4">
                <div>
                    <strong>Fecha:</strong>{' '}
                    {new Date(order.createdAt).toLocaleDateString('es-CL', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })}
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
                    <strong>Envío:</strong> {order.envio.metodoEnvio} - Estimado:{' '}
                    {new Date(order.envio.fechaEstimadaEntrega).toLocaleDateString('es-CL')}
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
                <div className="border-t pt-2 text-right font-bold">Total: ${order.total.toLocaleString()}</div>
            </div>

            <p className="text-sm text-gray-500 text-center mt-6">
                Guarda este enlace para consultar el estado de tu pedido.
            </p>
        </div>
    );
}
