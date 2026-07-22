'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { Envio } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { EstadoEnvioBadge } from '@/components/ui/EstadoEnvioBadge';

export default function ProblemasPage() {
    const [envios, setEnvios] = useState<Envio[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/envios/problemas')
            .then(({ data }) => setEnvios(Array.isArray(data) ? data : data.content || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin h-8 w-8 border-4 border-rose-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Envíos con problemas</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Listado de envíos problemáticos</CardTitle>
                </CardHeader>
                <CardContent>
                    {envios.length === 0 ? (
                        <p className="text-muted-foreground">No hay envíos con problemas</p>
                    ) : (
                        <div className="w-full overflow-x-auto">
                            <Table className="min-w-[600px]">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tracking</TableHead>
                                        <TableHead>Pedido</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead>Fecha estimada</TableHead>
                                        <TableHead>Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {envios.map((envio) => (
                                        <TableRow key={envio.id}>
                                            <TableCell className="font-medium text-sm">{envio.numeroTracking || '—'}</TableCell>
                                            <TableCell className="text-sm">{envio.pedido?.numeroPedido || '—'}</TableCell>
                                            <TableCell><EstadoEnvioBadge estado={envio.estadoEnvio} /></TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {new Date(envio.fechaEstimadaEntrega).toLocaleDateString('es-CL')}
                                            </TableCell>
                                            <TableCell>
                                                <Link href={`/admin/envios/${envio.id}`}>
                                                    <Button variant="ghost" size="sm">Ver detalle</Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
