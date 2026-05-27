'use client';
import { CldUploadWidget } from 'next-cloudinary';
import { Button } from '@/components/ui/button';
import { ImagePlus, Trash } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  value: string[];         // Array actual de URLs
  onChange: (newValue: string[]) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange }) => {
  const onUpload = (result: any) => {
    const newUrl = result.info.secure_url;
    onChange([...value, newUrl]);
  };

  const onRemove = (urlToRemove: string) => {
    onChange(value.filter((url) => url !== urlToRemove));
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-4">
        {value.map((url) => (
          <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden border">
            <div className="z-10 absolute top-2 right-2">
              <Button type="button" onClick={() => onRemove(url)} variant="destructive" size="sm">
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image fill className="object-cover" alt="Imagen del producto" src={url} />
          </div>
        ))}
      </div>
      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        onSuccess={onUpload}
        options={{
          maxFiles: 10,
          sources: ['local', 'url', 'camera'],
          showUploadMoreButton: true,
          clientAllowedFormats: ['image/png', 'image/jpeg', 'image/webp'],
        }}
      >
        {({ open }) => (
          <Button type="button" onClick={() => open()} variant="secondary">
            <ImagePlus className="h-4 w-4 mr-2" />
            Subir imágenes
          </Button>
        )}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;