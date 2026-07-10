'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface Props {
    isOpen: boolean;
    fromStatus: string;
    toStatus: string;
    fromLabel: string;
    toLabel: string;
    onConfirm: () => Promise<void>;
    onCancel: () => void;
}

export function StatusChangeDialog({
    isOpen,
    fromStatus,
    toStatus,
    fromLabel,
    toLabel,
    onConfirm,
    onCancel,
}: Props) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleConfirm = async () => {
        setLoading(true);
        setError('');
        try {
            await onConfirm();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al cambiar estado');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onCancel}>
            <div
                className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-bold">Confirmar cambio de estado</h3>
                    <button
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-600"
                        disabled={loading}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <p className="text-gray-600 mb-4">
                    Se actualizará del estado actual{' '}
                    <strong className="text-orange-600">{fromLabel}</strong> a{' '}
                    <strong className="text-green-600">{toLabel}</strong>.
                </p>

                <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
                    <p className="text-sm text-yellow-800">
                        ¿Estás seguro? <strong>No se podrá volver al estado anterior.</strong>
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm mb-3">
                        {error}
                    </div>
                )}

                <div className="text-xs text-gray-500 mb-3">
                    <span className="font-mono">
                        {fromStatus} → {toStatus}
                    </span>
                </div>

                <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={onCancel} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={loading}
                        className="bg-rose-600 hover:bg-rose-700"
                    >
                        {loading ? 'Actualizando...' : 'Confirmar'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
