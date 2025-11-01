-- Create table for callup responses
CREATE TABLE public.callup_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  activity_id UUID NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'declined')),
  decline_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(activity_id, player_id)
);

-- Enable RLS
ALTER TABLE public.callup_responses ENABLE ROW LEVEL SECURITY;

-- Players can view their own callup responses
CREATE POLICY "Players can view their own callup responses"
ON public.callup_responses
FOR SELECT
USING (auth.uid() = player_id);

-- Players can update their own callup responses
CREATE POLICY "Players can update their own callup responses"
ON public.callup_responses
FOR UPDATE
USING (auth.uid() = player_id);

-- Coaches can view callup responses for their team's activities
CREATE POLICY "Coaches can view their team's callup responses"
ON public.callup_responses
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.activities
    WHERE activities.id = callup_responses.activity_id
    AND activities.created_by = auth.uid()
  )
);

-- Coaches can create callup responses when sending callups
CREATE POLICY "Coaches can create callup responses"
ON public.callup_responses
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.activities
    WHERE activities.id = callup_responses.activity_id
    AND activities.created_by = auth.uid()
  )
);

-- Add trigger for updated_at
CREATE TRIGGER update_callup_responses_updated_at
BEFORE UPDATE ON public.callup_responses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();