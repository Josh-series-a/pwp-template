-- Make client_id nullable in business_health table since we now use report_id
ALTER TABLE public.business_health 
ALTER COLUMN client_id DROP NOT NULL;