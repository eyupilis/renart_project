import type { ProductsResponse, ProductFilters, Product } from '../types/product';

// Gold price caching
let goldPriceCache: { price: number; timestamp: number } | null = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

async function getGoldPrice(): Promise<number> {
  const now = Date.now();
  
  // Check cache first
  if (goldPriceCache && (now - goldPriceCache.timestamp) < CACHE_DURATION) {
    console.log('🥇 Using cached gold price:', goldPriceCache.price.toFixed(2), '$/gram');
    return goldPriceCache.price;
  }

  try {
    console.log('🌐 Fetching real-time gold price...');
    
    // Using free API from fcsapi.com for gold prices
    const response = await fetch('https://fcsapi.com/api-v3/forex/latest?symbol=XAUUSD&access_key=demo'); // demo key for testing
    
    if (!response.ok) {
      throw new Error(`Gold API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // API returns gold price in USD per ounce
    const pricePerOunce = data?.response?.[0]?.price || data?.response?.[0]?.c || 2650; // fallback to ~$2650/oz
    const pricePerGram = parseFloat(pricePerOunce) / 31.1035; // Convert ounce to gram
    
    // Cache the result
    goldPriceCache = { price: pricePerGram, timestamp: now };
    console.log('✅ Real-time gold price:', pricePerGram.toFixed(2), '$/gram', '(from', pricePerOunce, '$/oz)');
    
    return pricePerGram;
  } catch (error) {
    console.error('❌ Gold price API error:', error);
    console.log('🔄 Using fallback gold price: 85.2 $/gram');
    // Fallback to a reasonable price if API fails
    return 85.2; // ~$2650/oz converted to per gram
  }
}

// Local data from server/data/products.json
const localProducts = [
  {
    name: "Engagement Ring 1",
    popularityScore: 0.85,
    weight: 2.1,
    images: {
      yellow: "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG085-100P-Y.jpg?v=1696588368",
      rose: "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG085-100P-R.jpg?v=1696588406",
      white: "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG085-100P-W.jpg?v=1696588402"
    }
  },
  {
    name: "Engagement Ring 2",
    popularityScore: 0.51,
    weight: 3.4,
    images: {
      yellow: "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG012-Y.jpg?v=1707727068",
      rose: "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG012-R.jpg?v=1707727068",
      white: "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG012-W.jpg?v=1707727068"
    }
  },
  {
    name: "Engagement Ring 3",
    popularityScore: 0.92,
    weight: 3.8,
    images: {
      yellow: "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG020-100P-Y.jpg?v=1683534032",
      rose: "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG020-100P-R.jpg?v=1683534032",
      white: "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG020-100P-W.jpg?v=1683534032"
    }
  },
  {
    name: "Engagement Ring 4",
    popularityScore: 0.88,
    weight: 4.5,
    images: {
      yellow: "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG022-100P-Y.jpg?v=1683532153",
      rose: "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG022-100P-R.jpg?v=1683532153",
      white: "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG022-100P-W.jpg?v=1683532153"
    }
  },
  {
    name: "Engagement Ring 5",
    popularityScore: 0.80,
    weight: 2.5,
    images: {
      yellow: "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG074-100P-Y.jpg?v=1696232035",
      rose: "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG074-100P-R.jpg?v=1696927124",
      white: "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG074-100P-W.jpg?v=1696927124"
    }
  },
  {
    name: "Engagement Ring 6",
    popularityScore: 0.82,
    weight: 1.8,
    images: {
      yellow: "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG075-100P-Y.jpg?v=1696591786",
      rose: "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG075-100P-R.jpg?v=1696591802",
      white: "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG075-100P-W.jpg?v=1696591798"
    }
  },
  {
    name: "Engagement Ring 7",
    popularityScore: 0.70,
    weight: 5.2,
    images: {
      yellow: "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG094-100P-Y.jpg?v=1696589183",
      rose: "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG094-100P-R.jpg?v=1696589214",
      white: "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG094-100P-W.jpg?v=1696589210"
    }
  },
  {
    name: "Engagement Ring 8",
    popularityScore: 0.90,
    weight: 3.7,
    images: {
      yellow: "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG115-100P-Y.jpg?v=1696596076",
      rose: "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG115-100P-R.jpg?v=1696596151",
      white: "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG115-100P-W.jpg?v=1696596147"
    }
  }
];

function calculatePrice(popularityScore: number, weight: number, goldPrice: number): number {
  return (popularityScore + 1) * weight * goldPrice;
}

function convertToRating(popularityScore: number): number {
  return Math.round((popularityScore * 5) * 10) / 10;
}

export async function fetchProducts(filters?: ProductFilters): Promise<ProductsResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const goldPrice = await getGoldPrice(); // Real-time gold price per gram
  
  let products: Product[] = localProducts.map((product, index) => ({
    id: `product-${index + 1}`,
    name: product.name,
    price: calculatePrice(product.popularityScore, product.weight, goldPrice),
    rating: convertToRating(product.popularityScore),
    popularity_score: product.popularityScore,
    weight: product.weight,
    image_yellow: product.images.yellow,
    image_rose: product.images.rose,
    image_white: product.images.white,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));

  // Apply filters
  if (filters?.minPrice !== undefined) {
    products = products.filter(p => p.price >= filters.minPrice!);
  }
  if (filters?.maxPrice !== undefined) {
    products = products.filter(p => p.price <= filters.maxPrice!);
  }
  if (filters?.minRating !== undefined) {
    products = products.filter(p => p.rating >= filters.minRating!);
  }

  // Sort by popularity score (descending)
  products.sort((a, b) => b.popularity_score - a.popularity_score);

  return {
    products,
    goldPrice,
    totalCount: products.length,
  };
}
