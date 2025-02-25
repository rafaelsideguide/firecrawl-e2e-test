'use client';

import { useEffect, useState, useRef } from 'react';

const ScrollBottomLoader = () => {
  const [isBottom, setIsBottom] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    if ((scrollTop + clientHeight) >= (scrollHeight - 100)) {
      setIsBottom(true);
    }
  };

  useEffect(() => {
    const currentElement = scrollRef.current;
    
    if (currentElement) {
      currentElement.addEventListener('scroll', handleScroll);

      return () => {
        currentElement.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  return (
    <div ref={scrollRef}
      id="scroll-bottom-loader"
      style={{
        overflowY: 'auto',
        height: '300px',
        border: '1px solid #ccc',
        backgroundColor: isBottom ? '#333' : '#000'
      }}
    >
      <div style={{ height: '1200px' }}>
        <p>Scroll down to load content at the bottom.</p>
        {isBottom && (
          <p style={{ position: 'absolute', bottom: '0', textAlign: 'center' }}>You have reached the bottom!</p>
        )}
      </div>
    </div>
  );
};

export default ScrollBottomLoader;
