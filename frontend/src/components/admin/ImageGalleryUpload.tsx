'use client';
import { useState, useRef, DragEvent } from 'react';
import api from '@/lib/axios';
import { ImagePlus, Trash2, GripVertical, Loader2 } from 'lucide-react';
import Image from 'next/image';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    useSortable,
    rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const MAX_IMAGES = 5;

interface ImageGalleryUploadProps {
    value: string[];
    onChange: (newValue: string[]) => void;
}

function SortableImage({ url, index, onRemove }: { url: string; index: number; onRemove: () => void }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: url });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="relative group">
            <button
                type="button"
                {...attributes}
                {...listeners}
                className="absolute top-1 left-1 z-20 bg-black/60 rounded p-0.5 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <GripVertical className="h-3.5 w-3.5 text-white" />
            </button>
            <button
                type="button"
                onClick={onRemove}
                className="absolute top-1 right-1 z-20 bg-red-600 rounded p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <Trash2 className="h-3.5 w-3.5 text-white" />
            </button>
            <div className="relative w-28 h-28 rounded-lg overflow-hidden border bg-gray-100">
                <Image
                    src={url}
                    alt={`Imagen ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="112px"
                />
            </div>
        </div>
    );
}

export default function ImageGalleryUpload({ value, onChange }: ImageGalleryUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = value.indexOf(active.id as string);
            const newIndex = value.indexOf(over.id as string);
            onChange(arrayMove(value, oldIndex, newIndex));
        }
    };

    const upload = async (file: File) => {
        if (value.length >= MAX_IMAGES) return;
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const { data } = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            onChange([...value, data.url]);
        } catch {
            alert('Error al subir imagen');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const files = Array.from(e.dataTransfer.files);
        files.forEach((file) => {
            if (file.type.startsWith('image/') && value.length + files.indexOf(file) < MAX_IMAGES) {
                upload(file);
            }
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        files.forEach((file) => upload(file));
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const canAdd = value.length < MAX_IMAGES;

    return (
        <div>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={value} strategy={rectSortingStrategy}>
                    <div className="flex flex-wrap gap-3">
                        {value.map((url, idx) => (
                            <SortableImage
                                key={url}
                                url={url}
                                index={idx}
                                onRemove={() => onChange(value.filter((u) => u !== url))}
                            />
                        ))}
                        {isUploading && (
                            <div className="w-28 h-28 rounded-lg border bg-gray-100 flex items-center justify-center">
                                <Loader2 className="h-6 w-6 text-rose-500 animate-spin" />
                            </div>
                        )}
                        {canAdd && (
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                                onDragLeave={() => setIsDragOver(false)}
                                onDrop={handleDrop}
                                className={`w-28 h-28 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
                                    isDragOver
                                        ? 'border-rose-500 bg-rose-50'
                                        : 'border-gray-300 hover:border-rose-400 hover:bg-rose-50'
                                }`}
                            >
                                <ImagePlus className="h-5 w-5 text-gray-400" />
                                <span className="text-xs text-gray-400">Agregar</span>
                            </button>
                        )}
                    </div>
                </SortableContext>
            </DndContext>
            {value.length === 0 && !isUploading && (
                <p className="text-gray-400 text-xs mt-2">Arrastra imágenes o haz clic en Agregar (máx. {MAX_IMAGES})</p>
            )}
        </div>
    );
}
