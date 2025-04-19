
import React from 'react';
import { Chapter } from './types';

export const TOTAL_PAGES = 200;

export const CHAPTERS: Chapter[] = [
  { id: 'intro',   title: 'Introduction',       startPage: 1,   endPage: 10,  route: '/read/intro' },
  { id: 'part-1',  title: 'Part 1 – Foundation', startPage: 11,  endPage: 50,  route: '/read/part-1' },
  { id: 'part-2',  title: 'Part 2 – Growth',     startPage: 51,  endPage: 120, route: '/read/part-2' },
  { id: 'part-3',  title: 'Part 3 – Purpose',    startPage: 121, endPage: 180, route: '/read/part-3' },
  { id: 'concl',   title: 'Conclusion',          startPage: 181, endPage: 200, route: '/read/concl' },
];

// Helpers
export const getChapterForPage = (page: number) =>
  CHAPTERS.find(c => page >= c.startPage && page <= c.endPage);

export const getStartPageForRoute = (segment?: string) =>
  CHAPTERS.find(c => c.route.endsWith(segment || ''))?.startPage ?? 1;

export const getPageContent = (page: number): React.ReactNode => {
  return (
    <>
      <h3>Page {page}</h3>
      <p>Demo text for page {page}. Replace this via CMS or static assets.</p>
      {page % 5 === 0 && (
        <div data-workbook-field-id={`reflect-${page}`}>
          Reflection: jot down what resonated on this spread.
        </div>
      )}
    </>
  );
};
