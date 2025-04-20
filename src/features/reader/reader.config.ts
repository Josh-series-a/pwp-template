
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

export const getChapterForPage = (page: number): Chapter | undefined => {
  return CHAPTERS.find(c => page >= c.startPage && page <= c.endPage);
};

export const getStartPageForRoute = (segment?: string): number => {
  const chapter = CHAPTERS.find(c => c.route.endsWith(segment || ''));
  return chapter?.startPage ?? 1;
};

// Note: We're using React.createElement instead of JSX to avoid any TS/JSX parsing issues
export const getPageContent = (page: number): React.ReactNode => {
  return React.createElement(
    'div',
    null,
    React.createElement(
      'h3',
      { className: "text-2xl font-serif mb-4" },
      "Page ",
      page
    ),
    React.createElement(
      'p',
      { className: "text-lg mb-6" },
      `Demo text for page ${page}. Replace this via CMS or static assets.`
    ),
    page % 5 === 0 && React.createElement(
      'div',
      { 
        'data-workbook-field-id': `reflect-${page}`,
        className: "p-4 bg-muted/20 rounded-md border"
      },
      "Reflection: jot down what resonated on this spread."
    )
  );
};
