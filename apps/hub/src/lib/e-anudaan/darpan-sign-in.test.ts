// Sign in with NGO-DARPAN: every return state, and the order the checks run in.
//
// Run: node --test src/lib/e-anudaan/darpan-sign-in.test.ts   (from apps/hub)

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  DARPAN_ATTRIBUTES,
  DARPAN_DEMO_SCENARIOS,
  DARPAN_LINKS_KEY,
  DARPAN_REQUEST_TTL_MS,
  DARPAN_ROUTES,
  attributeValue,
  authorizeUrl,
  beginRequest,
  callbackUrl,
  clearRequest,
  darpanDirectory,
  exchangeDarpanCode,
  isDarpanDemoRoute,
  maskEmail,
  maskMobile,
  planDemoScenario,
  readLinks,
  readRequest,
  resolveDarpanReturn,
  simulatedCode,
  writeLinks,
  type DarpanReturnInput,
} from "./darpan-sign-in.ts";

const NOW = Date.parse("2026-09-17T10:00:00Z");
const DIR = darpanDirectory(undefined);
const NGOS = [
  { id: "ngo-001", darpanId: "MH/2016/100000" },
  { id: "ngo-002", darpanId: "UP/2016/100137" },
];

function input(over: Partial<DarpanReturnInput> & { params: DarpanReturnInput["params"] }): DarpanReturnInput {
  return {
    pending: { state: "abc", startedAt: NOW - 30_000 },
    now: NOW,
    exchange: (code) => exchangeDarpanCode(code, DIR),
    ngos: NGOS,
    linkedDarpanIds: [],
    ...over,
  };
}

class MemoryStore {
  map = new Map<string, string>();
  getItem(k: string) {
    return this.map.get(k) ?? null;
  }
  setItem(k: string, v: string) {
    this.map.set(k, v);
  }
  removeItem(k: string) {
    this.map.delete(k);
  }
}

test("linked: a registered, already-linked organisation goes straight in", () => {
  const r = resolveDarpanReturn(
    input({ params: { code: simulatedCode("registered"), state: "abc" }, linkedDarpanIds: ["MH/2016/100000"] }),
  );
  assert.equal(r.kind, "linked");
  assert.equal(r.kind === "linked" && r.ngoId, "ngo-001");
});

test("first link: registered on e-Anudaan but never signed in with DARPAN", () => {
  const r = resolveDarpanReturn(input({ params: { code: simulatedCode("registered"), state: "abc" } }));
  assert.equal(r.kind, "first-link");
  assert.equal(r.kind === "first-link" && r.ngoId, "ngo-001");
});

test("DARPAN IDs match regardless of case and spacing", () => {
  const r = resolveDarpanReturn(
    input({ params: { code: simulatedCode("registered"), state: "abc" }, linkedDarpanIds: [" mh/2016/100000 "] }),
  );
  assert.equal(r.kind, "linked");
});

test("not registered: an active DARPAN organisation e-Anudaan does not hold", () => {
  const r = resolveDarpanReturn(input({ params: { code: simulatedCode("unregistered"), state: "abc" } }));
  assert.equal(r.kind, "not-registered");
  assert.equal(r.kind === "not-registered" && r.profile.organisationName, "Nav Chetna Welfare Society");
});

test("inactive and suspended registrations are stopped with their status", () => {
  for (const account of ["inactive", "suspended"] as const) {
    const r = resolveDarpanReturn(input({ params: { code: simulatedCode(account), state: "abc" } }));
    assert.equal(r.kind, "inactive");
    assert.equal(r.kind === "inactive" && r.status, account === "inactive" ? "Inactive" : "Suspended");
  }
});

test("an inactive registration is stopped even when e-Anudaan holds and has linked it", () => {
  const inactive = { ...DIR.registered, status: "Inactive" as const };
  const r = resolveDarpanReturn(
    input({
      params: { code: "anything", state: "abc" },
      exchange: () => inactive,
      linkedDarpanIds: [inactive.darpanId],
    }),
  );
  assert.equal(r.kind, "inactive");
});

test("refused: access_denied is the applicant's own decision", () => {
  assert.equal(resolveDarpanReturn(input({ params: { error: "access_denied", state: "abc" } })).kind, "refused");
});

test("unavailable: any other provider error, or a return with neither code nor error", () => {
  for (const error of ["temporarily_unavailable", "server_error", "invalid_scope"]) {
    assert.equal(resolveDarpanReturn(input({ params: { error, state: "abc" } })).kind, "unavailable");
  }
  assert.equal(resolveDarpanReturn(input({ params: { state: "abc" } })).kind, "unavailable");
});

test("expired: no request, a mismatched state, or a stale request — checked before anything else", () => {
  const code = simulatedCode("registered");
  assert.equal(resolveDarpanReturn(input({ params: { code, state: "abc" }, pending: null })).kind, "expired");
  assert.equal(resolveDarpanReturn(input({ params: { code, state: "forged" } })).kind, "expired");
  assert.equal(resolveDarpanReturn(input({ params: { code } })).kind, "expired");
  // A forged error cannot pick the screen either.
  assert.equal(resolveDarpanReturn(input({ params: { error: "access_denied", state: "forged" } })).kind, "expired");
  const stale = { state: "abc", startedAt: NOW - DARPAN_REQUEST_TTL_MS - 1 };
  assert.equal(resolveDarpanReturn(input({ params: { code, state: "abc" }, pending: stale })).kind, "expired");
  const future = { state: "abc", startedAt: NOW + 60_000 };
  assert.equal(resolveDarpanReturn(input({ params: { code, state: "abc" }, pending: future })).kind, "expired");
});

test("expired: a code the provider did not issue", () => {
  assert.equal(resolveDarpanReturn(input({ params: { code: "made-up", state: "abc" } })).kind, "expired");
  assert.equal(resolveDarpanReturn(input({ params: { code: "sim.toString", state: "abc" } })).kind, "expired");
});

test("the request is single-use and survives a round trip through storage", () => {
  const s = new MemoryStore();
  beginRequest(s, "xyz", NOW);
  assert.deepEqual(readRequest(s), { state: "xyz", startedAt: NOW });
  clearRequest(s);
  assert.equal(readRequest(s), null);
  s.setItem("e-anudaan.darpan.request.v1", "{not json");
  assert.equal(readRequest(s), null);
  assert.equal(readRequest(null), null);
});

test("links: the demo organisation starts linked; an explicit empty list stays empty", () => {
  const s = new MemoryStore();
  assert.deepEqual(readLinks(s), ["MH/2016/100000"]);
  writeLinks(s, []);
  assert.deepEqual(readLinks(s), []);
  writeLinks(s, ["A", "A", "B"]);
  assert.deepEqual(JSON.parse(s.getItem(DARPAN_LINKS_KEY)!), ["A", "B"]);
});

test("URLs carry state and exactly one of code or error", () => {
  const a = new URL(authorizeUrl("s1"), "http://x");
  assert.equal(a.pathname, DARPAN_ROUTES.provider);
  assert.equal(a.searchParams.get("state"), "s1");
  assert.equal(a.searchParams.get("redirect_uri"), DARPAN_ROUTES.callback);
  assert.equal(a.searchParams.get("scope")?.split(" ").length, DARPAN_ATTRIBUTES.length);

  const ok = new URL(callbackUrl("s1", { code: "c" }), "http://x");
  assert.equal(ok.searchParams.get("code"), "c");
  assert.equal(ok.searchParams.has("error"), false);
  const no = new URL(callbackUrl("s1", { error: "access_denied" }), "http://x");
  assert.equal(no.searchParams.get("error"), "access_denied");
  assert.equal(no.searchParams.has("code"), false);
});

test("the registered organisation follows the seeded NGO", () => {
  const d = darpanDirectory({
    id: "ngo-001",
    name: "Test Sansthan",
    darpanId: "DL/2020/1",
    registrationNo: "R-1",
    district: "Pune",
    state: "Maharashtra",
  });
  assert.equal(d.registered.organisationName, "Test Sansthan");
  assert.equal(d.registered.darpanId, "DL/2020/1");
});

test("attribute display masks contact details and never shows a PAN number", () => {
  assert.equal(maskMobile("9441747200"), "+91 94417 •••00");
  assert.equal(maskEmail("sankalpsevasansthan@gmail.com"), "s•••••n@gmail.com");
  assert.equal(attributeValue(DIR.registered, "panOnRecord"), "Yes");
  assert.equal(attributeValue(DIR.inactive, "panOnRecord"), "No");
  assert.ok(!attributeValue(DIR.registered, "contact").includes("9441747200"));
});

test("every demo scenario resolves to the state it is named after", () => {
  const expected: Record<string, string> = {
    linked: "linked",
    "first-link": "first-link",
    "not-registered": "not-registered",
    inactive: "inactive",
    suspended: "inactive",
    refused: "refused",
    unavailable: "unavailable",
    expired: "expired",
  };
  for (const { id } of DARPAN_DEMO_SCENARIOS) {
    const plan = planDemoScenario(id);
    if (plan.go.to === "provider") continue;
    const links = plan.link === "set" ? [DIR.registered.darpanId] : [];
    const params =
      plan.go.to === "callback"
        ? { ...("code" in plan.go.answer ? { code: plan.go.answer.code } : { error: plan.go.answer.error }), state: "abc" }
        : { state: "abc" };
    const pending = plan.go.to === "callback-without-request" ? null : { state: "abc", startedAt: NOW };
    const r = resolveDarpanReturn(input({ params, pending, linkedDarpanIds: links }));
    assert.equal(r.kind, expected[id], id);
  }
});

test("the dock's tab appears on the sign-in routes and nowhere else", () => {
  assert.equal(isDarpanDemoRoute("/portals/e-anudaan/login"), true);
  assert.equal(isDarpanDemoRoute("/portals/e-anudaan/login/darpan"), true);
  assert.equal(isDarpanDemoRoute("/portals/e-anudaan/login/darpan-return"), true);
  assert.equal(isDarpanDemoRoute("/portals/e-anudaan/register"), true);
  assert.equal(isDarpanDemoRoute("/portals/e-anudaan/ngo/dashboard"), false);
  assert.equal(isDarpanDemoRoute("/portals/e-anudaan/loginx"), false);
  assert.equal(isDarpanDemoRoute(null), false);
});

test("the stand-in's registered organisation is the NGO the prototype signs in as", async () => {
  const { buildSeed } = await import("./store/seed.ts");
  const ngo = buildSeed().ngos[0]!;
  // The demo dock and the first-run link list use the fallback without the store; it must agree.
  assert.equal(DIR.registered.darpanId, ngo.darpanId);
  assert.equal(DIR.registered.organisationName, ngo.name);
  assert.equal(DIR.registered.registrationNo, ngo.registrationNo);
});
