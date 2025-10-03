import type { ProductFilters } from '../types/product';

interface FilterSidebarProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  totalCount: number;
}

export function FilterSidebar({ filters, onFiltersChange, totalCount }: FilterSidebarProps) {
  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = value === '' ? undefined : parseFloat(value);
    onFiltersChange({
      ...filters,
      [type === 'min' ? 'minPrice' : 'maxPrice']: numValue,
    });
  };

  const handleRatingChange = (rating: number) => {
    onFiltersChange({
      ...filters,
      minRating: filters.minRating === rating ? undefined : rating,
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.minRating !== undefined;

  return (
    <aside className="w-full bg-white border border-neutral-200 rounded-lg p-6 h-fit">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium tracking-wide">FILTERS</h2>
      </div>

      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="w-full mb-6 py-2 text-sm text-neutral-600 hover:text-neutral-900 border border-neutral-300 hover:border-neutral-900 transition-colors rounded"
        >
          Clear All Filters
        </button>
      )}

      <div className="mb-6">
        <p className="text-sm text-neutral-600 mb-4">
          {totalCount} {totalCount === 1 ? 'product' : 'products'} found
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-4 tracking-wide">PRICE RANGE</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-neutral-600 mb-1 block">Min Price ($)</label>
              <input
                type="number"
                value={filters.minPrice ?? ''}
                onChange={(e) => handlePriceChange('min', e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 border border-neutral-300 focus:border-neutral-900 focus:outline-none text-sm rounded"
                min="0"
              />
            </div>
            <div>
              <label className="text-xs text-neutral-600 mb-1 block">Max Price ($)</label>
              <input
                type="number"
                value={filters.maxPrice ?? ''}
                onChange={(e) => handlePriceChange('max', e.target.value)}
                placeholder="10000"
                className="w-full px-3 py-2 border border-neutral-300 focus:border-neutral-900 focus:outline-none text-sm rounded"
                min="0"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-4 tracking-wide">MINIMUM RATING</h3>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                onClick={() => handleRatingChange(rating)}
                className={`w-full py-2 px-3 text-left text-sm border transition-colors rounded ${
                  filters.minRating === rating
                    ? 'border-neutral-900 bg-neutral-900 text-white'
                    : 'border-neutral-300 hover:border-neutral-900'
                }`}
              >
                {rating}+ Stars
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
