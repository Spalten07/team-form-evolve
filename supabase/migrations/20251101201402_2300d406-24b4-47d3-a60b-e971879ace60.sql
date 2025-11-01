-- Add profile fields for contact information and guardian details
ALTER TABLE public.profiles
ADD COLUMN phone TEXT,
ADD COLUMN address TEXT,
ADD COLUMN guardian_name TEXT,
ADD COLUMN guardian_phone TEXT;