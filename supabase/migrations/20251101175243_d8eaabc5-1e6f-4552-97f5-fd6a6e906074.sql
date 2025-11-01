-- Create enum for roles
CREATE TYPE public.app_role AS ENUM ('coach', 'player');

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Users can view their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to get user's active role (stored in profiles)
CREATE OR REPLACE FUNCTION public.get_active_role(_user_id UUID)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = _user_id
$$;

-- Update handle_new_user to use user_roles table
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  new_team_id UUID;
  user_role TEXT;
  user_team_code TEXT;
BEGIN
  user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'player');
  user_team_code := NEW.raw_user_meta_data->>'team_code';
  
  -- Create profile with default active role
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    user_role
  );
  
  -- Add role to user_roles table
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, user_role::app_role);
  
  -- If coach, create team
  IF user_role = 'coach' THEN
    INSERT INTO public.teams (name, team_code, coach_id)
    VALUES (
      COALESCE(NEW.raw_user_meta_data->>'full_name', 'Mitt lag') || 's lag',
      generate_team_code(),
      NEW.id
    )
    RETURNING id INTO new_team_id;
    
    UPDATE public.profiles
    SET team_id = new_team_id
    WHERE id = NEW.id;
    
  -- If player with team code, join team
  ELSIF user_role = 'player' AND user_team_code IS NOT NULL THEN
    SELECT id INTO new_team_id
    FROM public.teams
    WHERE team_code = user_team_code;
    
    UPDATE public.profiles
    SET team_id = new_team_id
    WHERE id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$;