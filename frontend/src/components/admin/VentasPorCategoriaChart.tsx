'use client';

import * as React from 'react';
import { memo } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const COLORS = [
  '#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6',
  '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16',
  '#06b6d4', '#e11d48', '#a855f7', '#eab308', '#64748b',
];

const TOP_N = 15;

const chartConfig = {
  total: { label: 'Ingresos', color: '#3b82f6' },
};

interface Props {
  revenueByCategory: { categoria: string; total: number }[];
}

const VentasPorCategoriaChart = memo(function VentasPorCategoriaChart({ revenueByCategory }: Props) {
  const data = React.useMemo(() => {
    if (revenueByCategory.length > TOP_N) {
      const top = revenueByCategory.slice(0, TOP_N);
      const others = revenueByCategory.slice(TOP_N).reduce((sum, d) => sum + d.total, 0);
      if (others > 0) {
        top.push({ categoria: 'Otras', total: others });
      }
      return top;
    }
    return revenueByCategory;
  }, [revenueByCategory]);

  const empty = data.length === 0 || data.every((d) => d.total === 0);
  const chartHeight = Math.max(250, data.length * 32 + 40);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <CardTitle className="text-base">Ingresos por categoría</CardTitle>
      </CardHeader>
      <CardContent>
        {empty ? (
          <p className="text-sm text-muted-foreground py-8 text-center">No hay ventas registradas.</p>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="w-full"
            style={{ height: chartHeight }}
          >
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
              accessibilityLayer
              barCategoryGap="20%"
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                type="category"
                dataKey="categoria"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11 }}
                width={140}
              />
              <XAxis type="number" tickLine={false} axisLine={false} tick={{ fontSize: 11 }}
                tickFormatter={(v: number) => `$${v.toLocaleString('es-CL')}`}
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
              <Bar dataKey="total" radius={[0, 4, 4, 0]} barSize={20}>
                {data.map((entry, index) => (
                  <Cell key={entry.categoria} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
});
export default VentasPorCategoriaChart;
