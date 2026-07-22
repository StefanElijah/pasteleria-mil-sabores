'use client';

import * as React from 'react';
import { memo } from 'react';
import { Pie, PieChart } from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMemo } from 'react';
import { estadoPedidoHexColor, estadoPedidoTexto, isEstadoPedido } from '@/lib/estados';
import { filterByDate, RANGES } from '@/lib/filtro';

interface PedidoData {
  estado: string;
  count: number;
  createdAt?: string;
}

const DistribucionPedidosChart = memo(function DistribucionPedidosChart({ pedidos }: { pedidos: PedidoData[] }) {
  const [dias, setDias] = React.useState('all');

  const data = useMemo(() => {
    const grouped: Record<string, number> = {};
    for (const p of pedidos) {
      const estado = isEstadoPedido(p.estado) ? p.estado : 'DESCONOCIDO';
      grouped[estado] = (grouped[estado] || 0) + 1;
    }

    return Object.entries(grouped)
      .map(([estado, cantidad]) => ({
        estado,
        cantidad,
        fill: estadoPedidoHexColor[estado as keyof typeof estadoPedidoHexColor] || '#9ca3af',
      }))
      .sort((a, b) => b.cantidad - a.cantidad);
  }, [pedidos]);

  const chartConfig = useMemo(() => {
    const config: Record<string, { label: string; color: string }> = {};
    for (const { estado, fill } of data) {
      const label = isEstadoPedido(estado) ? estadoPedidoTexto[estado] : estado;
      config[estado] = { label, color: fill };
    }
    return config;
  }, [data]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <CardTitle className="text-base">Pedidos por estado</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">No hay pedidos registrados.</p>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={data}
                dataKey="cantidad"
                nameKey="estado"
                innerRadius={55}
                strokeWidth={2}
              />
              <ChartLegend
                content={<ChartLegendContent nameKey="estado" />}
              />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
});
export default DistribucionPedidosChart;
