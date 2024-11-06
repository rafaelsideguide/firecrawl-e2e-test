'use client';

import React, { useState, useEffect } from 'react';

const OnlyShowedOnMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    handleResize(); // Set initial state based on current window width
    window.addEventListener('resize', handleResize); // Update state on window resize

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      {isMobile && (
        <div>
          <p>This content is only visible on mobile</p>
        </div>
      )}
    </>
  );
};

export default OnlyShowedOnMobile;
