
import React, { useEffect, useRef, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { useAnnotations } from '../hooks/useAnnotations';

type Props = {
  id: string;
  page: number;
  initial: string;
};

export const EditableArea: React.FC<Props> = ({ id, page, initial }) => {
  const [txt, setTxt] = useState(initial);
  const { upsertField, saving } = useAnnotations();
  const ref = useRef<HTMLTextAreaElement>(null);

  // Auto-resize
  useEffect(() => {
    const t = ref.current;
    if (!t) return;
    t.style.height = 'auto';
    t.style.height = t.scrollHeight + 'px';
  }, [txt]);

  // Save with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      upsertField({ id, page, content: txt, isChecklist: false });
    }, 400);
    return () => clearTimeout(timer);
  }, [txt, id, page, upsertField]);

  return (
    <Textarea
      ref={ref}
      value={txt}
      onChange={(e) => setTxt(e.target.value)}
      placeholder="Type here..."
      className="w-full resize-none bg-yellow-50/40 border-yellow-200 focus-visible:ring-accent-gold"
    />
  );
};
