import type { EstadoPedidoKey, ColorKey } from '@/hooks/useOrderStatus';

export const estadoPedidoTexto: Record<EstadoPedidoKey, string> = {
  PENDIENTE: 'Pendiente',
  PREPARANDO: 'Preparando',
  ENVIADO: 'Enviado',
  EN_REPARTO: 'En Reparto',
  ENTREGADO: 'Entregado',
  INTENTO_FALLIDO: 'Intento Fallido',
  RETRASADO: 'Retrasado',
  DEVUELTO: 'Devuelto',
  CANCELADO: 'Cancelado',
};

export const estadoPedidoColor: Record<EstadoPedidoKey, string> = {
  PENDIENTE: 'bg-yellow-500',
  PREPARANDO: 'bg-blue-500',
  ENVIADO: 'bg-purple-500',
  EN_REPARTO: 'bg-indigo-500',
  ENTREGADO: 'bg-green-500',
  INTENTO_FALLIDO: 'bg-red-500',
  RETRASADO: 'bg-orange-500',
  DEVUELTO: 'bg-gray-500',
  CANCELADO: 'bg-zinc-900',
};

export const estadoPedidoHexColor: Record<EstadoPedidoKey, string> = {
  PENDIENTE: '#eab308',
  PREPARANDO: '#3b82f6',
  ENVIADO: '#a855f7',
  EN_REPARTO: '#6366f1',
  ENTREGADO: '#22c55e',
  INTENTO_FALLIDO: '#ef4444',
  RETRASADO: '#f97316',
  DEVUELTO: '#6b7280',
  CANCELADO: '#18181b',
};

export interface EstadoOption {
  value: EstadoPedidoKey;
  label: string;
}

export const estadoPedidoOpciones: EstadoOption[] = (
  Object.entries(estadoPedidoTexto) as [EstadoPedidoKey, string][]
).map(([value, label]) => ({ value, label }));

export function isEstadoPedido(s: string): s is EstadoPedidoKey {
  return s in estadoPedidoTexto;
}

export { type EstadoPedidoKey, type ColorKey };
