import { Button } from '@/components/ui/button';

interface FormButtonsProps {
    isLoading: boolean;
    onCancel?: () => void;
    submitLabel?: string;
    loadingLabel?: string;
}

export function FormButtons({
    isLoading,
    onCancel,
    submitLabel = 'Guardar',
    loadingLabel = 'Guardando...',
}: FormButtonsProps) {
    return (
        <div className="flex gap-2">
            {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancelar
                </Button>
            )}
            <Button type="submit" disabled={isLoading}>
                {isLoading ? loadingLabel : submitLabel}
            </Button>
        </div>
    );
}
