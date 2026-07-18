// app/page.tsx
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { Product } from '@/types';
import ProductCard from '@/components/products/ProductCard';
import HeroSlider from '@/components/ui/hero-slider';
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
      <div className="relative -mt-8 -ml-[calc(50vw-50%)] -mr-[calc(50vw-50%)] overflow-hidden">
        <HeroSlider />
      </div>

      {/* Productos Destacados Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Productos Destacados</h2>
          <p className="text-gray-600 mt-2">Nuestras especialidades más solicitadas</p>
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