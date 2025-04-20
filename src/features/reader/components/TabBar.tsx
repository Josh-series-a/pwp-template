
import React from 'react';
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import { CHAPTERS } from '../reader.config';
import { useReader } from '../context/ReaderContext';

interface TabBarProps {
  className?: string;
}

const TabBar: React.FC<TabBarProps> = ({ className }) => {
  const { currentPage, turnPage } = useReader();
  
  // Function to determine if a chapter tab is active
  const isActiveChapter = (chapter: typeof CHAPTERS[0]) => {
    return currentPage >= chapter.startPage && currentPage <= chapter.endPage;
  };
  
  return (
    <div className={cn("flex flex-col gap-2 pr-2", className)}>
      {CHAPTERS.map((chapter) => (
        <Button
          key={chapter.id}
          variant="ghost"
          className={cn(
            "px-2 py-6 rounded-r-md border-r-4 shadow-md relative w-8 h-16",
            isActiveChapter(chapter)
              ? "border-primary bg-primary/10" 
              : "border-muted bg-background/80"
          )}
          onClick={() => turnPage(chapter.startPage)}
          disabled={isActiveChapter(chapter)}
        >
          <span className="absolute -rotate-90 whitespace-nowrap font-serif text-xs">
            {chapter.title.slice(0, 10)}{chapter.title.length > 10 ? '...' : ''}
          </span>
        </Button>
      ))}
    </div>
  );
};

export default TabBar;
