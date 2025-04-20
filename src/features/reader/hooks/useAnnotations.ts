
import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { v4 as uid } from 'uuid';
import {
  AnnotationData,
  AnnotationDataSchema,
  Highlight,
  Note,
  WorkbookField,
} from '../types';

const LS_KEY = 'reader-annotations';

const loadLS = (): AnnotationData => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return { highlights: [], notes: [], workbookFields: [] };
    return AnnotationDataSchema.parse(JSON.parse(raw));
  } catch {
    localStorage.removeItem(LS_KEY);
    return { highlights: [], notes: [], workbookFields: [] };
  }
};

const saveLS = (d: AnnotationData) =>
  localStorage.setItem(LS_KEY, JSON.stringify(d));

export const useAnnotations = () => {
  const qc = useQueryClient();

  const { data = { highlights: [], notes: [], workbookFields: [] } } = useQuery({
    queryKey: ['ann'],
    queryFn: () => loadLS(),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const m = useMutation({
    mutationFn: async (d: AnnotationData) => saveLS(d),
    onMutate: async (next) => {
      await qc.cancelQueries({ queryKey: ['ann'] });
      qc.setQueryData(['ann'], next);
    },
  });

  const addHighlight = useCallback(
    (page: number, start: number, end: number) => {
      const h: Highlight = { id: uid(), page, startOffset: start, endOffset: end, color: 'accent-gold' };
      m.mutate({ ...data, highlights: [...data.highlights, h] });
    },
    [data, m],
  );

  const addNote = useCallback(
    (page: number, content: string) => {
      const n: Note = { id: uid(), page, content, createdAt: new Date().toISOString() };
      m.mutate({ ...data, notes: [...data.notes, n] });
    },
    [data, m],
  );

  const upsertField = useCallback(
    (f: WorkbookField) => {
      const idx = data.workbookFields.findIndex((x) => x.id === f.id);
      const next = [...data.workbookFields];
      idx === -1 ? next.push(f) : (next[idx] = f);
      m.mutate({ ...data, workbookFields: next });
    },
    [data, m],
  );

  return { data, addHighlight, addNote, upsertField, saving: m.isPending };
};
