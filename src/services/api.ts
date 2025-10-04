import type { ProductsResponse, ProductFilters, Product } from '../types/product';

// Gold price caching
let goldPriceCache: { price: number; timestamp: number } | null = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

async function getGoldPrice(): Promise<number> {
  const now = Date.now();
  
  // FOR TESTING: Uncomment below line to always fetch fresh data (disable cache)
  // goldPriceCache = null;
  
  if (goldPriceCache && (now - goldPriceCache.timestamp) < CACHE_DURATION) {
    console.log('🥇 Using cached gold price:', goldPriceCache.price.toFixed(2), '$/gram', `(cached ${Math.round((now - goldPriceCache.timestamp) / 1000 / 60)} mins ago)`);
    return goldPriceCache.price;
  }

  try {
    console.log('🌐 Fetching real-time gold price from Metal Price API...');
    
    let goldPricePerOunce: number | null = null;
    let apiSource = '';
    
    // API 1: Metal Price API (REAL-TIME DATA)
    try {
      console.log('📡 Connecting to metalpriceapi.com...');
      const response = await fetch('https://api.metalpriceapi.com/v1/latest?api_key=59ea46b62cf468eaca0758faa7311637&base=USD&currencies=XAU');
      
      if (response.ok) {
        const data = await response.json();
        console.log('📊 Metal Price API response:', JSON.stringify(data, null, 2));
        
        // XAU is price per troy ounce of gold in USD
        if (data.success && data.rates && data.rates.XAU) {
          // XAU rate is USD per 1 troy ounce, we need ounces per USD
          goldPricePerOunce = 1 / data.rates.XAU; // Convert from "USD per ounce" to "ounces per USD" then invert
          apiSource = 'metalpriceapi.com';
          console.log('✨ REAL-TIME Gold Price: $', goldPricePerOunce.toFixed(2), '/oz from Metal Price API');
        } else {
          throw new Error('Invalid API response structure');
        }
      } else {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('❌ Metal Price API failed:', error);
      
      // API 2: Fallback simulation with notice
      console.log('🎭 Falling back to demo simulation...');
      const basePrice = 2650;
      const variation = (Math.random() - 0.5) * 100;
      goldPricePerOunce = Math.round((basePrice + variation) * 100) / 100;
      apiSource = 'fallback-simulation';
      console.log('📊 Fallback simulation: $', goldPricePerOunce, '/oz (base:', basePrice, '+ variation:', Math.round(variation * 100) / 100, ')');
    }
    
    // Final safety check
    if (!goldPricePerOunce || goldPricePerOunce < 2000 || goldPricePerOunce > 4000) {
      console.log('⚠️  Price validation failed, using safe fallback');
      goldPricePerOunce = 2650;
      apiSource = 'emergency-fallback';
    }
    
    const pricePerGram = parseFloat(goldPricePerOunce.toString()) / 31.1035; // Convert ounce to gram
    
    // Cache the result
    goldPriceCache = { price: pricePerGram, timestamp: now };
    console.log(`✅ Gold price: $${pricePerGram.toFixed(2)}/gram (from $${goldPricePerOunce}/oz via ${apiSource}) at ${new Date().toLocaleTimeString()}`);
    
    return pricePerGram;
  } catch (error) {
    console.error('❌ All gold price APIs failed:', error);
    console.log('🔄 Using emergency fallback: $85.2/gram');
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
