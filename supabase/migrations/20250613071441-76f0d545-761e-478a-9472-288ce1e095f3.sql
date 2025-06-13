
-- Create health_score_credits table
CREATE TABLE public.health_score_credits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  health_score_credits INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_health_score_credits_updated_at
  BEFORE UPDATE ON public.health_score_credits
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_credits_updated_at();

-- Add Row Level Security (RLS)
ALTER TABLE public.health_score_credits ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for health_score_credits
CREATE POLICY "Users can view their own health score credits" 
  ON public.health_score_credits 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own health score credits" 
  ON public.health_score_credits 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage health score credits" 
  ON public.health_score_credits 
  FOR ALL 
  USING (auth.role() = 'service_role');
