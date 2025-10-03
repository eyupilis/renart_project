import { useState, useMemo } from 'react';
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
          <div className="max-w-7xl mx-auto mb-12">
            <div className="flex items-center py-6 border-b border-gray-200">
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
          </div>

          {error && (
            <div className="max-w-7xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 text-red-800 rounded">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Main Content Area with Sidebar */}
          <div className="max-w-7xl mx-auto">
            <div className="flex gap-8">
              {/* Filter Sidebar */}
              {showFilters && (
                <div className="w-80 flex-shrink-0">
                  <FilterSidebar
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    totalCount={filteredAndSortedProducts.length}
                  />
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
