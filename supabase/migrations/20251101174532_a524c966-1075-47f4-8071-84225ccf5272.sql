-- Create teams table
CREATE TABLE public.teams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  team_code TEXT NOT NULL UNIQUE,
  coach_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- Teams policies
CREATE POLICY "Users can view their own team"
  ON public.teams FOR SELECT
  USING (
    auth.uid() = coach_id OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
    )
  );

CREATE POLICY "Coaches can create their own team"
  ON public.teams FOR INSERT
  WITH CHECK (auth.uid() = coach_id);

CREATE POLICY "Coaches can update their own team"
  ON public.teams FOR UPDATE
  USING (auth.uid() = coach_id);

-- Add team_id to profiles
ALTER TABLE public.profiles
ADD COLUMN team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL;

-- Add team_id to activities
ALTER TABLE public.activities
ADD COLUMN team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE;

-- Now update the team policy to use team_id
DROP POLICY "Users can view their own team" ON public.teams;
CREATE POLICY "Users can view their own team"
  ON public.teams FOR SELECT
  USING (
    auth.uid() = coach_id OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.team_id = teams.id
    )
  );

-- Update activities RLS policies
DROP POLICY IF EXISTS "Users can view activities from their team" ON public.activities;
CREATE POLICY "Users can view activities from their team"
  ON public.activities FOR SELECT
  USING (
    team_id IS NULL OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.team_id = activities.team_id
    )
  );

-- Function to generate unique team code
CREATE OR REPLACE FUNCTION generate_team_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate 6 character alphanumeric code (uppercase)
    code := upper(substring(md5(random()::text) from 1 for 6));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM public.teams WHERE team_code = code) INTO code_exists;
    
    -- Exit loop if code is unique
    EXIT WHEN NOT code_exists;
  END LOOP;
  
  RETURN code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update handle_new_user function to create team for coaches
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
  
  -- If coach, create a team first
  IF user_role = 'coach' THEN
    INSERT INTO public.teams (name, team_code, coach_id)
    VALUES (
      COALESCE(NEW.raw_user_meta_data->>'full_name', 'Mitt lag') || 's lag',
      generate_team_code(),
      NEW.id
    )
    RETURNING id INTO new_team_id;
    
    -- Create profile with team_id
    INSERT INTO public.profiles (id, email, full_name, role, team_id)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
      'coach',
      new_team_id
    );
  -- If player with team code, find and join team
  ELSIF user_role = 'player' AND user_team_code IS NOT NULL THEN
    -- Find team by code
    SELECT id INTO new_team_id
    FROM public.teams
    WHERE team_code = user_team_code;
    
    -- Create profile with team_id if team exists
    INSERT INTO public.profiles (id, email, full_name, role, team_id)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
      'player',
      new_team_id
    );
  ELSE
    -- Create profile without team
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
      user_role
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Add trigger for teams updated_at
CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON public.teams
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();