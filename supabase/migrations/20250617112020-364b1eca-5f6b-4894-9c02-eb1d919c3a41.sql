
-- Drop the problematic admin policy that references auth.users directly
DROP POLICY IF EXISTS "Admins can manage all health score credits" ON public.health_score_credits;

-- Create a security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND (
      auth.users.raw_user_meta_data->>'role' = 'Admin' 
      OR auth.users.email = 'colinfc@btinternet.com'
    )
  );
$$;

-- Create new admin policy using the security definer function
CREATE POLICY "Admins can manage all health score credits"
  ON public.health_score_credits
  FOR ALL
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());
