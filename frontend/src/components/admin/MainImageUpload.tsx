'use client';
import { useState, useRef, DragEvent } from 'react';
import api from '@/lib/axios';
import { ImagePlus, Trash2, Upload, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface MainImageUploadProps {
    value: string | null;
    onChange: (url: string | null) => void;
}

export default function MainImageUpload({ value, onChange }: MainImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const upload = async (file: File) => {
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const { data } = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            onChange(data.url);
        } catch {
            alert('Error al subir imagen');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            upload(file);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) upload(file);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleReplace = () => fileInputRef.current?.click();
    const handleRemove = () => onChange(null);

    if (isUploading) {
        return (
            <div className="relative w-[288px] h-48 bg-gray-100 border-2 border-rose-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 text-rose-500 animate-spin mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">Subiendo imagen...</p>
                </div>
            </div>
        );
    }

    if (value) {
        return (
            <div className="relative w-[288px] h-48 rounded-lg overflow-hidden border group">
                <Image
                    src={value}
                    alt="Imagen principal"
                    fill
                    className="object-cover"
                    sizes="288px"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button
                        type="button"
                        onClick={handleReplace}
                        className="flex items-center gap-1 bg-white/90 hover:bg-white text-gray-800 px-3 py-1.5 rounded text-sm font-medium transition-colors"
                    >
                        <Upload className="h-3.5 w-3.5" />
                        Reemplazar
                    </button>
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                        Eliminar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />
            <button
                type="button"
                onClick={handleReplace}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                className={`w-[288px] h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer ${
                    isDragOver
                        ? 'border-rose-500 bg-rose-50'
                        : 'border-gray-300 hover:border-rose-400 hover:bg-rose-50'
                }`}
            >
                <ImagePlus className="h-8 w-8 text-gray-400" />
                <p className="text-sm text-gray-500 font-medium">Imagen principal</p>
                <p className="text-xs text-gray-400">Arrastra o haz clic para subir</p>
            </button>
        </>
    );
}
