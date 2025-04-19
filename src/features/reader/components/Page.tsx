
import React from 'react';
import { cn } from '@/lib/utils';
import { PageNumber } from './PageNumber';
import { getPageContent } from '../reader.config';

type Props = {
  page: number;
  isLeft: boolean;
};

/** One sheet in the spread (no page-turn motion here). */
export const Page: React.FC<Props> = ({ page, isLeft }) => {
  return (
    <div
      data-page-number={page}
      className={cn(
        'relative flex-1 bg-canvas page-shadow overflow-y-auto px-8 py-6',
        isLeft ? 'mr-[2px]' : 'ml-[2px]',
      )}
    >
      <article className="prose max-w-none text-brand-ink">
        {getPageContent(page)}
      </article>

      <PageNumber number={page} isLeft={isLeft} />
    </div>
  );
};

