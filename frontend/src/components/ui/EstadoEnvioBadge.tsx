'use client';

import { Badge } from '@/components/ui/badge';
import { isEstadoPedido, estadoPedidoTexto, estadoPedidoColor } from '@/lib/estados';

interface Props {
    estado: string;
}

export function EstadoEnvioBadge({ estado }: Props) {
    return (
        <Badge className={isEstadoPedido(estado) ? estadoPedidoColor[estado] : 'bg-gray-500'}>
            {isEstadoPedido(estado) ? estadoPedidoTexto[estado] : estado}
        </Badge>
    );
}
