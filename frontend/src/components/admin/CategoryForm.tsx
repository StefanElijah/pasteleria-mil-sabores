'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

const categorySchema = z.object({
    nombre: z.string().min(1),
    slug: z.string().min(1),
    icono: z.string().optional(),
    activo: z.boolean().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormProps {
    initialData?: Partial<CategoryFormValues>;
    onSubmit: (data: CategoryFormValues) => Promise<void>;
    isLoading: boolean;
}

export function CategoryForm({ initialData, onSubmit, isLoading }: CategoryFormProps) {
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: initialData || { activo: true },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
            <div>
                <label>Nombre *</label>
                <Input {...register('nombre')} />
                {errors.nombre && <p className="text-red-500">{errors.nombre.message}</p>}
            </div>
            <div>
                <label>Slug *</label>
                <Input {...register('slug')} />
            </div>
            <div>
                <label>Icono (emoji o URL)</label>
                <Input {...register('icono')} />
            </div>
            <div className="flex items-center gap-2">
                <Checkbox
                    checked={watch('activo')}
                    onCheckedChange={(checked) => setValue('activo', !!checked)}
                />
                <label>Activo</label>
            </div>
            <Button type="submit" disabled={isLoading}>{isLoading ? 'Guardando...' : 'Guardar'}</Button>
        </form>
    );
}