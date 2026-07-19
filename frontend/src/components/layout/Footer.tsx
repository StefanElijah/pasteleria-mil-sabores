'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { CreditCard, Wallet, DollarSign } from 'lucide-react';

export default function Footer() {
    const pathname = usePathname();
    return (
        <footer className="bg-gray-900 text-gray-300 py-10 mt-12">
            <div className="container mx-auto px-4 sm:px-8 md:px-16 lg:px-24 xl:px-28 2xl:px-32">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Compañía */}
                    <div>
                        <h5 className="text-white text-lg font-semibold mb-4">Pastelería Mil Sabores</h5>
                        <p className="text-sm">La mejor pastelería artesanal en Chile, endulzando tus momentos especiales desde 1995.</p>
                        <div className="flex gap-4 mt-4">
                            <a href="#" aria-label="Facebook" className="hover:text-white">
                                <FaFacebook className="w-5 h-5" />
                            </a>
                            <a href="https://www.instagram.com/pasteleriamilsaboresoficial/" aria-label="Instagram" className="hover:text-white">
                                <FaInstagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Enlaces rápidos */}
                    <div>
                        <h5 className="text-white text-lg font-semibold mb-4">Enlaces Rápidos</h5>
                        <ul className="space-y-2 text-sm">
                            {pathname === '/' ? (
                                <li><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white cursor-pointer">Inicio</button></li>
                            ) : (
                                <li><Link href="/" className="hover:text-white">Inicio</Link></li>
                            )}
                            <li><Link href="/nosotros" className="hover:text-white">Quienes Somos</Link></li>
                            <li><Link href="/contacto" className="hover:text-white">Contáctanos</Link></li>
                        </ul>
                    </div>

                    {/* Políticas */}
                    <div>
                        <h5 className="text-white text-lg font-semibold mb-4">Políticas</h5>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/terminos-y-condiciones" className="hover:text-white">Términos y Condiciones</Link></li>
                            <li><Link href="/privacidad-y-seguridad" className="hover:text-white">Privacidad y Seguridad</Link></li>
                            <li><Link href="/devolucion-y-reembolso" className="hover:text-white">Devolución y Reembolso</Link></li>
                            <li><Link href="/calidad-e-inocuidad" className="hover:text-white">Calidad e Inocuidad</Link></li>
                            <li><Link href="/entrega-y-envios" className="hover:text-white">Entrega y Envíos</Link></li>
                        </ul>
                    </div>

                    {/* Contacto y métodos de pago */}
                    <div>
                        <h5 className="text-white text-lg font-semibold mb-4">Contacto</h5>
                        <p className="text-sm flex items-center gap-2">
                            📍 Calle Principal 123, Santiago
                        </p>
                        <h5 className="text-white text-lg font-semibold mt-6 mb-4">Formas de Pago</h5>
                        <div className="flex gap-3">
                            <CreditCard className="w-6 h-6" />
                            <DollarSign className="w-6 h-6" />
                            <Wallet className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <hr className="border-gray-800 my-8" />

                <div className="container mx-auto px-4 sm:px-8 md:px-16 lg:px-24 xl:px-28 2xl:px-32 text-center">
                    <p>© {new Date().getFullYear()} Pastelería Mil Sabores. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}