# Project Rules

## Safety

- Never commit `.env`, `.env.local`, or real secret values.
- Keep `.env.example` committed with variable names only.
- Never put private keys in `VITE_*`, `NEXT_PUBLIC_*`, or other browser-exposed variables.
- `SUPABASE_SERVICE_ROLE_KEY` is backend/server-only.
- `GEMINI_API_KEY` is backend/server-only.
- Use `GEMINI_MODEL=gemini-2.5-flash-lite` by default.

## Supabase

- `SUPABASE_URL` must be the base URL, like `https://PROJECT_REF.supabase.co`.
- Do not use `/rest/v1` in `SUPABASE_URL`.
- `VITE_SUPABASE_PROJECT_ID` is the project ref from the Supabase URL.
- If the app uses Supabase tables, check `supabase/migrations`.
- If a table is missing, apply migrations with Supabase CLI or SQL Editor.
- If a table exists but has no rows, add seed data or an empty-state UI.

## Vercel

- Confirm the correct project root before editing.
- Confirm build command and install command match the project.
- For TanStack Start / Nitro SSR apps, the Vercel build must create `.vercel/output`.
- If Vercel logs show only `dist/` and the app returns `404: NOT_FOUND`, fix package manager/build settings.
- This repo uses npm; keep `vercel.json` with `npm install` and `npm run build`.

## Before Deploy

- Run install if needed.
- Run the local build command.
- Check `.env` is ignored.
- Check required Vercel environment variables are listed.
- Check Supabase migrations/seed data are applied.
- Push the latest commit before redeploying.
