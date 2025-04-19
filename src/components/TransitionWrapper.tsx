
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
const TransitionWrapper: React.FC<{ 
  children: React.ReactNode;
  animation?: string;
  delay?: number;
  className?: string;
}> = ({
  children,
  animation,
  delay,
  className
}) => (
  <AnimatePresence initial={false} mode="wait">
    {children}
  </AnimatePresence>
);

export default TransitionWrapper;
