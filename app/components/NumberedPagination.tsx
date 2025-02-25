"use client";
import { useState } from 'react';

interface Props {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function NumberedPagination({ 
  totalItems, 
  itemsPerPage, 
  currentPage, 
  onPageChange 
}: Props) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // First page
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => onPageChange(1)}
          className="px-3 py-1 rounded-md hover:bg-orange-100 hover:text-black"
        >
          1
        </button>
      );
      if (startPage > 2) pages.push(<span key="start-ellipsis">...</span>);
    }

    // Numbered pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-1 rounded-md ${
            currentPage === i 
              ? 'bg-orange-500 text-white' 
              : 'hover:bg-orange-100 hover:text-black'
          }`}
        >
          {i}
        </button>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push(<span key="end-ellipsis">...</span>);
      pages.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className="px-3 py-1 rounded-md hover:bg-orange-100 hover:text-black"
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="flex items-center gap-2 font-mono">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded-md ${
          currentPage === 1 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:bg-orange-100 hover:text-black'
        }`}
      >
        Previous
      </button>
      {renderPageNumbers()}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded-md ${
          currentPage === totalPages 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:bg-orange-100 hover:text-black'
        }`}
      >
        Next
      </button>
    </div>
  );
} 