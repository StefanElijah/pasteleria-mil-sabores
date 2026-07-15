'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
        <div className="flex items-center justify-center py-8 sm:py-12">
            <Card className="w-full max-w-md mx-4 sm:mx-auto">
                <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl text-center font-bold">
                        Iniciar sesión
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label htmlFor="email" className="block text-sm font-medium">
                                Email
                            </label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="tu@correo.cl"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="password" className="block text-sm font-medium">
                                Contraseña
                            </label>
                            <PasswordInput
                                id="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="remember"
                                checked={rememberMe}
                                onCheckedChange={(checked) => setRememberMe(checked === true)}
                            />
                            <label
                                htmlFor="remember"
                                className="text-sm text-muted-foreground cursor-pointer select-none"
                            >
                                Mantener sesión iniciada
                            </label>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-rose-600 hover:bg-rose-700 text-white"
                        >
                            {isLoading ? 'Cargando...' : 'Ingresar'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center border-t-0 pt-0">
                    <p className="text-sm text-muted-foreground">
                        ¿No tienes cuenta?{' '}
                        <Link href="/auth/register" className="text-rose-600 hover:underline font-medium">
                            Regístrate
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
