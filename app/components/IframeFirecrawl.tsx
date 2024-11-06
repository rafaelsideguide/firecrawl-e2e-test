'use client';

import React from 'react';

const IframeFirecrawl = () => {
  return (
    <iframe
      src="https://firecrawl.dev"
      title="Firecrawl Data"
      style={{
        width: '100%',
        height: '500px',
        border: '1px solid #ccc'
      }}
    />
  );
};

export default IframeFirecrawl;
