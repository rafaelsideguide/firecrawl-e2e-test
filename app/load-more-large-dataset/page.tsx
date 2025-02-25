"use client";
import { useState, useEffect } from 'react';

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
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
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

export default function LoadMoreLargeDatasetPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState<Array<ReturnType<typeof generateItems>[0]>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // Load initial page
  useEffect(() => {
    const loadInitialPage = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchPaginatedItems(1, ITEMS_PER_PAGE);
        setItems(data.items);
        setHasMore(data.hasMore);
      } catch (err) {
        setError('Failed to load items');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialPage();
  }, []);

  useEffect(() => {
    const scraped = getRandomDescriptionPerPage();
    console.log(JSON.stringify(scraped, null, 2));
  }, []);

  const loadMore = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const nextPage = currentPage + 1;
      const data = await fetchPaginatedItems(nextPage, ITEMS_PER_PAGE);
      setItems(prev => [...prev, ...data.items]);
      setCurrentPage(nextPage);
      setHasMore(data.hasMore);
    } catch (err) {
      setError('Failed to load more items');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col gap-8 row-start-2 items-center w-full max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold">Large Dataset Load More Pagination</h1>
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

      {(hasMore || isLoading) && (
        <button
          onClick={loadMore}
          disabled={isLoading}
          className={`px-6 py-2 rounded-md transition-colors ${
            isLoading
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-orange-500 text-white hover:bg-orange-600'
          }`}
        >
          {isLoading ? 'Loading...' : 'Load More'}
        </button>
      )}
    </main>
  );
} 