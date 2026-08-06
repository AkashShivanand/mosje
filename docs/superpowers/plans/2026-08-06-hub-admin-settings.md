# Hub Admin Settings Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the site-gate password out of the `SITE_PASSWORD` environment variable into a Supabase-backed settings store, changeable from an `/admin` page protected by its own password.

**Architecture:** A key/value table in Supabase holds `gate_token` — the HMAC digest the gate already compares against, so the plaintext password is never stored. The proxy resolves the expected token through a 60-second process-local cache, falling back to `SITE_PASSWORD` whenever the store is unset, slow or unreachable, so a database outage cannot lock anyone out. `/admin` sits outside the gate and is protected by a separate `ADMIN_PASSWORD`, which is the recovery path if the gate password is ever lost.

**Tech Stack:** Next.js 16 (App Router, `src/proxy.ts`), React 19, TypeScript strict, Supabase Postgres reached over PostgREST with plain `fetch`, Web Crypto HMAC-SHA256, `node:test` for unit tests, `@mosje/design-system` for all UI.

## Global Constraints

- **TypeScript strict, no `any`.** Named exports only. PascalCase components, camelCase utils.
- **No new dependencies.** The store talks to PostgREST with plain `fetch`; `@supabase/supabase-js` is NOT added.
- **No new design-system components.** Import `Button`, `Input`, `FormField`, `Alert` from `@mosje/design-system`. No hand-built inputs, buttons or cards. No hardcoded hex, spacing or font values — brand tokens only.
- **The plaintext gate password is never written to the database.** Only `HMAC-SHA256(password, "mosje-site-gate.v1")`.
- **Cache TTL is exactly 60000 ms. Store fetch timeout is exactly 1500 ms.**
- **`SUPABASE_SERVICE_ROLE_KEY` is server-only** — never imported into a file carrying `"use client"`.
- **Server actions live in their own `actions.ts` with a file-level `"use server"` directive.** An inline directive on a module-scope function does not compile to an action reference.
- **Tests are colocated in `src/`**, use `node:test` + `node:assert/strict`, and import with explicit `.ts` extensions. Run with `npm test --prefix apps/hub`.
- **No AI attribution in commit messages.**
- Working directory for all commands is the repo root, `/Users/akashk/Documents/Projects/MoSJE`, unless stated otherwise.

## File Structure

| Path | Responsibility |
|---|---|
| `apps/hub/src/lib/hmac.ts` | **new** — `hmacToken(secret, label)` and `safeEqual`. The one place HMAC digests are produced. |
| `apps/hub/src/lib/hmac.test.ts` | **new** — digest stability, domain separation, comparison safety. |
| `apps/hub/src/lib/settings/store.ts` | **new** — `readSetting` / `writeSetting` over PostgREST, TTL cache, timeout, fail-soft. |
| `apps/hub/src/lib/settings/store.test.ts` | **new** — cache, TTL expiry, timeout and error fallback, unconfigured store. |
| `apps/hub/src/lib/site-gate.ts` | **modify** — `resolveGateToken()` replaces `gatePassword()`; HMAC moves to `hmac.ts`. |
| `apps/hub/src/lib/site-gate.test.ts` | **new** — `safeNextPath` and token resolution order. |
| `apps/hub/src/lib/admin/auth.ts` | **new** — admin cookie, `requireAdmin`, `signInAdmin`, `signOutAdmin`. The single seam Phase 2 replaces. |
| `apps/hub/src/app/admin/login/page.tsx` · `actions.ts` · `login-form.tsx` | **new** — admin sign-in. |
| `apps/hub/src/app/admin/page.tsx` · `actions.ts` · `settings-form.tsx` | **new** — change the gate password. |
| `apps/hub/src/app/gate/actions.ts` | **modify** — verify against the resolved token. |
| `apps/hub/src/proxy.ts` | **modify** — exempt `/admin`; use `resolveGateToken()`. |
| `supabase/migrations/20260806000000_hub_settings.sql` | **new** — the table and its RLS lockdown. |

---

### Task 1: Extract the HMAC primitives

Pulls digest generation out of `site-gate.ts` so the admin auth in Task 5 can reuse it under a different label instead of duplicating it. Pure refactor — no behaviour change.

**Files:**
- Create: `apps/hub/src/lib/hmac.ts`
- Create: `apps/hub/src/lib/hmac.test.ts`
- Modify: `apps/hub/src/lib/site-gate.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `hmacToken(secret: string, label: string): Promise<string>` — base64url HMAC-SHA256, 43 chars. `safeEqual(a: string, b: string): boolean`.

- [ ] **Step 1: Write the failing test**

Create `apps/hub/src/lib/hmac.test.ts`:

```ts
// Tests for the HMAC primitives shared by the site gate and the admin auth.
// Run: npm test --prefix apps/hub

import { test } from "node:test";
import assert from "node:assert/strict";

import { hmacToken, safeEqual } from "./hmac.ts";

test("hmacToken is deterministic for the same secret and label", async () => {
  const a = await hmacToken("hunter2", "label.v1");
  const b = await hmacToken("hunter2", "label.v1");
  assert.equal(a, b);
});

test("hmacToken separates domains by label", async () => {
  const a = await hmacToken("hunter2", "gate.v1");
  const b = await hmacToken("hunter2", "admin.v1");
  assert.notEqual(a, b);
});

test("hmacToken output is base64url of fixed width", async () => {
  const token = await hmacToken("hunter2", "label.v1");
  assert.equal(token.length, 43);
  assert.match(token, /^[A-Za-z0-9_-]+$/);
});

test("hmacToken differs for different secrets", async () => {
  const a = await hmacToken("hunter2", "label.v1");
  const b = await hmacToken("hunter3", "label.v1");
  assert.notEqual(a, b);
});

test("safeEqual matches identical strings and rejects others", () => {
  assert.equal(safeEqual("abc", "abc"), true);
  assert.equal(safeEqual("abc", "abd"), false);
  assert.equal(safeEqual("abc", "abcd"), false);
  assert.equal(safeEqual("", ""), true);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test --prefix apps/hub`
Expected: FAIL — cannot find module `./hmac.ts`.

- [ ] **Step 3: Write the implementation**

Create `apps/hub/src/lib/hmac.ts`:

```ts
/**
 * HMAC primitives shared by the site gate and the hub admin auth.
 *
 * Both carry a secret in a cookie without carrying the secret itself: the
 * cookie holds HMAC-SHA256(secret, label), so a stolen cookie does not reveal
 * the password. The label provides domain separation — a gate cookie can never
 * be replayed as an admin cookie.
 */

function base64url(buffer: ArrayBuffer): string {
  let binary = "";
  for (const byte of new Uint8Array(buffer)) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** base64url HMAC-SHA256 of `label` keyed by `secret`. Always 43 characters. */
export async function hmacToken(secret: string, label: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(label),
  );
  return base64url(signature);
}

/**
 * Length-independent comparison. Callers compare HMAC digests, which are always
 * the same width, so the early length exit leaks nothing about the secret.
 */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test --prefix apps/hub`
Expected: PASS, 5 new tests.

- [ ] **Step 5: Point site-gate.ts at the new module**

In `apps/hub/src/lib/site-gate.ts`, delete the local `base64url` function and the local `safeEqual` implementation, and replace `deriveToken`'s body with a call into the new module. `safeEqual` is re-exported so every existing import of it keeps working. The three changed pieces read:

```ts
import { hmacToken, safeEqual } from "./hmac.ts";

export { safeEqual };

/**
 * Derive the cookie token for a password. Not memoised — safe to call with
 * untrusted input, since a wrong guess cannot evict the hot-path cache below.
 */
export async function deriveToken(password: string): Promise<string> {
  return hmacToken(password, GATE_LABEL);
}
```

Leave `GATE_COOKIE`, `GATE_LABEL`, `GATE_MAX_AGE_SECONDS`, `gatePassword`, `gateToken`, the `memo`, and `safeNextPath` exactly as they are. Import paths elsewhere are unchanged because `safeEqual` is re-exported.

- [ ] **Step 6: Verify nothing broke**

Run: `npm test --prefix apps/hub && npm run typecheck --workspace @mosje/hub && npm run lint --workspace @mosje/hub`
Expected: all pass.

- [ ] **Step 7: Commit**

```bash
git add apps/hub/src/lib/hmac.ts apps/hub/src/lib/hmac.test.ts apps/hub/src/lib/site-gate.ts
git commit -m "refactor(hub): extract HMAC primitives into src/lib/hmac.ts

The admin auth needs the same digest under a different label. One
implementation, domain-separated by label, rather than two."
```

---

### Task 2: Cover the existing gate helpers with tests

`safeNextPath` guards against an open redirect and has no test. Lock its behaviour down before Task 4 changes the file around it.

**Files:**
- Create: `apps/hub/src/lib/site-gate.test.ts`

**Interfaces:**
- Consumes: `safeNextPath` from Task 1's untouched `site-gate.ts`.
- Produces: nothing.

- [ ] **Step 1: Write the failing test**

Create `apps/hub/src/lib/site-gate.test.ts`:

```ts
// Tests for the site gate's redirect clamping.
// Run: npm test --prefix apps/hub

import { test } from "node:test";
import assert from "node:assert/strict";

import { safeNextPath } from "./site-gate.ts";

test("safeNextPath keeps same-origin absolute paths", () => {
  assert.equal(safeNextPath("/website"), "/website");
  assert.equal(safeNextPath("/portals/nmba/admin/login"), "/portals/nmba/admin/login");
  assert.equal(safeNextPath("/website?tab=2"), "/website?tab=2");
});

test("safeNextPath rejects protocol-relative and absolute URLs", () => {
  assert.equal(safeNextPath("//evil.example"), "/");
  assert.equal(safeNextPath("https://evil.example"), "/");
  assert.equal(safeNextPath("http://evil.example"), "/");
});

test("safeNextPath rejects backslash tricks browsers treat as //", () => {
  assert.equal(safeNextPath("/\\evil.example"), "/");
});

test("safeNextPath rejects relative paths and empty input", () => {
  assert.equal(safeNextPath("website"), "/");
  assert.equal(safeNextPath(""), "/");
  assert.equal(safeNextPath(null), "/");
  assert.equal(safeNextPath(undefined), "/");
});
```

- [ ] **Step 2: Run the test**

Run: `npm test --prefix apps/hub`
Expected: PASS. These document existing behaviour rather than drive new code. If any assertion fails, that is a real open-redirect bug — fix `safeNextPath` before continuing.

- [ ] **Step 3: Commit**

```bash
git add apps/hub/src/lib/site-gate.test.ts
git commit -m "test(hub): cover site-gate redirect clamping

safeNextPath is what stops ?next= becoming an open redirect. Pin it
before the surrounding file changes."
```

---

### Task 3: Create the Supabase project and table

**Files:**
- Create: `supabase/migrations/20260806000000_hub_settings.sql`

**Interfaces:**
- Consumes: nothing.
- Produces: a `hub_settings(key text primary key, value text not null, updated_at timestamptz)` table; the env values `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.

- [ ] **Step 1: Confirm with the user before creating the project**

Creating a Supabase project is an account-level action. Ask the user to confirm, and ask which organisation to use — `list_organizations` shows the available ones. Do not proceed without an answer.

- [ ] **Step 2: Create the project**

Use the Supabase MCP `create_project` with name `mosje-hub`, the confirmed organisation, and region `ap-south-1` (Mumbai — closest to users, and the estate is Indian government). If the tool returns a cost confirmation prompt, surface it to the user and wait; do not auto-confirm.

- [ ] **Step 3: Write the migration file**

Create `supabase/migrations/20260806000000_hub_settings.sql`:

```sql
-- Hub settings: a key/value store for values the /admin panel can change
-- without a redeploy. Phase 1 stores exactly one key, `gate_token`, which is
-- HMAC-SHA256 of the site-gate password. The plaintext password is never here.

create table if not exists public.hub_settings (
  key        text primary key,
  value      text not null,
  updated_at timestamptz not null default now()
);

-- RLS on with NO policies: anon and authenticated are denied everything.
-- The hub reaches this table only with the service role, which bypasses RLS.
-- Without this, the anon key would be able to read the gate token.
alter table public.hub_settings enable row level security;
```

- [ ] **Step 4: Apply the migration**

Use the Supabase MCP `apply_migration` with name `hub_settings` and the SQL above, against the new project.

- [ ] **Step 5: Verify the table and its lockdown**

Use the Supabase MCP `execute_sql` against the new project:

```sql
select
  (select count(*) from information_schema.tables
     where table_schema = 'public' and table_name = 'hub_settings') as table_present,
  (select relrowsecurity from pg_class where relname = 'hub_settings') as rls_enabled,
  (select count(*) from pg_policies
     where schemaname = 'public' and tablename = 'hub_settings') as policy_count;
```

Expected: `table_present = 1`, `rls_enabled = true`, `policy_count = 0`.

- [ ] **Step 6: Wire the environment variables**

Get the project URL and service role key from the Supabase dashboard (Project Settings → API). Then, from the repo root:

```bash
printf 'https://<project-ref>.supabase.co' | vercel env add SUPABASE_URL production
printf 'https://<project-ref>.supabase.co' | vercel env add SUPABASE_URL preview
printf '<service-role-key>' | vercel env add SUPABASE_SERVICE_ROLE_KEY production
printf '<service-role-key>' | vercel env add SUPABASE_SERVICE_ROLE_KEY preview
```

Do NOT add these to `development` — local dev should keep running with no store, exercising the fallback path. Do NOT write either value into any file in the repo; `.env*` is gitignored and the pre-tool guard blocks touching it.

- [ ] **Step 7: Verify and commit**

```bash
vercel env ls
git add supabase/migrations/20260806000000_hub_settings.sql
git commit -m "feat(hub): add hub_settings table for admin-configurable settings

RLS enabled with no policies, so only the service role reads it. Stores
the gate token digest, never the password."
```

Expected from `vercel env ls`: `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` present for Production and Preview only.

---

### Task 4: The settings store

**Files:**
- Create: `apps/hub/src/lib/settings/store.ts`
- Create: `apps/hub/src/lib/settings/store.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `SETTING_GATE_TOKEN: "gate_token"`
  - `readSetting(key: string, deps?: StoreDeps): Promise<string | null>`
  - `writeSetting(key: string, value: string, deps?: StoreDeps): Promise<void>`
  - `resetSettingsCache(): void`
  - `interface StoreDeps { fetchImpl: typeof fetch; now: () => number }`

- [ ] **Step 1: Write the failing test**

Create `apps/hub/src/lib/settings/store.test.ts`:

```ts
// Tests for the hub settings store: caching, TTL, and fail-soft behaviour.
// The store sits on the request hot path, so its failure modes matter more
// than its happy path — a slow or dead database must degrade, never hang.
//
// Run: npm test --prefix apps/hub

import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";

import {
  SETTING_GATE_TOKEN,
  readSetting,
  resetSettingsCache,
  type StoreDeps,
} from "./store.ts";

const ENV = { SUPABASE_URL: "https://p.supabase.co", SUPABASE_SERVICE_ROLE_KEY: "svc" };

function withEnv(fn: () => Promise<void>): Promise<void> {
  const previous = { ...process.env };
  Object.assign(process.env, ENV);
  return fn().finally(() => {
    process.env = previous;
  });
}

function jsonResponse(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

/** A fetch stub that counts calls and returns a fixed PostgREST payload. */
function stubFetch(rows: unknown[]): { impl: typeof fetch; calls: () => number } {
  let calls = 0;
  const impl = (async () => {
    calls += 1;
    return jsonResponse(rows);
  }) as unknown as typeof fetch;
  return { impl, calls: () => calls };
}

beforeEach(() => resetSettingsCache());

test("readSetting returns null when the store is not configured", async () => {
  const previous = { ...process.env };
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  const { impl, calls } = stubFetch([{ value: "tok" }]);
  try {
    assert.equal(await readSetting(SETTING_GATE_TOKEN, { fetchImpl: impl, now: Date.now }), null);
    assert.equal(calls(), 0, "must not call the network when unconfigured");
  } finally {
    process.env = previous;
  }
});

test("readSetting returns the stored value", async () => {
  await withEnv(async () => {
    const { impl } = stubFetch([{ value: "stored-token" }]);
    const got = await readSetting(SETTING_GATE_TOKEN, { fetchImpl: impl, now: Date.now });
    assert.equal(got, "stored-token");
  });
});

test("readSetting returns null when the key is absent", async () => {
  await withEnv(async () => {
    const { impl } = stubFetch([]);
    assert.equal(await readSetting(SETTING_GATE_TOKEN, { fetchImpl: impl, now: Date.now }), null);
  });
});

test("readSetting caches within the TTL and refetches after it", async () => {
  await withEnv(async () => {
    const { impl, calls } = stubFetch([{ value: "stored-token" }]);
    let clock = 1_000_000;
    const deps: StoreDeps = { fetchImpl: impl, now: () => clock };

    await readSetting(SETTING_GATE_TOKEN, deps);
    await readSetting(SETTING_GATE_TOKEN, deps);
    assert.equal(calls(), 1, "second read inside the TTL must be served from cache");

    clock += 59_000;
    await readSetting(SETTING_GATE_TOKEN, deps);
    assert.equal(calls(), 1, "still inside the 60s TTL");

    clock += 2_000;
    await readSetting(SETTING_GATE_TOKEN, deps);
    assert.equal(calls(), 2, "past the TTL, refetch");
  });
});

test("readSetting returns null when the fetch rejects", async () => {
  await withEnv(async () => {
    const impl = (async () => {
      throw new Error("ECONNREFUSED");
    }) as unknown as typeof fetch;
    assert.equal(await readSetting(SETTING_GATE_TOKEN, { fetchImpl: impl, now: Date.now }), null);
  });
});

test("readSetting returns null on a non-OK response", async () => {
  await withEnv(async () => {
    const impl = (async () => new Response("nope", { status: 500 })) as unknown as typeof fetch;
    assert.equal(await readSetting(SETTING_GATE_TOKEN, { fetchImpl: impl, now: Date.now }), null);
  });
});

test("a failed read is cached too, so a dead store is not hammered", async () => {
  await withEnv(async () => {
    let calls = 0;
    const impl = (async () => {
      calls += 1;
      throw new Error("ECONNREFUSED");
    }) as unknown as typeof fetch;
    const deps: StoreDeps = { fetchImpl: impl, now: () => 1_000_000 };

    await readSetting(SETTING_GATE_TOKEN, deps);
    await readSetting(SETTING_GATE_TOKEN, deps);
    assert.equal(calls, 1);
  });
});

test("resetSettingsCache forces the next read to refetch", async () => {
  await withEnv(async () => {
    const { impl, calls } = stubFetch([{ value: "stored-token" }]);
    const deps: StoreDeps = { fetchImpl: impl, now: () => 1_000_000 };
    await readSetting(SETTING_GATE_TOKEN, deps);
    resetSettingsCache();
    await readSetting(SETTING_GATE_TOKEN, deps);
    assert.equal(calls(), 2);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test --prefix apps/hub`
Expected: FAIL — cannot find module `./store.ts`.

- [ ] **Step 3: Write the implementation**

Create `apps/hub/src/lib/settings/store.ts`:

```ts
/**
 * Hub settings store — a key/value table in Supabase, reached over PostgREST.
 *
 * This sits on the request hot path: the proxy resolves the gate token through
 * it on every request. Three consequences shape the design.
 *
 *  - It caches. A 60s process-local TTL, so a password change propagates
 *    within a minute rather than costing a database round-trip per request.
 *    Warm serverless instances cache independently, so propagation across all
 *    of them is best-effort.
 *  - It times out. 1.5s, after which the caller gets null and falls back.
 *    A slow database must not hang every page load in the estate.
 *  - It never throws. Every failure returns null, and the null is cached, so a
 *    dead store is not hammered once per request. Callers treat null as
 *    "no configured value" and fall back to their environment variable.
 *
 * It uses plain fetch rather than @supabase/supabase-js: two endpoints do not
 * justify a dependency on the proxy's cold start.
 */

/** The only key Phase 1 uses. */
export const SETTING_GATE_TOKEN = "gate_token";

const CACHE_TTL_MS = 60_000;
const FETCH_TIMEOUT_MS = 1_500;

export interface StoreDeps {
  fetchImpl: typeof fetch;
  now: () => number;
}

const defaultDeps: StoreDeps = { fetchImpl: fetch, now: Date.now };

interface CacheEntry {
  value: string | null;
  at: number;
}

const cache = new Map<string, CacheEntry>();

/** Drop every cached value. Called after a write, and by tests. */
export function resetSettingsCache(): void {
  cache.clear();
}

interface StoreConfig {
  url: string;
  serviceKey: string;
}

/** Null when the store is not configured — the local-dev and bootstrap path. */
function config(): StoreConfig | null {
  const url = process.env.SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !serviceKey) return null;
  return { url, serviceKey };
}

function headers(serviceKey: string): Record<string, string> {
  return {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    "Content-Type": "application/json",
  };
}

/**
 * Read a setting. Returns null when the store is unconfigured, the key is
 * absent, or the read failed for any reason — all of which mean the same thing
 * to callers: use your fallback.
 */
export async function readSetting(
  key: string,
  deps: StoreDeps = defaultDeps,
): Promise<string | null> {
  const cfg = config();
  if (!cfg) return null;

  const hit = cache.get(key);
  if (hit && deps.now() - hit.at < CACHE_TTL_MS) return hit.value;

  let value: string | null = null;
  try {
    const url = `${cfg.url}/rest/v1/hub_settings?key=eq.${encodeURIComponent(key)}&select=value`;
    const response = await deps.fetchImpl(url, {
      headers: headers(cfg.serviceKey),
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      cache: "no-store",
    });
    if (response.ok) {
      const rows: unknown = await response.json();
      if (Array.isArray(rows) && rows.length > 0) {
        const first: unknown = rows[0];
        if (first && typeof first === "object" && "value" in first) {
          const raw = (first as { value: unknown }).value;
          if (typeof raw === "string") value = raw;
        }
      }
    } else {
      console.warn(`[settings] read ${key} failed: HTTP ${response.status}`);
    }
  } catch (error) {
    console.warn(`[settings] read ${key} failed:`, error);
  }

  // The failure is cached too — a dead store must not be retried per request.
  cache.set(key, { value, at: deps.now() });
  return value;
}

/**
 * Upsert a setting. Unlike reads, this throws: a write is a deliberate admin
 * action and its caller must be able to report that it did not happen.
 */
export async function writeSetting(
  key: string,
  value: string,
  deps: StoreDeps = defaultDeps,
): Promise<void> {
  const cfg = config();
  if (!cfg) throw new Error("Settings store is not configured");

  const response = await deps.fetchImpl(`${cfg.url}/rest/v1/hub_settings`, {
    method: "POST",
    headers: { ...headers(cfg.serviceKey), Prefer: "resolution=merge-duplicates" },
    body: JSON.stringify([{ key, value, updated_at: new Date().toISOString() }]),
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Settings write failed: HTTP ${response.status}`);
  }
  resetSettingsCache();
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test --prefix apps/hub`
Expected: PASS, 8 new tests.

- [ ] **Step 5: Typecheck and lint**

Run: `npm run typecheck --workspace @mosje/hub && npm run lint --workspace @mosje/hub`
Expected: both pass.

- [ ] **Step 6: Commit**

```bash
git add apps/hub/src/lib/settings/store.ts apps/hub/src/lib/settings/store.test.ts
git commit -m "feat(hub): settings store over PostgREST

Sits on the request hot path, so it caches for 60s, times out at 1.5s,
and never throws on read — every failure returns null and the caller
falls back to its environment variable."
```

---

### Task 5: Resolve the gate token through the store

After this task the password is changeable by editing the database row directly, which is real value before any UI exists.

**Files:**
- Modify: `apps/hub/src/lib/site-gate.ts`
- Modify: `apps/hub/src/lib/site-gate.test.ts`
- Modify: `apps/hub/src/proxy.ts`
- Modify: `apps/hub/src/app/gate/actions.ts`

**Interfaces:**
- Consumes: `readSetting`, `SETTING_GATE_TOKEN` (Task 4); `hmacToken`, `safeEqual` (Task 1).
- Produces: `resolveGateToken(): Promise<string | null>`. `gatePassword()` is removed.

- [ ] **Step 1: Write the failing test**

In `apps/hub/src/lib/site-gate.test.ts`, first widen the existing top-of-file import and add one more beside it — imports must stay at the top of the file or ESLint will reject it:

```ts
import { deriveToken, resolveGateToken, safeNextPath } from "./site-gate.ts";
import { resetSettingsCache } from "./settings/store.ts";
```

Then append these tests at the end of the file:

```ts
test("resolveGateToken prefers the stored token over the env password", async () => {
  const previous = { ...process.env };
  resetSettingsCache();
  process.env.SUPABASE_URL = "https://p.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "svc";
  process.env.SITE_PASSWORD = "env-password";
  globalThis.fetch = (async () =>
    new Response(JSON.stringify([{ value: "stored-token" }]), {
      status: 200,
      headers: { "content-type": "application/json" },
    })) as unknown as typeof fetch;
  try {
    assert.equal(await resolveGateToken(), "stored-token");
  } finally {
    process.env = previous;
    resetSettingsCache();
  }
});

test("resolveGateToken falls back to the env password when the store is empty", async () => {
  const previous = { ...process.env };
  resetSettingsCache();
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  process.env.SITE_PASSWORD = "env-password";
  try {
    assert.equal(await resolveGateToken(), await deriveToken("env-password"));
  } finally {
    process.env = previous;
    resetSettingsCache();
  }
});

test("resolveGateToken returns null when neither store nor env is set", async () => {
  const previous = { ...process.env };
  resetSettingsCache();
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.SITE_PASSWORD;
  try {
    assert.equal(await resolveGateToken(), null);
  } finally {
    process.env = previous;
    resetSettingsCache();
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test --prefix apps/hub`
Expected: FAIL — `resolveGateToken` is not exported.

- [ ] **Step 3: Add resolveGateToken and remove gatePassword**

In `apps/hub/src/lib/site-gate.ts`, add the import and the new function, and delete the `gatePassword` export entirely:

```ts
import { SETTING_GATE_TOKEN, readSetting } from "./settings/store.ts";

/**
 * The token an incoming cookie must match, resolved in priority order:
 *
 *   1. `gate_token` from the settings store, changed from /admin
 *   2. HMAC of `SITE_PASSWORD`, the environment-variable floor
 *   3. null — the gate is off, which is the local-dev path
 *
 * Step 2 is what makes a database outage survivable: production always has
 * SITE_PASSWORD set, so an unreachable, paused or empty store degrades to a
 * working gate rather than an open or unreachable site.
 */
export async function resolveGateToken(): Promise<string | null> {
  const stored = await readSetting(SETTING_GATE_TOKEN);
  if (stored) return stored;

  const envPassword = process.env.SITE_PASSWORD?.trim();
  if (envPassword) return gateToken(envPassword);

  return null;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test --prefix apps/hub`
Expected: PASS, 3 new tests.

- [ ] **Step 5: Update the proxy to use it**

In `apps/hub/src/proxy.ts`, change the import from `gatePassword` to `resolveGateToken`, and replace the body of `gateRedirect` so it reads:

```ts
async function gateRedirect(req: NextRequest): Promise<NextResponse | null> {
  const expected = await resolveGateToken();
  // No configured token ⇒ gate disabled. This is the local-dev path, and it is
  // the first thing checked so the proxy stays cheap on every request.
  if (!expected) return null;

  const { pathname } = req.nextUrl;
  if (pathname === "/gate" || pathname.startsWith("/gate/")) return null;
  if (GATE_PUBLIC_ASSETS.includes(pathname)) return null;

  const presented = req.cookies.get(GATE_COOKIE)?.value;
  if (presented && safeEqual(presented, expected)) return null;

  const url = req.nextUrl.clone();
  url.search = "";
  url.pathname = "/gate";
  url.searchParams.set("next", pathname + req.nextUrl.search);
  return NextResponse.redirect(url);
}
```

Remove `gateToken` from the proxy's imports if it is no longer referenced.

- [ ] **Step 6: Update the gate's unlock action**

In `apps/hub/src/app/gate/actions.ts`, replace the imports of `gatePassword` and `gateToken` with `resolveGateToken`, and change the body so it reads:

```ts
export async function unlock(formData: FormData): Promise<void> {
  const target = safeNextPath(String(formData.get("next") ?? "/"));
  const expected = await resolveGateToken();

  // Gate switched off between render and submit — nothing left to check.
  if (!expected) redirect(target);

  const entered = String(formData.get("password") ?? "");
  // Compare digests, not the raw strings, so the comparison is over two values
  // of identical width and leaks nothing about the password's length.
  const matches = safeEqual(await deriveToken(entered), expected);

  if (!matches) {
    redirect(`/gate?next=${encodeURIComponent(target)}&error=1`);
  }

  const store = await cookies();
  store.set(GATE_COOKIE, expected, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: GATE_MAX_AGE_SECONDS,
  });

  redirect(target);
}
```

- [ ] **Step 7: Verify the whole app still builds**

Run: `npm test --prefix apps/hub && npm run typecheck --workspace @mosje/hub && npm run lint --workspace @mosje/hub && npm run build --workspace @mosje/hub`
Expected: all pass, `/gate` present in the route manifest.

- [ ] **Step 8: Commit**

```bash
git add apps/hub/src/lib/site-gate.ts apps/hub/src/lib/site-gate.test.ts apps/hub/src/proxy.ts apps/hub/src/app/gate/actions.ts
git commit -m "feat(hub): resolve the gate token from the settings store

Store first, SITE_PASSWORD as the floor. A paused or unreachable
database degrades to a working gate instead of an open site."
```

---

### Task 6: Admin authentication

**Files:**
- Create: `apps/hub/src/lib/admin/auth.ts`
- Create: `apps/hub/src/lib/admin/auth.test.ts`

**Interfaces:**
- Consumes: `hmacToken`, `safeEqual` (Task 1).
- Produces:
  - `ADMIN_COOKIE: "mosje-admin"`, `ADMIN_MAX_AGE_SECONDS: number`
  - `adminConfigured(): boolean`
  - `expectedAdminToken(): Promise<string | null>`
  - `isAdminAuthenticated(): Promise<boolean>`
  - `requireAdmin(): Promise<void>`
  - `signInAdmin(entered: string): Promise<boolean>`
  - `signOutAdmin(): Promise<void>`

- [ ] **Step 1: Write the failing test**

Create `apps/hub/src/lib/admin/auth.test.ts`:

```ts
// Tests for the hub admin auth seam. Only the pure, cookie-free parts are
// unit-tested here; the cookie-reading functions need a request context and
// are covered by the manual matrix in Task 9.
//
// Run: npm test --prefix apps/hub

import { test } from "node:test";
import assert from "node:assert/strict";

import { hmacToken } from "../hmac.ts";
import { ADMIN_COOKIE, adminConfigured, expectedAdminToken } from "./auth.ts";

test("the admin cookie is not the gate cookie", () => {
  assert.equal(ADMIN_COOKIE, "mosje-admin");
  assert.notEqual(ADMIN_COOKIE, "mosje-gate");
});

test("adminConfigured is false when ADMIN_PASSWORD is unset or blank", () => {
  const previous = { ...process.env };
  try {
    delete process.env.ADMIN_PASSWORD;
    assert.equal(adminConfigured(), false);
    process.env.ADMIN_PASSWORD = "   ";
    assert.equal(adminConfigured(), false);
    process.env.ADMIN_PASSWORD = "s3cret";
    assert.equal(adminConfigured(), true);
  } finally {
    process.env = previous;
  }
});

test("expectedAdminToken is null when unconfigured", async () => {
  const previous = { ...process.env };
  try {
    delete process.env.ADMIN_PASSWORD;
    assert.equal(await expectedAdminToken(), null);
  } finally {
    process.env = previous;
  }
});

test("the admin token uses a different label from the gate token", async () => {
  const previous = { ...process.env };
  try {
    process.env.ADMIN_PASSWORD = "same-secret";
    const admin = await expectedAdminToken();
    const gate = await hmacToken("same-secret", "mosje-site-gate.v1");
    assert.notEqual(admin, gate, "a gate cookie must never be replayable as an admin cookie");
  } finally {
    process.env = previous;
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test --prefix apps/hub`
Expected: FAIL — cannot find module `./auth.ts`.

- [ ] **Step 3: Write the implementation**

Create `apps/hub/src/lib/admin/auth.ts`:

```ts
/**
 * Hub admin authentication — the seam Phase 2 replaces.
 *
 * Phase 1 is one shared ADMIN_PASSWORD, deliberately: no person other than the
 * maintainer has been identified as needing to change hub settings, and the
 * production system will run behind government SSO on government
 * infrastructure, so nothing built here survives into it.
 *
 * Every consumer goes through requireAdmin(). When named accounts arrive, the
 * internals of these functions change and no caller does.
 *
 * The password must be materially stronger than the site-gate password:
 * /admin is deliberately reachable without a gate cookie, because it is the
 * recovery path when the gate password is lost.
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { hmacToken, safeEqual } from "../hmac.ts";

export const ADMIN_COOKIE = "mosje-admin";

/** Distinct from the gate's label, so the two cookies can never be swapped. */
const ADMIN_LABEL = "mosje-hub-admin.v1";

/** 7 days — shorter than the gate's 30, because this one can change settings. */
export const ADMIN_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

/** False when ADMIN_PASSWORD is unset or blank; /admin 404s in that case. */
export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD?.trim());
}

/** The token a valid admin cookie must carry, or null when unconfigured. */
export async function expectedAdminToken(): Promise<string | null> {
  const password = process.env.ADMIN_PASSWORD?.trim();
  if (!password) return null;
  return hmacToken(password, ADMIN_LABEL);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const expected = await expectedAdminToken();
  if (!expected) return false;
  const presented = (await cookies()).get(ADMIN_COOKIE)?.value;
  return Boolean(presented && safeEqual(presented, expected));
}

/** Redirects to the sign-in page unless the caller is an authenticated admin. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
}

/** Verifies a submitted password and sets the cookie. Returns false on reject. */
export async function signInAdmin(entered: string): Promise<boolean> {
  const password = process.env.ADMIN_PASSWORD?.trim();
  if (!password) return false;

  // Compare digests so the comparison is over two equal-width values.
  const matches = safeEqual(
    await hmacToken(entered, ADMIN_LABEL),
    await hmacToken(password, ADMIN_LABEL),
  );
  if (!matches) return false;

  (await cookies()).set(ADMIN_COOKIE, await hmacToken(password, ADMIN_LABEL), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: ADMIN_MAX_AGE_SECONDS,
  });
  return true;
}

export async function signOutAdmin(): Promise<void> {
  (await cookies()).delete({ name: ADMIN_COOKIE, path: "/admin" });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test --prefix apps/hub`
Expected: PASS, 4 new tests.

- [ ] **Step 5: Set the admin password**

Generate a strong password and add it to Vercel. Show the generated value to the user — they need it to sign in — and tell them it is not stored anywhere in the repo.

```bash
openssl rand -base64 24
```

Then, substituting the generated value:

```bash
printf '<generated-password>' | vercel env add ADMIN_PASSWORD production
printf '<generated-password>' | vercel env add ADMIN_PASSWORD preview
```

Do NOT add it to `development`; `/admin` should 404 locally unless deliberately configured.

- [ ] **Step 6: Commit**

```bash
git add apps/hub/src/lib/admin/auth.ts apps/hub/src/lib/admin/auth.test.ts
git commit -m "feat(hub): admin auth seam

One shared ADMIN_PASSWORD behind requireAdmin(), on its own cookie and
HMAC label so a gate cookie can never be replayed as an admin one.
Named accounts replace the internals of this file and nothing else."
```

---

### Task 7: The admin sign-in page

**Files:**
- Create: `apps/hub/src/app/admin/login/page.tsx`
- Create: `apps/hub/src/app/admin/login/actions.ts`
- Create: `apps/hub/src/app/admin/login/login-form.tsx`
- Modify: `apps/hub/src/proxy.ts`
- Modify: `apps/hub/src/components/conditional-app-switcher.tsx`

**Interfaces:**
- Consumes: `adminConfigured`, `isAdminAuthenticated`, `signInAdmin` (Task 6).
- Produces: a reachable `/admin/login`, and `/admin*` exempt from the site gate.

- [ ] **Step 1: Exempt /admin from the site gate**

In `apps/hub/src/proxy.ts`, inside `gateRedirect`, add the exemption immediately after the existing `/gate` check:

```ts
  if (pathname === "/gate" || pathname.startsWith("/gate/")) return null;
  // /admin is deliberately outside the gate: it is the recovery path when the
  // gate password is lost or a bad value is written. It has its own password.
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return null;
```

- [ ] **Step 2: Write the sign-in action**

Create `apps/hub/src/app/admin/login/actions.ts`:

```ts
"use server";

import { redirect } from "next/navigation";
import { signInAdmin } from "@/lib/admin/auth";

export async function submitAdminLogin(formData: FormData): Promise<void> {
  const entered = String(formData.get("password") ?? "");
  const ok = await signInAdmin(entered);
  redirect(ok ? "/admin" : "/admin/login?error=1");
}
```

- [ ] **Step 3: Write the form**

Create `apps/hub/src/app/admin/login/login-form.tsx`:

```tsx
"use client";

// Client component because FormField takes a render prop, and functions cannot
// cross the server→client boundary. The server action arrives as a prop.

import { useFormStatus } from "react-dom";
import { Alert, Button, FormField, Input } from "@mosje/design-system";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? "Checking…" : "Sign in"}
    </Button>
  );
}

export interface AdminLoginFormProps {
  action: (formData: FormData) => Promise<void>;
  invalid: boolean;
}

export function AdminLoginForm({ action, invalid }: AdminLoginFormProps) {
  return (
    <form action={action} className="mt-6 flex flex-col gap-4">
      {invalid ? (
        <Alert status="error" title="Incorrect password">
          That admin password was not recognised.
        </Alert>
      ) : null}

      <FormField label="Admin password" required>
        {(control) => (
          <Input
            {...control}
            name="password"
            type="password"
            autoComplete="current-password"
            autoFocus
            required
          />
        )}
      </FormField>

      <SubmitButton />
    </form>
  );
}
```

- [ ] **Step 4: Write the page**

Create `apps/hub/src/app/admin/login/page.tsx`:

```tsx
/**
 * DS Audit: Button ✅ existing · Input ✅ existing · FormField ✅ existing ·
 *           Alert ✅ existing · page layout ➕ app-local.
 *
 * Layout is app-local for the same reason the gate's is: a deployment
 * administration surface is not a product screen any portal reuses.
 */

import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { adminConfigured, isAdminAuthenticated } from "@/lib/admin/auth";
import { submitAdminLogin } from "./actions";
import { AdminLoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin sign-in — MoSJE Digital Estate",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  // No configured password means no admin surface at all — 404 rather than a
  // form that can never be satisfied.
  if (!adminConfigured()) notFound();
  if (await isAdminAuthenticated()) redirect("/admin");

  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-line bg-surface p-8 shadow-sm">
          <div className="text-center">
            <h1 className="text-xl font-bold text-ink">Hub administration</h1>
            <p className="mt-1 text-sm text-ink-muted">
              Settings for the deployed prototype
            </p>
          </div>

          <AdminLoginForm action={submitAdminLogin} invalid={error === "1"} />
        </div>

        <p className="mt-6 text-center text-xs text-ink-hint">
          This is not the review password. Ask the maintainer if you need access.
        </p>
      </div>
    </main>
  );
}
```

- [ ] **Step 5: Hide the AppSwitcher on admin pages**

In `apps/hub/src/components/conditional-app-switcher.tsx`, replace the guard:

```tsx
  // Hidden on the hub root (it *is* the portals index), on the site gate, and
  // across the admin surface, where it offers nothing relevant.
  if (pathname === "/" || pathname === "/gate" || pathname.startsWith("/admin")) return null;
```

- [ ] **Step 6: Verify**

Run: `npm test --prefix apps/hub && npm run typecheck --workspace @mosje/hub && npm run lint --workspace @mosje/hub && npm run build --workspace @mosje/hub`
Expected: all pass, `/admin/login` present in the route manifest.

- [ ] **Step 7: Commit**

```bash
git add apps/hub/src/app/admin apps/hub/src/proxy.ts apps/hub/src/components/conditional-app-switcher.tsx
git commit -m "feat(hub): admin sign-in at /admin/login

/admin sits outside the site gate on purpose — it is the recovery path
when the gate password is lost, so it cannot depend on knowing it."
```

---

### Task 8: The settings page

**Files:**
- Create: `apps/hub/src/app/admin/page.tsx`
- Create: `apps/hub/src/app/admin/actions.ts`
- Create: `apps/hub/src/app/admin/settings-form.tsx`

**Interfaces:**
- Consumes: `requireAdmin`, `signOutAdmin` (Task 6); `writeSetting`, `SETTING_GATE_TOKEN` (Task 4); `deriveToken` (Task 1/5).
- Produces: a working `/admin` that changes the gate password.

- [ ] **Step 1: Write the actions**

Create `apps/hub/src/app/admin/actions.ts`:

```ts
"use server";

import { redirect } from "next/navigation";
import { requireAdmin, signOutAdmin } from "@/lib/admin/auth";
import { SETTING_GATE_TOKEN, writeSetting } from "@/lib/settings/store";
import { deriveToken } from "@/lib/site-gate";

/** Minimum length for the shared review password. */
const MIN_LENGTH = 12;

export async function changeGatePassword(formData: FormData): Promise<void> {
  await requireAdmin();

  const next = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (next.length < MIN_LENGTH) redirect("/admin?error=short");
  if (next !== confirm) redirect("/admin?error=mismatch");

  // Only the digest is stored. The plaintext password never reaches the
  // database, so a leak cannot expose a string reused elsewhere.
  try {
    await writeSetting(SETTING_GATE_TOKEN, await deriveToken(next));
  } catch {
    redirect("/admin?error=store");
  }

  redirect("/admin?saved=1");
}

export async function signOut(): Promise<void> {
  await signOutAdmin();
  redirect("/admin/login");
}
```

- [ ] **Step 2: Write the form**

Create `apps/hub/src/app/admin/settings-form.tsx`:

```tsx
"use client";

import { useFormStatus } from "react-dom";
import { Alert, Button, FormField, Input } from "@mosje/design-system";

const MESSAGES: Record<string, string> = {
  short: "Use at least 12 characters.",
  mismatch: "The two entries did not match.",
  store: "Could not reach the settings store. The password was not changed.",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? "Saving…" : "Change password"}
    </Button>
  );
}

export interface GatePasswordFormProps {
  action: (formData: FormData) => Promise<void>;
  error?: string;
  saved: boolean;
}

export function GatePasswordForm({ action, error, saved }: GatePasswordFormProps) {
  return (
    <form action={action} className="mt-6 flex flex-col gap-4">
      {saved ? (
        <Alert status="success" title="Password changed">
          It takes up to a minute to apply everywhere. Everyone signed in with
          the old password will be asked for the new one.
        </Alert>
      ) : null}

      {error ? (
        <Alert status="error" title="Not changed">
          {MESSAGES[error] ?? "Something went wrong."}
        </Alert>
      ) : null}

      <FormField label="New review password" hint="At least 12 characters." required>
        {(control) => (
          <Input {...control} name="password" type="password" autoComplete="new-password" required />
        )}
      </FormField>

      <FormField label="Confirm new password" required>
        {(control) => (
          <Input {...control} name="confirm" type="password" autoComplete="new-password" required />
        )}
      </FormField>

      <SubmitButton />
    </form>
  );
}
```

- [ ] **Step 3: Write the page**

Create `apps/hub/src/app/admin/page.tsx`:

```tsx
/**
 * DS Audit: Button ✅ existing · Input ✅ existing · FormField ✅ existing ·
 *           Alert ✅ existing · page layout ➕ app-local.
 */

import type { Metadata } from "next";
import { Button } from "@mosje/design-system";
import { requireAdmin } from "@/lib/admin/auth";
import { changeGatePassword, signOut } from "./actions";
import { GatePasswordForm } from "./settings-form";

export const metadata: Metadata = {
  title: "Hub settings — MoSJE Digital Estate",
  robots: { index: false, follow: false },
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  await requireAdmin();
  const { error, saved } = await searchParams;

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-12">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Hub settings</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Settings for the deployed prototype.
          </p>
        </div>
        <form action={signOut}>
          <Button type="submit" appearance="outlined" size="sm">
            Sign out
          </Button>
        </form>
      </div>

      <section className="mt-8 rounded-xl border border-line bg-surface p-6 shadow-sm">
        <h2 className="text-base font-semibold text-ink">Review password</h2>
        <p className="mt-1 text-sm text-ink-muted">
          The shared password reviewers enter to reach the prototype. Changing it
          signs everyone out.
        </p>

        <GatePasswordForm action={changeGatePassword} error={error} saved={saved === "1"} />
      </section>

      <p className="mt-6 text-xs text-ink-hint">
        If the settings store is unreachable, the gate falls back to the
        SITE_PASSWORD environment variable, so the estate stays reachable.
      </p>
    </main>
  );
}
```

- [ ] **Step 4: Verify**

Run: `npm test --prefix apps/hub && npm run typecheck --workspace @mosje/hub && npm run lint --workspace @mosje/hub && npm run build --workspace @mosje/hub`
Expected: all pass, `/admin` present in the route manifest.

- [ ] **Step 5: Commit**

```bash
git add apps/hub/src/app/admin
git commit -m "feat(hub): change the review password from /admin

Writes only the HMAC digest, so the plaintext password never reaches
the database."
```

---

### Task 9: Deploy and verify end to end

**Files:** none — this task ships and proves the feature.

**Interfaces:**
- Consumes: everything above.
- Produces: a verified production deployment.

- [ ] **Step 1: Deploy to production**

```bash
vercel deploy --prod
```

Expected: `readyState: "READY"`.

- [ ] **Step 2: Confirm the gate still works from the environment fallback**

The store has no `gate_token` row yet, so the gate must still be using `SITE_PASSWORD`.

```bash
curl -s -o /dev/null -w '%{http_code} -> %{redirect_url}\n' https://mosje-samavesh.vercel.app/website
```

Expected: `307 -> https://mosje-samavesh.vercel.app/gate?next=%2Fwebsite`.

Then open the gate in the browser preview, enter the current review password, and confirm it lands on `/website`.

- [ ] **Step 3: Confirm /admin is reachable without a gate cookie**

In a browser context with no gate cookie:

```bash
curl -s -o /dev/null -w '%{http_code}\n' https://mosje-samavesh.vercel.app/admin/login
```

Expected: `200` — not a redirect to `/gate`.

- [ ] **Step 4: Reject a wrong admin password**

Open `/admin/login` in the browser preview, submit a wrong password.
Expected: redirected to `/admin/login?error=1`, the error Alert renders, no cookie set.

- [ ] **Step 5: Sign in and change the review password**

Sign in with the generated `ADMIN_PASSWORD`, then on `/admin` submit a new review password twice.
Expected: `/admin?saved=1` with the success Alert.

Also confirm the guards: submit an 11-character password (expect `error=short`), and two different values (expect `error=mismatch`).

- [ ] **Step 6: Confirm the new password took effect and the old one did not**

Wait 60 seconds for the cache to expire. In a fresh browser context, open `https://mosje-samavesh.vercel.app/`.
Expected: the new password is accepted; the old one is rejected with the "Incorrect password" Alert.

- [ ] **Step 7: Confirm only the digest reached the database**

Use the Supabase MCP `execute_sql`:

```sql
select key, length(value) as value_length, updated_at from public.hub_settings;
```

Expected: one row, `key = 'gate_token'`, `value_length = 43`. If the length is not 43 the plaintext password has been stored — stop and fix Task 8 before continuing.

- [ ] **Step 8: Confirm the fallback**

Use the Supabase MCP `execute_sql` to remove the row, simulating an empty or unreachable store:

```sql
delete from public.hub_settings where key = 'gate_token';
```

Wait 60 seconds, then in a fresh browser context confirm the gate accepts the `SITE_PASSWORD` value again. This proves the outage path.

- [ ] **Step 9: Restore and record the final password**

Sign in at `/admin` and set the review password to its final value. Tell the user both the review password and the admin password, and state plainly that neither is stored in the repository.

- [ ] **Step 10: Update the project brain**

Add a short entry to `CLAUDE.md` under **Active context** recording that the hub has a site gate whose password lives in `hub_settings` in Supabase, changeable at `/admin`, with `SITE_PASSWORD` as the fallback floor and `ADMIN_PASSWORD` guarding the panel.

```bash
git add CLAUDE.md
git commit -m "docs: record the hub site gate and admin settings in the project brain"
git push origin main
```

---

## Self-Review

**Spec coverage:**

| Spec requirement | Task |
|---|---|
| Datastore is Supabase Postgres | 3 |
| `hub_settings` table, RLS on, no policies | 3 |
| Plaintext password never stored; `gate_token` is the digest | 4, 8, verified in 9 |
| Resolution order store → env → disabled | 5 |
| 60s TTL cache | 4 |
| 1.5s fetch timeout | 4 |
| Plain `fetch`, no `supabase-js` | 4 |
| `/admin` exempt from the gate | 7 |
| `ADMIN_PASSWORD` separate and stronger | 6 |
| Auth behind a single `requireAdmin()` | 6 |
| `ADMIN_PASSWORD` unset ⇒ 404 | 7 |
| Service-role key server-only | 4, 6 (no `"use client"` file imports it) |
| Unit tests for `safeNextPath`, `safeEqual`, resolution, cache TTL | 1, 2, 4, 5 |
| Manual verification matrix | 9 |
| DS audit, no new DS components | 7, 8 |

**Known gaps, carried deliberately:** rate limiting is out of scope per the spec and remains absent. The cookie-reading functions in `auth.ts` (`isAdminAuthenticated`, `requireAdmin`, `signInAdmin`, `signOutAdmin`) are covered by the Task 9 manual matrix rather than unit tests, because they need a Next request context; this is stated in the test file's header comment.

**Type consistency:** `hmacToken(secret, label)` is used with that signature in Tasks 1, 6. `readSetting(key, deps?)` / `writeSetting(key, value, deps?)` / `resetSettingsCache()` / `StoreDeps` match between Tasks 4 and 5. `deriveToken(password)` keeps its Task 1 signature and is used in Tasks 5 and 8. `resolveGateToken()` is defined in Task 5 and used in Tasks 5 only. `SETTING_GATE_TOKEN` is used in Tasks 4, 5, 8. `requireAdmin` / `signOutAdmin` defined in Task 6, used in Tasks 7, 8.
