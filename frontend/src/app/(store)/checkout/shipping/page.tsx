'use client';
import { useCheckoutStore } from '@/store/checkoutStore';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const SHIPPING_METHODS = [
    { value: 'Chilexpress', label: 'Chilexpress' },
    { value: 'Starken', label: 'Starken' },
];

export default function ShippingStep() {
    const { user } = useAuthStore();
    const { shippingInfo, setShippingInfo, setShippingMethod, shippingMethod } = useCheckoutStore();
    const router = useRouter();

    const [form, setForm] = useState(shippingInfo);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [localShippingMethod, setLocalShippingMethod] = useState(shippingMethod);

    useEffect(() => {
        if (user && !shippingInfo.primerNombreDestinatario) {
            setForm((prev) => ({
                ...prev,
                primerNombreDestinatario: user.primerNombre || '',
                primerApellidoDestinatario: user.primerApellido || '',
                emailDestinatario: user.email || '',
                telefonoDestinatario: user.telefono || '',
            }));
        }
    }, []);

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!form.primerNombreDestinatario.trim()) errs.primerNombreDestinatario = 'Requerido';
        if (!form.primerApellidoDestinatario.trim()) errs.primerApellidoDestinatario = 'Requerido';
        if (!form.emailDestinatario.trim()) errs.emailDestinatario = 'Requerido';
        if (!form.telefonoDestinatario.trim()) errs.telefonoDestinatario = 'Requerido';
        if (!form.calle.trim()) errs.calle = 'Requerida';
        if (!form.numero.trim()) errs.numero = 'Requerido';
        if (!form.comunaId.trim()) errs.comunaId = 'Requerida';
        return errs;
    };

    const handleNext = () => {
        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length > 0) return;
        setShippingInfo(form);
        setShippingMethod(localShippingMethod);
        router.push('/checkout/payment');
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-6">Información de envío</h2>

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Nombre destinatario *</label>
                        <Input
                            value={form.primerNombreDestinatario}
                            onChange={(e) => setForm({ ...form, primerNombreDestinatario: e.target.value })}
                            placeholder="Nombre"
                        />
                        {errors.primerNombreDestinatario && <p className="text-red-500 text-xs mt-1">{errors.primerNombreDestinatario}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Apellido destinatario *</label>
                        <Input
                            value={form.primerApellidoDestinatario}
                            onChange={(e) => setForm({ ...form, primerApellidoDestinatario: e.target.value })}
                            placeholder="Apellido"
                        />
                        {errors.primerApellidoDestinatario && <p className="text-red-500 text-xs mt-1">{errors.primerApellidoDestinatario}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Email *</label>
                        <Input
                            type="email"
                            value={form.emailDestinatario}
                            onChange={(e) => setForm({ ...form, emailDestinatario: e.target.value })}
                            placeholder="correo@ejemplo.com"
                        />
                        {errors.emailDestinatario && <p className="text-red-500 text-xs mt-1">{errors.emailDestinatario}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Teléfono *</label>
                        <Input
                            value={form.telefonoDestinatario}
                            onChange={(e) => setForm({ ...form, telefonoDestinatario: e.target.value })}
                            placeholder="+56 9..."
                        />
                        {errors.telefonoDestinatario && <p className="text-red-500 text-xs mt-1">{errors.telefonoDestinatario}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Calle *</label>
                    <Input
                        value={form.calle}
                        onChange={(e) => setForm({ ...form, calle: e.target.value })}
                        placeholder="Ej: Av. Providencia"
                    />
                    {errors.calle && <p className="text-red-500 text-xs mt-1">{errors.calle}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Número *</label>
                        <Input
                            value={form.numero}
                            onChange={(e) => setForm({ ...form, numero: e.target.value })}
                            placeholder="Ej: 1234"
                        />
                        {errors.numero && <p className="text-red-500 text-xs mt-1">{errors.numero}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Comuna ID *</label>
                        <Input
                            value={form.comunaId}
                            onChange={(e) => setForm({ ...form, comunaId: e.target.value })}
                            placeholder="Ej: 1 (Santiago)"
                        />
                        {errors.comunaId && <p className="text-red-500 text-xs mt-1">{errors.comunaId}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Método de envío</label>
                    <div className="grid grid-cols-2 gap-3">
                        {SHIPPING_METHODS.map((method) => (
                            <button
                                key={method.value}
                                type="button"
                                onClick={() => setLocalShippingMethod(method.value)}
                                className={`border rounded-lg p-3 text-sm font-medium transition-colors ${localShippingMethod === method.value ? 'border-rose-600 bg-rose-50 text-rose-600' : 'border-gray-200 hover:border-gray-300'}`}
                            >
                                {method.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={() => router.push('/checkout')}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Anterior
                </Button>
                <Button onClick={handleNext}>
                    Siguiente: Pago <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </div>
    );
}
