
import React from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';
import { useReader } from '../context/ReaderContext';
import { CHAPTERS, getChapterForPage } from '../reader.config';

export const TabBar: React.FC = () => {
  const { currentPage, goToPage } = useReader();
  const active = getChapterForPage(currentPage)?.id ?? '';

  return (
    <Tabs.Root
      value={active}
      onValueChange={(id) => {
        const chap = CHAPTERS.find((c) => c.id === id);
        if (chap) goToPage(chap.startPage);
      }}
      orientation="vertical"
      className="flex flex-col h-full overflow-y-auto pr-1"
    >
      <Tabs.List className="flex flex-col gap-2">
        {CHAPTERS.map((c) => (
          <Tabs.Trigger
            key={c.id}
            value={c.id}
            className={cn(
              'relative px-2 py-1 text-left text-xs font-medium',
              'rounded-sm transition-colors',
              'data-[state=active]:text-brand-ink data-[state=active]:before:bg-accent-gold',
              'before:absolute before:inset-y-0 before:left-0 before:w-1 before:rounded-l',
            )}
          >
            {c.title}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs.Root>
  );
};
