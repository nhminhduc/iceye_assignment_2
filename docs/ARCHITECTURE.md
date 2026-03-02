# Architecture Documentation

## Feature-Sliced Design Layer Diagram

```
┌─────────────────────────────────────────────────────────────┐
│  app/          Bootstrap, providers, router guards, CSS     │
├─────────────────────────────────────────────────────────────┤
│  pages/        Thin route wrappers — no business logic      │
├─────────────────────────────────────────────────────────────┤
│  widgets/      Self-contained UI blocks (Header, Sidebar,   │
│                AcquisitionsPanel)                           │
├─────────────────────────────────────────────────────────────┤
│  features/     User interactions (auth, acquisitions,       │
│                profile) — each contains API, store, UI      │
├─────────────────────────────────────────────────────────────┤
│  entities/     Pure business types + thin API wrappers      │
│                (user, acquisition)                          │
├─────────────────────────────────────────────────────────────┤
│  shared/       Cross-cutting utilities: api client,         │
│                shadcn/ui components, lib/cn utility         │
└─────────────────────────────────────────────────────────────┘
```

**Dependency rule:** layers may only import from layers below them. `features` can import `entities` and `shared`. `widgets` can import `features`. `pages` can import `widgets`. `app` can import everything.

---

## ADR-001: UI Library — shadcn/ui vs Ant Design vs MUI

| Criterion | shadcn/ui + Radix UI | Ant Design 5 | Material UI v6 |
|---|---|---|---|
| Bundle size | ~12 kB (tree-shaken, only what you use) | ~1.5 MB (large peer deps) | ~300 kB |
| Customisation | Full — copy-paste source ownership | Theme tokens only | Theme tokens + `sx` prop |
| Accessibility | Radix UI primitives (WCAG AA) | Good but opinionated | Good |
| Design language | Neutral / composable | Ant Design system | Material Design |
| Tailwind integration | First-class | Needs workarounds | Needs workarounds |
| Learning curve | Low (standard React) | Medium (AntD patterns) | Medium |

**Decision:** shadcn/ui. Assignment recommends it, and it integrates naturally with Tailwind CSS v4 via CSS variables. Components are owned in-repo — no runtime dependency on the library itself.

---

## ADR-002: Client State — Zustand vs Jotai vs Redux Toolkit

| Criterion | Zustand | Jotai | Redux Toolkit |
|---|---|---|---|
| API simplicity | Very simple — single `create()` call | Atom-based, requires bridge for React Query | Boilerplate despite improvements |
| DevTools | Redux DevTools compat via middleware | Jotai DevTools (separate package) | Built-in Redux DevTools |
| Persist middleware | Built-in | `atomWithStorage` built-in | Manual or redux-persist |
| React Query bridge | Not needed (separate concerns) | `jotai-tanstack-query` extra package | Not needed |
| Bundle size | ~1 kB | ~3 kB | ~11 kB |

**Decision:** Zustand for client state (auth session), TanStack Query standalone for server state. Cleanest separation, smallest total bundle, easiest DevTools.

---

## ADR-003: Routing — React Router v7 vs TanStack Router

| Criterion | React Router v7 | TanStack Router |
|---|---|---|
| Ecosystem familiarity | Industry standard | Growing but newer |
| Type safety | Good with loader types | Excellent (file-based, fully typed) |
| FSD alignment | Manual route config aligns with FSD pages | File-based convention may conflict |
| Data loading | Loader API (framework mode) | Built-in loader + search params |
| Bundle size | ~15 kB | ~20 kB |
| Setup complexity | Low | Medium (codegen for route tree) |

**Decision:** React Router v7 in library mode. Simpler setup, wider team familiarity, and route config nests naturally inside the FSD pages layer without codegen.

---

## ADR-004: Architecture — Feature-Sliced Design vs Traditional Layered

| Criterion | Feature-Sliced Design | Traditional (pages/components/hooks/store) |
|---|---|---|
| Import direction | Enforced by layer rules | Convention only |
| Feature isolation | High — each feature is self-contained | Low — features spread across all folders |
| Scalability | Scales to large teams (each feature is a mini-module) | Becomes tangled as features grow |
| Discovery | Intuitive — find feature, find everything | Hunt across folders |
| Overhead for small apps | Slight | None |

**Decision:** FSD. Assignment recommends it, and even for a small app it demonstrates the pattern clearly and enforces good habits.

---

## ADR-005: Authentication & Authorization Design

### JWT Bearer Token Flow

```
User          LoginForm          authApi            LARVIS Backend
 │                │                  │                    │
 │  submit form   │                  │                    │
 │──────────────▶│                  │                    │
 │                │  POST /token     │                    │
 │                │─────────────────▶│                    │
 │                │  { user_id, pw } │                    │
 │                │                  │─── POST /token ───▶│
 │                │                  │◀── { access: JWT } ─│
 │                │◀────────────────│                    │
 │                │  store token     │                    │
 │                │  (Zustand+persist)                   │
 │◀──────────────│                  │                    │
 │  navigate /dashboard             │                    │
```

### Authenticated Request Flow

```
Component     TanStack Query     apiClient (Axios)     LARVIS Backend
    │               │                   │                    │
    │  useQuery()   │                   │                    │
    │──────────────▶│                   │                    │
    │               │  GET /acquisitions│                    │
    │               │──────────────────▶│                    │
    │               │                   │ interceptor reads  │
    │               │                   │ token from Zustand │
    │               │                   │─ Authorization: ──▶│
    │               │                   │  Bearer <token>    │
    │               │                   │◀─── JSON data ────│
    │               │◀─────────────────│                    │
    │◀─────────────│                   │                    │
```

### Logout Flow

```
User          Header.tsx         authStore          React Router
 │                │                  │                   │
 │  click logout  │                  │                   │
 │──────────────▶│                  │                   │
 │                │  logout()        │                   │
 │                │─────────────────▶│                   │
 │                │  clear token     │                   │
 │                │  clear userId    │                   │
 │                │  (localStorage   │                   │
 │                │   cleared by     │                   │
 │                │   Zustand persist│                   │
 │                │◀─────────────────│                   │
 │                │  navigate /login │                   │
 │                │─────────────────────────────────────▶│
 │                │  AuthGuard detects no token          │
 │                │  redirects to /login                 │
```

### Token Storage Comparison

| Storage | XSS Risk | CSRF Risk | Persistence | Accessible to JS |
|---|---|---|---|---|
| `localStorage` (chosen) | Medium (token exposed to XSS scripts) | None (not sent automatically) | Survives tab close | Yes |
| `sessionStorage` | Medium | None | Lost on tab close | Yes |
| `HttpOnly Cookie` | None (JS cannot read) | Medium (sent automatically) | Configurable | No |
| In-memory (module var) | None | None | Lost on refresh | Yes |

**Choice: localStorage via Zustand persist.**

Rationale: The LARVIS backend does not support `HttpOnly` cookies or CSRF tokens, making cookie-based storage impractical without backend changes. localStorage is the pragmatic choice for this API. Mitigation: avoid `dangerouslySetInnerHTML`, apply strict CSP headers in production.

### Authorization Scopes

The backend enforces that a user may only `POST /users/{id}` for their own `user_id`. The frontend respects this by only ever calling `POST /users/{userId}` where `userId` comes from the auth store (set at login time). There is no admin escalation path in the current backend.

### Route Protection

`<AuthGuard>` reads `token` from Zustand. If falsy, it renders `<Navigate to="/login" replace />`. This is evaluated synchronously from the persisted localStorage snapshot, so there is no flash-of-unauthenticated-content after refresh.

---

## ADR-006: Production Deployment — Docker + PM2

### Decision

Use a multi-stage Docker build with PM2 + `serve` for static file serving.

### Architecture

```
docker-compose.yml
├── backend   (./backend/Dockerfile)
│   └── scratch image with static Go binary → :8080
└── frontend  (./Dockerfile)
    ├── Stage 1: node:22-alpine → npm ci → npm run build
    └── Stage 2: node:22-alpine → pm2 + serve → dist/ on :3000
```

### Rationale

| Option | Pros | Cons |
|---|---|---|
| nginx only | Fast, low memory | No process management, needs separate config |
| PM2 + serve (chosen) | Process management, auto-restart, health monitoring, simple config | Slightly larger image than pure nginx |
| Node.js Express | Full control | Overkill for static files |

PM2 provides process management (auto-restart, monitoring) via `ecosystem.config.cjs`. The `serve` package handles SPA fallback routing natively with the `-s` flag. No reverse proxy is needed since the backend runs as a separate container with its own port.

### Configuration

- `ecosystem.config.cjs` — PM2 process definition (fork mode, port 3000)
- `docker-compose.yml` — orchestrates frontend (port 3000) and backend (port 8080)
- Frontend's Axios client defaults to `http://localhost:8080` (configurable via `VITE_API_URL` at build time)
