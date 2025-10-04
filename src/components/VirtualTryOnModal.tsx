import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Product } from '../types/product';
import type { ImageFile, EditImageResult, Ring, RingColor } from '../types/virtual-try-on';
import { ImageUploader } from './virtual-try-on/ImageUploader';
import { CinematicResultCard } from './virtual-try-on/CinematicResultCard';
import { editImage } from '../services/geminiService';

interface VirtualTryOnModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

interface SelectedRing {
  product: Ring;
  color: RingColor;
  imageFile: ImageFile;
}

type AppState = 'idle' | 'generating' | 'done';

const urlToImageFile = async (url: string): Promise<ImageFile> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image from ${url}. Status: ${response.status}`);
  }
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      const previewUrl = URL.createObjectURL(blob);
      resolve({ base64, mimeType: blob.type, previewUrl });
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export function VirtualTryOnModal({ isOpen, onClose, product }: VirtualTryOnModalProps) {
  const [selectedRing, setSelectedRing] = useState<SelectedRing | null>(null);
  const [selectedColor, setSelectedColor] = useState<RingColor>('yellow');
  const [isRingLoading, setIsRingLoading] = useState(false);
  const [personImage, setPersonImage] = useState<ImageFile | null>(null);
  const [resultData, setResultData] = useState<EditImageResult | null>(null);
  const [appState, setAppState] = useState<AppState>('idle');
  const [error, setError] = useState<string | null>(null);

  const resultRef = useRef<HTMLDivElement>(null);
  const handUploaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (appState === 'generating' || appState === 'done') {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [appState]);

  // Convert product to ring format and load initial image
  useEffect(() => {
    if (isOpen && product) {
      handleRingSelect(selectedColor);
    }
  }, [isOpen, product, selectedColor]);

  const handleRingSelect = async (color: RingColor) => {
    if (!product) return;
    
    setIsRingLoading(true);
    setPersonImage(null);
    setResultData(null);
    setError(null);
    setAppState('idle');

    try {
      const url = product[`image_${color}`];
      const imageFile = await urlToImageFile(url);
      const ring: Ring = {
        name: product.name,
        popularityScore: product.popularity_score,
        weight: product.weight,
        images: {
          yellow: product.image_yellow,
          rose: product.image_rose,
          white: product.image_white,
        }
      };
      setSelectedRing({ product: ring, color, imageFile });
      setTimeout(() => {
        handUploaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    } catch {
      setError("Could not load the selected ring's image. Please try another one.");
      setSelectedRing(null);
    } finally {
      setIsRingLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedRing || !personImage) return;

    setAppState('generating');
    setError(null);
    setResultData(null);

    try {
      const result = await editImage(personImage, selectedRing.imageFile);
      
      // Check if API is unavailable
      if (!result.imageBase64 && result.text?.includes('Gemini API key not configured')) {
        setError('Virtual Try-On requires additional setup. This is a demo feature that needs the Gemini API key to be configured. You can still browse and purchase our beautiful rings!');
        setResultData({
          text: 'Virtual Try-On Demo Mode: This feature requires additional API configuration for full functionality. Visit our store to try on rings in person!',
          imageBase64: null,
          mimeType: null,
        });
      } else {
        setResultData(result);
      }
    } catch (err) {
      console.warn('Virtual Try-On error:', err);
      setError('Virtual Try-On is temporarily unavailable. You can still browse our collection and make purchases!');
    } finally {
      setAppState('done');
    }
  };

  const handleReset = () => {
    setSelectedRing(null);
    setPersonImage(null);
    setResultData(null);
    setError(null);
    setAppState('idle');
    if (product) {
      handleRingSelect('yellow');
    }
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const colorOptions: { color: RingColor; label: string; bgClass: string }[] = [
    { color: 'white', label: 'Platinum', bgClass: 'bg-gray-200' },
    { color: 'yellow', label: 'Yellow Gold', bgClass: 'bg-yellow-400' },
    { color: 'rose', label: 'Rose Gold', bgClass: 'bg-rose-300' }
  ];

  const isGenerating = appState === 'generating';
  const showResult = appState === 'generating' || appState === 'done';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-neutral-200 px-8 py-6 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-neutral-900 rounded-full flex items-center justify-center">
              <span className="text-white font-serif text-sm font-bold">R</span>
            </div>
            <div>
              <h2 className="text-2xl font-serif text-neutral-900 tracking-wide">Try On Experience</h2>
              <p className="text-neutral-600 text-sm mt-1">Experience your ring virtually with AI precision</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-3 hover:bg-neutral-100 rounded-full transition-all duration-200 group"
          >
            <X size={20} className="text-neutral-600 group-hover:text-neutral-900" />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-6 space-y-10">
          {/* Ring Selection - Premium Layout */}
          {product && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
              {/* Left Side - Ring Display */}
              <div className="flex flex-col space-y-6">
                <div className="text-center lg:text-left">
                  <div className="inline-flex items-center px-3 py-1 bg-neutral-100 rounded-full text-xs text-neutral-600 font-medium mb-4">
                    <span>The Renart® Setting</span>
                  </div>
                  <h3 className="text-3xl font-serif text-neutral-900 mb-2">{product.name}</h3>
                  <div className="flex items-center justify-center lg:justify-start space-x-4 text-sm text-neutral-600">
                    <span>${product.price.toLocaleString()}</span>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4 fill-amber-500" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                      <span>{product.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                <div className="relative flex-1 min-h-0">
                  {isRingLoading ? (
                    <div className="aspect-square w-full rounded-xl bg-neutral-100 flex items-center justify-center animate-pulse">
                      <div className="text-center">
                        <div className="w-8 h-8 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin mx-auto mb-2"></div>
                        <p className="text-neutral-500 text-sm">Loading Ring...</p>
                      </div>
                    </div>
                  ) : selectedRing ? (
                    <div className="space-y-6 h-full flex flex-col">
                      <div className="relative bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-xl p-8 flex-1">
                        <img
                          src={selectedRing.imageFile.previewUrl}
                          alt={product.name}
                          className="w-full h-full object-contain rounded-lg shadow-sm"
                        />
                      </div>
                      
                      {/* Premium Color Picker */}
                      <div className="space-y-3 flex-shrink-0">
                        <p className="text-sm font-medium text-neutral-900 tracking-wide">METAL TYPE</p>
                        <div className="grid grid-cols-3 gap-3">
                          {colorOptions.map(({ color, label, bgClass }) => (
                            <button
                              key={color}
                              onClick={() => {
                                setSelectedColor(color);
                                handleRingSelect(color);
                              }}
                              className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 ${
                                selectedColor === color
                                  ? 'border-neutral-900 bg-neutral-50 shadow-sm'
                                  : 'border-neutral-200 hover:border-neutral-300'
                              }`}
                            >
                              <div className={`w-5 h-5 rounded-full ${bgClass} border border-white shadow-sm`}></div>
                              <span className="text-xs font-medium text-neutral-800">{label.split(' ')[0]}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Right Side - Virtual Try-On */}
              <div className="flex flex-col space-y-6">
                <div className="text-center lg:text-left">
                  <h4 className="text-xl font-serif text-neutral-900 mb-2">Virtual Try-On</h4>
                  <p className="text-neutral-600 text-sm">Upload a photo of your hand to see how this ring looks on you</p>
                </div>
                
                <div className="relative flex-1 min-h-0" ref={handUploaderRef}>
                  {isRingLoading ? (
                    <div className="w-full h-full min-h-[400px] rounded-xl bg-neutral-100 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-8 h-8 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin mx-auto mb-2"></div>
                        <p className="text-neutral-500 text-sm">Preparing ring...</p>
                      </div>
                    </div>
                  ) : (selectedRing || isRingLoading) ? (
                    <div className="w-full h-full">
                      <ImageUploader
                        id="person-image"
                        label="Upload a photo of your hand"
                        onImageUpload={setPersonImage}
                        onRemove={() => setPersonImage(null)}
                        imageFile={personImage}
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          )}

          {/* Generate Button - Premium Style */}
          {selectedRing && personImage && appState === 'idle' && (
            <div className="flex flex-col items-center pt-4 border-t border-neutral-200 space-y-3">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="group relative overflow-hidden bg-neutral-900 text-white px-12 py-4 rounded-lg font-medium tracking-wide text-sm hover:bg-neutral-800 transition-all duration-300 flex items-center space-x-3"
              >
                <span>CREATE VIRTUAL TRY-ON</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <div className="text-center text-xs text-neutral-500 max-w-md">
                <p>This is an AI-powered demo feature. For the best experience, visit our showroom to try rings in person!</p>
              </div>
            </div>
          )}
          
          {/* Results Section - Enhanced */}
          <div ref={resultRef} className="w-full">
            {showResult && selectedRing && personImage && (
              <div className="pt-8 border-t border-neutral-200">
                <div className="text-center mb-6">
                  <h4 className="text-xl font-serif text-neutral-900 mb-2">Your Virtual Try-On</h4>
                  <p className="text-neutral-600 text-sm">AI-generated realistic preview</p>
                </div>
                <CinematicResultCard
                  isLoading={isGenerating}
                  resultData={resultData}
                  error={error}
                  sourceImages={{ ring: selectedRing.imageFile, person: personImage }}
                />
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          {appState === 'done' && (
            <div className="flex justify-center space-x-4 pt-6">
              <button
                onClick={handleReset}
                className="px-8 py-3 border border-neutral-300 text-neutral-700 rounded-lg font-medium text-sm hover:border-neutral-900 hover:text-neutral-900 transition-all duration-200"
              >
                Try Another Ring
              </button>
              <button
                onClick={handleClose}
                className="px-8 py-3 bg-neutral-900 text-white rounded-lg font-medium text-sm hover:bg-neutral-800 transition-all duration-200"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}