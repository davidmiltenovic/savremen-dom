import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Star } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface UploadedImage {
  id?: string;
  url: string;
  path?: string;
  is_main: boolean;
  order_index: number;
  isNew?: boolean;
}

interface ImageUploadProps {
  propertyId?: string;
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
}

export function ImageUpload({ propertyId, images, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const resizeAndOptimizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }

          let width = img.width;
          let height = img.height;
          const maxWidth = 1920;
          const maxHeight = 1920;

          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = width * ratio;
            height = height * ratio;
          }

          canvas.width = width;
          canvas.height = height;

          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Could not convert canvas to blob'));
                return;
              }
              const reader = new FileReader();
              reader.onloadend = () => {
                resolve(reader.result as string);
              };
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            },
            'image/jpeg',
            0.85
          );
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFiles = async (files: FileList) => {
    setUploading(true);

    try {
      const fileArray = Array.from(files);
      const uploadPromises = fileArray.map(async (file) => {
        if (!file.type.startsWith('image/')) {
          throw new Error(`${file.name} nije slika`);
        }

        const optimizedBase64 = await resizeAndOptimizeImage(file);

        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
          throw new Error('Niste prijavljeni');
        }

        const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/optimize-image`;
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageBase64: optimizedBase64,
            fileName: file.name,
            propertyId: propertyId,
            userToken: sessionData.session.access_token,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Upload failed');
        }

        const result = await response.json();

        return {
          url: result.url,
          path: result.path,
          is_main: images.length === 0,
          order_index: images.length,
          isNew: true,
        };
      });

      const uploadedImages = await Promise.all(uploadPromises);
      onChange([...images, ...uploadedImages]);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Greška pri upload-u slika');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = async (index: number) => {
    const image = images[index];

    if (image.path) {
      try {
        await supabase.storage
          .from('property-images')
          .remove([image.path]);
      } catch (error) {
        console.error('Error removing image from storage:', error);
      }
    }

    if (image.id && propertyId) {
      try {
        await supabase
          .from('property_images')
          .delete()
          .eq('id', image.id);
      } catch (error) {
        console.error('Error removing image from database:', error);
      }
    }

    const updatedImages = images
      .filter((_, i) => i !== index)
      .map((img, i) => ({
        ...img,
        order_index: i,
        is_main: i === 0 && images.length > 1 ? true : img.is_main,
      }));

    onChange(updatedImages);
  };

  const setMainImage = (index: number) => {
    const updatedImages = images.map((img, i) => ({
      ...img,
      is_main: i === index,
    }));
    onChange(updatedImages);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= images.length) return;

    const updatedImages = [...images];
    const [movedImage] = updatedImages.splice(fromIndex, 1);
    updatedImages.splice(toIndex, 0, movedImage);

    const reorderedImages = updatedImages.map((img, i) => ({
      ...img,
      order_index: i,
    }));

    onChange(reorderedImages);
  };

  return (
    <div className="space-y-4">
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 transition-all ${
          dragActive
            ? 'border-[#7096AF] bg-[#7096AF]/5'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          id="image-upload"
        />

        <label
          htmlFor="image-upload"
          className="flex flex-col items-center justify-center cursor-pointer"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            {uploading ? (
              <div className="w-8 h-8 border-4 border-gray-300 border-t-[#7096AF] rounded-full animate-spin" />
            ) : (
              <Upload className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <p className="text-lg font-medium text-gray-900 mb-1">
            {uploading ? 'Upload u toku...' : 'Prevucite slike ovde'}
          </p>
          <p className="text-sm text-gray-500">
            ili kliknite da izaberete fajlove
          </p>
          <p className="text-xs text-gray-400 mt-2">
            PNG, JPG, WebP do 10MB
          </p>
        </label>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative group bg-white border-2 border-gray-200 rounded-lg overflow-hidden aspect-square"
            >
              <img
                src={image.url}
                alt={`Slika ${index + 1}`}
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setMainImage(index)}
                  className={`p-2 rounded-lg transition-all ${
                    image.is_main
                      ? 'bg-[#7096AF] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                  title="Glavna slika"
                >
                  <Star className="w-5 h-5" fill={image.is_main ? 'currentColor' : 'none'} />
                </button>

                <button
                  type="button"
                  onClick={() => moveImage(index, index - 1)}
                  disabled={index === 0}
                  className="p-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  title="Pomeri levo"
                >
                  ←
                </button>

                <button
                  type="button"
                  onClick={() => moveImage(index, index + 1)}
                  disabled={index === images.length - 1}
                  className="p-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  title="Pomeri desno"
                >
                  →
                </button>

                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                  title="Obriši"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {image.is_main && (
                <div className="absolute top-2 left-2 bg-[#7096AF] text-white text-xs font-semibold px-2 py-1 rounded">
                  GLAVNA
                </div>
              )}

              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Još nema slika</p>
        </div>
      )}
    </div>
  );
}
