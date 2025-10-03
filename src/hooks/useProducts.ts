import { useState, useEffect } from 'react';
import type { Product, ProductFilters } from '../types/product';
import { fetchProducts } from '../services/api';

export function useProducts(filters?: ProductFilters) {
  const [products, setProducts] = useState<Product[]>([]);
  const [goldPrice, setGoldPrice] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProducts(filters);

        if (mounted) {
          setProducts(data.products);
          setGoldPrice(data.goldPrice);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      mounted = false;
    };
  }, [filters?.minPrice, filters?.maxPrice, filters?.minRating]);

  return { products, goldPrice, loading, error };
}
