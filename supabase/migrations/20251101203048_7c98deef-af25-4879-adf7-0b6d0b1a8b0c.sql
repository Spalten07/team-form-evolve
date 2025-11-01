-- Create table for theory assignments
CREATE TABLE public.theory_assignments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id text NOT NULL,
  assigned_by uuid NOT NULL REFERENCES auth.users(id),
  assigned_to uuid NOT NULL REFERENCES auth.users(id),
  team_id uuid REFERENCES public.teams(id),
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.theory_assignments ENABLE ROW LEVEL SECURITY;

-- Coaches can create assignments
CREATE POLICY "Coaches can create theory assignments"
ON public.theory_assignments
FOR INSERT
WITH CHECK (
  auth.uid() = assigned_by AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'coach'
  )
);

-- Coaches can view their team's assignments
CREATE POLICY "Coaches can view their team's assignments"
ON public.theory_assignments
FOR SELECT
USING (
  auth.uid() = assigned_by OR
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'coach' AND team_id = theory_assignments.team_id
  )
);

-- Players can view their own assignments
CREATE POLICY "Players can view their own assignments"
ON public.theory_assignments
FOR SELECT
USING (auth.uid() = assigned_to);

-- Players can update their own assignments (mark as completed)
CREATE POLICY "Players can update their own assignments"
ON public.theory_assignments
FOR UPDATE
USING (auth.uid() = assigned_to);

-- Coaches can delete their own assignments
CREATE POLICY "Coaches can delete their assignments"
ON public.theory_assignments
FOR DELETE
USING (auth.uid() = assigned_by);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_theory_assignments_updated_at
BEFORE UPDATE ON public.theory_assignments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create table for scheduled callups
CREATE TABLE public.scheduled_callups (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  coach_id uuid NOT NULL REFERENCES auth.users(id),
  team_id uuid REFERENCES public.teams(id),
  days_before integer NOT NULL,
  day_of_week integer NOT NULL,
  selected_players uuid[] NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.scheduled_callups ENABLE ROW LEVEL SECURITY;

-- Coaches can manage their own scheduled callups
CREATE POLICY "Coaches can create scheduled callups"
ON public.scheduled_callups
FOR INSERT
WITH CHECK (
  auth.uid() = coach_id AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'coach'
  )
);

CREATE POLICY "Coaches can view their scheduled callups"
ON public.scheduled_callups
FOR SELECT
USING (auth.uid() = coach_id);

CREATE POLICY "Coaches can update their scheduled callups"
ON public.scheduled_callups
FOR UPDATE
USING (auth.uid() = coach_id);

CREATE POLICY "Coaches can delete their scheduled callups"
ON public.scheduled_callups
FOR DELETE
USING (auth.uid() = coach_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_scheduled_callups_updated_at
BEFORE UPDATE ON public.scheduled_callups
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();