'use client';

import { useEffect, useState, useRef } from 'react';

const LoadedOnViewContent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={ref}>
      {isVisible && (
        <div>
          <p>This content loads only when you see it. Don&apos;t blink! 👼</p>
        </div>
      )}
    </div>
  );
};

export default LoadedOnViewContent;
