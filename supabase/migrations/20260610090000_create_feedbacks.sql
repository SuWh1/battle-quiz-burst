CREATE TABLE IF NOT EXISTS public."отзывы" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  improvement text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS feedback_created_at_idx
  ON public."отзывы" (created_at DESC);

ALTER TABLE public."отзывы" ENABLE ROW LEVEL SECURITY;
