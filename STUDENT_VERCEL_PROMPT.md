# Master student Codex prompt: deploy project to Vercel

Copy everything inside the text block below and paste it into Codex inside the student project.

This prompt tells Codex to:

- verify the correct local repo;
- protect `.env` and secrets;
- detect the app/framework;
- fix Vercel settings;
- check Supabase env variables;
- run Supabase migrations automatically when possible;
- build locally;
- commit and push safe deployment fixes.

```text
You are helping a beginner student prepare this project for Vercel deployment.

The student may not know Git, Vercel, Supabase, env files, or database migrations.
Work carefully, explain simply, and do not say “done” until the project is actually verified.

Goal:
- Make the app run locally.
- Make the app build successfully.
- Make the app deploy correctly on Vercel.
- Fix current or possible Vercel errors such as:
  404: NOT_FOUND
  Code: NOT_FOUND
- Verify Supabase environment variables and database migrations.
- Commit and push safe code changes if changes are needed.

Important safety rules:
- Never commit `.env`, `.env.local`, `.env.*`, API keys, tokens, passwords, private keys, Supabase service-role keys, or real secrets.
- Never print real secret values in chat or final response.
- `.env.example` is allowed in git, but it must contain variable names only, not real values.
- Public frontend variables such as `VITE_*`, `NEXT_PUBLIC_*`, or similar are visible in the browser.
- Never put `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`, Stripe secret keys, Clerk secret keys, or private backend secrets in frontend/public variables.
- Supabase anon/public keys may be used in frontend variables.
- Supabase service-role keys are backend/server-only.
- Gemini API keys are backend/server-only.
- For Gemini student projects, use `GEMINI_MODEL=gemini-2.5-flash-lite` by default unless the user explicitly asks for another model.

Step 1 — Verify the correct local project folder:
1. Print:
   - current folder path
   - git remote URL
   - current branch
   - git status
2. Check whether there are duplicate local clones of the same GitHub repo.
3. If the VS Code folder and the git repo folder are different, stop and explain the mismatch before editing files.
4. Do not edit a duplicate/old clone unless the student confirms it is the correct folder.

Step 2 — Create persistent project rules:
1. Create or update `AGENTS.md` in the project root.
2. Add project rules for:
   - `.env` safety
   - secrets safety
   - package manager choice
   - Vercel build/output rules
   - Supabase URL/project ref rules
   - Supabase migration rules
   - Gemini model/key rules if Gemini is used
   - “Before deploy” checklist
3. Do not put real secrets in `AGENTS.md`.
4. Future Codex runs must be able to read `AGENTS.md` and remember these rules.

Step 3 — Inspect the project:
Check:
- folder structure
- `package.json`
- lockfiles: `package-lock.json`, `bun.lock`, `pnpm-lock.yaml`, `yarn.lock`
- framework config files
- routes/pages
- API/server files
- Supabase files
- migrations
- `.env`, `.env.local`, `.env.example`
- `.gitignore`
- `vercel.json`
- README/deployment docs

Determine the app type:
- Static frontend
- Vite/React SPA
- Next.js
- TanStack Start / Nitro SSR
- Express/custom backend
- Full-stack frontend + backend
- Other framework

Step 4 — Fix Vercel deployment settings:
Decide and document:
- Root Directory
- Framework Preset
- Install Command
- Build Command
- Output Directory
- whether `vercel.json` is needed

Rules:
- Prefer minimal correct Vercel config.
- If the project is a TanStack Start / Nitro SSR app, the build must create `.vercel/output`.
- If Vercel logs show only `dist/` for a TanStack/Nitro SSR app and the site returns `404: NOT_FOUND`, fix the package manager/build settings.
- If local works with npm but Vercel uses Bun/pnpm/yarn incorrectly, add or fix `vercel.json` with explicit commands.
- Do not hide build errors. Fix the real cause.

Step 5 — Fix routing:
- For SPA apps, make refresh/deep links work.
- For backend/server apps, make API/server routes deploy correctly.
- For full-stack apps, verify frontend routes and backend routes separately.

Step 6 — Check env variables:
1. Search the code for env usage:
   - `process.env`
   - `import.meta.env`
   - `SUPABASE`
   - `VITE_`
   - `NEXT_PUBLIC_`
   - `GEMINI`
   - provider-specific names such as Firebase, Clerk, Stripe, OpenAI, etc.
2. Compare required env vars with:
   - `.env`
   - `.env.local`
   - `.env.example`
   - README/deployment docs
3. Add `.env` and `.env.*` to `.gitignore`.
4. Keep `.env.example` allowed in git.
5. Create or update `.env.example` with variable names only.
6. If `.env` is already tracked by git, remove it from git tracking without deleting the local file.

Supabase env rules:
- `SUPABASE_URL`: base project URL, for example `https://PROJECT_REF.supabase.co`
- Never use `/rest/v1` in `SUPABASE_URL`.
- `SUPABASE_ANON_KEY` or `SUPABASE_PUBLISHABLE_KEY`: anon/public key.
- `VITE_SUPABASE_URL`: same base project URL, exposed to browser.
- `VITE_SUPABASE_ANON_KEY` or `VITE_SUPABASE_PUBLISHABLE_KEY`: same anon/public key, exposed to browser.
- `VITE_SUPABASE_PROJECT_ID`: project ref only.
- `SUPABASE_SERVICE_ROLE_KEY`: service-role secret key, backend/server-only, never `VITE_*`.

How to find Supabase project ref:
- If Supabase URL is `https://abcxyz.supabase.co`, project ref is `abcxyz`.
- It is the part between `https://` and `.supabase.co`.

AI env rules:
- `GEMINI_API_KEY`: backend/server-only secret.
- `GEMINI_MODEL`: use `gemini-2.5-flash-lite` for student projects by default.

Vercel env handoff:
- If `.env` exists locally, create `VERCEL_ENV_IMPORT.local.env` using the local `.env` values as `KEY=VALUE` lines.
- Create `VERCEL_ENV_VALUES.local.md` explaining each env var in simple words and which Vercel environments need it: Production, Preview, Development.
- Make sure both files are ignored by git.
- Do not print real values in chat/final response.
- In final response, list variable names and where students find values, but not actual secret values.

Step 7 — Настрой простую регистрацию без подтверждения email:
Если проект использует Supabase Auth и нужна обычная регистрация по email/password без письма подтверждения:
1. Проверь, есть ли в приложении регистрация через `supabase.auth.signUp`.
2. Если формы регистрации нет, добавь простую форму:
   - email
   - password
   - кнопка “Зарегистрироваться”
   - кнопка “Войти”
   - кнопка “Войти через Google”, если нужен Google OAuth
   - кнопка “Выйти”, если пользователь уже вошёл
3. Для Google OAuth используй `supabase.auth.signInWithOAuth({ provider: "google" })`.
4. Для обычной регистрации используй `supabase.auth.signUp({ email, password })`.
5. Для входа используй `supabase.auth.signInWithPassword({ email, password })`.
6. Для выхода используй `supabase.auth.signOut()`.
7. Не добавляй свою систему паролей и не сохраняй пароли в базу вручную. Supabase Auth делает это сам.
8. Email confirmation нельзя полностью отключить кодом приложения. Это настройка Supabase Dashboard.
9. Напиши студенту точные шаги:
   - Open Supabase Dashboard.
   - Go to Authentication → Providers → Email.
   - Turn OFF `Confirm email`.
   - Save.
10. После этого новые пользователи смогут регистрироваться и сразу входить без письма подтверждения.
11. Если Google login нужен, также напиши шаги:
   - Authentication → Providers → Google.
   - Enable Google.
   - Add Google Client ID.
   - Add Google Client Secret.
   - In Google Cloud Console, add Supabase callback URL as authorized redirect URI.
12. В Supabase Authentication → URL Configuration добавь:
   - local dev URL, for example `http://localhost:5173` or the actual dev URL
   - Vercel production URL
   - Vercel preview URL pattern if needed

Step 8 — Check Supabase service-role usage:
Search for:
- `SUPABASE_SERVICE_ROLE_KEY`
- `service_role`
- `supabaseAdmin`
- server Supabase clients

Decide:
- If the app only reads public data protected by SELECT/RLS policies, use anon/public key and do not require service role.
- If the app writes AI-generated/user-generated data from a server function, performs admin actions, or bypasses RLS, require `SUPABASE_SERVICE_ROLE_KEY`.
- Never put service role in frontend code or `VITE_*`.

Step 9 — Check and run Supabase migrations automatically:
Explain simply:
- A migration is a SQL file that creates or updates database tables.
- The app can fail even if the code is correct when migrations are not applied.

Check:
- Does the project use Supabase?
- Is there a `supabase/migrations` folder?
- Are there SQL files?
- Does the app query tables/columns that may not exist yet?
- Are there seed files or starter data?

Common errors and meaning:
- `Could not find the table ... in the schema cache`: table migration was not applied.
- `column ... does not exist`: column migration was not applied.
- `table exists but has no rows`: seed data is missing or no data has been added.

Automatic migration workflow:
1. If Supabase CLI can run, use `npx supabase`.
2. If not logged in, run:
   `npx supabase login`
3. Find the project ref from `.env` if possible.
4. Link the project:
   `npx supabase link --project-ref PROJECT_REF`
5. Preview migrations:
   `npx supabase db push --linked --dry-run`
6. If dry-run shows pending migrations, apply them:
   `npx supabase db push --linked`
7. If the CLI asks for the database password and it is not available, stop and tell the student exactly where to find it:
   Supabase Dashboard → Project Settings → Database → Database password / Connection settings.
8. If automatic migration is blocked, provide manual SQL Editor steps:
   - Open Supabase dashboard.
   - Open the correct project.
   - Go to SQL Editor.
   - Run SQL files from `supabase/migrations` in filename order.
   - Run seed SQL files if the app needs starter data.

After migrations:
- Re-run the local app/build check.
- Verify the old missing-table/missing-column error is gone.
- If table exists but has no rows, add seed migration or document exactly what data must be inserted.

Step 10 — Check common Vite/Vercel build issues:
- If CSS has remote `@import url("https://...")` font imports and Lightning CSS fails with:
  `@import rules must precede all rules`
  move imports to the top or move external font links into HTML/document head.
- Do not disable the Vite overlay to hide errors.
- Fix the actual CSS/import order.

Step 11 — Run verification commands:
Run the correct commands for this project, usually:
- install command, for example `npm install`
- build command, for example `npm run build`
- tests/lint only if configured and practical

If build fails:
- Read the error.
- Fix the root cause.
- Re-run build.
- Do not hide errors.

Step 12 — Commit and push safe changes:
Before committing:
1. Run `git status`.
2. Confirm `.env` and local secret handoff files are not staged.
3. Confirm `.env.example`, docs, config, migrations, and code fixes are safe to commit.

Then:
- commit with a clear message
- push to the current branch

Do not commit if secrets are staged.

Step 13 — Final response format:
In the final response, include:
- exact local folder path changed
- GitHub remote URL and branch
- app type/framework
- why Vercel showed `404: NOT_FOUND` or what issue was found
- files/settings changed
- whether `AGENTS.md` was created/updated
- required Vercel env variable names
- for each env var: what value type goes there and where to find it, without revealing actual values
- for Supabase vars: say project URL, anon/public key, project ID, or service-role secret key
- whether service role is required and why
- whether basic email/password registration was added
- whether Google login was added
- whether Supabase `Confirm email` must be turned off manually and exact dashboard path
- whether Supabase migrations were applied automatically
- if migrations were not applied, exact command/manual SQL steps needed
- whether seed data is needed
- exact Vercel settings to use
- confirmation `.env` is ignored
- confirmation `.env.example` is committed
- confirmation local secret handoff files are ignored if created
- build/test result
- commit hash if committed
- whether the project is ready to redeploy

Remember:
- Be beginner-friendly.
- Be specific.
- Prefer fixing the real cause over quick hacks.
- Do not leak secrets.
- Do not stop before Supabase, build, and Vercel setup are verified or clearly blocked with exact next steps.
```
