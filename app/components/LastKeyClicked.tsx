'use client';

import React, { useState, useEffect } from 'react';

const LastKeyClicked = () => {
  const [lastKey, setLastKey] = useState('');

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      setLastKey(event.key);
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <div>
      <p>Last Key Clicked: {lastKey}</p>
    </div>
  );
};

export default LastKeyClicked;
