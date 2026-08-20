// Tests for the assistant's configuration.
//
// The interesting behaviour here is entirely about what happens when the stored
// value is WRONG — absent, stale, hand-edited, or written against a registry
// that has since changed. A settings row must never be able to break a page,
// and a toggle that silently does nothing is worse than one that fails loudly.
//
// Run: npm test --prefix apps/hub

import { test } from "node:test";
import assert from "node:assert/strict";

import type { AppEntry } from "@mosje/design-system/registry";
import {
  CHATBOT_CONFIG_MAX_BYTES,
  CHATBOT_CONFIG_VERSION,
  chatbotEnabledAt,
  chatbotEnabledPaths,
  chatbotSurfaces,
  emptyChatbotConfig,
  parseChatbotConfig,
  serializeChatbotConfig,
  type ChatbotConfig,
} from "./config.ts";

const APPS: AppEntry[] = [
  { name: "DoSJE Website", path: "/website", group: "Website" },
  { name: "Nasha Mukt Bharat", path: "/portals/nmba", group: "Portals" },
  { name: "PM-AJAY", path: "/portals/pm-ajay", group: "Portals" },
  { name: "Design System", path: "/design-system", group: "Resources" },
];

const config = (over: Partial<ChatbotConfig> = {}): ChatbotConfig => ({
  version: CHATBOT_CONFIG_VERSION,
  enabled: true,
  surfaces: {},
  ...over,
});

/* -- defaults -------------------------------------------------------------- */

test("with no stored config the assistant is on the website and nowhere else", () => {
  assert.deepEqual(chatbotEnabledPaths(APPS, null), ["/website"]);
});

test("Resources entries are never offered as surfaces", () => {
  const paths = chatbotSurfaces(APPS, null).map((s) => s.path);
  assert.ok(!paths.includes("/design-system"), "the design system is not a chatbot surface");
  assert.deepEqual(paths, ["/website", "/portals/nmba", "/portals/pm-ajay"]);
});

test("a surface with no override reports itself as a default", () => {
  const surfaces = chatbotSurfaces(APPS, null);
  assert.ok(surfaces.every((s) => s.isDefault));
  assert.equal(surfaces.find((s) => s.path === "/website")?.enabled, true);
  assert.equal(surfaces.find((s) => s.path === "/portals/nmba")?.enabled, false);
});

/* -- overrides ------------------------------------------------------------- */

test("an override wins over the code default, in both directions", () => {
  const c = config({ surfaces: { "/website": false, "/portals/nmba": true } });
  assert.deepEqual(chatbotEnabledPaths(APPS, c), ["/portals/nmba"]);

  const surfaces = chatbotSurfaces(APPS, c);
  assert.equal(surfaces.find((s) => s.path === "/website")?.isDefault, false);
  assert.equal(surfaces.find((s) => s.path === "/portals/pm-ajay")?.isDefault, true);
});

test("the master switch beats every per-surface override", () => {
  const c = config({ enabled: false, surfaces: { "/portals/nmba": true } });
  assert.deepEqual(chatbotEnabledPaths(APPS, c), []);
  // …and leaves the per-surface intent intact, so putting it back restores it.
  assert.equal(chatbotSurfaces(APPS, c).find((s) => s.path === "/portals/nmba")?.enabled, true);
});

test("a stored surface the registry no longer has is simply not offered", () => {
  // A portal removed from DEFAULT_APPS, or hidden by an admin, must not
  // resurrect itself as a phantom row.
  const c = config({ surfaces: { "/portals/retired": true } });
  const paths = chatbotEnabledPaths(APPS, c);
  assert.ok(!paths.includes("/portals/retired"));
});

/* -- path matching --------------------------------------------------------- */

test("a surface covers everything beneath it, and nothing that merely shares a prefix", () => {
  assert.equal(chatbotEnabledAt("/portals/nmba", ["/portals/nmba"]), true);
  assert.equal(chatbotEnabledAt("/portals/nmba/admin/login", ["/portals/nmba"]), true);
  // The bug this guards: a naive startsWith would match the wrong portal.
  assert.equal(chatbotEnabledAt("/portals/nmba-legacy", ["/portals/nmba"]), false);
  assert.equal(chatbotEnabledAt("/portals/pm-ajay", ["/portals/nmba"]), false);
});

test("excluded paths can never be switched on, even by a hand-edited row", () => {
  // Someone editing Supabase directly must not be able to put a chatbot on the
  // recovery surface. The exclusion is re-applied at the decision, not trusted
  // from upstream.
  for (const path of ["/admin", "/admin/chatbot", "/gate", "/", "/storybook/"]) {
    assert.equal(
      chatbotEnabledAt(path, ["/admin", "/gate", "/", "/storybook"]),
      false,
      `${path} must stay excluded`,
    );
  }
});

test("the hub root is excluded without excluding everything under it", () => {
  // "/" is a prefix of every path, so it needs exact-match semantics or it
  // would suppress the assistant estate-wide.
  assert.equal(chatbotEnabledAt("/", ["/website"]), false);
  assert.equal(chatbotEnabledAt("/website", ["/website"]), true);
});

/* -- parsing --------------------------------------------------------------- */

test("parse rejects everything that is not a current, well-formed config", () => {
  assert.equal(parseChatbotConfig(null), null);
  assert.equal(parseChatbotConfig(""), null);
  assert.equal(parseChatbotConfig("not json"), null);
  assert.equal(parseChatbotConfig("[]"), null);
  assert.equal(parseChatbotConfig(JSON.stringify({ surfaces: {} })), null, "no version");
  assert.equal(
    parseChatbotConfig(JSON.stringify({ version: 99, surfaces: {} })),
    null,
    "a future version must not be half-read",
  );
});

test("parse drops junk inside a valid config rather than failing the whole read", () => {
  const parsed = parseChatbotConfig(
    JSON.stringify({
      version: CHATBOT_CONFIG_VERSION,
      surfaces: {
        "/website": true,
        // The bug this guards: "false" coercing to true is exactly what makes a
        // toggle look broken.
        "/portals/nmba": "false",
        "relative/path": true,
        "/portals/pm-ajay": false,
      },
    }),
  );
  assert.deepEqual(parsed?.surfaces, { "/website": true, "/portals/pm-ajay": false });
});

test("enabled defaults to true when absent, and only an explicit false turns it off", () => {
  assert.equal(parseChatbotConfig(JSON.stringify({ version: 1, surfaces: {} }))?.enabled, true);
  assert.equal(
    parseChatbotConfig(JSON.stringify({ version: 1, enabled: false, surfaces: {} }))?.enabled,
    false,
  );
});

test("an oversized payload is refused before it is parsed", () => {
  const huge = JSON.stringify({
    version: CHATBOT_CONFIG_VERSION,
    enabled: true,
    surfaces: Object.fromEntries(
      Array.from({ length: 4000 }, (_, i) => [`/portals/p${i}`, true]),
    ),
  });
  assert.ok(new TextEncoder().encode(huge).length > CHATBOT_CONFIG_MAX_BYTES);
  assert.equal(parseChatbotConfig(huge), null);
});

/* -- round trip ------------------------------------------------------------ */

test("serialize round-trips through parse", () => {
  const c = config({ enabled: false, surfaces: { "/portals/nmba": true, "/website": false } });
  assert.deepEqual(parseChatbotConfig(serializeChatbotConfig(c)), c);
});

test("serialize is stable regardless of key insertion order", () => {
  const a = config({ surfaces: { "/website": false, "/portals/nmba": true } });
  const b = config({ surfaces: { "/portals/nmba": true, "/website": false } });
  assert.equal(serializeChatbotConfig(a), serializeChatbotConfig(b));
});

test("the empty config is the code defaults", () => {
  assert.deepEqual(chatbotEnabledPaths(APPS, emptyChatbotConfig()), ["/website"]);
});
