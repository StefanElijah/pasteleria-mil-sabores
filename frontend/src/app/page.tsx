'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Product } from '@/types';
import ProductCard from '@/components/products/ProductCard';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products')
      .then(({ data }) => setProducts(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-10">Cargando productos...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Nuestros Productos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}