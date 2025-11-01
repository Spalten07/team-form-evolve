-- Create table for custom theory quizzes
CREATE TABLE public.custom_quizzes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id text NOT NULL UNIQUE,
  title text NOT NULL,
  level text NOT NULL,
  questions jsonb NOT NULL,
  created_by uuid NOT NULL REFERENCES auth.users(id),
  team_id uuid REFERENCES public.teams(id),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.custom_quizzes ENABLE ROW LEVEL SECURITY;

-- Coaches can create custom quizzes
CREATE POLICY "Coaches can create custom quizzes"
ON public.custom_quizzes
FOR INSERT
WITH CHECK (
  auth.uid() = created_by AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'coach'
  )
);

-- Coaches can view their own custom quizzes
CREATE POLICY "Coaches can view their custom quizzes"
ON public.custom_quizzes
FOR SELECT
USING (auth.uid() = created_by);

-- Coaches can update their own custom quizzes
CREATE POLICY "Coaches can update their custom quizzes"
ON public.custom_quizzes
FOR UPDATE
USING (auth.uid() = created_by);

-- Coaches can delete their own custom quizzes
CREATE POLICY "Coaches can delete their custom quizzes"
ON public.custom_quizzes
FOR DELETE
USING (auth.uid() = created_by);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_custom_quizzes_updated_at
BEFORE UPDATE ON public.custom_quizzes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();