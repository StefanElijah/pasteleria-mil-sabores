'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Mail, Phone, MapPin } from 'lucide-react';
import { FaInstagram } from 'react-icons/fa';

const contactSchema = z.object({
    nombre: z.string().min(1, 'El nombre es obligatorio'),
    email: z.string().email('Correo inválido'),
    mensaje: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function ContactoPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactForm>({
        resolver: zodResolver(contactSchema),
    });

    const onSubmit = async (data: ContactForm) => {
        setIsSubmitting(true);
        // Simulación de envío - conectar con backend real después
        console.log(data);
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success('Mensaje enviado', {
            description: '¡Gracias por contactarnos! Te responderemos pronto.',
        });
        reset();
        setIsSubmitting(false);
    };

    return (
        <div className="container mx-auto py-12 px-4 max-w-4xl">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-rose-600 mb-2">Pastelería Mil Sabores</h1>
                <p className="text-gray-600 text-lg">Contáctanos para más información</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Formulario */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold mb-4">Envíanos un mensaje</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <Input {...register('nombre')} placeholder="Nombre completo" />
                            {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>}
                        </div>
                        <div>
                            <Input {...register('email')} placeholder="Correo electrónico" type="email" />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                        </div>
                        <div>
                            <Textarea {...register('mensaje')} placeholder="Escribe tu mensaje..." rows={5} />
                            {errors.mensaje && <p className="text-red-500 text-sm mt-1">{errors.mensaje.message}</p>}
                        </div>
                        <Button type="submit" disabled={isSubmitting} className="w-full">
                            {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
                        </Button>
                    </form>
                </div>

                {/* Información de contacto */}
                <div className="bg-gray-50 rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold mb-4">Información de contacto</h2>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-rose-600" />
                            <span>+56 9 1234 5678</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-rose-600" />
                            <span>contacto@milsabores.cl</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-rose-600" />
                            <span>Calle Principal 123, Santiago</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <FaInstagram className="w-5 h-5 text-rose-600" />
                            <span>@milSaboresPasteleria</span>
                        </div>
                    </div>
                    <hr className="my-6" />
                    <div className="text-center">
                        <p className="text-gray-600">Horario de atención</p>
                        <p className="font-medium">Lunes a Sábado: 9:00 - 21:00 hrs</p>
                        <p className="text-gray-600 mt-2">¿Tienes una solicitud especial? Escríbenos por WhatsApp.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}