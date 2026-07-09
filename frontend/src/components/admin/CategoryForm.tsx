'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { FormButtons } from '@/components/ui/form-buttons';
import { useSlug } from '@/hooks/useSlug';

const categorySchema = z.object({
    nombre: z.string().min(1, "El nombre es requerido").max(50, "Máximo 50 caracteres"),
    slug: z
        .string()
        .min(1, "El slug es requerido")
        .max(50, "Máximo 50 caracteres")
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Formato inválido (solo minúsculas, números y guiones)"),
    activo: z.boolean().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormProps {
    initialData?: Partial<CategoryFormValues>;
    onSubmit: (data: CategoryFormValues) => Promise<void>;
    isLoading: boolean;
    onCancel?: () => void;
}

export function CategoryForm({ initialData, onSubmit, isLoading, onCancel }: CategoryFormProps) {
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: initialData || { activo: true },
    });

    const slug = useSlug({ watch, setValue });
    const [copied, setCopied] = useState(false);

    const handleCopySlug = async () => {
        await navigator.clipboard.writeText(slug);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
            <div>
                <label>Nombre *</label>
                <Input {...register('nombre')} />
                {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre.message}</p>}
            </div>
            <div>
                <label className="text-muted-foreground text-sm">Slug (auto-generado)</label>
                <div className="flex gap-2">
                    <Input {...register('slug')} readOnly className="bg-muted cursor-default" />
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={handleCopySlug}
                        title="Copiar slug"
                    >
                        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                </div>
                {errors.slug && <p className="text-red-500 text-sm">{errors.slug.message}</p>}
            </div>
            <div className="flex items-center gap-2">
                <Checkbox
                    checked={watch('activo')}
                    onCheckedChange={(checked) => setValue('activo', !!checked)}
                />
                <label>Activo</label>
            </div>
            <FormButtons isLoading={isLoading} onCancel={onCancel} />
        </form>
    );
}