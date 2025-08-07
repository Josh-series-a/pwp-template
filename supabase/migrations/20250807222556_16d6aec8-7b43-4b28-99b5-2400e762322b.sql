-- Add documents field to package_queue table
ALTER TABLE public.package_queue 
ADD COLUMN documents TEXT[] DEFAULT '{}';

-- Create function to mark queue items as completed when package is created
CREATE OR REPLACE FUNCTION public.complete_package_queue()
RETURNS TRIGGER AS $$
BEGIN
  -- Update queue status to completed when a package is created/updated
  UPDATE public.package_queue 
  SET 
    status = 'completed',
    completed_at = now(),
    updated_at = now()
  WHERE 
    report_id = NEW.report_id 
    AND package_name = NEW.package_name 
    AND user_id = NEW.user_id
    AND status IN ('queued', 'processing');
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Create trigger to automatically complete queue items when packages are created
CREATE TRIGGER complete_package_queue_trigger
AFTER INSERT OR UPDATE ON public.packages
FOR EACH ROW
EXECUTE FUNCTION public.complete_package_queue();