# Supabase database setup

The app reads quiz questions from `public.questions`.

If local development or Vercel shows this error:

```text
Could not find the table 'public.questions' in the schema cache
```

the SQL migration has not been applied to the Supabase project yet.

## Automated setup with Supabase CLI

Run these from the project folder:

```bash
npm run db:link
npm run db:push:dry
npm run db:push
```

The CLI may ask you to log in or enter the Supabase database password.

Use the project ref from `VITE_SUPABASE_PROJECT_ID` when linking. For this project it is:

```text
nuvjafpspourscpacapw
```

## Manual setup

If CLI setup is not available:

1. Open Supabase dashboard.
2. Open the project.
3. Go to SQL Editor.
4. Paste and run the SQL from `supabase/migrations/20260602044307_dca38f60-8fb5-40f9-b7f5-647934c49ae4.sql`.
5. Paste and run the SQL from `supabase/migrations/20260605093000_seed_questions.sql` to add starter questions.
6. Paste and run the SQL from `supabase/migrations/20260608090000_add_quiz_groups.sql` to group saved questions into separate quizzes.

## Important

- Supabase anon/service keys cannot create tables through the app.
- Creating tables requires SQL Editor, Supabase CLI, or a direct database connection.
- After creating the table, add rows to `public.questions` or the quiz will have no questions.
- The seed migration `supabase/migrations/20260605093000_seed_questions.sql` adds starter questions only when the table is empty.
- The quiz grouping migration `supabase/migrations/20260608090000_add_quiz_groups.sql` is required for the “all quizzes” page.
