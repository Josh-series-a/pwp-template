
import { useEffect, useCallback } from 'react';
import { useReader } from '../context/ReaderContext';
import { TOTAL_PAGES } from '../reader.config';

export const useTurnPage = () => {
  const { currentPage, turnPage } = useReader();

  const goToNextPage = useCallback(() => {
    // In spread view, we advance by 2 pages
    // Note: This can be adjusted based on isSpreadView state if needed
    const nextPage = Math.min(currentPage + 2, TOTAL_PAGES);
    if (nextPage > currentPage) {
      turnPage(nextPage);
    }
  }, [currentPage, turnPage]);

  const goToPreviousPage = useCallback(() => {
    // In spread view, we go back by 2 pages
    const prevPage = Math.max(currentPage - 2, 1);
    if (prevPage < currentPage) {
      turnPage(prevPage);
    }
  }, [currentPage, turnPage]);

  const goToPage = useCallback((pageNumber: number) => {
    // Ensure the page is valid and adjust for spread view if needed
    const targetPage = Math.max(1, Math.min(pageNumber, TOTAL_PAGES));
    if (targetPage !== currentPage) {
      turnPage(targetPage);
    }
  }, [currentPage, turnPage]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        goToNextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        goToPreviousPage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [goToNextPage, goToPreviousPage]);

  return {
    goToNextPage,
    goToPreviousPage,
    goToPage
  };
};

export default useTurnPage;
