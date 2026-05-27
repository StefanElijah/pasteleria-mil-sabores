'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Category } from '@/types';
import ImageUpload from './ImageUpload';
import { useState } from 'react';

const productSchema = z.object({
    nombre: z.string().min(1),
    slug: z.string().min(1),
    descripcion: z.string().optional(),
    precio: z.number().min(0),
    precioComparacion: z.number().min(0).optional().nullable(),
    stock: z.number().int().min(0),
    imagenes: z.array(z.string()).optional(),
    novedad: z.boolean().optional(),
    destacado: z.boolean().optional(),
    activo: z.boolean().optional(),
    categoriaId: z.string().min(1),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
    initialData?: Partial<ProductFormValues>;
    categories: Category[];
    onSubmit: (data: ProductFormValues) => Promise<void>;
    isLoading: boolean;
}

export function ProductForm({ initialData, categories, onSubmit, isLoading }: ProductFormProps) {
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: initialData || {
            novedad: false,
            destacado: false,
            activo: true,
            stock: 0,
            precio: 0,
            imagenes: [],
        },
    });
    const imagenes = watch('imagenes') || [];

    const handleImageChange = (url: string) => {
        setValue('imagenes', [...imagenes, url]);
    };

    const handleImageRemove = (urlToRemove: string) => {
        setValue('imagenes', imagenes.filter((url: string) => url !== urlToRemove));
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label>Nombre *</label>
                <Input {...register('nombre')} />
                {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre.message}</p>}
            </div>
            <div>
                <label>Slug *</label>
                <Input {...register('slug')} />
                {errors.slug && <p className="text-red-500 text-sm">{errors.slug.message}</p>}
            </div>
            <div>
                <label>Descripción</label>
                <Textarea {...register('descripcion')} rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label>Precio *</label>
                    <Input type="number" step="1" {...register('precio', { valueAsNumber: true })} />
                    {errors.precio && <p className="text-red-500 text-sm">{errors.precio.message}</p>}
                </div>
                <div>
                    <label>Precio Comparación</label>
                    <Input type="number" step="1" {...register('precioComparacion', { valueAsNumber: true })} />
                </div>
            </div>
            <div>
                <label>Stock *</label>
                <Input type="number" {...register('stock', { valueAsNumber: true })} />
            </div>
            <div>
                <label>Categoría *</label>
                <select {...register('categoriaId')} className="w-full border rounded p-2">
                    <option value="">Seleccione...</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.nombre}
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                    <Checkbox
                        checked={watch('novedad')}
                        onCheckedChange={(checked) => setValue('novedad', !!checked)}
                    />
                    Novedad
                </label>
                <label className="flex items-center gap-2">
                    <Checkbox
                        checked={watch('destacado')}
                        onCheckedChange={(checked) => setValue('destacado', !!checked)}
                    />
                    Destacado
                </label>
                <label className="flex items-center gap-2">
                    <Checkbox
                        checked={watch('activo')}
                        onCheckedChange={(checked) => setValue('activo', !!checked)}
                    />
                    Activo
                </label>
            </div>
            <ImageUpload
                value={imagenes}
                onChange={(newImages) => setValue('imagenes', newImages)}
            />
            <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Guardando...' : 'Guardar'}
            </Button>
        </form>
    );
}