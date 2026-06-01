# weincard-public-web — Context & Tech Stack

## Purpose

Browser-based copy of the Flutter mobile app. Customer-facing. Users can browse restaurants, manage their membership card, redeem offers, view favorites, and check savings. Also serves the marketing/landing pages (`/`, `/planes`, `/registro`, etc.).

This project is the long-term replacement for the `landing/` repo. Both coexist during the transition — `landing/` still serves some routes.

For system context, API endpoints, and backend migration status, see:
- `@../CLAUDE.md` — system overview
- `@../context/api-endpoints.md` — all API contracts
- `@../context/migration.md` — backend migration status

---

## Tech Stack

| Layer        | Choice                          | Version |
| ------------ | ------------------------------- | ------- |
| Framework    | React                           | 19      |
| Language     | TypeScript                      | ~       |
| Build tool   | Vite                            | ~       |
| UI library   | Mantine                         | 9       |
| Icons        | Lucide React                    | ~       |
| Routing      | React Router DOM                | 7       |
| Server state | TanStack Query (React Query)    | 5       |
| Forms        | React Hook Form + Zod           | ~       |
| HTTP client  | Axios (two instances)           | ~       |
| Toasts       | Sonner                          | ~       |
| SEO          | react-helmet-async              | ~       |
| Analytics    | @vercel/analytics               | ~       |
| Deploy       | Vercel                          | —       |

---

## Project Structure

```
src/
├── api/
│   ├── client.ts        # apiClient (VITE_API_BASE_URL) — primary client, most endpoints
│   ├── honoClient.ts    # honoClient (VITE_HONO_API_BASE_URL) — for newer hono-only endpoints
│   ├── auth.ts          # OTP login, getMe
│   ├── branches.ts      # Branch filter, branch detail, categories
│   ├── favorites.ts
│   ├── memberships.ts   # Plan list, session create, cancel, by-user
│   ├── redemptions.ts   # Generate/verify codes, redemption history
│   ├── reviews.ts
│   └── users.ts         # User update, GET /users/status (uses honoClient)
├── context/
│   └── AuthContext.tsx  # Auth state, membership info, coupon redemption info
├── components/
│   ├── auth/            # RequireAuth guard
│   └── layout/          # AppLayout (app shell with bottom nav)
├── hooks/               # TanStack Query wrappers
│   ├── useBranches.ts
│   ├── useCategories.ts
│   ├── useFavorites.ts
│   ├── useMembership.ts
│   ├── useRedemptions.ts
│   └── useReviews.ts
├── pages/
│   ├── auth/            # Login, Verificacion flows
│   ├── catalog/         # Catalog/explore components
│   ├── explore/         # Explore page components
│   ├── home/            # Home page components
│   ├── layout/          # Layout components
│   ├── membership/      # Membership page components
│   ├── verificacion/    # OTP verification
│   ├── app/             # Protected app pages (below)
│   │   ├── MembershipCardPage.tsx
│   │   ├── ExplorePage.tsx
│   │   ├── BranchDetailPage.tsx
│   │   ├── SavingsPage.tsx
│   │   ├── FavoritesPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── MembershipManagementPage.tsx
│   │   └── RedeemPage.tsx
│   ├── legal/           # Política de privacidad, cookies, términos
│   ├── CatalogoPage.tsx
│   ├── DeleteAccountPage.tsx
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── NotFoundPage.tsx
│   ├── PlanesPage.tsx
│   └── RegistroPage.tsx
├── router/
│   └── index.tsx        # createBrowserRouter with public + protected routes
├── lib/
│   ├── palette.ts       # Brand color constants
│   ├── platform.ts      # Platform detection helpers
│   └── theme.ts         # Mantine theme config
├── styles/
│   └── globals.css
└── types/
    └── index.ts         # All TypeScript interfaces
```

---

## Routing

| Path | Page | Auth required |
|---|---|---|
| `/` | Home / landing | No |
| `/planes` | Membership plans | No |
| `/registro` | Registration | No |
| `/catalogo` | Restaurant catalog | No |
| `/verificacion` | OTP verification | No |
| `/login` | Login | No |
| `/delete-account` | Account deletion | No |
| `/politica-de-privacidad` | Privacy policy | No |
| `/politica-de-cookies` | Cookie policy | No |
| `/terminos-y-condiciones` | Terms | No |
| `/app` | → redirects to `/app/card` | Yes |
| `/app/card` | Membership card | Yes |
| `/app/explore` | Restaurant explorer | Yes |
| `/app/explore/:branchId` | Branch detail | Yes |
| `/app/savings` | Savings history | Yes |
| `/app/favorites` | Favorites | Yes |
| `/app/profile` | Profile & settings | Yes |
| `/app/membership` | Membership management | Yes |
| `/app/redeem/:offerId` | Offer redemption flow | Yes |

Protected routes are wrapped in `<RequireAuth>` which checks `localStorage` for `wc_access_token`.

---

## API Clients

The app has two Axios instances, both auto-inject the JWT from `localStorage` (`wc_access_token`):

| Client | Env var | Used for |
|---|---|---|
| `apiClient` (`src/api/client.ts`) | `VITE_API_BASE_URL` | Most endpoints — auth, branches, categories, memberships, redemptions, favorites, reviews |
| `honoClient` (`src/api/honoClient.ts`) | `VITE_HONO_API_BASE_URL` | Newer hono-only endpoints (e.g. `GET /users/status`) |

Both clients redirect to `/login` on 401.

---

## Auth Flow

1. User enters phone → `POST /auth/request-otp` → OTP sent via WhatsApp + SMS
2. User enters 6-digit code → `POST /auth/verify-otp` → `{ accessToken }`
3. Store `accessToken` in `localStorage` as `wc_access_token`
4. All subsequent API calls: `Authorization: Bearer <accessToken>`
5. On app load: `GET /auth/me` to restore user identity, `GET /users/status` for membership

**AuthContext** provides: `user`, `membership`, `couponRedemption`, `isLoggedIn`, `hasMembership`, `activePlanKey`, `membershipName`, `membershipActiveUntil`, `login()`, `logout()`, `refreshUser()`, `refreshMembership()`.

---

## Membership status

Uses `GET /users/status` (hono-lambdas) which returns `{ userInfo, membership, couponRedemption }`.

`membership.status` values: `active`, `canceled`, `pending_cancel`, `trialing`, `ended`, `pastDue`, `unpaid`, `paused`, `incomplete`.

`hasMembership` (in AuthContext) is true when status is `active`, `pending_cancel`, or `trialing`.

---

## Key Data Types (src/types/index.ts)

- **AuthUser** — `{ id, name, lastname?, email?, phone, role?, isVerified? }`
- **MembershipInfo** — from `/users/status`; includes `status`, `membershipPlanDuration`, `paymentMethod`
- **CouponRedemptionInfo** — coupon trial details including `trialUsageCount`, `renewalCount`, `usesLeft`
- **Branch** — location with geo, images, offers array, contact info, WhatsApp config
- **Offer** — discount with `offerType`, `validDays`, `validFrom`/`validTo`
- **MembershipPlan** — subscription tier with `duration` and `price`

---

## Environment Variables

| Variable | Purpose |
|---|---|
| `VITE_API_BASE_URL` | Primary backend URL (hono-lambdas or legacy, configurable) |
| `VITE_HONO_API_BASE_URL` | hono-lambdas URL for newer endpoints (default: `https://i44j0udx07.execute-api.us-east-2.amazonaws.com`) |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps (branch location / explore map) |
