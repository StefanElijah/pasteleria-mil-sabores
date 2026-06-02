// app/page.tsx
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { Product } from '@/types';
import ProductCard from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const { data } = await api.get('/products/destacados');
        setFeaturedProducts(data);
      } catch (error) {
        console.error("Error al cargar productos destacados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-rose-50 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Endulzando tus <span className="text-rose-600">mejores momentos</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Descubre nuestra selección de tortas, postres y dulces artesanales elaborados con los mejores ingredientes y mucho amor.
          </p>
          <Link href="/products">
            <Button size="lg" className="bg-rose-600 hover:bg-rose-700 text-white rounded-full px-8">
              Ver catálogo completo <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Productos Destacados Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Productos Destacados</h2>
            <p className="text-gray-600 mt-2">Nuestras especialidades más solicitadas</p>
          </div>
          <Link href="/products" className="hidden sm:flex items-center text-rose-600 hover:text-rose-700 font-medium">
            Ver todos <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="text-rose-600 animate-pulse">Cargando destacados...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Botón ver todos para móviles */}
        <div className="mt-8 text-center sm:hidden">
          <Link href="/products">
            <Button variant="outline" className="w-full">
              Ver todos los productos
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}