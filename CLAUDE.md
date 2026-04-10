# CLAUDE.md — Weincard Landing

## What this project is

Marketing + catalog landing for **Weincard** — a restaurant membership app for Medellín, Colombia. Built with Next.js 16 (App Router), React 19, Tailwind CSS v4, and shadcn/ui components. Deployed on Vercel.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | Tailwind CSS v4, shadcn/ui (Radix primitives) |
| Fonts | Clash Grotesk (local), Inter, Hepta Slab, Playfair Display (Google) |
| Analytics | Vercel Analytics |
| Auth | JWT stored in `localStorage` under key `wc_access_token` |
| Package manager | pnpm (pnpm-lock.yaml present) |

## Routes

| Route | File | Notes |
|---|---|---|
| `/` | `app/page.tsx` | Homepage — server component, fully static |
| `/catalogo` | `app/catalogo/page.tsx` | Restaurant catalog — client component, hits API |
| `/planes` | `app/planes/page.tsx` | Plans/pricing — client component, Stripe checkout |
| `/login` | `app/login/page.tsx` | Login form |
| `/registro` | `app/registro/page.tsx` | Registration |
| `/verificacion` | `app/verificacion/page.tsx` | Phone/email verification |
| `/delete-account` | `app/delete-account/page.tsx` | Account deletion |
| `/politica-de-privacidad` | `app/politica-de-privacidad/page.tsx` | Legal |
| `/politica-de-cookies` | `app/politica-de-cookies/page.tsx` | Legal |
| `/terminos-y-condiciones` | `app/terminos-y-condiciones/page.tsx` | Legal |

## API

Base URL is set in `lib/api.ts`:
```
NEXT_PUBLIC_API_BASE_URL  (env var, falls back to)
https://azucq9v6zc.execute-api.us-east-1.amazonaws.com/prod
```

### Endpoints used

| Method | Path | Used in | Description |
|---|---|---|---|
| POST | `/branches/filter` | `app/catalogo/page.tsx` | Search/list restaurant branches. Body: `{ name?: string }`. Query: `?limit=N&skip=N`. Returns `{ branches, count, nextCursor }`. |
| GET | `/auth/me` | `components/header-auth.tsx`, `app/planes/page.tsx` | Get current user profile. Requires `Authorization: Bearer <token>`. |
| GET | `/memberships/by-user` | `components/header-auth.tsx`, `app/catalogo/page.tsx` (modal), `app/planes/page.tsx` | Get user's memberships. Returns `{ userMemberships: [...] }` or array directly. |
| POST | `/memberships/session/create` | `app/planes/page.tsx` | Create Stripe checkout session. Body: `{ email, membershipPlan: "monthly" | "yearly" }`. Returns `{ url }`. |
| PATCH | `/users/update/:id` | `app/planes/page.tsx` | Save email to user account before checkout. |

### The double request you see in DevTools (`/branches/filter`)

When the browser makes a cross-origin POST with `Content-Type: application/json`, it automatically sends a **CORS preflight OPTIONS request** first, followed by the actual POST. This is completely standard browser behavior — not a bug. The OPTIONS request has no body; the POST carries the JSON payload.

## Auth flow

- Token key: `wc_access_token` in `localStorage`
- `lib/auth.ts` exports `getToken()`, `saveToken()`, `clearAuth()`, `isLoggedIn()`
- Token is a JWT passed as `Authorization: Bearer <token>` header
- `components/header-auth.tsx` fetches `/auth/me` and `/memberships/by-user` on mount to show user state in the nav

## Key components

| Component | File | Notes |
|---|---|---|
| `HeaderAuth` | `components/header-auth.tsx` | Shows login button or user avatar/dropdown. Used in every page header. |
| `BranchCard` | `app/catalogo/page.tsx` | Restaurant card in the grid |
| `BranchModal` | `app/catalogo/page.tsx` | Detail modal for a branch. Checks membership status to decide CTA label. |

## Catalog page (`/catalogo`) — how it works

1. On mount, `fetchBranches("", 0, true)` runs — loads all branches (no filter).
2. User types in search box → `handleInput` debounces 400ms → calls `fetchBranches(val, 0, true)` (replaces results).
3. "Ver más" button → `handleLoadMore` → calls `fetchBranches(query, skip + PAGE_SIZE, false)` (appends results).
4. `PAGE_SIZE = 10`.
5. Clicking a card → opens `BranchModal` which re-checks membership and shows appropriate CTA.

## Plans page (`/planes`) — how it works

1. Loads user + membership on mount.
2. If user has no email → shows inline email capture form before checkout.
3. Calls `/memberships/session/create` → receives Stripe URL → opens in new tab.

## Known bugs / issues

### "Planes" link inconsistency (FIXED)
- `app/catalogo/page.tsx` nav had `href="/#planes"` (scrolls to section on homepage) instead of `href="/planes"` (dedicated page).
- The homepage (`app/page.tsx`) correctly links to `/planes`.
- This caused: first click from catalogo → smoothscroll to `#planes` section; second click (now on homepage) → navigates to `/planes`.
- **Fixed:** changed to `href="/planes"` in catalogo nav.

### Silent fetch failures
- `fetchBranches` in catalogo catches errors and does nothing (`// silent fail`). If the API is down, the UI shows an empty state with no error message.

### Membership check duplication
- `BranchModal` re-fetches `/memberships/by-user` independently from `HeaderAuth`. Two separate fetches on modal open.

### `useSearchParams` in `BranchModal`
- `BranchModal` calls `useSearchParams()` but the parent page (`CatalogoPage`) is not wrapped in `<Suspense>`. This can cause a hydration warning or build error in strict mode.

## Styling conventions

- Colors: `bg-cream` (off-white), `bg-burgundy`, `bg-black`, `text-red-customM` — defined in `app/globals.css` / Tailwind config.
- Fonts: use `font-clash` (Clash Grotesk), `font-hepta-slab` (Hepta Slab) utility classes via CSS variables.
- Animations: `animate-scroll-right` / `animate-scroll-left` (logo carousel on homepage) — defined in globals.css.
- Rounded sections use `rounded-b-[60px]` for curved bottom edges between sections.

## Environment variables

| Variable | Required | Default |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | No | AWS API Gateway URL (hardcoded fallback in `lib/api.ts`) |
