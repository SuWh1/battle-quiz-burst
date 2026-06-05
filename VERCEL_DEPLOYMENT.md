# Vercel deployment

This project is a TanStack Start app with Nitro server output for Vercel.

## Vercel project settings

- Framework Preset: Other
- Root Directory: repository root
- Install Command: leave default, or use `bun install`
- Build Command: `bun run build`
- Output Directory: leave empty

The build creates `.vercel/output`, which Vercel uses through the Build Output API.

## Required environment variables

Add these in Vercel Project Settings → Environment Variables for Production, Preview, and Development:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

Use the same values from the local `.env` file when adding these to Vercel. Do not commit those real values to GitHub.

For this project:

- `SUPABASE_URL`: Supabase Project Settings → API → Project URL
- `SUPABASE_ANON_KEY`: Supabase Project Settings → API → anon/public key
- `SUPABASE_PUBLISHABLE_KEY`: same value as `SUPABASE_ANON_KEY` if the app uses this variable name
- `VITE_SUPABASE_URL`: same value as `SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`: same value as `SUPABASE_ANON_KEY`
- `VITE_SUPABASE_PUBLISHABLE_KEY`: same value as `SUPABASE_ANON_KEY`
- `VITE_SUPABASE_PROJECT_ID`: the project reference from the Supabase URL, the part before `.supabase.co`

`SUPABASE_SERVICE_ROLE_KEY` is only needed if server-only Supabase admin code is used. Do not add service-role keys to any `VITE_*` variable.

## Common 404 cause

If Vercel deploys this as a plain static Vite app, it may serve the wrong output and show `404: NOT_FOUND`. The Nitro preset must stay set to `vercel` in `vite.config.ts`, and Vercel should use the `.vercel/output` directory produced by the build.
