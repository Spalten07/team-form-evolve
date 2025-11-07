-- Create saved_trainings table
CREATE TABLE public.saved_trainings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  duration INTEGER NOT NULL,
  focus TEXT NOT NULL,
  players INTEGER NOT NULL,
  exercises JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.saved_trainings ENABLE ROW LEVEL SECURITY;

-- Coaches can create their own saved trainings
CREATE POLICY "Coaches can create saved trainings"
ON public.saved_trainings
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = coach_id);

-- Coaches can view their own saved trainings
CREATE POLICY "Coaches can view their saved trainings"
ON public.saved_trainings
FOR SELECT
TO authenticated
USING (auth.uid() = coach_id);

-- Coaches can update their own saved trainings
CREATE POLICY "Coaches can update their saved trainings"
ON public.saved_trainings
FOR UPDATE
TO authenticated
USING (auth.uid() = coach_id);

-- Coaches can delete their own saved trainings
CREATE POLICY "Coaches can delete their saved trainings"
ON public.saved_trainings
FOR DELETE
TO authenticated
USING (auth.uid() = coach_id);

-- Add trigger for updated_at
CREATE TRIGGER update_saved_trainings_updated_at
BEFORE UPDATE ON public.saved_trainings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();