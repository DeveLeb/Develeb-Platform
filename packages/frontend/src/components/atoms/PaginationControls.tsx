'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

import { cn } from '@/lib/utils';

interface PaginationControlsProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (newPage: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const router = useRouter();
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    const url = new URL(window.location.href);
    url.searchParams.set('page', String(page));
    url.searchParams.set('per_page', String(itemsPerPage));
    router.push(url.toString());
  };

  // Helper function to generate an array of page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) {
      end = Math.min(5, totalPages);
    } else if (currentPage >= totalPages - 2) {
      start = Math.max(1, totalPages - 4);
    }

    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
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
        {getPageNumbers().map((pageNumber) => (
          <li key={pageNumber}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(pageNumber);
              }}
              className={cn(
                'p-2 sm:p-3 bg-transparent border border-[var(--dark-blue)] rounded-none',
                currentPage === pageNumber
                  ? 'bg-[var(--dark-blue)] text-[var(--white)]'
                  : 'hover:bg-[var(--dark-blue)] text-[var(--dark-blue)] hover:text-[var(--white)]'
              )}
            >
              {pageNumber}
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
