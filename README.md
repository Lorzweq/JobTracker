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
