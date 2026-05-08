# TestiJobtracker

TestiJobtracker is a small single-page job tracking and CV helper app built with React + Vite.

## Features
- Job listing and job cards UI
- CV analysis helper (requires GROQ API key)
- Authentication and profiles (optional Supabase integration)
- Leaderboard and analytics pages

## Tech stack
- Vite
- React
- Supabase (optional, for auth and profiles)
- Groq (optional, for CV analysis)

## Prerequisites
- Node.js 18+ and npm
- A GitHub repository for deployment (if using GitHub Pages)

## Quick start
1. Install dependencies

```bash
npm install
```

2. Run the dev server

```bash
npm run dev
```

3. Build for production

```bash
npm run build
```

4. Preview the production build locally

```bash
npm run preview
```

## Environment variables
Create a `.env` or `.env.local` file at the project root and set any of the following variables as needed. Features that require these variables will be disabled or show warnings if values are missing.

- `VITE_SUPABASE_URL` — your Supabase project URL (optional)
- `VITE_SUPABASE_ANON_KEY` — Supabase anon/public key (optional)
- `VITE_LOCAL_EMAIL_DOMAIN` — optional domain used for synthesized local emails (default: `example.com`)
- `VITE_GROQ_API_KEY` — API key for Groq-powered CV analysis (optional)

Notes:
- If `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are not provided, authentication-related features will be unavailable but the UI will still run.
- If `VITE_GROQ_API_KEY` is not provided or invalid, the CV analysis features will throw an error when used.

## Project structure (high level)

- `src/` – React source files and components
- `src/utils/` – helper clients (Supabase and Groq) and utilities
- `public/` – static assets
- `vite.config.js` – Vite configuration (see `base` setting for Pages)

## Troubleshooting
- If authentication fails, verify your Supabase environment variables and console settings.
- If CV analysis fails, confirm `VITE_GROQ_API_KEY` is set and valid.
- If pages are 404 on GitHub Pages, check the `base` in `vite.config.js` matches the repository name and that the `gh-pages` branch was published successfully.

## Contributing
Contributions welcome — open issues or PRs with fixes and improvements.

# React + Vite

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a local environment file from the template:

```bash
copy .env.example .env.local
```

3. Open `.env.local` and set real values for:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_GROQ_API_KEY`

4. Start development server:

```bash
npm run dev
```

If Supabase is not configured, the app will throw:
"Supabase is not configured. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."

Use your Supabase project URL (for example `https://YOUR_PROJECT_REF.supabase.co`) and anon public key from the Supabase dashboard.
