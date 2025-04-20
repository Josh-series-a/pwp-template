
import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { TOTAL_PAGES, getPageContent } from '@/features/reader/reader.config';
import TransitionWrapper from '@/components/TransitionWrapper';
import PageTransition from '@/components/PageTransition';

const Read2 = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageDirection, setPageDirection] = useState<'forward' | 'backward' | 'none'>('none');
  
  const handleNextPage = () => {
    if (currentPage < TOTAL_PAGES) {
      setPageDirection('forward');
      setCurrentPage(prev => prev + 1);
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setPageDirection('backward');
      setCurrentPage(prev => prev - 1);
    }
  };
  
  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-[#f8f5ed] dark:bg-[#252117]">
      <div className="w-full h-full flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h1 className="text-xl font-serif">Book Reader</h1>
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-muted/20 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="mx-2">Page {currentPage} of {TOTAL_PAGES}</span>
            <button 
              onClick={handleNextPage}
              disabled={currentPage === TOTAL_PAGES}
              className="px-4 py-2 bg-muted/20 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto p-8">
          <TransitionWrapper>
            <PageTransition key={currentPage} direction={pageDirection}>
              <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 shadow-lg rounded">
                {getPageContent(currentPage)}
              </div>
            </PageTransition>
          </TransitionWrapper>
        </div>
      </div>
    </div>
  );
};

export default Read2;
