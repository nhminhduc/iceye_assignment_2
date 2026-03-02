# Backend Improvement Suggestions

> LARVIS: "Hoo-man, these are very helpful suggestions! I shall implement them immediately! …after a nap."

The following observations are based on interacting with the LARVIS backend binary and its auto-generated documentation.

---

## Critical / Security

### 1. No Refresh Tokens

**Current:** `POST /token` returns a single `{ access }` token with no expiry information and no refresh mechanism.

**Problem:** Either the token never expires (security risk: stolen token valid forever) or it expires quickly (bad UX: users get kicked out mid-session with no way to refresh silently).

**Suggestion:** Implement a standard OAuth2-style token pair:
- Short-lived access token (e.g., 15 minutes)
- Long-lived refresh token (e.g., 7 days) returned in an `HttpOnly` cookie
- `POST /token/refresh` endpoint to exchange refresh token for a new access token

### 2. Plaintext Passwords

**Current:** The API returns `"password": string` in `GET /users/{id}` and `POST /users/{id}` responses. This strongly implies passwords are stored in plaintext.

**Problem:** Any compromise of the database (or a network tap without TLS) exposes all user credentials.

**Suggestion:**
- Hash passwords with bcrypt (work factor ≥ 12) or Argon2id before storing
- Never return password values in API responses — omit the field entirely
- Accept password change via `PATCH /users/{id}` with `{ current_password, new_password }` to prevent CSRF-style updates

### 3. No HTTPS / TLS

**Current:** Service listens on plain HTTP.

**Suggestion:** Terminate TLS at the reverse proxy level (nginx/caddy) or within the binary using `autocert` (Let's Encrypt). Even on a Mars station, in-transit encryption matters.

### 4. No Rate Limiting

**Current:** `POST /token` accepts unlimited authentication attempts.

**Problem:** Brute-force attacks are trivial.

**Suggestion:** Implement IP-based rate limiting on `/token` (e.g., 10 attempts per minute per IP). Consider account lockout after N consecutive failures.

---

## API Design

### 5. Wrong HTTP Method for Update

**Current:** `POST /users/{id}` is used for updating a profile.

**Problem:** `POST` is semantically for creation. Update should use `PUT` (full replace) or `PATCH` (partial update).

**Suggestion:** Add `PATCH /users/{id}` with partial update semantics. Keep `POST` for backwards compatibility during a transition period, or version the API (`/v2/users/{id}`).

### 6. Missing OpenAPI / Swagger Spec

**Current:** Documentation is a Markdown appendix in the assignment brief.

**Suggestion:** Expose `GET /openapi.json` and `GET /docs` (Swagger UI). The Go ecosystem has `swaggo/swag` for annotation-based generation, or `huma` for design-first OpenAPI.

### 7. No Pagination on Collections

**Current:** `GET /acquisitions` and `GET /users` return all records unbounded.

**Problem:** As data grows, response size becomes unmanageable.

**Suggestion:**
```
GET /acquisitions?start=<unix>&end=<unix>&limit=100&offset=0
GET /users?limit=50&page=2
```
Return `Link` headers or a `{ data: [], total: N, page: N }` envelope.

### 8. Missing Endpoints

| Missing endpoint | Purpose |
|---|---|
| `DELETE /token` (logout) | Server-side token revocation |
| `GET /acquisitions/summary` | Pre-aggregated stats (avoid client-side computation) |
| `GET /health` | Liveness probe for container orchestration |
| `GET /ready` | Readiness probe (check DB connection) |
| `PATCH /users/{id}` | Proper partial update |

### 9. No CORS Configuration

**Current:** No `Access-Control-Allow-Origin` headers observed.

**Problem:** Browser will block cross-origin requests from the frontend unless CORS is configured.

**Suggestion:** Add a `--allowed-origins` flag and respond with appropriate CORS headers. For development, allow `http://localhost:5173`. For production, restrict to the frontend domain.

---

## Observability

### 10. No Structured Logging

**Suggestion:** Replace `fmt.Println` / `log.Printf` with a structured logger (`slog` — built into Go 1.21+). Emit JSON logs with `level`, `timestamp`, `request_id`, `method`, `path`, `status`, `latency_ms`.

### 11. No Request Tracing

**Suggestion:** Inject a `X-Request-ID` header (generate UUID if absent), propagate it through all log lines, and return it in the response for client-side correlation.

### 12. No Metrics Endpoint

**Suggestion:** Expose `GET /metrics` in Prometheus format (via `prometheus/client_golang`). Track request count, latency histograms, and error rates per endpoint.

---

## Developer Experience

### 13. No `Content-Type` Validation

**Suggestion:** Return `415 Unsupported Media Type` when `Content-Type` is not `application/json` on POST endpoints, rather than silently failing or returning a 500.

### 14. Opaque Error Responses

**Current:** Error responses appear to be plain text or inconsistent JSON.

**Suggestion:** Standardise on:
```json
{
  "error": "invalid_credentials",
  "message": "User ID or password is incorrect",
  "request_id": "550e8400-e29b-41d4-a716-446655440000"
}
```
