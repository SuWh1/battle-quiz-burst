# Student Codex prompt for Vercel deployment

Copy and paste this into Codex inside each student project.

For a full beginner checklist before using this prompt, see `STUDENT_FULL_SETUP_STEPS.md`.

```text
Please prepare this project for deployment on Vercel and fix the current 404: NOT_FOUND issue.

Context:
- The app may have frontend, backend/server routes, or both.
- The deployed Vercel page currently shows:
  404: NOT_FOUND
  Code: NOT_FOUND
- Env variables may be missing or incorrectly configured.
- The student may not know how to handle `.env` safely.

Tasks:
1. First verify you are working in the correct local repository:
   - Print the current folder path.
   - Check the git remote URL.
   - Check the current branch.
   - Check whether there are multiple local clones of the same GitHub repo.
   - If the open editor folder and the git repo folder are different, stop and explain the mismatch before editing files.
   - Do not make changes in a duplicate/old clone unless the student confirms it is the correct project folder.
2. Inspect the project structure, package.json, framework config, routes, API/server files, and any existing vercel.json.
3. Determine the app type:
   - Static frontend app
   - Vite/React SPA
   - Next.js app
   - TanStack Start / Nitro SSR app
   - Express/custom backend
   - Full-stack app with separate frontend/backend
4. Fix the Vercel deployment setup:
   - Correct Root Directory
   - Correct Install Command
   - Correct Build Command
   - Correct Output Directory
   - Correct framework preset
   - Add or fix vercel.json only if needed
   - Check which package manager Vercel will use from lockfiles (`package-lock.json`, `bun.lock`, `pnpm-lock.yaml`, `yarn.lock`).
   - If local works with npm but Vercel uses Bun/pnpm/yarn and deploys `404: NOT_FOUND`, add `vercel.json` with explicit `installCommand` and `buildCommand`.
   - For Nitro/TanStack SSR apps, ensure the build creates `.vercel/output`; if Vercel logs show only `dist/`, fix build/package-manager settings.
5. Fix routing:
   - For SPA apps, ensure page refreshes/deep links work.
   - For backend/server apps, ensure API/server routes are deployed correctly.
6. Check environment variables:
   - Find all required env vars in the code.
   - Compare required env vars with `.env`, `.env.local`, `.env.example`, README, and deployment docs if present.
   - Add `.env` and `.env.*` to `.gitignore`.
   - Keep `.env.example` allowed in git.
   - Create or update `.env.example` with variable names only, no real values.
   - If `.env` is already tracked by git, remove it from git tracking without deleting the local file.
   - List exactly what must be added in Vercel Project Settings → Environment Variables.
   - For each Vercel env var, say clearly what kind of key it is and where the student should get it, for example Supabase anon/public key, Supabase service role secret key, Firebase console, Clerk dashboard, Stripe dashboard, backend URL, or local `.env`.
   - For Supabase projects, label keys clearly:
     - `SUPABASE_URL`: base project URL, no `/rest/v1`.
     - `SUPABASE_ANON_KEY` or `SUPABASE_PUBLISHABLE_KEY`: anon/public frontend-safe key.
     - `VITE_SUPABASE_ANON_KEY` or `VITE_SUPABASE_PUBLISHABLE_KEY`: same anon/public key, exposed to browser.
     - `SUPABASE_SERVICE_ROLE_KEY`: secret backend/server-only key, never `VITE_*`.
   - For AI API keys, label keys clearly:
     - `GEMINI_API_KEY`: secret backend/server-only key, never `VITE_*`.
     - `GEMINI_MODEL`: safe model name, for example `gemini-2.5-flash-lite`.
   - If `.env` exists locally, create `VERCEL_ENV_IMPORT.local.env` using the actual local `.env` values, formatted as `KEY=VALUE` lines so the student can paste/import it into Vercel Environment Variables.
   - Also create `VERCEL_ENV_VALUES.local.md` with short instructions for which Vercel environments to add them to: Production, Preview, and Development, and with human-friendly labels like “Supabase anon/public key” and “Supabase service role secret key.”
   - Make sure `VERCEL_ENV_IMPORT.local.env` and `VERCEL_ENV_VALUES.local.md` are ignored by git and never committed.
   - Do not print real secret values in the chat/final response; only put them in the local ignored files.
7. Check for common Vite/Vercel build issues:
   - If CSS has remote `@import url("https://...")` font imports, make sure the build accepts it.
   - If Lightning CSS errors with `@import rules must precede all rules`, move imports to the top or move external font links into the HTML/document head.
   - Do not hide the error by disabling the Vite overlay; fix the CSS/import order.
8. Check Supabase service-role usage:
   - Search for `SUPABASE_SERVICE_ROLE_KEY`, `service_role`, `supabaseAdmin`, and server Supabase clients.
   - If code only reads public data protected by SELECT/RLS policies, use the anon/public key instead of requiring service role.
   - Require `SUPABASE_SERVICE_ROLE_KEY` only for real backend admin actions that must bypass RLS.
   - Never put service-role keys in `VITE_*`, frontend code, or copy-paste files meant for public client variables.
9. Check database schema/migrations:
   - Explain in simple student-friendly language that migrations are SQL files that create/update database tables.
   - Explain how to find the Supabase project ref: it is the part of `https://PROJECT_REF.supabase.co` before `.supabase.co`.
   - If the app reads tables from Supabase, verify those tables exist in the target Supabase project.
   - Search `supabase/migrations`, SQL files, Prisma/schema files, Drizzle files, or ORM config.
   - If Supabase errors with `Could not find the table ... in the schema cache`, explain that the SQL migration must be applied to Supabase.
   - If the UI says the table exists but has no rows, add or document seed data for the required table.
   - For quiz/list/data apps, check whether the app needs starter rows and create an idempotent seed migration if appropriate.
   - If Supabase CLI is available, automate migration with `supabase link` and `supabase db push`, or add clear scripts/docs for it.
   - When giving `supabase link`, substitute the real project ref if it can be found from `.env`; otherwise show exactly where the student should paste it.
   - If CLI cannot run because login/database password is missing, provide manual SQL Editor steps.
   - If a required table may be empty, make the UI handle the empty state gracefully.
10. Run the local install/build/test steps needed to verify the fix.
11. If build fails, fix the real cause instead of hiding errors.
12. Commit and push the deployment fix to GitHub if changes are needed.

Important:
- Never commit real `.env`.
- Always commit `.env.example`.
- If creating ready-to-copy env handoff files, name them `VERCEL_ENV_IMPORT.local.env` and `VERCEL_ENV_VALUES.local.md`, keep them local only, and confirm they are ignored by git.
- Do not leak API keys, tokens, database URLs, private keys, service-role keys, or secrets.
- Public frontend variables such as `VITE_*`, `NEXT_PUBLIC_*`, or similar are visible in the browser, so never put private secrets there.
- Supabase anon/public keys may be used in frontend variables; Supabase service role keys must stay backend/server-only.
- Gemini API keys must stay backend/server-only and must not use `VITE_*`.
- Do not require `SUPABASE_SERVICE_ROLE_KEY` unless the project actually needs backend admin privileges.
- Remote font CSS imports can break Lightning CSS/Vite builds; prefer document/head font links when needed.
- App database tables must exist in Supabase before Vercel/local runtime can query them.
- Do not change unrelated app logic unless required for deployment.
- Prefer minimal, correct Vercel config.

Final response should include:
- The exact local folder path that was changed
- The GitHub remote URL and branch
- What type of app this is
- Why Vercel showed 404
- What files/settings were changed
- Required Vercel environment variables
- For each env var: what value should go there and where to find it, without revealing the actual secret value in chat
- For Supabase env vars: clearly say whether it needs the project URL, anon/public key, project ID, or service role secret key
- Whether service role is actually required, and why
- Any CSS/font import fixes made for Vite/Vercel
- Whether database migrations were applied or what exact command/manual SQL step is needed
- If `.env` exists: confirm `VERCEL_ENV_IMPORT.local.env` was created for Vercel import/paste and is ignored by git
- If `.env` exists: confirm `VERCEL_ENV_VALUES.local.md` was created with instructions and is ignored by git
- Exact Vercel settings to use
- Confirmation that `.env` is ignored and `.env.example` is committed
- Whether it is ready to redeploy
```
