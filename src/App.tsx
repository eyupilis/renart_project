import { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { ProductGrid } from './components/ProductGrid';
import { ProductCarousel } from './components/ProductCarousel';
import { VirtualTryOnModal } from './components/VirtualTryOnModal';
import { FilterSidebar } from './components/FilterSidebar';
import { useProducts } from './hooks/useProducts';
import type { Product, ProductFilters } from './types/product';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest';

function App() {
  const { products, loading, error } = useProducts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filters, setFilters] = useState<ProductFilters>({});
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [showFilters, setShowFilters] = useState(false);

  const handleTryVirtual = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleFiltersChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
  };

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Apply filters
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(product => product.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(product => product.price <= filters.maxPrice!);
    }
    if (filters.minRating !== undefined) {
      filtered = filtered.filter(product => product.rating >= filters.minRating!);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'featured':
      default:
        filtered.sort((a, b) => b.popularity_score - a.popularity_score);
        break;
    }

    return filtered;
  }, [products, filters, sortBy]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-20">
        <HeroSection />
        
        {/* Featured Carousel Section */}
        <ProductCarousel
          products={filteredAndSortedProducts.slice(0, 8)}
          onProductSelect={handleTryVirtual}
          autoPlay={true}
          transitionSpeed={600}
          showParallax={true}
        />
        
        {/* Products Section with Top Bar - Exactly like in the provided image */}
        <section id="products" className="w-full px-6 lg:px-12 py-8">
          {/* Top Header Bar - Exactly like in the provided image */}
          <div className="max-w-7xl mx-auto mb-8 lg:mb-12">
            {/* Desktop Layout */}
            <div className="hidden lg:flex items-center py-6 border-b border-gray-200">
              {/* Left side - Sort By and Product Count */}
              <div className="flex items-center space-x-8 w-1/3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-black tracking-wide">SORT BY</span>
                  <select
                    className="text-sm border-none bg-transparent focus:outline-none cursor-pointer font-medium"
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value as SortOption)}
                  >
                    <option value="featured">Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>
                <span className="text-sm font-medium text-black tracking-wide">{filteredAndSortedProducts.length} PRODUCTS</span>
              </div>

              {/* Center - Title */}
              <div className="w-1/3 text-center">
                <h1 className="text-3xl font-serif text-black tracking-wide">Engagement Rings</h1>
              </div>

              {/* Right side - Filters */}
              <div className="flex items-center justify-end w-1/3">
                <button
                  className="flex items-center space-x-2 text-sm font-medium text-black hover:text-gray-600 transition-colors tracking-wide"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <span>FILTERS</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="lg:hidden space-y-4 py-4 border-b border-gray-200">
              {/* Title */}
              <div className="text-center">
                <h1 className="text-2xl sm:text-3xl font-serif text-black tracking-wide">Engagement Rings</h1>
              </div>
              
              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium text-black tracking-wide">SORT BY</span>
                    <select
                      className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-black"
                      value={sortBy}
                      onChange={(e) => handleSortChange(e.target.value as SortOption)}
                    >
                      <option value="featured">Featured</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="newest">Newest</option>
                    </select>
                  </div>
                  <span className="text-xs font-medium text-gray-600">{filteredAndSortedProducts.length} PRODUCTS</span>
                </div>

                <button
                  className="flex items-center space-x-2 text-xs font-medium text-black hover:text-gray-600 transition-colors tracking-wide border border-gray-300 px-3 py-2 rounded"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <span>FILTERS</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="max-w-7xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 text-red-800 rounded">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Main Content Area with Sidebar */}
          <div className="max-w-7xl mx-auto">
            <div className="lg:flex gap-8">
              {/* Desktop Filter Sidebar */}
              {showFilters && (
                <div className="hidden lg:block w-80 flex-shrink-0">
                  <FilterSidebar
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    totalCount={filteredAndSortedProducts.length}
                  />
                </div>
              )}

              {/* Mobile Filter Overlay */}
              {showFilters && (
                <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setShowFilters(false)}>
                  <div className="absolute right-0 top-0 h-full w-80 bg-white p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-medium">Filters</h2>
                      <button onClick={() => setShowFilters(false)} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                      </button>
                    </div>
                    <FilterSidebar
                      filters={filters}
                      onFiltersChange={handleFiltersChange}
                      totalCount={filteredAndSortedProducts.length}
                    />
                  </div>
                </div>
              )}

              {/* Product Grid */}
              <div className="flex-1">
                <ProductGrid
                  products={filteredAndSortedProducts}
                  loading={loading}
                  onTryVirtual={handleTryVirtual}
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      
      {/* Virtual Try-On Modal */}
      <VirtualTryOnModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        product={selectedProduct}
      />
    </div>
  );
}

export default App;
