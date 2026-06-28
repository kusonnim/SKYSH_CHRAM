# Deployment

This project is ready to deploy as a Vercel Next.js app.

## Vercel Project

1. Import the GitHub repository into Vercel.
2. Use the default Next.js framework preset.
3. Keep the default output settings.
4. Add the environment variables listed below.
5. Deploy from the `main` branch after the PR is merged.

## Environment Variables

Set these in Vercel Project Settings > Environment Variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Use the same values as local `.env.local`. Do not commit `.env.local`.

## Supabase Auth URLs

After Vercel creates the production URL, update Supabase Authentication URL settings:

```text
Site URL:
https://your-project.vercel.app

Redirect URL:
https://your-project.vercel.app/auth/callback
```

## Smoke Test

After deployment, verify:

- `/signup`
- `/login`
- `/dashboard`
- `/stage/volume-highest-candle`
- `/profile`

## Local Verification

Before merging a deployment PR, run:

```bash
npm test
npm run build
```
