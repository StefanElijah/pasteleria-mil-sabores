'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { Envio } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { EstadoEnvioBadge } from '@/components/ui/EstadoEnvioBadge';
import { estadoPedidoOpciones } from '@/lib/estados';
import { X } from 'lucide-react';

const TODOS = 'TODOS';

export default function AdminEnviosPage() {
    const [envios, setEnvios] = useState<Envio[]>([]);
    const [loading, setLoading] = useState(true);
    const [filtroEstado, setFiltroEstado] = useState<string>(TODOS);

    const cargar = async () => {
        setLoading(true);
        try {
            const params: any = {};
            if (filtroEstado !== TODOS) params.estadoEnvio = filtroEstado;
            const { data } = await api.get('/envios', { params });
            setEnvios(Array.isArray(data) ? data : data.content || []);
        } catch (err) {
            console.error('Error cargando envíos:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargar();
    }, [filtroEstado]);

    const handleFilterChange = (v: string | null) => {
        setFiltroEstado(v ?? TODOS);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin h-8 w-8 border-4 border-rose-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Gestión de Envíos</h1>
                <Link href="/admin/envios/problemas">
                    <Button variant="outline" size="sm">Ver envíos con problemas</Button>
                </Link>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <label className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                    Filtrar por estado:
                </label>
                <Select value={filtroEstado} onValueChange={handleFilterChange}>
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Todos los estados" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={TODOS}>Todos los estados</SelectItem>
                        {estadoPedidoOpciones.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {filtroEstado !== TODOS && (
                    <Button variant="ghost" size="sm" onClick={() => handleFilterChange(TODOS)}
                        className="text-muted-foreground hover:text-foreground gap-1.5">
                        <X className="h-3.5 w-3.5" />
                        Limpiar
                    </Button>
                )}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">
                        Listado de envíos
                        {filtroEstado !== TODOS && (
                            <span className="ml-2 text-sm font-normal text-muted-foreground">
                                — {envios.length} resultado{envios.length !== 1 ? 's' : ''} (filtrados)
                            </span>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="w-full overflow-x-auto">
                        <Table className="min-w-[600px]">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[180px]">Tracking</TableHead>
                                    <TableHead>Pedido</TableHead>
                                    <TableHead>Método</TableHead>
                                    <TableHead className="w-[160px]">Estado</TableHead>
                                    <TableHead className="w-[130px]">Fecha estimada</TableHead>
                                    <TableHead className="w-[100px]">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {envios.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-sm">
                                            No hay envíos que mostrar.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    envios.map((envio) => (
                                        <TableRow key={envio.id}>
                                            <TableCell className="font-medium text-sm">
                                                {envio.numeroTracking || '—'}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {envio.pedido?.numeroPedido || '—'}
                                            </TableCell>
                                            <TableCell className="text-sm">{envio.metodoEnvio}</TableCell>
                                            <TableCell>
                                                <EstadoEnvioBadge estado={envio.estadoEnvio} />
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                                                {new Date(envio.fechaEstimadaEntrega).toLocaleDateString('es-CL')}
                                            </TableCell>
                                            <TableCell>
                                                <Link href={`/admin/envios/${envio.id}`}>
                                                    <Button variant="ghost" size="sm">Ver detalle</Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
