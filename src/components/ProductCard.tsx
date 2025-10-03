import { useState } from 'react';
import { Star } from 'lucide-react';
import type { Product, ColorOption } from '../types/product';

interface ProductCardProps {
  product: Product;
  onTryVirtual?: (product: Product) => void;
}

export function ProductCard({ product, onTryVirtual }: ProductCardProps) {
  const [selectedColor, setSelectedColor] = useState<ColorOption>('yellow');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const currentImage = product[`image_${selectedColor}`];

  // Get metal type from selected color for display
  const getMetalType = (color: ColorOption) => {
    switch (color) {
      case 'yellow':
        return '18k Yellow Gold';
      case 'rose':
        return '18k Rose Gold';
      case 'white':
        return 'Platinum';
      default:
        return 'Platinum';
    }
  };

  // Color options for the rings
  const colorOptions: { color: ColorOption; label: string }[] = [
    { color: 'white', label: 'Platinum' },
    { color: 'yellow', label: 'Yellow Gold' },
    { color: 'rose', label: 'Rose Gold' }
  ];

  return (
    <div
      className="group bg-white transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Large Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 mb-6">
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gray-200"></div>
        )}
        <img
          src={currentImage}
          alt={product.name}
          className={`w-full h-full object-cover transition-all duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          } ${isHovered ? 'scale-105' : 'scale-100'}`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Color Picker - Smaller and more modern */}
        <div className={`absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1.5 transition-all duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-80'
        }`}>
          {colorOptions.map(({ color, label }) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`w-5 h-5 rounded-full border transition-all duration-200 ${
                selectedColor === color
                  ? 'border-white border-2 ring-2 ring-white/40'
                  : 'border-white/50 border hover:border-white hover:scale-105'
              } ${
                color === 'yellow' ? 'bg-yellow-400' :
                color === 'rose' ? 'bg-rose-300' :
                'bg-gray-200'
              }`}
              title={label}
            />
          ))}
        </div>

        {/* Price overlay on hover */}
        {isHovered && (
          <div className="absolute top-4 right-4 bg-black/80 text-white px-3 py-1 rounded-full text-sm font-medium">
            ${product.price.toLocaleString()}
          </div>
        )}

        {/* Rating overlay on hover */}
        {isHovered && (
          <div className="absolute top-4 left-4 bg-white/90 text-black px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
            <Star size={12} className="fill-amber-500 text-amber-500" />
            <span>{product.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="text-center space-y-3">
        <h3 className="text-lg font-medium text-black tracking-wide">
          The Renart® Setting
        </h3>
        <p className="text-sm text-gray-600">
          {product.name} in {getMetalType(selectedColor)}
        </p>
        
        {/* Price and Rating - Always visible */}
        <div className="flex justify-center items-center space-x-4 text-sm">
          <span className="font-semibold text-black">${product.price.toLocaleString()}</span>
          <div className="flex items-center space-x-1 text-gray-600">
            <Star size={14} className="fill-amber-500 text-amber-500" />
            <span>{product.rating.toFixed(1)}</span>
          </div>
        </div>

        <button
          onClick={() => onTryVirtual?.(product)}
          className="text-sm text-black hover:text-gray-600 transition-colors underline font-medium"
        >
          Try Yourself
        </button>
      </div>
    </div>
  );
}
