'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';

export default function RegisterPage() {
    const router = useRouter();
    const register = useAuthStore((state) => state.register);
    const isLoading = useAuthStore((state) => state.isLoading);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        primerNombre: '',
        primerApellido: '',
        telefono: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await register(formData);
            router.push('/auth/login?registered=true');
        } catch (error) {
            alert('Error al registrarse');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[70vh]">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Crear cuenta</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="email" type="email" placeholder="Email" onChange={handleChange} required className="w-full p-2 border rounded" />
                    <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} required className="w-full p-2 border rounded" />
                    <input name="primerNombre" placeholder="Nombre" onChange={handleChange} required className="w-full p-2 border rounded" />
                    <input name="primerApellido" placeholder="Apellido" onChange={handleChange} required className="w-full p-2 border rounded" />
                    <input name="telefono" placeholder="Teléfono (opcional)" onChange={handleChange} className="w-full p-2 border rounded" />
                    <button type="submit" disabled={isLoading} className="w-full bg-rose-600 text-white py-2 rounded">
                        {isLoading ? 'Registrando...' : 'Registrarse'}
                    </button>
                </form>
                <p className="text-center mt-4">
                    ¿Ya tienes cuenta? <Link href="/auth/login" className="text-rose-600">Inicia sesión</Link>
                </p>
            </div>
        </div>
    );
}