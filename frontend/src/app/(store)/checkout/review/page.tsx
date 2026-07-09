'use client';
import { useCheckoutStore } from '@/store/checkoutStore';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, MapPin, CreditCard, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { deleteDraft } from '@/lib/checkout';

export default function ReviewStep() {
    const { shippingInfo, paymentMethod, shippingMethod, setShippingCost, shippingCost, reset: resetCheckout } = useCheckoutStore();
    const { items, total, subtotal, discount, clearCart, cartId } = useCartStore();
    const router = useRouter();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [orderCreated, setOrderCreated] = useState<any>(null);
    const [calculatingShipping, setCalculatingShipping] = useState(true);

    const displaySubtotal = subtotal || total;
    const displayDiscount = discount?.amount || 0;
    const displayShipping = shippingCost || 0;
    const displayTotal = total + displayShipping;

    useEffect(() => {
        if (shippingInfo.comunaId) {
            setCalculatingShipping(true);
            api.get('/orders/shipping', {
                params: { comunaId: shippingInfo.comunaId, metodo: shippingMethod },
            })
                .then((res) => {
                    setShippingCost(res.data.costo);
                })
                .catch(() => { })
                .finally(() => setCalculatingShipping(false));
        } else {
            setCalculatingShipping(false);
        }
    }, []);

    const handleConfirm = async () => {
        setIsSubmitting(true);
        setError('');
        try {
            const orderData = {
                items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
                direccion: {
                    calle: shippingInfo.calle,
                    numero: shippingInfo.numero,
                    comunaId: shippingInfo.comunaId,
                    tipoVivienda: shippingInfo.tipoVivienda || 'CASA',
                },
                metodoPago: paymentMethod,
                metodoEnvio: shippingMethod,
                costoEnvio: shippingCost,
                descuentoId: discount?.id,
                primerNombreDestinatario: shippingInfo.primerNombreDestinatario,
                primerApellidoDestinatario: shippingInfo.primerApellidoDestinatario,
                emailDestinatario: shippingInfo.emailDestinatario,
                telefonoDestinatario: shippingInfo.telefonoDestinatario,
            };

            const headers = cartId ? { 'x-cart-id': cartId } : {};
            const response = await api.post('/orders', orderData, { headers });
            await clearCart();
            await deleteDraft().catch(() => { });
            resetCheckout();
            setOrderCreated(response.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al procesar el pedido. Intenta de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (orderCreated) {
        return (
            <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Pedido confirmado</h2>
                <p className="text-gray-500 mb-4">Tu pedido <strong>{orderCreated.numeroPedido}</strong> ha sido registrado exitosamente.</p>

                {orderCreated.envio?.fechaEstimadaEntrega && (
                    <p className="text-sm text-gray-500 mb-6">
                        Fecha estimada de entrega: {new Date(orderCreated.envio.fechaEstimadaEntrega).toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                )}

                <div className="flex gap-4 justify-center">
                    <Button variant="outline" onClick={() => router.push('/')}>
                        Seguir comprando
                    </Button>
                    <Button onClick={() => router.push('/account/orders')}>
                        Ver mis pedidos
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-xl font-bold mb-6">Confirmar pedido</h2>

            <div className="space-y-6">
                <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <MapPin className="w-5 h-5 text-gray-500" />
                        <h3 className="font-semibold">Dirección de envío</h3>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                        <p className="font-medium text-gray-900">{shippingInfo.primerNombreDestinatario} {shippingInfo.primerApellidoDestinatario}</p>
                        <p>{shippingInfo.calle} #{shippingInfo.numero}, Comuna {shippingInfo.comunaId}</p>
                        <p>{shippingInfo.emailDestinatario} · {shippingInfo.telefonoDestinatario}</p>
                    </div>
                </div>

                <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Package className="w-5 h-5 text-gray-500" />
                        <h3 className="font-semibold">Método de envío</h3>
                    </div>
                    <p className="text-sm">{shippingMethod}</p>
                    {calculatingShipping ? (
                        <p className="text-sm text-gray-400">Calculando costo...</p>
                    ) : (
                        <p className="text-sm font-medium">${displayShipping.toLocaleString()}</p>
                    )}
                </div>

                <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <CreditCard className="w-5 h-5 text-gray-500" />
                        <h3 className="font-semibold">Método de pago</h3>
                    </div>
                    <p className="text-sm">{paymentMethod === 'EFECTIVO' ? 'Efectivo' : paymentMethod === 'TARJETA' ? 'Tarjeta' : paymentMethod === 'TRANSFERENCIA' ? 'Transferencia' : 'Pago contra entrega'}</p>
                </div>

                <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>${displaySubtotal.toLocaleString()}</span>
                    </div>
                    {displayDiscount > 0 && (
                        <div className="flex justify-between text-green-600">
                            <span>Descuento ({discount?.codigo})</span>
                            <span>-${displayDiscount.toLocaleString()}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-gray-600">
                        <span>Envío</span>
                        <span>{calculatingShipping ? '...' : `$${displayShipping.toLocaleString()}`}</span>
                    </div>
                    <div className="flex justify-between font-bold text-xl border-t pt-2">
                        <span>Total</span>
                        <span>{calculatingShipping ? '...' : `$${displayTotal.toLocaleString()}`}</span>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <div className="flex justify-between">
                    <Button variant="outline" onClick={() => router.push('/checkout/payment')}>
                        <ArrowLeft className="w-4 h-4 mr-2" /> Anterior
                    </Button>
                    <Button onClick={handleConfirm} disabled={isSubmitting || calculatingShipping} className="bg-rose-600 hover:bg-rose-700">
                        {isSubmitting ? 'Procesando...' : 'Confirmar pedido'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
