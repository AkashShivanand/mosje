// Tests for the registry config read — the degradation contract, mostly.
// A settings row must never be able to break the estate, so every failure mode
// here has to land on "use the code defaults" rather than on an exception.
//
// Run: npm test --prefix apps/hub

import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";

import { DEFAULT_APPS } from "@mosje/design-system/app-registry";
import { resetSettingsCache, type StoreDeps } from "../settings/store.ts";
import { blockedEntry, hiddenFrom, readRegistryConfig, registryFrom } from "./config.ts";

const ENV = { SUPABASE_URL: "https://p.supabase.co", SUPABASE_SERVICE_ROLE_KEY: "svc" };

function withEnv(fn: () => Promise<void>): Promise<void> {
  const previous = { ...process.env };
  Object.assign(process.env, ENV);
  return fn().finally(() => {
    process.env = previous;
  });
}

/** Deps whose fetch returns one PostgREST row carrying `value`. */
function depsReturning(value: string): StoreDeps {
  return {
    fetchImpl: (async () =>
      new Response(JSON.stringify([{ value }]), {
        status: 200,
        headers: { "content-type": "application/json" },
      })) as unknown as typeof fetch,
    now: () => Date.now(),
  };
}

/** Deps whose fetch rejects, standing in for a timeout or a dead network. */
function depsThrowing(error: Error): StoreDeps {
  return {
    fetchImpl: (async () => {
      throw error;
    }) as unknown as typeof fetch,
    now: () => Date.now(),
  };
}

/** Deps whose fetch returns an HTTP error. */
function depsWithStatus(status: number): StoreDeps {
  return {
    fetchImpl: (async () => new Response("", { status })) as unknown as typeof fetch,
    now: () => Date.now(),
  };
}

const paths = (entries: { path: string }[]) => entries.map((e) => e.path);

beforeEach(() => resetSettingsCache());

test("an unconfigured store yields the code defaults", async () => {
  const previous = { ...process.env };
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  try {
    const config = await readRegistryConfig(depsReturning("{}"));
    assert.equal(config, null);
    assert.deepEqual(paths(registryFrom(config)), paths(DEFAULT_APPS));
  } finally {
    process.env = previous;
  }
});

test("a valid stored patch is applied", async () => {
  await withEnv(async () => {
    const config = await readRegistryConfig(
      depsReturning(
        JSON.stringify({
          version: 1,
          entries: { "/portals/nmba": { status: "hidden" } },
        }),
      ),
    );
    assert.equal(config?.entries["/portals/nmba"]?.status, "hidden");
    const rendered = registryFrom(config);
    assert.ok(!paths(rendered).includes("/portals/nmba"));
    assert.deepEqual(paths(hiddenFrom(config)), ["/portals/nmba"]);
  });
});

test("a network failure falls back to the code defaults", async () => {
  await withEnv(async () => {
    const config = await readRegistryConfig(
      depsThrowing(new Error("connect ECONNREFUSED")),
    );
    assert.equal(config, null);
    assert.deepEqual(paths(registryFrom(config)), paths(DEFAULT_APPS));
  });
});

test("a timeout falls back to the code defaults", async () => {
  await withEnv(async () => {
    const abort = new Error("The operation was aborted due to timeout");
    abort.name = "TimeoutError";
    const config = await readRegistryConfig(depsThrowing(abort));
    assert.equal(config, null);
    assert.deepEqual(paths(registryFrom(config)), paths(DEFAULT_APPS));
  });
});

test("an HTTP error falls back to the code defaults", async () => {
  await withEnv(async () => {
    const config = await readRegistryConfig(depsWithStatus(500));
    assert.equal(config, null);
    assert.deepEqual(paths(registryFrom(config)), paths(DEFAULT_APPS));
  });
});

test("a malformed stored value falls back to the code defaults without throwing", async () => {
  await withEnv(async () => {
    const config = await readRegistryConfig(depsReturning("{ not json at all"));
    assert.equal(config, null);
    assert.deepEqual(paths(registryFrom(config)), paths(DEFAULT_APPS));
  });
});

test("an oversized stored value is rejected", async () => {
  await withEnv(async () => {
    const config = await readRegistryConfig(
      depsReturning(
        JSON.stringify({
          version: 1,
          entries: { "/a": { desc: "x".repeat(40_000) } },
        }),
      ),
    );
    assert.equal(config, null);
  });
});

test("a patch referencing an unknown path is ignored, not fatal", async () => {
  await withEnv(async () => {
    const config = await readRegistryConfig(
      depsReturning(
        JSON.stringify({
          version: 1,
          entries: { "/portals/not-a-real-portal": { status: "hidden" } },
        }),
      ),
    );
    assert.deepEqual(paths(registryFrom(config)), paths(DEFAULT_APPS));
    assert.deepEqual(hiddenFrom(config), []);
  });
});

test("hiddenFrom is empty when there is no config", () => {
  assert.deepEqual(hiddenFrom(null), []);
});

// ── the proxy's block decision ────────────────────────────────────────────

const HIDDEN_NMBA = hiddenFrom({
  version: 1,
  entries: { "/portals/nmba": { status: "hidden" } },
});

test("a hidden path is blocked", () => {
  const match = blockedEntry({
    pathname: "/portals/nmba",
    hidden: HIDDEN_NMBA,
    isAdmin: false,
  });
  assert.equal(match?.path, "/portals/nmba");
});

test("everything beneath a hidden path is blocked, including its login page", () => {
  for (const pathname of [
    "/portals/nmba/admin/login",
    "/portals/nmba/admin/mass-pledge/new",
    "/portals/nmba/logo.svg",
  ]) {
    assert.equal(
      blockedEntry({ pathname, hidden: HIDDEN_NMBA, isAdmin: false })?.path,
      "/portals/nmba",
      `expected ${pathname} to be blocked`,
    );
  }
});

test("an admin passes through a hidden path", () => {
  assert.equal(
    blockedEntry({ pathname: "/portals/nmba", hidden: HIDDEN_NMBA, isAdmin: true }),
    null,
  );
});

test("a live path is never blocked", () => {
  assert.equal(
    blockedEntry({ pathname: "/portals/tg", hidden: HIDDEN_NMBA, isAdmin: false }),
    null,
  );
});

test("nothing hidden means nothing blocked", () => {
  assert.equal(
    blockedEntry({ pathname: "/portals/nmba", hidden: [], isAdmin: false }),
    null,
  );
});

test("the recovery surfaces are never blocked, even if their entry is hidden", () => {
  // Hiding the design system must not take /admin, /gate or /unavailable with
  // it — that would lock the admin out of the control that unhides it.
  const hidden = hiddenFrom({
    version: 1,
    entries: { "/design-system": { status: "hidden" } },
  });
  for (const pathname of [
    "/admin",
    "/admin/portals",
    "/gate",
    "/unavailable",
    "/_next/data/x.json",
  ]) {
    assert.equal(
      blockedEntry({ pathname, hidden, isAdmin: false }),
      null,
      `expected ${pathname} to stay reachable`,
    );
  }
  // The hidden entry itself is still blocked.
  assert.equal(
    blockedEntry({ pathname: "/design-system", hidden, isAdmin: false })?.path,
    "/design-system",
  );
});

test("duplicate slashes cannot slip past the block", () => {
  // //portals/nmba resolves to the same route as /portals/nmba, so a prefix
  // match on the raw string would wave the alternate spelling through.
  for (const pathname of [
    "//portals/nmba",
    "/portals//nmba",
    "//portals//nmba//admin",
  ]) {
    assert.equal(
      blockedEntry({ pathname, hidden: HIDDEN_NMBA, isAdmin: false })?.path,
      "/portals/nmba",
      `expected ${pathname} to be blocked`,
    );
  }
});

test("duplicate slashes cannot smuggle a request past the exemption list either", () => {
  const hidden = hiddenFrom({
    version: 1,
    entries: { "/design-system": { status: "hidden" } },
  });
  assert.equal(blockedEntry({ pathname: "//admin", hidden, isAdmin: false }), null);
});

test("a sibling path sharing a prefix is not blocked", () => {
  assert.equal(
    blockedEntry({
      pathname: "/portals/nmba-something-else",
      hidden: HIDDEN_NMBA,
      isAdmin: false,
    }),
    null,
  );
});
