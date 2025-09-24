import React, { useState, useRef, useCallback, useEffect } from 'react';
import { UploadCloudIcon } from '../icons/UploadCloudIcon';
import { useTranslator } from '../../hooks/useTranslator';

interface ImageDropzoneProps {
  onFileSelect: (file: File | null) => void;
  existingImageUrl?: string | null;
  label: string;
  disabled?: boolean;
}

export const ImageDropzone: React.FC<ImageDropzoneProps> = ({ onFileSelect, existingImageUrl, label, disabled = false }) => {
  const t = useTranslator();
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(existingImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreview(existingImageUrl || null);
  }, [existingImageUrl]);

  const handleFile = useCallback((file: File | undefined) => {
    if (file && file.type.startsWith('image/')) {
        onFileSelect(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    } else {
        onFileSelect(null);
    }
  }, [onFileSelect]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;
    
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  const handleClick = () => {
    if (!disabled) {
        fileInputRef.current?.click();
    }
  };
  
  const baseClasses = "relative border-2 border-dashed rounded-lg p-6 flex flex-col justify-center items-center text-center transition-colors duration-200";
  const stateClasses = isDragging 
    ? "border-blue-500 bg-blue-50" 
    : "border-gray-300 bg-white hover:border-gray-400";
  const disabledClasses = disabled ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer";

  return (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <div
            className={`${baseClasses} ${stateClasses} ${disabledClasses}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleClick}
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-disabled={disabled}
            aria-label={`${label}: ${t('dragAndDropOrClick')}`}
            onKeyDown={(e) => e.key === 'Enter' && handleClick()}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleInputChange}
                className="hidden"
                accept="image/png, image/jpeg, image/gif, image/svg+xml"
                aria-hidden="true"
                disabled={disabled}
            />
            {preview ? (
                <img src={preview} alt="Preview" className="max-h-32 rounded-md object-contain" />
            ) : (
                <div className="space-y-1">
                    <UploadCloudIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="text-sm text-gray-600">
                        {t('dragAndDropOrClick')}
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF, SVG</p>
                </div>
            )}
        </div>
    </div>
  );
};