-- Create attendance table to track player attendance at activities
CREATE TABLE public.attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  activity_id UUID NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  attended BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(activity_id, player_id)
);

-- Enable RLS
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Coaches can view attendance for their team's activities
CREATE POLICY "Coaches can view attendance for their activities"
ON public.attendance
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.activities
    WHERE activities.id = attendance.activity_id
    AND activities.created_by = auth.uid()
  )
);

-- Coaches can insert attendance records for their activities
CREATE POLICY "Coaches can insert attendance for their activities"
ON public.attendance
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.activities
    WHERE activities.id = attendance.activity_id
    AND activities.created_by = auth.uid()
  )
);

-- Coaches can update attendance records for their activities
CREATE POLICY "Coaches can update attendance for their activities"
ON public.attendance
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.activities
    WHERE activities.id = attendance.activity_id
    AND activities.created_by = auth.uid()
  )
);

-- Players can view their own attendance
CREATE POLICY "Players can view their own attendance"
ON public.attendance
FOR SELECT
USING (auth.uid() = player_id);

-- Trigger for updated_at
CREATE TRIGGER update_attendance_updated_at
BEFORE UPDATE ON public.attendance
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();