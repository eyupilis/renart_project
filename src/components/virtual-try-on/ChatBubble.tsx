import React from 'react';
import type { ImageFile, EditImageResult } from '../../types/virtual-try-on';

interface ResultCardProps {
  isLoading: boolean;
  resultData: EditImageResult | null;
  error: string | null;
  sourceImages: {
    ring: ImageFile;
    person: ImageFile;
  }
}

const LoadingState: React.FC = () => (
    <div className="relative w-full aspect-square bg-gray-200 rounded-xl overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
    </div>
);

const SourceImagePreview: React.FC<{ image: ImageFile, label: string }> = ({ image, label }) => (
    <div className="text-center">
        <img src={image.previewUrl} alt={label} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md mx-auto" />
        <p className="text-sm mt-2 font-semibold text-[#8C4E3A]">{label}</p>
    </div>
);


export const ResultCard: React.FC<ResultCardProps> = ({ isLoading, resultData, error, sourceImages }) => {
  return (
    <div className="w-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8 animate-fade-in-up">
      <div className="flex justify-center items-center gap-4 md:gap-8 -mt-20 mb-6">
        <SourceImagePreview image={sourceImages.ring} label="Ring" />
        <SourceImagePreview image={sourceImages.person} label="Hand" />
      </div>
      <div className="w-full">
        {isLoading && <LoadingState />}
        {error && !isLoading && (
            <div className="w-full aspect-square bg-red-50 border border-red-200 rounded-xl flex flex-col items-center justify-center text-center p-4">
                <h3 className="text-xl font-bold text-red-600">Generation Failed</h3>
                <p className="text-red-500 mt-2">{error}</p>
            </div>
        )}
        {resultData && !isLoading && (
            <div className="w-full">
                <img
                  src={`data:${resultData.mimeType};base64,${resultData.imageBase64}`}
                  alt="Generated virtual try-on"
                  className="w-full aspect-square rounded-xl object-cover shadow-md"
                />
                {resultData.text && (
                  <p className="text-center mt-4 text-[#7D4222] italic">{resultData.text}</p>
                )}
            </div>
        )}
      </div>
    </div>
  );
};