'use client';
import { useRequireAuth } from '@/hooks/useAuth';
import { useCartStore } from '@/store/cartStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

const checkoutSchema = z.object({
    primerNombreDestinatario: z.string().min(1),
    primerApellidoDestinatario: z.string().min(1),
    emailDestinatario: z.string().email(),
    telefonoDestinatario: z.string().min(1),
    direccionId: z.string().optional(),
    direccion: z.object({
        calle: z.string().min(1),
        numero: z.string().min(1),
        ciudad: z.string().optional(),
        codigoPostal: z.string().optional(),
        telefono: z.string().optional(),
        tipoVivienda: z.enum(['CASA', 'DEPARTAMENTO', 'OFICINA', 'LOCAL_COMERCIAL', 'OTRO']).default('CASA'),
        comunaId: z.string().min(1),
    }).optional(),
    metodoPago: z.enum(['TARJETA', 'TRANSFERENCIA', 'EFECTIVO', 'PAGO_ENTREGA']),
    metodoEnvio: z.string().min(1),
}).refine(data => data.direccionId || data.direccion, {
    message: 'Debe proporcionar una dirección existente o una nueva',
});

export default function CheckoutPage() {
    const { user } = useRequireAuth();
    const { items, total, clearCart, cartId } = useCartStore();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            primerNombreDestinatario: user?.primerNombre || '',
            primerApellidoDestinatario: user?.primerApellido || '',
            emailDestinatario: user?.email || '',
            telefonoDestinatario: user?.telefono || '',
            metodoPago: 'EFECTIVO',
            metodoEnvio: 'Chilexpress',
        },
    });

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            // Asegurar que items se envíen desde el carrito si no se especificaron
            const orderData = {
                ...data,
                items: items.map(item => ({ productId: item.productId, quantity: item.quantity })),
            };
            const headers = cartId ? { 'x-cart-id': cartId } : {};
            const response = await api.post('/orders', orderData, { headers });
            await clearCart();
            router.push(`/orders/${response.data.id}`);
        } catch (error) {
            alert('Error al procesar el pedido');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (items.length === 0) {
        return <div className="text-center py-10">El carrito está vacío. <Link href="/">Ir a comprar</Link></div>;
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Finalizar compra</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label>Nombre destinatario *</label>
                    <input {...register('primerNombreDestinatario')} className="border p-2 w-full" />
                    {errors.primerNombreDestinatario && <p className="text-red-500">{errors.primerNombreDestinatario.message}</p>}
                </div>
                <div>
                    <label>Apellido destinatario *</label>
                    <input {...register('primerApellidoDestinatario')} className="border p-2 w-full" />
                </div>
                <div>
                    <label>Email destinatario *</label>
                    <input {...register('emailDestinatario')} className="border p-2 w-full" />
                </div>
                <div>
                    <label>Teléfono destinatario *</label>
                    <input {...register('telefonoDestinatario')} className="border p-2 w-full" />
                </div>
                {/* Aquí iría un selector de direcciones guardadas o formulario de dirección nueva. Por simplicidad, usaremos dirección temporal */}
                <div className="border p-4 rounded">
                    <h3 className="font-semibold mb-2">Dirección de envío</h3>
                    <div>
                        <label>Calle *</label>
                        <input {...register('direccion.calle')} className="border p-2 w-full" />
                    </div>
                    <div>
                        <label>Número *</label>
                        <input {...register('direccion.numero')} className="border p-2 w-full" />
                    </div>
                    <div>
                        <label>Comuna ID *</label>
                        <input {...register('direccion.comunaId')} className="border p-2 w-full" placeholder="1" />
                    </div>
                </div>
                <div>
                    <label>Método de pago *</label>
                    <select {...register('metodoPago')} className="border p-2 w-full">
                        <option value="EFECTIVO">Efectivo</option>
                        <option value="TARJETA">Tarjeta</option>
                        <option value="TRANSFERENCIA">Transferencia</option>
                        <option value="PAGO_ENTREGA">Pago contra entrega</option>
                    </select>
                </div>
                <div>
                    <label>Método de envío *</label>
                    <select {...register('metodoEnvio')} className="border p-2 w-full">
                        <option value="Chilexpress">Chilexpress</option>
                        <option value="Starken">Starken</option>
                    </select>
                </div>
                <div className="text-xl font-bold">Total: ${total.toLocaleString()}</div>
                <button type="submit" disabled={isSubmitting} className="bg-rose-600 text-white py-2 px-4 rounded w-full">
                    {isSubmitting ? 'Procesando...' : 'Confirmar pedido'}
                </button>
            </form>
        </div>
    );
}