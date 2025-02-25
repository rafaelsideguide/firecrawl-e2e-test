"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

type NavItem = {
  href: string;
  label: string;
} | {
  label: string;
  items: (NavItem)[];
};

export default function MainNav() {
  const pathname = usePathname();
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);

  // Load open dropdowns from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('nav-open-dropdowns');
    if (stored) {
      setOpenDropdowns(JSON.parse(stored));
    }
  }, []);

  // Update localStorage when dropdowns change
  useEffect(() => {
    localStorage.setItem('nav-open-dropdowns', JSON.stringify(openDropdowns));
  }, [openDropdowns]);

  // Auto-open parent dropdowns for active page
  useEffect(() => {
    const findParentLabels = (items: NavItem[], targetPath: string, parents: string[] = []): string[] => {
      for (const item of items) {
        if ('href' in item) {
          if (item.href === targetPath) {
            return parents;
          }
        } else {
          const found = findParentLabels(item.items, targetPath, [...parents, item.label]);
          if (found.length) {
            return found;
          }
        }
      }
      return [];
    };

    const parentLabels = findParentLabels(navItems, pathname);
    if (parentLabels.length) {
      setOpenDropdowns(prev => {
        const newDropdowns = [...new Set([...prev, ...parentLabels])];
        return newDropdowns;
      });
    }
  }, [pathname]);

  const navItems: NavItem[] = [
    { href: '/actions', label: 'Actions' },
    {
      label: 'Pagination',
      items: [
        {
          label: 'Numbered Pagination',
          items: [
            { href: '/numbered-pagination', label: 'DOM-based' },
            { href: '/numbered-pagination/with-params', label: 'URL Params' },
          ]
        },
        {
          label: 'Large Dataset Numbered Pagination',
          items: [
            { href: '/numbered-large-pagination', label: 'Large Dataset DOM-based' },
            { href: '/numbered-large-pagination/with-params', label: 'Large Dataset URL Params' },
          ]
        },
        {
          label: 'Next/Previous',
          items: [
            { href: '/next-prev', label: 'DOM-based' },
            { href: '/next-prev/with-params', label: 'URL Params' },
          ]
        },
        {
          label: 'Next/Previous Large Dataset',
          items: [
            { href: '/next-prev-large-dataset', label: 'DOM-based' },
            { href: '/next-prev-large-dataset/with-params', label: 'URL Params' },
          ]
        },
        {
          label: 'Load More',
          items: [
            { href: '/load-more', label: 'DOM-based' },
            { href: '/load-more/with-params', label: 'URL Params' },
          ]
        },
        {
          label: 'Load More Large Dataset',
          items: [
            { href: '/load-more-large-dataset', label: 'DOM-based' },
            { href: '/load-more-large-dataset/with-params', label: 'URL Params' },
          ]
        },
        {
          label: 'Infinite Scroll',
          items: [
            { href: '/infinite-scroll', label: 'DOM-based' },
            { href: '/infinite-scroll/with-params', label: 'URL Params' },
          ]
        },
        {
          label: 'Infinite Scroll Large Dataset',
          items: [
            { href: '/infinite-scroll-large-dataset', label: 'DOM-based' },
            { href: '/infinite-scroll-large-dataset/with-params', label: 'URL Params' },
          ]
        }
      ]
    },
  ];

  const toggleDropdown = (label: string) => {
    setOpenDropdowns(prev => {
      if (prev.includes(label)) {
        return prev.filter(item => item !== label);
      }
      return [...prev, label];
    });
  };

  const isDropdownOpen = (label: string) => openDropdowns.includes(label);

  const hasActiveChild = (item: NavItem): boolean => {
    if ('href' in item) {
      return pathname === item.href;
    }
    return item.items.some(subItem => hasActiveChild(subItem));
  };

  const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
    <svg 
      className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M9 5l7 7-7 7"
      />
    </svg>
  );

  const renderNavItems = (items: NavItem[]) => {
    return items.map((item) => (
      <li key={item.label}>
        {'href' in item ? (
          <Link 
            href={item.href}
            className={`block px-4 py-2 rounded-md transition-colors ${
              pathname === item.href 
                ? 'bg-orange-500 text-white' 
                : 'hover:bg-orange-100 hover:text-black'
            }`}
          >
            {item.label}
          </Link>
        ) : (
          <div className="space-y-1">
            <button
              onClick={() => toggleDropdown(item.label)}
              className={`w-full text-left px-4 py-2 rounded-md transition-colors hover:bg-orange-100 hover:text-black
                ${hasActiveChild(item) ? 'bg-orange-900 text-white' : ''}`}
            >
              <div className="flex items-center justify-between">
                <span>{item.label}</span>
                <ChevronIcon isOpen={isDropdownOpen(item.label)} />
              </div>
            </button>
            <ul className={`ml-4 space-y-1 ${isDropdownOpen(item.label) ? '' : 'hidden'}`}>
              {renderNavItems(item.items)}
            </ul>
          </div>
        )}
      </li>
    ));
  };

  return (
    <nav className="w-64 h-screen fixed left-0 top-0 bg-black border-r border-gray-800 flex flex-col">
      <div className="p-4">
        <Link 
          href="/" 
          className="block text-xl font-bold text-white hover:text-orange-500 transition-colors"
        >
          <span className="whitespace-nowrap">🔥🔬 FireLab</span>
          <span className="block text-sm text-gray-400 font-normal">scrape test page</span>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <ul className="flex flex-col gap-2">
          {renderNavItems(navItems)}
        </ul>
      </div>
    </nav>
  );
} 