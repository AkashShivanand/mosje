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

// ── Single-flight ─────────────────────────────────────────────────────────
// Concurrent readers of the same key must share one round-trip. Without this,
// every request arriving during a cold start hits the database independently,
// on the request hot path, exactly when the store is most likely struggling.

test("concurrent reads of the same key share a single fetch", async () => {
  const previous = { ...process.env };
  Object.assign(process.env, ENV);
  resetSettingsCache();
  try {
    let calls = 0;
    let release: (() => void) | undefined;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    const deps: StoreDeps = {
      fetchImpl: (async () => {
        calls += 1;
        await gate;
        return jsonResponse([{ value: "shared" }]);
      }) as unknown as typeof fetch,
      now: () => Date.now(),
    };

    const reads = [
      readSetting(SETTING_GATE_TOKEN, deps),
      readSetting(SETTING_GATE_TOKEN, deps),
      readSetting(SETTING_GATE_TOKEN, deps),
    ];
    release?.();
    const results = await Promise.all(reads);

    assert.equal(calls, 1, "three concurrent readers must cost one fetch");
    assert.deepEqual(results, ["shared", "shared", "shared"]);
  } finally {
    process.env = previous;
  }
});

test("a failed in-flight read is not left behind to poison later reads", async () => {
  const previous = { ...process.env };
  Object.assign(process.env, ENV);
  resetSettingsCache();
  try {
    let calls = 0;
    const deps: StoreDeps = {
      fetchImpl: (async () => {
        calls += 1;
        throw new Error("network down");
      }) as unknown as typeof fetch,
      now: () => Date.now(),
    };
    assert.equal(await readSetting("k1", deps), null);
    resetSettingsCache();
    assert.equal(await readSetting("k1", deps), null);
    assert.equal(calls, 2, "the in-flight entry must clear after a failure");
  } finally {
    process.env = previous;
  }
});

test("a read in flight during a write does not re-cache the pre-write value", async () => {
  const previous = { ...process.env };
  Object.assign(process.env, ENV);
  resetSettingsCache();
  try {
    let calls = 0;
    let release: (() => void) | undefined;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    const deps: StoreDeps = {
      fetchImpl: (async () => {
        calls += 1;
        // First read blocks; later reads resolve immediately with the new value.
        if (calls === 1) {
          await gate;
          return jsonResponse([{ value: "stale" }]);
        }
        return jsonResponse([{ value: "fresh" }]);
      }) as unknown as typeof fetch,
      now: () => Date.now(),
    };

    const inflight = readSetting("k", deps);
    // A write lands while that read is still outstanding.
    resetSettingsCache();
    release?.();
    assert.equal(await inflight, "stale", "the caller still gets its own result");

    // The stale value must NOT have been cached, so the next read refetches.
    assert.equal(await readSetting("k", deps), "fresh");
    assert.equal(calls, 2);
  } finally {
    process.env = previous;
  }
});
