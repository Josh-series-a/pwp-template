
import { z } from 'zod';

export type Chapter = {
  id: string;        // "part-1"
  title: string;     // "Part 1 – Foundation"
  startPage: number; // 1-based index
  endPage: number;   // inclusive
  route: string;     // "/read/part-1"
};

/* ---------- Annotations ---------- */

export const HighlightSchema = z.object({
  id: z.string(),
  page: z.number(),
  startOffset: z.number(),
  endOffset: z.number(),
  color: z.string().default('accent-gold'),
});
export type Highlight = z.infer<typeof HighlightSchema>;

export const NoteSchema = z.object({
  id: z.string(),
  page: z.number(),
  content: z.string(),
  createdAt: z.string(),
});
export type Note = z.infer<typeof NoteSchema>;

export const WorkbookFieldSchema = z.object({
  id: z.string(),   // unique per field
  page: z.number(),
  content: z.string(),
  isChecklist: z.boolean().optional().default(false),
});
export type WorkbookField = z.infer<typeof WorkbookFieldSchema>;

export const AnnotationDataSchema = z.object({
  highlights: z.array(HighlightSchema),
  notes: z.array(NoteSchema),
  workbookFields: z.array(WorkbookFieldSchema),
});
export type AnnotationData = z.infer<typeof AnnotationDataSchema>;

/* ---------- Context shape ---------- */

export type ReaderContextType = {
  currentPage: number;
  totalPages: number;
  chapters: Chapter[];
  theme: 'light' | 'night' | 'sepia';
  readAloudActive: boolean;
  goToPage: (page: number) => void;
  toggleTheme: (t: 'light' | 'night' | 'sepia') => void;
  toggleReadAloud: () => void;
  isPageTurning: boolean;
};
