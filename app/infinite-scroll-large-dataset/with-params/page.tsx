"use client";
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// Reuse the same random generation logic
const createRandom = (seed: number) => {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
};

const generateItems = (count: number) => {
  const STATIC_SEED = 7919;
  const random = createRandom(STATIC_SEED);
  
  const adjectives = ['Amazing', 'Brilliant', 'Curious', 'Dynamic', 'Elegant', 'Fantastic', 'Graceful', 'Harmonious', 'Innovative', 'Joyful', 'Kinetic', 'Luminous', 'Magical', 'Noble', 'Optimal', 'Pristine', 'Quantum', 'Radiant', 'Sublime', 'Tranquil'];
  const nouns = ['Project', 'System', 'Solution', 'Framework', 'Design', 'Module', 'Interface', 'Component', 'Platform', 'Service', 'Algorithm', 'Architecture', 'Pattern', 'Protocol', 'Engine', 'Portal', 'Network', 'Database', 'Pipeline', 'Toolkit'];
  
  const items = Array.from({ length: count }, (_, i) => {
    const randomValue = Math.floor(random() * 100);
    const shuffleValue = Math.floor(random() * 1000);
    const complexityFactor = Math.floor(random() * randomValue * shuffleValue);
    
    const adjIndex = Math.floor((random() * complexityFactor) % adjectives.length);
    const nounIndex = Math.floor((random() * shuffleValue) % nouns.length);
    
    const adj = adjectives[adjIndex];
    const noun = nouns[nounIndex];
    const randomNum = Math.floor(random() * 1000);
    
    return {
      id: i + 1,
      title: `${adj} ${noun} ${randomNum}`,
      description: `A ${adj.toLowerCase()} description for this ${noun.toLowerCase()}, featuring unique identifier ${randomNum}`,
      sortValue: complexityFactor
    };
  });

  return items.sort((a, b) => {
    const diff = a.sortValue - b.sortValue;
    if (diff === 0) {
      return a.id - b.id;
    }
    return diff;
  });
};

// Simulate API call with pagination
const fetchPaginatedItems = async (page: number, itemsPerPage: number) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Generate all items (in real API, this would be database query)
  const allItems = generateItems(TOTAL_ITEMS);
  
  // Calculate pagination
  const startIndex = 0;  // Always fetch from start
  const endIndex = page * itemsPerPage;  // Fetch up to current page
  
  // Return paginated response
  return {
    items: allItems.slice(startIndex, endIndex),
    totalItems: TOTAL_ITEMS,
    currentPage: page,
    totalPages: Math.ceil(TOTAL_ITEMS / itemsPerPage),
    hasMore: endIndex < TOTAL_ITEMS
  };
};

const ITEMS_PER_PAGE = 12;
const TOTAL_ITEMS = 1200; // This will give us 100 pages

const getRandomDescriptionPerPage = () => {
  const allItems = generateItems(TOTAL_ITEMS);
  const pages = Math.ceil(TOTAL_ITEMS / ITEMS_PER_PAGE);
  const scrapedPages = [];

  for (let page = 0; page < pages; page++) {
    const pageStart = page * ITEMS_PER_PAGE;
    const pageEnd = pageStart + ITEMS_PER_PAGE;
    const pageItems = allItems.slice(pageStart, pageEnd);
    
    const randomItem = pageItems[Math.floor(Math.random() * pageItems.length)];
    
    scrapedPages.push({
      html: randomItem.description
    });
  }

  return { scrapedPages };
};

export default function InfiniteScrollLargeDatasetParamsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [items, setItems] = useState<Array<ReturnType<typeof generateItems>[0]>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  
  // Reference to the sentinel element for infinite scroll
  const observerTarget = useRef<HTMLDivElement>(null);
  
  // Get current page from URL params or default to 1
  const currentPage = Number(searchParams.get('page')) || 1;

  // Load more items when intersection observer triggers
  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;
    
    const params = new URLSearchParams(searchParams);
    params.set('page', (currentPage + 1).toString());
    router.push(`?${params.toString()}`);
  }, [currentPage, isLoading, hasMore, router, searchParams]);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loadMore]);

  // Load items up to current page
  useEffect(() => {
    const loadItems = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchPaginatedItems(currentPage, ITEMS_PER_PAGE);
        setItems(data.items);
        setHasMore(data.hasMore);
      } catch (err) {
        setError('Failed to load items');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadItems();
  }, [currentPage]);

  useEffect(() => {
    const scraped = getRandomDescriptionPerPage();
    console.log(JSON.stringify(scraped, null, 2));
  }, []);

  return (
    <main className="flex flex-col gap-8 row-start-2 items-center w-full max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold">Large Dataset Infinite Scroll Pagination (URL Params)</h1>
      <p className="text-gray-600">
        Showing {items.length} of {TOTAL_ITEMS} items
      </p>
      
      {error && (
        <div className="w-full p-4 text-red-500 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
        {items.map(item => (
          <div 
            key={item.id}
            className="p-4 border border-gray-200 rounded-lg hover:border-orange-500 transition-colors"
          >
            <h2 className="text-xl font-bold mb-2">{item.title}</h2>
            <p className="text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>

      {/* Sentinel element for infinite scroll */}
      <div 
        ref={observerTarget}
        className="w-full h-4"
      />

      {isLoading && (
        <div className="flex justify-center w-full py-4">
          <div className="text-gray-500">Loading more items...</div>
        </div>
      )}

      <div className="text-sm text-gray-500">
        Current URL parameter: page={currentPage}
      </div>
    </main>
  );
} 