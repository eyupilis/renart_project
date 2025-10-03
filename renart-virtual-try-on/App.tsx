
import React, { useState, useRef, useEffect } from 'react';
import type { ImageFile, EditImageResult, Ring, RingColor } from './types';
import { ImageUploader } from './components/ImageUploader';
import { ResultCard } from './components/ChatBubble';
import { RingSelector } from './components/RingSelector';
import { RenartLogo, ArrowRightIcon } from './components/icons';
import { editImage } from './services/geminiService';

type AppState = 'idle' | 'generating' | 'done';

interface SelectedRing {
  product: Ring;
  color: RingColor;
  imageFile: ImageFile;
}

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

const App: React.FC = () => {
  const [selectedRing, setSelectedRing] = useState<SelectedRing | null>(null);
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

  const handleRingSelect = async (ring: Ring, color: RingColor) => {
    setIsRingLoading(true);
    setPersonImage(null);
    setResultData(null);
    setError(null);
    setAppState('idle');

    try {
      const url = ring.images[color];
      const imageFile = await urlToImageFile(url);
      setSelectedRing({ product: ring, color, imageFile });
      setTimeout(() => {
        handUploaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    } catch (e) {
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
      setResultData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isGenerating = appState === 'generating';
  const showResult = appState === 'generating' || appState === 'done';

  return (
    <div className="bg-[#F7F2ED] text-[#2C2A29] min-h-screen font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <RenartLogo />
            <h1 className="text-xl font-bold text-[#7D4222]">Virtual Try-On</h1>
          </div>
        </header>

        <main className="py-12 flex flex-col items-center gap-12">
          <div className="text-center max-w-2xl mx-auto animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-[#7D4222]">Create Your Virtual Try-On</h2>
            <p className="mt-4 text-lg text-[#8C4E3A]">
              Select a ring from our collection, then upload a photo of your hand to see a realistic preview.
            </p>
          </div>

          <div className="w-full max-w-5xl flex flex-col items-center gap-12">
            <RingSelector onRingSelect={handleRingSelect} selectedRingProduct={selectedRing?.product} />

            {(selectedRing || isRingLoading) && (
              <div ref={handUploaderRef} className="w-full max-w-md animate-fade-in-up">
                {isRingLoading ? (
                  <div className="aspect-square w-full rounded-2xl bg-white/50 flex items-center justify-center">
                    <p className="text-[#8C4E3A]">Loading Ring...</p>
                  </div>
                ) : (
                  <ImageUploader id="person-image" label="2. Upload Hand" onImageUpload={setPersonImage} onRemove={() => setPersonImage(null)} imageFile={personImage} />
                )}
              </div>
            )}
          </div>

          {selectedRing && personImage && appState === 'idle' && (
            <div className="animate-fade-in-up">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="bg-black text-white font-bold py-4 px-8 rounded-full flex items-center justify-center gap-3 text-lg hover:scale-105 hover:shadow-lg transition-all duration-300"
              >
                <span>Generate Image</span>
                <ArrowRightIcon />
              </button>
            </div>
          )}
          
          <div ref={resultRef} className="w-full max-w-4xl">
            {showResult && selectedRing && personImage && (
              <ResultCard
                isLoading={isGenerating}
                resultData={resultData}
                error={error}
                sourceImages={{ ring: selectedRing.imageFile, person: personImage }}
              />
            )}
          </div>
          
          {appState === 'done' && (
             <div className="mt-8 animate-fade-in-up">
              <button
                onClick={handleReset}
                className="bg-[#8C4E3A] text-white font-bold py-3 px-8 rounded-full text-md hover:scale-105 hover:shadow-md transition-all duration-300"
              >
                Start Over
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
