export interface Product {
  id: string;
  name: string;
  popularity_score: number;
  weight: number;
  image_yellow: string;
  image_rose: string;
  image_white: string;
  created_at: string;
  updated_at: string;
  price: number;
  rating: number;
}

export interface ProductsResponse {
  products: Product[];
  goldPrice: number;
  totalCount: number;
}

export interface ProductFilters {
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
}

export type ColorOption = 'yellow' | 'rose' | 'white';
