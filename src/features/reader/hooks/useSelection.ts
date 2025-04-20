
import { useEffect, useState } from 'react';

export const useSelection = () => {
  const [range, setRange] = useState<Range | null>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const handler = () => {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0 || sel.toString().trim() === '') {
        setRange(null);
        setRect(null);
        return;
      }
      const r = sel.getRangeAt(0);
      setRange(r);
      setRect(r.getBoundingClientRect());
    };

    document.addEventListener('mouseup', handler);
    document.addEventListener('keyup', handler);

    return () => {
      document.removeEventListener('mouseup', handler);
      document.removeEventListener('keyup', handler);
    };
  }, []);

  const clear = () => {
    window.getSelection()?.removeAllRanges();
    setRange(null);
    setRect(null);
  };

  return { range, rect, clear };
};
