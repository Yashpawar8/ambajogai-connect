CREATE TABLE public.issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  category TEXT NOT NULL DEFAULT 'attendance',
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.issues TO authenticated;
GRANT ALL ON public.issues TO service_role;

ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own issues select" ON public.issues FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own issues insert" ON public.issues FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
