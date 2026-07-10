'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const login = useAuthStore((state) => state.login);
    const isLoading = useAuthStore((state) => state.isLoading);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password, rememberMe);
            router.push('/');
        } catch (error) {
            alert('Credenciales incorrectas');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[70vh]">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Iniciar sesión</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-2 border rounded mb-4"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        className="w-full p-2 border rounded mb-4"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <label className="flex items-center mb-4 text-sm text-gray-600">
                        <input
                            type="checkbox"
                            className="mr-2"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        Mantener sesión iniciada
                    </label>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-rose-600 text-white py-2 rounded hover:bg-rose-700"
                    >
                        {isLoading ? 'Cargando...' : 'Ingresar'}
                    </button>
                </form>
                <p className="text-center mt-4">
                    ¿No tienes cuenta? <Link href="/auth/register" className="text-rose-600">Regístrate</Link>
                </p>
            </div>
        </div>
    );
}
