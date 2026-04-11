# CLAUDE.md — Weincard Dashboard

## What is this project?

Weincard Dashboard is an admin web platform for managing a digital membership program. It allows operators to:

- Manage affiliated merchants (aliados) and their branches
- Create and administer membership plans, coupons, and offers
- Track and audit benefit redemptions in real-time
- Manage user roles and permissions
- View analytics and savings metrics

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) + React 18 + TypeScript 5 |
| Styling | Tailwind CSS 3.4, shadcn/ui (Radix UI), Lucide React |
| Forms | React Hook Form + Zod |
| State | Zustand (global), React state (local) |
| HTTP | Axios with interceptors |
| DI | InversifyJS |
| Charts | Recharts, @tremor/react |
| Maps | @react-google-maps/api |
| Images | Cloudinary, AWS S3 |
| Auth | JWT via HTTP-only cookies |

---

## Project Structure

```
src/
├── app/              # Next.js App Router (auth routes + dashboard routes)
├── components/       # Shared UI components (shadcn/ui base + layout)
├── config/           # Axios setup, API URLs, route constants
├── data/             # Global adapters, error classes, interfaces
├── hooks/            # Global custom hooks (search params, logout, mobile)
├── lib/              # DI container, Google Maps, utils
├── modules/          # Feature modules (domain-organized — see below)
├── types/            # Global TypeScript types
├── utilities/        # Enums and helper functions
├── views/            # Full-page components composed per route
└── middleware.ts     # Auth/authorization guard (runs on every request)
```

### Module structure (per feature)

Every module under `src/modules/` follows Clean Architecture:

```
module/
├── data/
│   ├── repositories/    # API communication (HTTP layer)
│   ├── adapters/        # API response → domain model transformation
│   └── interfaces/      # API response type contracts
├── domain/
│   ├── use-cases/       # Business logic (pure, testable)
│   └── hooks/           # React integration wrapping use-cases
└── components/          # UI components scoped to this feature
```

---

## Architecture Patterns

### Data flow
```
Component → Hook → Use-Case → Repository → Axios → API
                                         ← Adapter ←
```

### Dependency Injection
- InversifyJS container lives in `src/lib/di/container.ts`
- All repositories and use-cases are registered as singletons
- Hooks retrieve use-cases via `container.get(...)` — always register new services here

### Authentication
1. Login hits `/auth/login-by-email` → JWT returned and stored in HTTP-only cookie
2. `middleware.ts` validates the JWT on every request
3. User profile fetched from `/auth/me` and cached in a base64-encoded cookie
4. Role-based route protection enforced in middleware, not in components

### Forms
- React Hook Form for form state
- Zod schemas for validation
- `@hookform/resolvers/zod` for integration

---

## Key Files to Know

| File | Purpose |
|---|---|
| `src/middleware.ts` | Auth gatekeeper — validates JWT, role-based access |
| `src/lib/di/container.ts` | InversifyJS DI registrations |
| `src/config/protocols/http/api_urls.ts` | All API endpoint constants |
| `src/config/protocols/http/axios-http-client.ts` | Axios instance + interceptors |
| `src/config/routes/routes.ts` | App route constants |

---

## Running the Project

```bash
pnpm install          # Install dependencies
pnpm dev              # Dev server at http://localhost:3000
pnpm build            # Production build
pnpm start            # Run production server
pnpm lint             # ESLint check
```

### Required environment variables

Create `.env.local` (never commit secrets):

```
NEXT_PUBLIC_API_URL=<backend API base URL>
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=<Google Maps key>
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<Cloudinary cloud>
NEXT_PUBLIC_CLOUDINARY_API_KEY=<Cloudinary key>
NEXT_PUBLIC_CLOUDINARY_API_SECRET=<Cloudinary secret>
```

---

## Adding a New Feature

1. Create a new folder under `src/modules/<feature>/`
2. Add `data/repositories/`, `data/adapters/`, `data/interfaces/`, `domain/use-cases/`, `domain/hooks/`
3. Register the repository and use-case in `src/lib/di/container.ts`
4. Add the API endpoints to `src/config/protocols/http/api_urls.ts`
5. Build page components in `src/views/<Feature>/`
6. Wire the page into `src/app/dashboard/<feature>/page.tsx`
7. Add route constant to `src/config/routes/routes.ts`

---

## Common Pitfalls

- **Forgetting `container.ts` registration** — DI will fail at runtime with a cryptic error
- **Storing tokens outside HTTP-only cookies** — use cookies, never localStorage
- **Adding image domains** — new image hosts must be added to `next.config.mjs` remotePatterns
- **`NEXT_PUBLIC_*` vars are browser-exposed** — never put secrets in them
- **Mutating state directly** — always use immutable patterns (Zustand setters, spread)
