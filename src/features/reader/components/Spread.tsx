
import React from 'react';
import { cn } from '@/lib/utils';
import { useReader } from '../context/ReaderContext';
import { useTurnPage } from '../hooks/useTurnPage';
import { Page } from './Page';
import { TransitionWrapper } from '@/components/TransitionWrapper';
import { PageTransition } from '@/components/PageTransition';

/**
 * Grid columns:
 *  ┊ gutter ┃ left-page ┃ spine ┃ right-page ┃ gutter ┊
 */
export const Spread: React.FC = () => {
  const { currentPage, isPageTurning } = useReader();
  const { handleHotspotClick } = useTurnPage();

  // Determine which folios show
  const leftPage = currentPage % 2 === 0 ? currentPage : currentPage - 1;
  const rightPage = currentPage % 2 === 0 ? currentPage + 1 : currentPage;

  return (
    <div
      className={cn(
        'grid h-full w-full',
        'grid-cols-spread',
        'bg-canvas relative',
      )}
    >
      {/* left gutter (could house chapter tabs later) */}
      <div className="col-start-1 col-end-2" />

      {/* left page */}
      <TransitionWrapper>
        <PageTransition key={`p-${leftPage}`} direction="none">
          <Page page={leftPage} isLeft />
        </PageTransition>
      </TransitionWrapper>

      {/* spine */}
      <div className="col-start-3 col-end-4 w-[4px] bg-canvas-dark shadow-inner" />

      {/* right page */}
      <TransitionWrapper>
        <PageTransition key={`p-${rightPage}`} direction="none">
          <Page page={rightPage} isLeft={false} />
        </PageTransition>
      </TransitionWrapper>

      {/* right gutter (future toolbar) */}
      <div className="col-start-5 col-end-6" />

      {/* invisible click hotspots */}
      <button
        aria-label="Previous page"
        className="absolute inset-y-0 left-0 w-1/4"
        onClick={() => handleHotspotClick('left')}
      />
      <button
        aria-label="Next page"
        className="absolute inset-y-0 right-0 w-1/4"
        onClick={() => handleHotspotClick('right')}
      />
    </div>
  );
};

