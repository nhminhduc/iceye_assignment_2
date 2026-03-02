# Enhancement Roadmap

> What I would add given more time — sorted by value/effort ratio.

---

## Completed

### Dark Mode ✓
Implemented via **next-themes** with `attribute="class"` and `enableSystem`. `ThemeToggle` component in the header supports light/dark/system switching. CSS variables use oklch color space with separate light and dark palettes defined in `index.css`.

### Loading Skeletons ✓
`DashboardSkeleton` provides a full skeleton layout matching the dashboard (chart, histogram, table placeholders). `ProfileForm` also includes skeleton loading state while fetching user data.

### Docker Containerization ✓
Multi-stage Dockerfile (node:22-alpine build → PM2 + serve production). `docker-compose.yml` orchestrates both frontend and backend services. Frontend served on port 3000, backend on port 8080.

### End-to-End Tests ✓
16 Playwright tests across 4 spec files covering auth flows, dashboard interactions, navigation guards, and profile page. Runs against the Vite preview server.

---

## Short-Term (days)

### Export to CSV
A "Download CSV" button on the acquisitions table that uses the `data` array already in memory and `URL.createObjectURL(new Blob(...))`.

### Toast Notifications
Replace the inline `<Alert>` success/error messages with a toast system (shadcn `sonner` integration) for better UX.

### Error Boundary
Wrap authenticated routes in a React `ErrorBoundary` to catch unexpected errors and show a friendly fallback instead of a blank screen.

---

## Medium-Term (weeks)

### Satellite Map Visualization
Render detected ore sites on a map of Mars (using a static Mars map as SVG or using CesiumJS for 3D globe view). Each acquisition timestamp could show a "sweep arc" over the planet surface.

### Real-Time Updates via SSE
Replace TanStack Query polling with a `GET /acquisitions/stream` Server-Sent Events endpoint. The UI would receive push updates when new satellite sweeps complete, displaying a "new data available" notification.

### Multi-Crew User Management
A dedicated "Crew" page using `GET /users` to list all mission members, with profile cards showing name, user ID, and last active time (if the backend adds an `updated_at` field).

### Data Annotation
Allow the user to add notes to specific acquisition timestamps (e.g., "unusually high — possible sensor glitch"). Stored client-side in localStorage with user-scoped keys, or as a backend feature if added.

### Keyboard Navigation & A11y Audit
Run `axe-core` in CI, fix all violations, add full keyboard navigation for the chart (announce data points via ARIA live regions).

---

## Long-Term (months)

### Multi-Mission Support
Allow switching between different Mars missions or satellite constellations. Each mission has its own acquisition history. Requires backend namespacing (`/missions/{id}/acquisitions`).

### Alerting System
Define thresholds for ore site counts (e.g., alert if > 50 sites in one sweep). LARVIS sends a push notification (or logs a station-wide alert) when a threshold is breached. Frontend displays a `<NotificationBell>` widget.

### Offline Mode (PWA)
Register a Service Worker that:
- Caches the last acquisition dataset to IndexedDB
- Serves the cached data when the network is down (relevant on Mars, where comms windows with Earth are limited)
- Shows a "Offline – showing cached data from {date}" banner

### Historical Comparison
Side-by-side chart comparing acquisition data from multiple months (requires backend to store more than the last month). Useful for spotting seasonal variation in ore deposit detection.

### Automated Report Generation
A "Generate Report" button that composes a PDF or HTML email report with:
- Summary statistics
- Time-series chart (as embedded SVG)
- Top acquisition sites map
- Ready to send to Space Command

This uses `@react-pdf/renderer` or `html2canvas` + `jsPDF`.

### Full Test Coverage & CI/CD
- Increase coverage to ≥80% (add integration tests with MSW for API mocking)
- Storybook for all shared UI components
- GitHub Actions: lint → test → build → Docker push → deploy to staging
