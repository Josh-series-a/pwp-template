
-- Add admin policies to user_credits table to allow admins to manage all user credits

-- Create policy to allow admins to manage all user credits
CREATE POLICY "Admins can manage all user credits"
  ON public.user_credits
  FOR ALL
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());
