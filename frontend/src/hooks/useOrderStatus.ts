'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/axios';

export type EstadoPedidoKey =
    | 'PENDIENTE'
    | 'PREPARANDO'
    | 'ENVIADO'
    | 'EN_REPARTO'
    | 'ENTREGADO'
    | 'INTENTO_FALLIDO'
    | 'RETRASADO'
    | 'DEVUELTO'
    | 'CANCELADO';

export type ColorKey =
    | 'yellow'
    | 'blue'
    | 'purple'
    | 'indigo'
    | 'green'
    | 'red'
    | 'orange'
    | 'gray';

export interface OrderStatusInfo {
    labels: Record<EstadoPedidoKey, string>;
    colors: Record<EstadoPedidoKey, ColorKey>;
    transitions: Record<EstadoPedidoKey, EstadoPedidoKey[]>;
}

export const DEFAULT_STATUS_INFO: OrderStatusInfo = {
    labels: {
        PENDIENTE: 'Pendiente',
        PREPARANDO: 'Preparando',
        ENVIADO: 'Enviado',
        EN_REPARTO: 'En Reparto',
        ENTREGADO: 'Entregado',
        INTENTO_FALLIDO: 'Intento Fallido',
        RETRASADO: 'Retrasado',
        DEVUELTO: 'Devuelto',
        CANCELADO: 'Cancelado',
    },
    colors: {
        PENDIENTE: 'yellow',
        PREPARANDO: 'blue',
        ENVIADO: 'purple',
        EN_REPARTO: 'indigo',
        ENTREGADO: 'green',
        INTENTO_FALLIDO: 'red',
        RETRASADO: 'orange',
        DEVUELTO: 'gray',
        CANCELADO: 'red',
    },
    transitions: {
        PENDIENTE: ['PREPARANDO', 'CANCELADO'],
        PREPARANDO: ['ENVIADO', 'CANCELADO'],
        ENVIADO: ['EN_REPARTO', 'RETRASADO', 'INTENTO_FALLIDO'],
        EN_REPARTO: ['ENTREGADO', 'INTENTO_FALLIDO', 'RETRASADO'],
        RETRASADO: ['EN_REPARTO', 'INTENTO_FALLIDO', 'ENTREGADO'],
        INTENTO_FALLIDO: ['EN_REPARTO', 'RETRASADO', 'DEVUELTO'],
        DEVUELTO: [],
        ENTREGADO: [],
        CANCELADO: [],
    },
};

let cachedInfo: OrderStatusInfo | null = null;
let loadingPromise: Promise<OrderStatusInfo> | null = null;

function loadFromBackend(): Promise<OrderStatusInfo> {
    return api
        .get('/orders/status-info')
        .then(({ data }) => data as OrderStatusInfo)
        .catch(() => DEFAULT_STATUS_INFO);
}

export function useOrderStatus() {
    const [info, setInfo] = useState<OrderStatusInfo>(cachedInfo || DEFAULT_STATUS_INFO);

    useEffect(() => {
        if (cachedInfo) {
            setInfo(cachedInfo);
            return;
        }
        if (!loadingPromise) {
            loadingPromise = loadFromBackend().then((data) => {
                cachedInfo = data;
                return data;
            });
        }
        loadingPromise.then((data) => setInfo(data));
    }, []);

    return info;
}
