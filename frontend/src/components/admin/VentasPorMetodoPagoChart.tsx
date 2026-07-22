'use client';

import * as React from 'react';
import { memo } from 'react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

const chartConfig = {
  tarjeta: { label: 'Tarjeta', color: '#3b82f6' },
  transferencia: { label: 'Transferencia', color: '#22c55e' },
  efectivo: { label: 'Efectivo', color: '#f59e0b' },
  pago_entrega: { label: 'Pago Contra Entrega', color: '#a855f7' },
} satisfies ChartConfig;

type ActiveKey = 'all' | 'tarjeta' | 'transferencia' | 'efectivo' | 'pago_entrega';

interface Props {
  revenueByPaymentMethod: { date: string; tarjeta: number; transferencia: number; efectivo: number; pago_entrega: number }[];
}

const VentasPorMetodoPagoChart = memo(function VentasPorMetodoPagoChart({ revenueByPaymentMethod }: Props) {
  const [activeChart, setActiveChart] = React.useState<ActiveKey>('all');

  const total = React.useMemo(() => {
    let tarjeta = 0;
    let transferencia = 0;
    let efectivo = 0;
    let pago_entrega = 0;
    for (const d of revenueByPaymentMethod) {
      tarjeta += d.tarjeta;
      transferencia += d.transferencia;
      efectivo += d.efectivo;
      pago_entrega += d.pago_entrega;
    }
    return {
      all: Math.round(tarjeta + transferencia + efectivo + pago_entrega),
      tarjeta: Math.round(tarjeta),
      transferencia: Math.round(transferencia),
      efectivo: Math.round(efectivo),
      pago_entrega: Math.round(pago_entrega),
    };
  }, [revenueByPaymentMethod]);

  const empty = revenueByPaymentMethod.every(
    (d) => d.tarjeta === 0 && d.transferencia === 0 && d.efectivo === 0 && d.pago_entrega === 0
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-4">
          <CardTitle className="text-base">Ventas por método de pago</CardTitle>
          <CardDescription>Tarjeta vs Transferencia vs Efectivo</CardDescription>
        </div>
        <div className="flex">
          {(['all', 'tarjeta', 'transferencia', 'efectivo', 'pago_entrega'] as const).map((key) => (
            <button
              key={key}
              data-active={activeChart === key}
              className="flex flex-1 flex-col justify-center gap-1 border-t px-4 py-3 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-t-0 sm:border-l sm:px-6 sm:py-4"
              onClick={() => setActiveChart(key)}
            >
              <span className="text-xs text-muted-foreground">
                {key === 'all' ? 'Todos' : chartConfig[key].label}
              </span>
              <span className="text-base leading-none font-bold sm:text-xl tabular-nums">
                ${total[key].toLocaleString('es-CL')}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        {empty ? (
          <p className="text-sm text-muted-foreground py-8 text-center">No hay ventas en el período seleccionado.</p>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <LineChart
              accessibilityLayer
              data={revenueByPaymentMethod}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={16}
                angle={-30}
                textAnchor="end"
                height={60}
                tick={{ fontSize: 10 }}
                tickFormatter={(value: string) => {
                  const date = new Date(value + 'T12:00:00');
                  return date.toLocaleDateString('es-CL', {
                    month: 'short',
                    day: 'numeric',
                  });
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11 }}
                tickFormatter={(value: number) => value.toLocaleString('es-CL')}
                domain={[0, (dataMax: number) => {
                  const padded = Math.round(dataMax * 1.15);
                  return padded === 0 ? 100 : padded;
                }]}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    labelFormatter={(value: string) => {
                      return new Date(value + 'T12:00:00').toLocaleDateString('es-CL', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      });
                    }}
                  />
                }
              />
              {(activeChart === 'all' || activeChart === 'tarjeta') && (
                <Line
                  dataKey="tarjeta"
                  type="monotone"
                  stroke="var(--color-tarjeta)"
                  strokeWidth={2}
                  dot={false}
                />
              )}
              {(activeChart === 'all' || activeChart === 'transferencia') && (
                <Line
                  dataKey="transferencia"
                  type="monotone"
                  stroke="var(--color-transferencia)"
                  strokeWidth={2}
                  dot={false}
                />
              )}
              {(activeChart === 'all' || activeChart === 'efectivo') && (
                <Line
                  dataKey="efectivo"
                  type="monotone"
                  stroke="var(--color-efectivo)"
                  strokeWidth={2}
                  dot={false}
                />
              )}
              {(activeChart === 'all' || activeChart === 'pago_entrega') && (
                <Line
                  dataKey="pago_entrega"
                  type="monotone"
                  stroke="var(--color-pago_entrega)"
                  strokeWidth={2}
                  dot={false}
                />
              )}
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
});
export default VentasPorMetodoPagoChart;
