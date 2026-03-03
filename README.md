# LARVIS — Satellite Acquisition Dashboard

A React + TypeScript dashboard for visualizing Martian ore site acquisition data from satellite sweeps. Built as a coding assignment for ICEYE.

## Tech Stack

- **React 19** with TypeScript (strict mode)
- **Vite 7** — dev server & bundler (`@vitejs/plugin-react-swc`)
- **Tailwind CSS v4** — utility-first styling with oklch color system
- **shadcn/ui** — Button, Sidebar, Skeleton, Input, DropdownMenu, and other primitives
- **Recharts** — LineChart (time series with drag-to-zoom) and BarChart (histogram)
- **TanStack React Query v5** — server state management with 5-minute caching
- **TanStack React Virtual v3** — virtualized table rendering for large datasets
- **React Router v7** — client-side routing
- **next-themes** — light / dark / system theme switching
- **Zustand** — lightweight auth state (persisted to localStorage)
- **Axios** — HTTP client with interceptors for auth tokens
- **date-fns** — date formatting (unix timestamps → human-readable)
- **Vitest + Testing Library** — 33 unit tests with jsdom
- **Playwright** — 16 end-to-end tests

## Getting Started

### Docker Compose (recommended)

The easiest way to run both the frontend and backend together:

```bash
docker compose up --build
```

This starts:
- **Frontend** at [http://localhost:3000](http://localhost:3000) — React SPA served via PM2 + `serve`
- **Backend** at [http://localhost:8080](http://localhost:8080) — LARVIS Go binary

To stop:

```bash
docker compose down
```

### Frontend Only (Docker)

```bash
docker build -t larvis-frontend .
docker run -p 3000:3000 larvis-frontend
```

Requires the backend to already be running at `http://localhost:8080`.

### Local Development

#### Prerequisites

- Node.js ≥ 18
- A running LARVIS backend at `http://localhost:8080` (or set `VITE_API_URL`)

#### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Available Scripts

| Script               | Description                              |
| -------------------- | ---------------------------------------- |
| `npm run dev`        | Start Vite dev server with HMR           |
| `npm run build`      | Type-check with `tsc` then build         |
| `npm run preview`    | Preview the production build locally     |
| `npm run lint`       | Run ESLint                               |
| `npm run lint:fix`   | Run ESLint with auto-fix                 |
| `npm run test`       | Run all unit tests once (`vitest run`)   |
| `npm run test:watch` | Run unit tests in watch mode             |
| `npm run test:e2e`   | Run Playwright end-to-end tests          |

## Project Structure

```
├── backend/               # LARVIS Go backend binary + Dockerfile
├── docker-compose.yml     # Orchestrates frontend + backend
├── Dockerfile             # Multi-stage frontend build (Node 22 → PM2 + serve)
├── ecosystem.config.cjs   # PM2 process config for production serve
├── e2e/                   # Playwright end-to-end tests
│   ├── auth.spec.ts       # Login/logout flows (4 tests)
│   ├── dashboard.spec.ts  # Dashboard rendering & interactions (6 tests)
│   ├── navigation.spec.ts # Route navigation & guards (3 tests)
│   ├── profile.spec.ts    # Profile page flows (3 tests)
│   └── fixtures.ts        # Shared test fixtures
├── playwright.config.ts   # Playwright config (Chromium, preview server)
├── docs/
│   ├── ARCHITECTURE.md    # ADRs, FSD layer diagram, auth flows
│   ├── BACKEND_IMPROVEMENTS.md
│   └── ENHANCEMENT_ROADMAP.md
└── src/
    ├── components/
    │   ├── icons.tsx           # Shared icon components
    │   ├── layout/            # DashboardLayout, AppHeader, AppSidebar, AppFooter
    │   │                      # ThemeProvider (next-themes), ThemeToggle, UserMenu
    │   └── ui/                # shadcn/ui primitives (button, sidebar, skeleton, etc.)
    ├── entities/
    │   ├── acquisition/       # Acquisition, AcquisitionDataPoint, DailyAggregation types
    │   └── user/              # User types & API
    ├── features/
    │   ├── acquisitions/      # Core feature module (see below)
    │   ├── auth/              # Login page, auth API, Zustand store, useLogin, useCurrentUser
    │   └── profile/           # Profile form & hook
    ├── hooks/                 # Shared hooks (use-mobile)
    ├── lib/                   # api-client (Axios), utils (cn helper)
    ├── pages/                 # Route-level page components
    │   ├── DashboardPage.tsx        # Orchestrates chart, histogram, table, filters
    │   ├── DashboardSkeleton.tsx    # Skeleton loading state matching dashboard layout
    │   ├── LoginPage.tsx
    │   ├── NotFoundPage.tsx         # 404 page (within authenticated area)
    │   └── ProfilePage.tsx
    ├── router/                # Route guards (AuthGuard, GuestGuard)
    ├── test/                  # Test setup (vitest + testing-library)
    ├── App.tsx                # Root router & route config
    ├── main.tsx               # Entry point (React Query, Router, ThemeProvider)
    └── index.css              # Tailwind imports, oklch theme variables (light + dark)
```

### Acquisitions Feature (`src/features/acquisitions/`)

Organized into sub-modules with barrel exports:

```
acquisitions/
├── acquisitionsApi.ts       # Axios call → GET /acquisitions
├── useAcquisitions.ts       # React Query hook + aggregateByDate (single source of truth)
├── chartTheme.ts            # Shared recharts color tokens (CSS custom properties)
├── index.ts                 # Barrel exports for the entire feature
├── chart/
│   ├── AcquisitionsChart.tsx       # LineChart with drag-to-zoom (ReferenceArea)
│   └── AcquisitionsChart.test.tsx  # 2 tests
├── histogram/
│   ├── AcquisitionsHistogram.tsx   # BarChart with auto-binning
│   ├── buildHistogram.ts          # Pure function — bins DailyAggregation data
│   └── AcquisitionsHistogram.test.tsx  # 5 tests (3 buildHistogram + 2 component)
├── table/
│   ├── AcquisitionsTable.tsx       # Virtualized table with exact datetime display
│   └── AcquisitionsTable.test.tsx  # 4 tests
└── filters/
    ├── AcquisitionFilters.tsx      # Filter UI (date range + sites range)
    ├── useAcquisitionFilters.ts    # URL search-param based filter state
    ├── filterAcquisitions.ts       # Pure function — filters by date & sites range
    └── filterAcquisitions.test.ts  # 11 tests
```

## Docker Architecture

```
docker-compose.yml
├── backend   (./backend/Dockerfile)
│   └── scratch image with static Go binary → :8080
└── frontend  (./Dockerfile)
    ├── Stage 1: node:22-alpine → npm ci → npm run build
    └── Stage 2: node:22-alpine → pm2 + serve → serves dist/ on :3000
```

The frontend Dockerfile uses a multi-stage build:
1. **Build stage**: installs dependencies and runs `tsc -b && vite build`
2. **Production stage**: installs `pm2` and `serve` globally, copies the built `dist/` folder, and runs `pm2-runtime` with the `ecosystem.config.cjs` config to serve static files on port 3000

## Architecture Decisions

### Single Source of Truth

`useAcquisitions` is the single data hook. It returns two derived views from the same React Query cache:

- **`records`** — one entry per raw acquisition, with exact `datetime` (second precision)
- **`daily`** — aggregated by calendar day (summing sites), used by chart & histogram

```
useAcquisitions (React Query + select)
  ├── records: AcquisitionDataPoint[]   ← per-acquisition, with datetime
  └── daily:   DailyAggregation[]       ← per-day sum

DashboardPage
  ├── filteredRecords = filterAcquisitions(records, filters)
  ├── filteredDaily   = aggregateByDate(filteredRecords)
  │
  ├── Chart      ← filteredDaily   (line chart, drag-to-zoom)
  ├── Histogram  ← filteredDaily   (bar chart, auto-binned)
  └── Table      ← filteredRecords (exact datetime per acquisition)
```

### Feature-Sliced Design

The codebase follows a simplified [Feature-Sliced Design](https://feature-sliced.design/) layout:

- **`components/`** — shared layout (Header, Sidebar, ThemeToggle, UserMenu) and shadcn/ui primitives
- **`lib/`** — cross-cutting utilities (Axios API client, `cn` helper)
- **`entities/`** — domain types (`Acquisition`, `AcquisitionDataPoint`, `DailyAggregation`)
- **`features/`** — self-contained feature modules (acquisitions, auth, profile)
- **`pages/`** — thin route components that compose features
- **`router/`** — route guards (`AuthGuard`, `GuestGuard`)

### Three Dashboard Views

All views are rendered simultaneously on the `DashboardPage` (no tabs — all visible at once):

1. **Time Series** — `LineChart` plotting daily detected ore sites. Supports drag-to-zoom which updates URL-param filters.
2. **Distribution** — `BarChart` histogram showing frequency distribution of daily site counts with auto-binning.
3. **Table** — Virtualized scrollable table showing every individual acquisition with **exact datetime** (second precision) via `@tanstack/react-virtual`.

### Theme System

- **next-themes** with `attribute="class"` and `enableSystem` for light/dark/system switching
- CSS custom properties use oklch color space (Tailwind CSS v4 native)
- Professional neutral gray palette with blue primary, 5-color chart series
- Chart tokens in `chartTheme.ts` use `var(--token)` directly (not wrapped in `hsl()`)

### Accessibility

- Skip-to-content link
- Semantic `<main>`, `<section>`, ARIA roles on charts (`role="img"`), table (`role="table"`), and filters (`<fieldset>`/`<legend>`)
- `focus-visible` ring styles on interactive elements
- `prefers-reduced-motion` media query support
- `aria-live` regions for dynamic content updates

### Authentication

- Zustand store persisted to `localStorage` (`larvis-auth` key)
- Axios interceptor attaches `Bearer` token to all API requests
- 401 responses automatically clear auth state and redirect to login

## Testing

### Unit Tests

```bash
npm run test
```

33 tests across 6 files:

| Test File                        | Tests | Description                                                       |
| -------------------------------- | ----- | ----------------------------------------------------------------- |
| `filterAcquisitions.test.ts`     | 11    | Date range, site range, combined filters, edge cases              |
| `AcquisitionsHistogram.test.tsx` | 5     | `buildHistogram` logic + component rendering                      |
| `AcquisitionsTable.test.tsx`     | 4     | Empty state, headers (Date & Time), record count, scroll viewport |
| `AcquisitionsChart.test.tsx`     | 2     | Empty state, chart container rendering                            |
| `LoginPage.test.tsx`             | 4     | Login form rendering and interaction                              |
| `ProfileForm.test.tsx`           | 7     | Profile form behavior                                             |

Tests use Vitest with jsdom environment and `@testing-library/react`.

### End-to-End Tests

```bash
npm run test:e2e
```

16 tests across 4 spec files using Playwright (Chromium):

| Spec File           | Tests | Description                              |
| ------------------- | ----- | ---------------------------------------- |
| `auth.spec.ts`      | 4     | Login/logout flows                       |
| `dashboard.spec.ts` | 6     | Dashboard rendering & chart interactions |
| `navigation.spec.ts`| 3     | Route navigation & auth guards           |
| `profile.spec.ts`   | 3     | Profile page flows                       |

E2E tests run against the Vite preview server on port 4173.

## Environment Variables

| Variable       | Default                 | Description        |
| -------------- | ----------------------- | ------------------ |
| `VITE_API_URL` | `http://localhost:8080` | LARVIS backend URL |

## License

Private — ICEYE coding assignment.
