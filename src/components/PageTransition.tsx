
import React from 'react';
import { motion } from 'framer-motion';

type Props = {
  /** Children must be keyed so Framer sees "old" vs "new" page. */
  children: React.ReactElement;
  /** 'forward' when moving next, 'backward' when prev, 'none' for initial. */
  direction: 'forward' | 'backward' | 'none';
};

/**
 * Handles the page-curl illusion: slides + subtle Y-rotation.
 * We keep it generic so any page canvas can be wrapped.
 */
export const PageTransition: React.FC<Props> = ({
  children,
  direction,
}) => {
  // Base distance in px for slide
  const DIST = 40;

  return (
    <motion.div
      className="h-full"
      initial={{
        x: direction === 'none' ? 0 : direction === 'forward' ? DIST : -DIST,
        rotateY: direction === 'none' ? 0 : direction === 'forward' ? -15 : 15,
        opacity: 0,
      }}
      animate={{
        x: 0,
        rotateY: 0,
        opacity: 1,
        transition: { duration: 0.85, ease: [0.55, 0.06, 0.26, 1.02] },
      }}
      exit={{
        x: direction === 'forward' ? -DIST : DIST,
        rotateY: direction === 'forward' ? 15 : -15,
        opacity: 0,
        transition: { duration: 0.85, ease: [0.55, 0.06, 0.26, 1.02] },
      }}
    >
      {children}
    </motion.div>
  );
};

