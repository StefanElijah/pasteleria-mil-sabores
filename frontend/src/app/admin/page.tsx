'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalCategories: 0,
        totalOrders: 0,
        pendingOrders: 0,
    });

    useEffect(() => {
        Promise.all([
            api.get('/products').then((res) => res.data.length),
            api.get('/categories').then((res) => res.data.length),
            api.get('/orders').then((res) => {
                const orders = res.data;
                return {
                    total: orders.length,
                    pending: orders.filter((o: any) => o.estado === 'PENDIENTE').length,
                };
            }),
        ]).then(([productsCount, categoriesCount, ordersData]) => {
            setStats({
                totalProducts: productsCount,
                totalCategories: categoriesCount,
                totalOrders: ordersData.total,
                pendingOrders: ordersData.pending,
            });
        });
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500">Total Productos</h3>
                    <p className="text-3xl font-bold">{stats.totalProducts}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500">Categorías</h3>
                    <p className="text-3xl font-bold">{stats.totalCategories}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500">Pedidos Totales</h3>
                    <p className="text-3xl font-bold">{stats.totalOrders}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500">Pedidos Pendientes</h3>
                    <p className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</p>
                </div>
            </div>
        </div>
    );
}