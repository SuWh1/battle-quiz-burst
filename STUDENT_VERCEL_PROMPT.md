# Student Codex prompt for Vercel deployment

Copy and paste this into Codex inside each student project.

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
1. Inspect the project structure, package.json, framework config, routes, API/server files, and any existing vercel.json.
2. Determine the app type:
   - Static frontend app
   - Vite/React SPA
   - Next.js app
   - TanStack Start / Nitro SSR app
   - Express/custom backend
   - Full-stack app with separate frontend/backend
3. Fix the Vercel deployment setup:
   - Correct Root Directory
   - Correct Install Command
   - Correct Build Command
   - Correct Output Directory
   - Correct framework preset
   - Add or fix vercel.json only if needed
4. Fix routing:
   - For SPA apps, ensure page refreshes/deep links work.
   - For backend/server apps, ensure API/server routes are deployed correctly.
5. Check environment variables:
   - Find all required env vars in the code.
   - Compare required env vars with `.env`, `.env.local`, `.env.example`, README, and deployment docs if present.
   - Add `.env` and `.env.*` to `.gitignore`.
   - Keep `.env.example` allowed in git.
   - Create or update `.env.example` with variable names only, no real values.
   - If `.env` is already tracked by git, remove it from git tracking without deleting the local file.
   - List exactly what must be added in Vercel Project Settings → Environment Variables.
   - For each Vercel env var, say where the student should get the value, for example Supabase project settings, Firebase console, Clerk dashboard, Stripe dashboard, backend URL, or local `.env`.
   - Do not print, expose, or commit real secret values.
6. Run the local install/build/test steps needed to verify the fix.
7. If build fails, fix the real cause instead of hiding errors.
8. Commit and push the deployment fix to GitHub if changes are needed.

Important:
- Never commit real `.env`.
- Always commit `.env.example`.
- Do not leak API keys, tokens, database URLs, private keys, service-role keys, or secrets.
- Public frontend variables such as `VITE_*`, `NEXT_PUBLIC_*`, or similar are visible in the browser, so never put private secrets there.
- Do not change unrelated app logic unless required for deployment.
- Prefer minimal, correct Vercel config.

Final response should include:
- What type of app this is
- Why Vercel showed 404
- What files/settings were changed
- Required Vercel environment variables
- For each env var: what value should go there and where to find it, without revealing the actual secret value
- Exact Vercel settings to use
- Confirmation that `.env` is ignored and `.env.example` is committed
- Whether it is ready to redeploy
```
