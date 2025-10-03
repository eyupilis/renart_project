
import React, { useState, useEffect } from 'react';
import type { Ring, RingColor } from '../types';
import { CheckIcon } from './icons';

interface RingSelectorProps {
    onRingSelect: (ring: Ring, color: RingColor) => void;
    selectedRingProduct: Ring | undefined;
}

const RingCard: React.FC<{ ring: Ring; onRingSelect: (ring: Ring, color: RingColor) => void; isSelected: boolean; }> = ({ ring, onRingSelect, isSelected }) => {
    const [selectedColor, setSelectedColor] = useState<RingColor>('yellow');
    
    const handleColorSelect = (color: RingColor) => {
        setSelectedColor(color);
        onRingSelect(ring, color);
    }
    
    return (
        <div className={`bg-white/80 rounded-2xl shadow-md p-4 transition-all duration-300 ${isSelected ? 'ring-2 ring-[#8C4E3A] scale-105 shadow-xl' : 'hover:shadow-lg hover:-translate-y-1'}`}>
            <img 
                src={ring.images[selectedColor]} 
                alt={ring.name} 
                className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="font-bold text-lg text-[#7D4222]">{ring.name}</h3>
            <div className="text-sm text-gray-500 mt-1">
                <span>Popularity: {ring.popularityScore * 100}%</span> | <span>Weight: {ring.weight}g</span>
            </div>
            <div className="flex items-center gap-2 mt-4">
                {(Object.keys(ring.images) as RingColor[]).map(color => (
                    <button
                        key={color}
                        onClick={() => handleColorSelect(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === color ? 'border-[#7D4222]' : 'border-transparent'}`}
                        aria-label={`Select ${color} color`}
                    >
                        <span className={`block w-full h-full rounded-full border-2 border-white/80
                           ${color === 'yellow' && 'bg-yellow-400'}
                           ${color === 'rose' && 'bg-rose-400'}
                           ${color === 'white' && 'bg-gray-300'}
                        `}>
                            {selectedColor === color && isSelected && <CheckIcon />}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    )
}

export const RingSelector: React.FC<RingSelectorProps> = ({ onRingSelect, selectedRingProduct }) => {
    const [rings, setRings] = useState<Ring[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRings = async () => {
            try {
                const response = await fetch('/rings.json');
                if (!response.ok) {
                    throw new Error('Failed to load ring data.');
                }
                const data: Ring[] = await response.json();
                setRings(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            } finally {
                setLoading(false);
            }
        };

        fetchRings();
    }, []);

    if (loading) {
        return <div className="text-center p-8 text-[#8C4E3A]">Loading Rings...</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-600">Error: {error}</div>;
    }
    
    return (
        <div className="w-full animate-fade-in-up">
            <p className="text-lg font-semibold text-[#8C4E3A] mb-3 text-center">1. Select a Ring</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {rings.map(ring => (
                    <RingCard 
                        key={ring.name} 
                        ring={ring} 
                        onRingSelect={onRingSelect}
                        isSelected={selectedRingProduct?.name === ring.name}
                    />
                ))}
            </div>
        </div>
    )
}
