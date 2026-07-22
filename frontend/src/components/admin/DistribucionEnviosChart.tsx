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
import { useMemo } from 'react';
import { estadoPedidoHexColor, estadoPedidoTexto, isEstadoPedido } from '@/lib/estados';
import { Envio } from '@/types';

const DistribucionEnviosChart = memo(function DistribucionEnviosChart({ envios }: { envios: Envio[] }) {
  const data = useMemo(() => {
    const grouped = envios.reduce<Record<string, number>>((acc, e) => {
      const estado = isEstadoPedido(e.estadoEnvio) ? e.estadoEnvio : 'DESCONOCIDO';
      acc[estado] = (acc[estado] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([estado, cantidad]) => ({
        estado,
        cantidad,
        fill: estadoPedidoHexColor[estado as keyof typeof estadoPedidoHexColor] || '#9ca3af',
      }))
      .sort((a, b) => b.cantidad - a.cantidad);
  }, [envios]);

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
        <CardTitle className="text-base">Envíos por estado</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">No hay envíos registrados.</p>
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
export default DistribucionEnviosChart;
