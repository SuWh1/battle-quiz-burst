ALTER TABLE public.questions
  ADD COLUMN IF NOT EXISTS quiz_id uuid,
  ADD COLUMN IF NOT EXISTS quiz_title text;

DO $$
DECLARE
  existing_quiz_id uuid := gen_random_uuid();
BEGIN
  UPDATE public.questions
  SET quiz_id = existing_quiz_id
  WHERE quiz_id IS NULL;
END $$;

UPDATE public.questions
SET quiz_title = 'База вопросов'
WHERE quiz_title IS NULL OR btrim(quiz_title) = '';

ALTER TABLE public.questions
  ALTER COLUMN quiz_id SET DEFAULT gen_random_uuid(),
  ALTER COLUMN quiz_id SET NOT NULL,
  ALTER COLUMN quiz_title SET DEFAULT 'База вопросов',
  ALTER COLUMN quiz_title SET NOT NULL;

CREATE INDEX IF NOT EXISTS questions_quiz_id_order_index_idx
  ON public.questions (quiz_id, order_index);
