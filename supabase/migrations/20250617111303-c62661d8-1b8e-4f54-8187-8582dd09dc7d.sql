
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own health score credits" ON public.health_score_credits;
DROP POLICY IF EXISTS "Users can create their own health score credits" ON public.health_score_credits;
DROP POLICY IF EXISTS "Users can update their own health score credits" ON public.health_score_credits;
DROP POLICY IF EXISTS "Service role can manage health score credits" ON public.health_score_credits;
DROP POLICY IF EXISTS "Admins can manage all health score credits" ON public.health_score_credits;

-- Create policy to allow users to view their own health score credits
CREATE POLICY "Users can view their own health score credits" 
  ON public.health_score_credits 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own health score credits
CREATE POLICY "Users can create their own health score credits" 
  ON public.health_score_credits 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own health score credits
CREATE POLICY "Users can update their own health score credits" 
  ON public.health_score_credits 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy to allow service role to manage all health score credits (for admin operations)
CREATE POLICY "Service role can manage health score credits" 
  ON public.health_score_credits 
  FOR ALL 
  USING (auth.role() = 'service_role');

-- Create policy to allow admins to manage all health score credits
CREATE POLICY "Admins can manage all health score credits"
  ON public.health_score_credits
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND (auth.users.raw_user_meta_data->>'role' = 'Admin' OR auth.users.email = 'colinfc@btinternet.com')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND (auth.users.raw_user_meta_data->>'role' = 'Admin' OR auth.users.email = 'colinfc@btinternet.com')
    )
  );
