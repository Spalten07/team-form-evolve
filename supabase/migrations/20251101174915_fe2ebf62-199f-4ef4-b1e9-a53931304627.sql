-- Fix handle_new_user function to avoid circular dependency
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
  
  -- If coach, create profile first, then team
  IF user_role = 'coach' THEN
    -- Create profile without team_id first
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
      'coach'
    );
    
    -- Now create team with coach_id
    INSERT INTO public.teams (name, team_code, coach_id)
    VALUES (
      COALESCE(NEW.raw_user_meta_data->>'full_name', 'Mitt lag') || 's lag',
      generate_team_code(),
      NEW.id
    )
    RETURNING id INTO new_team_id;
    
    -- Update profile with team_id
    UPDATE public.profiles
    SET team_id = new_team_id
    WHERE id = NEW.id;
    
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