
import React from 'react';
import { AnimatePresence } from 'framer-motion';

/**
 * Generic wrapper so we can swap any child with exit/enter motion.
 * Usage:
 *   <TransitionWrapper>
 *     <PageTransition key={pageKey} direction={dir}>
 *       <Page ... />
 *     </PageTransition>
 *   </TransitionWrapper>
 */
export const TransitionWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <AnimatePresence initial={false} mode="wait">
    {children}
  </AnimatePresence>
);

