# Student setup steps: VS Code, GitHub, Supabase, Vercel

Follow these steps from top to bottom.

## 1. Install apps

Install:

- VS Code: https://code.visualstudio.com/
- Git: https://git-scm.com/downloads
- Node.js LTS: https://nodejs.org/
- GitHub CLI: https://cli.github.com/ — optional, only needed for `gh` commands.

Optional but useful:

- Supabase CLI will run through `npx`, so you do not need to install it globally.

## 2. Open terminal in VS Code

1. Open VS Code.
2. Open your project folder.
3. Open Terminal → New Terminal.

Check tools:

```bash
node -v
npm -v
git --version
gh --version
```

If `gh --version` fails, that is okay. You can still use GitHub in the browser.

## 3. Log in to GitHub

If GitHub CLI is installed, run:

```bash
gh auth login
```

Choose:

- GitHub.com
- HTTPS
- Login with a web browser

Check:

```bash
gh auth status
```

If GitHub CLI is not installed, skip this step and sign in to GitHub in the browser instead.

## 4. Clone or open the project

If the project is already on the computer, open its folder in VS Code.

If you need to clone it:

```bash
git clone YOUR_GITHUB_REPO_URL
cd YOUR_PROJECT_FOLDER
```

Check you are in the right repo:

```bash
pwd
git remote -v
git branch --show-current
git status
```

## 5. Install dependencies

```bash
npm install
```

If the project uses another package manager, Codex may tell you a different command, such as:

```bash
bun install
pnpm install
yarn install
```

## 6. Create `.env`

If `.env.example` exists:

```bash
cp .env.example .env
```

Then open `.env` in VS Code and fill in the real values.

For Supabase, common values are:

```env
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_ANON_KEY=YOUR_ANON_PUBLIC_KEY
SUPABASE_PUBLISHABLE_KEY=YOUR_ANON_PUBLIC_KEY
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_PUBLIC_KEY
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_ANON_PUBLIC_KEY
VITE_SUPABASE_PROJECT_ID=YOUR_PROJECT_REF
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
GEMINI_MODEL=gemini-2.5-flash-lite
```

`YOUR_PROJECT_REF` means the short Supabase project ID from the URL.

Example:

```text
Supabase URL: https://nuvjafpspourscpacapw.supabase.co
Project ref:  nuvjafpspourscpacapw
```

Rule: copy the part between `https://` and `.supabase.co`.

Important:

- Do not use `/rest/v1` in `SUPABASE_URL`.
- Do not commit `.env`.
- Do not put service role keys in `VITE_*`.
- Do not put Gemini API keys in `VITE_*`.
- Only use `SUPABASE_SERVICE_ROLE_KEY` if backend/server admin code really needs it.

## 7. Run locally

```bash
npm run dev
```

Open the local URL shown in terminal, usually:

```text
http://localhost:5173
```

If something fails, copy the error and ask Codex.

## 8. Build locally

Stop the dev server with `Ctrl+C`, then run:

```bash
npm run build
```

If build fails, fix the real error before deploying.

## 9. Set up Supabase database

Some apps need database tables before they work. A migration is just a saved SQL file that creates or updates database tables.

If the app uses Supabase and has a folder named `supabase/migrations`, apply those files to Supabase.

First log in:

```bash
npx supabase login
```

Then link the project:

```bash
npx supabase link --project-ref YOUR_PROJECT_REF
```

Replace `YOUR_PROJECT_REF` with the project ref from the Supabase URL.

Example:

```bash
npx supabase link --project-ref nuvjafpspourscpacapw
```

Preview migrations:

```bash
npx supabase db push --linked --dry-run
```

Apply migrations:

```bash
npx supabase db push --linked
```

If the CLI asks for a database password, get it from Supabase project database settings.

Manual alternative:

1. Open Supabase dashboard.
2. Open your project.
3. Go to SQL Editor.
4. Run every SQL file from `supabase/migrations` in order.

Common database messages:

- `Could not find the table ...`: the table migration was not applied yet.
- `table exists but has no rows`: the table exists, but you need seed data or manually add rows.

## 10. Commit and push code

Check changes:

```bash
git status
```

Add safe files only:

```bash
git add .
```

Make sure `.env` is not included:

```bash
git status
```

Commit:

```bash
git commit -m "Prepare Vercel deployment"
```

Push:

```bash
git push
```

## 11. Deploy on Vercel

1. Open https://vercel.com/new
2. Import the GitHub repo.
3. Choose the correct project/team.
4. Set Root Directory to:

```text
./
```

5. Choose the detected framework, or use the framework Codex recommends.
6. Open Environment Variables.
7. Add all variables from `.env`, but do not include quotes.
8. Make sure AI keys like `GEMINI_API_KEY` are added as normal server variables, not `VITE_*`.

Example:

```env
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PROJECT_ID=YOUR_PROJECT_REF
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
GEMINI_MODEL=gemini-2.5-flash-lite
```

9. Click Deploy.

## 12. If Vercel shows `404: NOT_FOUND`

Check these:

```bash
npm run build
```

Then ask Codex to inspect:

- Vercel Root Directory
- Build Command
- Output Directory
- package manager lockfiles
- `vercel.json`
- Supabase env vars
- missing database tables

For TanStack Start / Nitro apps, Vercel should build `.vercel/output`. If Vercel logs show only `dist/`, the deployment config is wrong.

## 13. Paste the master prompt into Codex

After opening the project in VS Code, paste the master prompt from:

```text
STUDENT_VERCEL_PROMPT.md
```

That prompt tells Codex to verify everything automatically:

- correct local repo
- `.env` safety
- Vercel settings
- Supabase env variables
- Supabase migrations
- local build
- safe commit and push

If Supabase migrations can be run automatically, Codex will run them. If login or database password is missing, Codex will explain exactly what the student must do.
