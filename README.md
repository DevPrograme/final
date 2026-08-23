# knowvault

A Next.js (App Router) rebuild of the knowvault dashboard — a college
knowledge-sharing vault where students preserve and reuse projects, research,
and placement prep. Auth is handled by **Clerk**, UI primitives by
**shadcn/ui** + Tailwind, and the weekly activity chart by **Recharts**.

## Stack

- **Next.js 14** (App Router, Server Components)
- **TypeScript**
- **Tailwind CSS** with a small custom "vault" color palette layered on top
  of the standard shadcn tokens
- **shadcn/ui** primitives, hand-placed in `components/ui`
- **Clerk** for authentication (`@clerk/nextjs`)
- **Recharts** for the "Knowledge pulse" chart
- **lucide-react** for icons

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Clerk app

1. Go to [dashboard.clerk.com](https://dashboard.clerk.com) and create a new
   application (any sign-in methods you like — email, Google, etc.).
2. Copy the **Publishable key** and **Secret key** from *API Keys*.

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Then paste your keys into `.env.local`:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### 4. Run the dev server

```bash
npm run dev
```

Visit `http://localhost:3000` — you'll land on the public marketing page.
Sign up, and you're redirected into `/dashboard`, which is the page cloned
from the reference screenshots.

## Project structure

```
app/
  page.tsx                  Public landing page
  layout.tsx                Root layout: fonts + ClerkProvider
  globals.css               Design tokens (CSS variables) + Tailwind layers
  sign-in/[[...sign-in]]/   Clerk sign-in screen
  sign-up/[[...sign-up]]/   Clerk sign-up screen
  (app)/                    Route group for everything behind auth
    layout.tsx              Sidebar + topbar shell
    dashboard/              Main dashboard (the reference screenshots)
    explore/ projects/ research/
    mentorship/ vault-ai/
    contributions/ saved/ timeline/

components/
  ui/                       Vendored shadcn/ui primitives (button, card,
                             badge, avatar, input, separator, dialog, sheet,
                             skeleton). Safe to extend with `npx shadcn add`.
  shared/                   Your reusable, hand-built components — this is
                             the folder meant to be reused anywhere in the
                             app (and it already is: EffectBanner, StatCard,
                             and ResourceCard are all reused on the landing
                             page too).

lib/
  data.ts                   Mock content for the dashboard/landing page
  nav-config.ts             Sidebar navigation structure
  types.ts                  Shared TypeScript interfaces
  utils.ts                  cn() class merger + small date/number helpers

middleware.ts               Clerk route protection for every (app) route
```

## Swapping in real data

Everything on the dashboard currently comes from `lib/data.ts`
(`statCards`, `resources`, `weeklyPulse`, `effectStats`). To connect a real
backend:

1. Replace the arrays in `lib/data.ts` with fetch calls (e.g. inside
   `app/(app)/dashboard/page.tsx`, which is already a Server Component and
   can `await` a database call directly).
2. `ResourceCard`'s bookmark toggle is local UI state today — wire its
   `onClick` up to a server action or API route to persist saves per user.
3. The stub pages (`explore`, `projects`, `research`, `mentorship`,
   `vault-ai`, `contributions`, `saved`, `timeline`) each render an
   `EmptyState` — swap those out for real listings as those features land.

## Customizing the look

All colors live as HSL CSS variables in `app/globals.css` under `:root`
(`--primary`, `--vault-lime`, `--vault-ink`, the pastel `--vault-rose` /
`--vault-sky` / `--vault-moss` category tints, etc.), and are wired into
Tailwind via `tailwind.config.ts`. Change the variables and the whole app
re-themes — nothing is hard-coded to a hex value in components.

## Deploying

This is a standard Next.js app, so it deploys as-is to Vercel or any Node
host. Just make sure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and
`CLERK_SECRET_KEY` are set as environment variables in your hosting
provider, and add your production domain in the Clerk dashboard.
