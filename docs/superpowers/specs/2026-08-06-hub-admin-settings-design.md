# Hub Admin — Settings Store & Configurable Gate Password

**Status:** Approved design, ready for implementation planning
**Spec date:** 6 August 2026
**Scope:** Phase 1 of a hub admin surface. Phase 2 (named accounts, audit log) is explicitly out of scope — see *Decision Record*.

---

## Context

The estate deployed to Vercel today at `mosje-samavesh.vercel.app`. Vercel's own password protection is a Pro feature and the team is on Hobby, so [`a314508`](../../../apps/hub/src/lib/site-gate.ts) added an application-level gate: one shared password, read from the `SITE_PASSWORD` environment variable.

Changing that password currently means `vercel env rm` + `vercel env add` + a three-minute redeploy. This spec moves the value into a datastore so it can be changed from a web page, and establishes the settings-store seam that later hub settings will use.

The gate protects a work-in-progress prototype seeded with illustrative data and demo credentials. It is an access wall, not authentication. Nothing in this spec changes that, and nothing here touches the portal logins inside (SMILE, PM-AJAY, NMBA), which are unaffected.

---

## Current State (verified 6 August 2026)

| Fact | Evidence |
|---|---|
| No backend anywhere in the estate | No DB/ORM/auth dependencies in `apps/hub/package.json`; only three API routes, all serving static design-system docs |
| Gate cookie holds `HMAC-SHA256(password, label)`, never the password | [site-gate.ts](../../../apps/hub/src/lib/site-gate.ts) `deriveToken` / `gateToken` |
| Gate check runs in the proxy on every request | [proxy.ts](../../../apps/hub/src/proxy.ts) `gateRedirect`, catch-all matcher |
| `SITE_PASSWORD` unset ⇒ gate disabled | `gatePassword()` returns null; this is the local-dev path |
| Deep links survive the gate via `?next=`, clamped to same-origin | `safeNextPath` |
| Crawling disabled estate-wide | [robots.ts](../../../apps/hub/src/app/robots.ts), `ALLOW_INDEXING` opt-in |
| One Supabase org exists, no MoSJE project | `shivyog-sewa-management` only, unrelated |
| Portals persist via `localStorage` + seed data | House pattern; no server state anywhere |

---

## Decision Record

**Datastore: Supabase Postgres.** The alternative, Vercel Edge Config, is a better fit for a value read on every request — globally replicated, no network hop. It was rejected because [writes require a Vercel Access Token](https://vercel.com/docs/edge-config/vercel-api), not a scoped storage key. An in-app panel editing Edge Config must hold a credential that can also read the project's environment variables and delete the project. That trades a prototype-panel compromise for a Vercel-account compromise. Supabase keys confine the blast radius to one database.

Edge Config would still be correct if there were no panel and the value were edited in the Vercel dashboard. That option was offered and declined.

**Supabase free-tier pausing is accepted.** [Free projects pause after a week of inactivity](https://supabase.com/docs/guides/platform/free-project-pausing); a few requests a day keeps them awake. The gate reads settings on every request, so the project stays live during any real review activity, and the environment-variable fallback covers the dormant case.

**No named admin accounts in Phase 1.** Individual logins and an audit trail were requested and are deliberately deferred:

- No specific person other than the maintainer has been identified as needing to change these settings.
- An audit log would record who changed a shared review password guarding illustrative demo data.
- The production system will run on government infrastructure behind NIC/Parichay SSO. Nothing built on Supabase now survives into it, so this panel is prototype furniture and is priced accordingly.

This is revisited the moment a second named person needs access. The admin check is therefore isolated behind a single function so Phase 2 replaces one seam rather than the panel.

---

## Design System Audit (mandatory per CLAUDE.md)

Existing, import directly: `Button` `Input` `FormField` `Alert` `Card`.

Nothing new is added to `packages/design-system/`. The admin pages are two short forms; their layout is app-local for the same reason the gate's is — a deployment-administration surface is not a product screen any portal reuses. No hand-built inputs, buttons or cards. Brand tokens only, Noto Sans, `<Icon>` for iconography.

---

## Architecture

### Token resolution — the core contract

The gate already compares HMAC digests rather than passwords. That property is preserved: **the plaintext password is never stored.** The database holds exactly one value, `gate_token` = `HMAC-SHA256(password, GATE_LABEL)`, which is simultaneously:

- what a valid cookie contains, and
- what an entered password is verified against, via `deriveToken(entered) === gate_token`.

So the store needs one column and `site-gate.ts` needs one change: where the expected token comes from.

Resolution order, evaluated per request:

1. `gate_token` from the settings store, if reachable and set
2. `deriveToken(process.env.SITE_PASSWORD)`, if set
3. Neither ⇒ gate disabled (preserves today's local-dev behaviour)

Step 2 is the floor. A database outage, a paused project, or a botched settings write cannot lock everyone out of the estate, because production always has `SITE_PASSWORD` set as a recovery credential.

### Hot-path caching

The proxy runs on every request; a database round-trip per request is not acceptable. The store module keeps a process-local cache with a **60-second TTL**. Consequences, both acceptable:

- A password change takes up to 60 seconds to propagate, and longer across warm serverless instances that each cache independently.
- The old password keeps working during that window.

Reads use plain `fetch` against Supabase's PostgREST endpoint with a **1.5-second timeout**, not `@supabase/supabase-js`. This adds no dependency to the proxy's cold start, and a slow database degrades to the environment-variable fallback instead of hanging every page load. On timeout or error the cache is populated with the fallback and a `console.warn` is emitted.

### Admin authentication

`ADMIN_PASSWORD`, a separate and stronger secret than the gate password, verified with the same HMAC scheme under a distinct label, carried in a separate `mosje-admin` cookie (HttpOnly, Secure, SameSite=Lax, 7-day expiry — shorter than the gate's 30 days).

`/admin/*` is **exempt from the site gate.** This is deliberate and is the recovery path: if the gate password is lost or a bad value is written, the admin panel must still be reachable to fix it. It is protected by `ADMIN_PASSWORD` alone.

All of this lives behind one function:

```ts
// src/lib/admin/auth.ts
export async function requireAdmin(): Promise<void>  // redirects to /admin/login when not authenticated
```

Phase 2 replaces this function's internals with a real session lookup. No caller changes.

### Data model

```sql
create table hub_settings (
  key        text primary key,
  value      text not null,
  updated_at timestamptz not null default now()
);

alter table hub_settings enable row level security;
-- No policies are created. anon and authenticated are denied by default;
-- the server reaches this table only via the service role, which bypasses RLS.
```

Phase 1 uses exactly one key: `gate_token`. The table is key/value so later settings need a migration only if they need structure.

`SUPABASE_SERVICE_ROLE_KEY` is server-only and must never be imported into a client component. The anon key is not used and is not configured.

---

## Files

| Path | Change |
|---|---|
| `src/lib/settings/store.ts` | **new** — `readSetting` / `writeSetting`, PostgREST fetch, timeout, TTL cache |
| `src/lib/site-gate.ts` | resolution order above; `gatePassword()` becomes `resolveGateToken()` |
| `src/lib/admin/auth.ts` | **new** — admin cookie, `requireAdmin()`, `signInAdmin()`, `signOutAdmin()` |
| `src/app/admin/login/page.tsx` + `actions.ts` + `login-form.tsx` | **new** — admin sign-in |
| `src/app/admin/page.tsx` + `actions.ts` + `settings-form.tsx` | **new** — change gate password |
| `src/proxy.ts` | exempt `/admin` and `/admin/*`; gate reads the resolved token |
| `supabase/migrations/<ts>_hub_settings.sql` | **new** |

Server actions live in their own `actions.ts` with a file-level `"use server"` directive — an inline directive on a module-scope function does not compile to an action reference, as [`a314508`](../../../apps/hub/src/app/gate/actions.ts) established.

---

## Failure Modes

| Condition | Behaviour |
|---|---|
| Supabase unreachable, slow, or paused | 1.5s timeout → fall back to `SITE_PASSWORD` → gate still works |
| `gate_token` absent from the table | Fall back to `SITE_PASSWORD` |
| Both store and `SITE_PASSWORD` unset | Gate disabled — correct for local dev, and production always sets the env var |
| Bad value written to `gate_token` | Reach `/admin` (ungated), rewrite it. Worst case `vercel env` + redeploy restores the floor |
| `ADMIN_PASSWORD` unset | `/admin/*` returns 404 rather than granting open access |
| Brute force against either password | **Accepted risk.** Per-instance in-memory throttle only; serverless makes it partial. Mitigated by long generated passwords, `noindex`, and the low value of what is behind the wall. Real rate limiting waits for Phase 2's datastore-backed sessions |

---

## Testing

**Unit** (`node --test`, existing `npm test --prefix apps/hub`):
- `safeNextPath` rejects `//host`, `/\host`, absolute URLs; accepts same-origin paths
- `safeEqual` is length-safe and correct
- Token resolution honours store → env → disabled, including store-error fallback
- Cache respects TTL and does not serve stale values past it

**Manual matrix**, run against a production build before deploying:
1. Store empty, `SITE_PASSWORD` set → gate accepts the env password
2. Change the password at `/admin` → within 60s the new one is accepted and the old rejected
3. Existing gate cookies are invalidated by a password change (the token they carry no longer matches)
4. `/admin/login` reachable without a gate cookie
5. Wrong `ADMIN_PASSWORD` → error, no cookie set
6. Supabase paused → gate falls back, site reachable

---

## Out of Scope

Named admin accounts · audit log · role-based admin permissions · settings beyond `gate_token` · migrating any portal off `localStorage` · rate limiting backed by shared state · turning the gate off from the panel.

---

## Open Risks

1. **The estate gains its first backend service.** It currently has zero operational surface — nothing to keep alive, no secrets to rotate, no data to migrate. The env-var fallback prevents an outage from taking the site down, but this is a permanent change in operational character and the reason Phase 2 should not be assumed.
2. **60-second propagation** means a password rotation is not instant. If a password ever needs immediate revocation, the reliable action is changing `SITE_PASSWORD` and redeploying, which invalidates every cookie at once.
3. **`/admin` being ungated** is a deliberate recovery path, but it is a second publicly-reachable login form. Its password must be materially stronger than the gate's.
4. **The stored `gate_token` is cookie-equivalent.** Storing the digest rather than the password means a database leak does not expose a string the maintainer may have reused elsewhere — but the stored value can be pasted directly into a cookie to bypass the gate. Splitting into separate verification and cookie labels would close this, at the cost of storing two values and deriving the cookie only at unlock time. Judged not worth it for a prototype wall; revisit if anything of real value moves behind the gate.
