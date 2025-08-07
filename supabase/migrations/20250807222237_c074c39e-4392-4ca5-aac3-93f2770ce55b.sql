-- Create table to track package queue and timers
CREATE TABLE public.package_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  report_id UUID NOT NULL,
  package_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued', -- 'queued', 'processing', 'completed', 'failed'
  estimated_completion_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '10 minutes'),
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.package_queue ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own package queue" 
ON public.package_queue 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own package queue entries" 
ON public.package_queue 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own package queue entries" 
ON public.package_queue 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own package queue entries" 
ON public.package_queue 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_package_queue_updated_at
BEFORE UPDATE ON public.package_queue
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();