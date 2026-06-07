# Student environment variable guide

Use this guide when adding values to Vercel Project Settings → Environment Variables.

## Supabase keys

- `SUPABASE_URL`: the base Supabase project URL, like `https://your-project-ref.supabase.co`.
- `SUPABASE_ANON_KEY`: the Supabase anon/public key. This is also sometimes called the publishable key.
- `SUPABASE_PUBLISHABLE_KEY`: same value as `SUPABASE_ANON_KEY` if the project uses this name.
- `VITE_SUPABASE_URL`: same value as `SUPABASE_URL`.
- `VITE_SUPABASE_ANON_KEY`: same value as `SUPABASE_ANON_KEY`.
- `VITE_SUPABASE_PUBLISHABLE_KEY`: same value as `SUPABASE_ANON_KEY`.
- `VITE_SUPABASE_PROJECT_ID`: the project ref from the URL, the part before `.supabase.co`.
- `SUPABASE_SERVICE_ROLE_KEY`: secret server-only key. Add only if backend/server code needs it.
- `GEMINI_API_KEY`: secret server-only Gemini API key for AI features.
- `GEMINI_MODEL`: Gemini model name, for example `gemini-2.5-flash-lite`.

Most student apps do not need `SUPABASE_SERVICE_ROLE_KEY`. If the app only reads public data or uses normal user auth/RLS, use the anon/public key.

## Where to find them

In Supabase, open Project Settings → API:

- Project URL → use for `SUPABASE_URL` and `VITE_SUPABASE_URL`.
- Anon/public/publishable key → use for anon/public frontend variables.
- Service role key → use only for `SUPABASE_SERVICE_ROLE_KEY`.
- Gemini API key → Google AI Studio → API keys.

## Safety rules

- Never commit `.env`.
- Commit `.env.example` with names only.
- Never put service role keys into `VITE_*` variables.
- `VITE_*` variables are visible in the browser.
- Do not add service role keys to Vercel unless server code truly needs admin privileges.
- Do not put Gemini API keys into `VITE_*` variables.
- Add Vercel variables to Production, Preview, and Development unless the project needs different values per environment.

## Database setup

Environment variables only connect the app to Supabase. They do not create tables.

If the app says a table is missing, run the project SQL migrations in Supabase using the CLI or SQL Editor.
