import React, { useRef } from 'react';
import type { ImageFile } from '../types';
import { UploadIcon, CloseIcon } from './icons';

interface ImageUploaderProps {
  id: string;
  label: string;
  imageFile: ImageFile | null;
  onImageUpload: (file: ImageFile) => void;
  onRemove: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ id, label, imageFile, onImageUpload, onRemove }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        const previewUrl = URL.createObjectURL(file);
        
        onImageUpload({
          base64,
          mimeType: file.type,
          previewUrl
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    if (!imageFile) {
        inputRef.current?.click();
    }
  };

  return (
    <div className="w-full">
      <p className="text-lg font-semibold text-[#8C4E3A] mb-3">{label}</p>
      <div
        onClick={handleClick}
        className={`group relative aspect-square w-full rounded-2xl border-2 border-dashed transition-all duration-300 flex items-center justify-center
          ${imageFile ? 'border-[#8C4E3A] bg-white p-2 shadow-sm' : 'border-gray-400 bg-white/50 hover:border-[#8C4E3A] hover:bg-white cursor-pointer'}
        `}
      >
        <input
          id={id}
          ref={inputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
        {imageFile ? (
          <>
            <img src={imageFile.previewUrl} alt="Preview" className="w-full h-full rounded-xl object-cover" />
            <button 
                onClick={(e) => { e.stopPropagation(); onRemove(); }}
                className="absolute -top-3 -right-3 bg-white rounded-full p-1.5 shadow-md hover:bg-red-500 hover:text-white text-gray-600 transition-all duration-300"
                aria-label="Remove image"
            >
                <CloseIcon />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-500 p-4 text-center">
            <UploadIcon />
            <p className="mt-2 text-md font-semibold text-[#8C4E3A]">
              Click to upload an image
            </p>
            <p className="text-sm">PNG, JPG, WEBP</p>
          </div>
        )}
      </div>
    </div>
  );
};