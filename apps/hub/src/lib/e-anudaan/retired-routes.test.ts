/**
 * A retired E-Anudaan URL is a redirect, not a second copy of the page it points at.
 *
 * Design-director audit X-13, 16 Sep 2026: `/sign-in` rendered the login. It was a page that called
 * `redirect()`, which under `app/portals/loading.tsx` streams after the shell — `200 OK`, a meta
 * refresh, a client re-render and a console error. The proxy now answers these URLs with a 307
 * before anything renders, so the routes themselves must not come back.
 *
 * The proxy imports the site gate and the settings store, so it is read as source rather than run.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const HUB_SRC = new URL("../../", import.meta.url);
const proxy = readFileSync(new URL("proxy.ts", HUB_SRC), "utf8");

const RETIRED: readonly [string, string][] = [
  ["/portals/e-anudaan/sign-in", "/portals/e-anudaan/login?role=ngo"],
  ["/portals/e-anudaan", "/portals/e-anudaan/login"],
  ["/portals/e-anudaan/ngo/attendance-master", "/portals/e-anudaan/ngo/attendance"],
];

test("each retired E-Anudaan URL is redirected by the proxy", () => {
  const block = proxy.slice(proxy.indexOf("const E_ANUDAAN_ALIASES"), proxy.indexOf("};", proxy.indexOf("const E_ANUDAAN_ALIASES")));
  for (const [from, to] of RETIRED) {
    assert.ok(block.includes(`"${from}": "${to}"`), `${from} → ${to} is not in E_ANUDAAN_ALIASES`);
  }
  assert.match(proxy, /E_ANUDAAN_ALIASES\[pathname\.replace\(\/\\\/\$\/, ""\)\]/, "the proxy consults the aliases");
});

test("the NGO sign-in is not a page of its own any more", () => {
  assert.equal(existsSync(new URL("app/portals/e-anudaan/sign-in", HUB_SRC)), false);
});
