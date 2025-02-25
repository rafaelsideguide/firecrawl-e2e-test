"use client";
import { useState, useEffect } from 'react';
import NumberedPagination from '../components/NumberedPagination';

// Pseudo-random number generator with seed
const createRandom = (seed: number) => {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
};

// Sample data generation with "randomization" (not predictable)
const generateItems = (count: number) => {
  // Using a static seed but with a large prime number
  const STATIC_SEED = 7919;
  const random = createRandom(STATIC_SEED);
  
  const adjectives = ['Amazing', 'Brilliant', 'Curious', 'Dynamic', 'Elegant', 'Fantastic', 'Graceful', 'Harmonious', 'Innovative', 'Joyful', 'Kinetic', 'Luminous', 'Magical', 'Noble', 'Optimal', 'Pristine', 'Quantum', 'Radiant', 'Sublime', 'Tranquil'];
  const nouns = ['Project', 'System', 'Solution', 'Framework', 'Design', 'Module', 'Interface', 'Component', 'Platform', 'Service', 'Algorithm', 'Architecture', 'Pattern', 'Protocol', 'Engine', 'Portal', 'Network', 'Database', 'Pipeline', 'Toolkit'];
  
  // Generate all items first
  const items = Array.from({ length: count }, (_, i) => {
    // Use multiple random calls to increase complexity
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

  // Complex sorting based on multiple factors
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
    totalPages: Math.ceil(TOTAL_ITEMS / itemsPerPage)
  };
};

const ITEMS_PER_PAGE = 9;
const TOTAL_ITEMS = 50;

const getRandomDescriptionPerPage = () => {
  const allItems = generateItems(TOTAL_ITEMS);
  const pages = Math.ceil(TOTAL_ITEMS / ITEMS_PER_PAGE);
  const scrapedPages = [];

  for (let page = 0; page < pages; page++) {
    const pageStart = page * ITEMS_PER_PAGE;
    const pageEnd = pageStart + ITEMS_PER_PAGE;
    const pageItems = allItems.slice(pageStart, pageEnd);
    
    // Get random item from this page's items
    const randomItem = pageItems[Math.floor(Math.random() * pageItems.length)];
    
    scrapedPages.push({
      html: randomItem.description
    });
  }

  return { scrapedPages };
};

export default function NumberedPaginationPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState<Array<ReturnType<typeof generateItems>[0]>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data for current page
  useEffect(() => {
    const loadPage = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchPaginatedItems(currentPage, ITEMS_PER_PAGE);
        setItems(data.items);
      } catch (err) {
        setError('Failed to load items');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadPage();
  }, [currentPage]); // Re-fetch when page changes

  useEffect(() => {
    const scraped = getRandomDescriptionPerPage();
    console.log(JSON.stringify(scraped, null, 2));
  }, []);

  return (
    <main className="flex flex-col gap-8 row-start-2 items-center w-full max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold">Numbered Pagination (DOM-based)</h1>
      
      {error && (
        <div className="w-full p-4 text-red-500 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full min-h-[400px]">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
            <div 
              key={i}
              className="p-4 border border-gray-200 rounded-lg animate-pulse"
            >
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))
        ) : (
          // Actual items
          items.map(item => (
            <div 
              key={item.id}
              className="p-4 border border-gray-200 rounded-lg hover:border-orange-500 transition-colors"
            >
              <h2 className="text-xl font-bold">{item.title}</h2>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))
        )}
      </div>

      <NumberedPagination
        totalItems={TOTAL_ITEMS}
        itemsPerPage={ITEMS_PER_PAGE}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </main>
  );
} 