-- Add progress tracking columns to reports table
ALTER TABLE public.reports 
ADD COLUMN progress_start_time timestamp with time zone,
ADD COLUMN current_progress numeric DEFAULT 0;