'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

import { cn } from '@/lib/utils';

interface PaginationControlsProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({ currentPage, totalItems, itemsPerPage }) => {
  const router = useRouter();
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    const url = new URL(window.location.href);
    url.searchParams.set('page', String(page));
    url.searchParams.set('per_page', String(itemsPerPage));
    router.push(url.toString());
  };

  return (
    <nav role="navigation" aria-label="pagination" className="mx-auto flex w-full justify-center mt-8">
      <ul className="flex flex-row items-center space-x-2">
        <li>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className={cn(
              'p-2 sm:p-3 bg-transparent hover:bg-[var(--dark-blue)] text-[var(--dark-blue)] hover:text-[var(--white)] border border-[var(--dark-blue)] rounded-none',
              { 'opacity-50 cursor-not-allowed': currentPage <= 1 }
            )}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous</span>
          </button>
        </li>
        {Array.from({ length: totalPages }, (_, index) => (
          <li key={index}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(index + 1);
              }}
              className={cn(
                'p-2 sm:p-3 bg-transparent border border-[var(--dark-blue)] rounded-none',
                currentPage === index + 1
                  ? 'bg-[var(--dark-blue)] text-[var(--white)]'
                  : 'hover:bg-[var(--dark-blue)] text-[var(--dark-blue)] hover:text-[var(--white)]'
              )}
            >
              {index + 1}
            </a>
          </li>
        ))}
        <li>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className={cn(
              'p-2 sm:p-3 bg-transparent hover:bg-[var(--dark-blue)] text-[var(--dark-blue)] hover:text-[var(--white)] border border-[var(--dark-blue)] rounded-none',
              { 'opacity-50 cursor-not-allowed': currentPage >= totalPages }
            )}
            disabled={currentPage >= totalPages}
          >
            <span className="sr-only">Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default PaginationControls;
