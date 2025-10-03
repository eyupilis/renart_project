import React, { useState, useEffect } from 'react';
import type { ImageFile, EditImageResult } from '../../types/virtual-try-on';

interface CinematicResultCardProps {
  isLoading: boolean;
  resultData: EditImageResult | null;
  error: string | null;
  sourceImages: {
    ring: ImageFile;
    person: ImageFile;
  }
}

interface LoadingStage {
  id: string;
  title: string;
  description: string;
  duration: number;
  icon: string;
}

const loadingStages: LoadingStage[] = [
  {
    id: 'analyze',
    title: 'Analyzing Images',
    description: 'Understanding your hand structure and ring dimensions',
    duration: 2000,
    icon: '🔍'
  },
  {
    id: 'context',
    title: 'Understanding Context',
    description: 'Processing lighting, shadows, and skin tone',
    duration: 2500,
    icon: '🧠'
  },
  {
    id: 'compose',
    title: 'Creating Composition',
    description: 'Positioning the ring perfectly on your finger',
    duration: 3000,
    icon: '✨'
  },
  {
    id: 'finalize',
    title: 'Finalizing Details',
    description: 'Adding realistic reflections and shadows',
    duration: 2000,
    icon: '💎'
  }
];

const ParticleEffect: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  if (!isActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full animate-ping"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${1 + Math.random()}s`
          }}
        />
      ))}
    </div>
  );
};

const SophisticatedLoader: React.FC<{ currentStage: number; stages: LoadingStage[] }> = ({ 
  currentStage, 
  stages 
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const targetProgress = ((currentStage + 1) / stages.length) * 100;
        return prev < targetProgress ? prev + 2 : prev;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [currentStage, stages.length]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Main Loading Visual */}
      <div className="relative mb-8">
        <div className="w-64 h-64 mx-auto relative">
          {/* Outer spinning ring */}
          <div className="absolute inset-0 border-4 border-renart-brown/20 rounded-full"></div>
          <div 
            className="absolute inset-0 border-4 border-transparent border-t-renart-brown rounded-full animate-spin"
            style={{ animationDuration: '2s' }}
          ></div>
          
          {/* Inner pulsing core */}
          <div className="absolute inset-8 bg-gradient-to-br from-renart-brown/10 to-renart-brown/5 rounded-full flex items-center justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-renart-brown to-renart-brown-2 rounded-full flex items-center justify-center animate-pulse shadow-2xl">
              <span className="text-4xl animate-bounce">{stages[currentStage]?.icon}</span>
            </div>
          </div>

          {/* Particle effect */}
          <ParticleEffect isActive={true} />
        </div>

        {/* Progress bar */}
        <div className="w-full bg-neutral-200 rounded-full h-2 mb-6 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-renart-brown via-renart-brown-2 to-renart-brown-sugar transition-all duration-500 ease-out relative overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_1s_infinite]"></div>
          </div>
        </div>
      </div>

      {/* Stage Information */}
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-serif text-neutral-900">
          {stages[currentStage]?.title}
        </h3>
        <p className="text-neutral-600 text-lg">
          {stages[currentStage]?.description}
        </p>
        <div className="text-sm text-renart-brown font-medium">
          Step {currentStage + 1} of {stages.length}
        </div>
      </div>

      {/* Stage indicators */}
      <div className="flex justify-center space-x-4 mt-8">
        {stages.map((stage, index) => (
          <div
            key={stage.id}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index <= currentStage 
                ? 'bg-renart-brown scale-110 shadow-lg' 
                : 'bg-neutral-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const FIFAStyleReveal: React.FC<{ 
  resultData: EditImageResult;
  onRevealComplete: () => void;
}> = ({ resultData, onRevealComplete }) => {
  const [revealStage, setRevealStage] = useState<'spinning' | 'flipping' | 'revealed'>('spinning');

  useEffect(() => {
    const timer1 = setTimeout(() => setRevealStage('flipping'), 2000);
    const timer2 = setTimeout(() => {
      setRevealStage('revealed');
      onRevealComplete();
    }, 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onRevealComplete]);

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="relative">
        {/* Particle effects */}
        <ParticleEffect isActive={true} />
        
        {/* Spinning card container */}
        <div className="relative perspective-1000">
          <div
            className={`relative w-96 h-96 transition-all duration-2000 transform-gpu ${
              revealStage === 'spinning' 
                ? 'rotate-y-180 scale-75' 
                : revealStage === 'flipping'
                ? 'rotate-y-0 scale-90 rotate-12'
                : 'rotate-y-0 scale-100 rotate-0'
            }`}
            style={{
              transformStyle: 'preserve-3d',
              animation: revealStage === 'spinning' ? 'spin 2s linear infinite' : undefined
            }}
          >
            {/* Card back (shown during spinning) */}
            <div 
              className={`absolute inset-0 backface-hidden ${
                revealStage === 'spinning' ? 'block' : 'hidden'
              }`}
              style={{ transform: 'rotateY(180deg)' }}
            >
              <div className="w-full h-full bg-gradient-to-br from-renart-brown via-renart-brown-2 to-renart-brown-sugar rounded-2xl flex items-center justify-center shadow-2xl">
                <div className="text-center text-white">
                  <div className="text-6xl mb-4">💎</div>
                  <div className="text-2xl font-serif">Renart</div>
                  <div className="text-sm opacity-80">Virtual Try-On</div>
                </div>
              </div>
            </div>

            {/* Card front (revealed result) */}
            <div 
              className={`absolute inset-0 backface-hidden ${
                revealStage !== 'spinning' ? 'block' : 'hidden'
              }`}
            >
              <div className="w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-4 bg-gradient-to-r from-renart-brown to-renart-brown-2 text-white text-center">
                  <h3 className="font-serif text-lg">Your Virtual Try-On</h3>
                </div>
                <div className="p-4">
                  <img
                    src={`data:${resultData.mimeType};base64,${resultData.imageBase64}`}
                    alt="Generated virtual try-on"
                    className="w-full h-auto object-contain rounded-lg max-h-80"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dramatic lighting effect */}
        <div 
          className={`absolute -inset-32 transition-opacity duration-1000 ${
            revealStage === 'revealed' ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-radial from-renart-brown/20 via-transparent to-transparent animate-pulse"></div>
        </div>

        {/* Continue button */}
        {revealStage === 'revealed' && (
          <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 animate-fade-in-up">
            <button
              onClick={onRevealComplete}
              className="px-8 py-3 bg-renart-brown hover:bg-renart-brown-2 text-white rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const CinematicResultCard: React.FC<CinematicResultCardProps> = ({ 
  isLoading, 
  resultData, 
  error, 
  sourceImages 
}) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [showReveal, setShowReveal] = useState(false);
  const [revealComplete, setRevealComplete] = useState(false);

  useEffect(() => {
    if (isLoading && !error) {
      let stageTimer: NodeJS.Timeout;
      const advanceStage = (stage: number) => {
        if (stage < loadingStages.length - 1) {
          stageTimer = setTimeout(() => {
            setCurrentStage(stage + 1);
            advanceStage(stage + 1);
          }, loadingStages[stage].duration);
        }
      };
      
      setCurrentStage(0);
      advanceStage(0);

      return () => {
        if (stageTimer) clearTimeout(stageTimer);
      };
    }
  }, [isLoading, error]);

  useEffect(() => {
    if (resultData && !isLoading && !error) {
      setShowReveal(true);
    }
  }, [resultData, isLoading, error]);

  const handleRevealComplete = () => {
    setShowReveal(false);
    setRevealComplete(true);
  };

  if (showReveal && resultData) {
    return <FIFAStyleReveal resultData={resultData} onRevealComplete={handleRevealComplete} />;
  }

  return (
    <div className="w-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 animate-fade-in-up border border-neutral-200">
      {/* Source images preview - only shown when not loading */}
      {!isLoading && (
        <div className="flex justify-center items-center gap-8 mb-8">
          <div className="text-center">
            <img 
              src={sourceImages.ring.previewUrl} 
              alt="Ring" 
              className="w-20 h-20 rounded-full object-cover border-4 border-renart-brown shadow-lg mx-auto" 
            />
            <p className="text-sm mt-2 font-medium text-renart-brown">Ring</p>
          </div>
          <div className="text-renart-brown text-2xl">+</div>
          <div className="text-center">
            <img 
              src={sourceImages.person.previewUrl} 
              alt="Hand" 
              className="w-20 h-20 rounded-full object-cover border-4 border-renart-brown shadow-lg mx-auto" 
            />
            <p className="text-sm mt-2 font-medium text-renart-brown">Hand</p>
          </div>
        </div>
      )}

      <div className="w-full">
        {isLoading && (
          <div className="py-16">
            <SophisticatedLoader currentStage={currentStage} stages={loadingStages} />
          </div>
        )}
        
        {error && !isLoading && (
          <div className="w-full aspect-square bg-red-50 border-2 border-red-200 rounded-2xl flex flex-col items-center justify-center text-center p-8">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-2xl font-bold text-red-600 mb-2">Generation Failed</h3>
            <p className="text-red-500">{error}</p>
          </div>
        )}
        
        {resultData && !isLoading && revealComplete && (
          <div className="w-full animate-fade-in-up">
            <img
              src={`data:${resultData.mimeType};base64,${resultData.imageBase64}`}
              alt="Generated virtual try-on"
              className="w-full h-auto rounded-2xl object-contain shadow-xl border-4 border-renart-brown/20"
            />
            {resultData.text && (
              <p className="text-center mt-6 text-renart-brown italic text-lg font-medium">
                {resultData.text}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};