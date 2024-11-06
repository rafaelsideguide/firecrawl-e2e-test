'use client';

import React, { useState } from 'react';

const Input = () => {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <input
      id="input-1"
      type="text"
      value={inputValue}
      onChange={handleChange}
      placeholder="Enter text here..."
      style={{ padding: '8px', margin: '10px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#000' }}
    />
  );
};

export default Input;
