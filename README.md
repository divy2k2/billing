# Cashflow Pilot

A complete starter for a money incoming and outgoing web app using:

- Next.js App Router
- Vercel deployment and serverless API routes
- Supabase Postgres
- Custom domain support through Vercel
- Single admin account access

## Features

- Custom email-only login for one admin email
- Private admin-only dashboard
- Income and expense tracking
- Category management
- Monthly cashflow overview
- Category breakdown
- Vercel-ready API routes inside `app/api`

## Local setup

1. Install dependencies:

```bash
nvm use
npm install
```

2. Copy env variables:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your real Supabase project values.

If you prefer, `.env` also works locally.

3. Create a Supabase project and add:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_ADMIN_EMAIL`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `SUPABASE_SERVICE_ROLE_KEY`

4. In Supabase SQL editor, run [schema.sql](/home/wedo-dev-01/Documents/billing/supabase/schema.sql)

5. In Supabase Authentication:

- Keep one user with the same email value as `ADMIN_EMAIL`
- The app uses its own admin session cookie for login
- The `SUPABASE_SERVICE_ROLE_KEY` is used server-side to load and save the single private workspace

6. Start locally:

```bash
npm run dev
```

## Deploy to Vercel

1. Push this project to GitHub.
2. Import the repo into Vercel.
3. Set the Vercel Node.js version to `20`.
4. Add the same environment variables in Vercel project settings.
   Required values:
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_ADMIN_EMAIL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `SUPABASE_SERVICE_ROLE_KEY`
5. Deploy.
6. After deploy, connect your custom domain in Vercel project settings.

## Suggested production flow

- Use Vercel for hosting and custom domain
- Use Supabase for auth and database
- Keep one admin email only, and do not create additional business users
- No Supabase Authentication user is required anymore for app login
- Use Vercel cron later if you want monthly email reports or recurring reminders
- Add export, recurring entries, attachments, and team accounts as future upgrades
# tracker
# billing
# billing
