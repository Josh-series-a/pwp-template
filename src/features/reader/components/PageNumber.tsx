
import React from 'react';
import { cn } from '@/lib/utils';

type Props = {
  number: number;
  isLeft: boolean;
};

/** Small folio number in the corner of each page. */
export const PageNumber: React.FC<Props> = ({ number, isLeft }) => (
  <span
    className={cn(
      'absolute bottom-5 text-sm font-serif text-brand-ink select-none',
      isLeft ? 'left-8' : 'right-8',
    )}
    aria-hidden="true"
  >
    {number}
  </span>
);

