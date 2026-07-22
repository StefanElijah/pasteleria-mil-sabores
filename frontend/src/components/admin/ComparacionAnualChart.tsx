'use client';

import * as React from 'react';
import { memo } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const MONTH_OPTIONS = [
  { value: '', label: 'Todos los meses' },
  ...MONTHS.map((label, i) => ({ value: String(i + 1), label })),
];

const chartConfig = {
  añoActual: { label: 'Año actual', color: '#3b82f6' },
  añoAnterior: { label: 'Año anterior', color: '#94a3b8' },
};

interface Props {
  monthlyComparison: { label: string; añoActual: number; añoAnterior: number }[];
}

const ComparacionAnualChart = memo(function ComparacionAnualChart({ monthlyComparison }: Props) {
  const empty = monthlyComparison.every((d) => d.añoActual === 0 && d.añoAnterior === 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <CardTitle className="text-base">Comparación anual</CardTitle>
      </CardHeader>
      <CardContent>
        {empty ? (
          <p className="text-sm text-muted-foreground py-8 text-center">No hay datos de comparación anual.</p>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={monthlyComparison} margin={{ left: 12, right: 12 }}>
              <defs>
                <linearGradient id="grad-actual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="grad-anterior" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 11 }}
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
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value) => (
                      <span className="font-mono font-medium tabular-nums text-foreground">
                        ${Number(value ?? 0).toLocaleString('es-CL')}
                      </span>
                    )}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="añoActual"
                stroke="#3b82f6"
                fill="url(#grad-actual)"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Area
                type="monotone"
                dataKey="añoAnterior"
                stroke="#94a3b8"
                fill="url(#grad-anterior)"
                strokeWidth={2}
                strokeDasharray="4 3"
                dot={{ fill: '#94a3b8', r: 3 }}
                activeDot={{ r: 5 }}
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
});
export default ComparacionAnualChart;
