'use client';

import React, { useState } from 'react';

const ClickContent = () => {
  const [text, setText] = useState('Click me!');

  const handleClick = () => {
    setText('Text changed after click!');
  };

  return (
    <div id="click-me" onClick={handleClick} style={{ cursor: 'pointer', border: '1px solid #333', padding: '10px' }}>
      <p>{text}</p>
    </div>
  );
};

export default ClickContent;
