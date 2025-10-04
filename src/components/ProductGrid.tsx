import type { Product } from '../types/product';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  onTryVirtual?: (product: Product) => void;
}

function SkeletonCard() {
  return (
    <div className="bg-white animate-pulse">
      <div className="aspect-square bg-gray-200 mb-6"></div>
      <div className="text-center space-y-3">
        <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
      </div>
    </div>
  );
}

export function ProductGrid({ products, loading, onTryVirtual }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 xl:gap-16">
        {[...Array(6)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="col-span-3 py-16 text-center">
        <p className="text-gray-600 text-lg">No products found matching your filters.</p>
        <p className="text-gray-500 text-sm mt-2">Try adjusting your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 xl:gap-16">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onTryVirtual={onTryVirtual} />
      ))}
    </div>
  );
}
