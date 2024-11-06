'use client';
import React, { useState, useEffect } from 'react';

const JSLoadedContent = () => {
  const [isContentLoaded, setIsContentLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsContentLoaded(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {isContentLoaded ? <p>Content loaded after 5 seconds!</p> : <p>Loading...</p>}
    </div>
  );
};

export default JSLoadedContent;
