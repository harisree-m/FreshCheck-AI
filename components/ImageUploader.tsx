
import React, { useRef } from 'react';

interface ImageUploaderProps {
  onImageSelect: (base64: string) => void;
  disabled: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={disabled}
      />
      
      <div 
        onClick={disabled ? undefined : triggerUpload}
        className={`relative group border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer
          ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-50' : 'hover:border-emerald-500 hover:bg-emerald-50 border-slate-300'}
        `}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Scan your food</h3>
            <p className="text-sm text-slate-500 mt-1">Upload a photo or snap a picture from your camera</p>
          </div>
          <button 
            className={`mt-2 px-6 py-2.5 rounded-full font-semibold shadow-sm transition-colors
              ${disabled ? 'bg-slate-300 text-slate-500' : 'bg-emerald-600 text-white hover:bg-emerald-700'}
            `}
          >
            Select Image
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
