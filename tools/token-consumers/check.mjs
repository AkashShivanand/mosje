/**
 * Zero-consumer tokens — a ratchet so the dead half of the Tier-2 contract can only shrink.
 *
 * On 2026-09-05, 535 of 1,020 Tier-2 custom properties declared in tokens.css had no static
 * reference anywhere in the design system or the hub: 85% of the component tier, 68% of the
 * legacy colour paths, 87% of the alpha ladder. A token nothing binds is worse than no token —
 * it promises a contract the estate does not keep, and it costs a designer a picker entry.
 *
 * This counts, per family (the first path segment after `--sa-`), the declared Tier-2 names
 * with zero textual references in the scoped files. It cannot see template-literal references
 * (`var(--sa-alpha-${n})`), so a family built that way is over-counted; the baseline absorbs
 * that, and the ratchet only ever asks that the count not grow. Retiring a token counts as a
 * reduction — the point is that every declared token is either consumed or removed.
 *
 * Run with `--baseline` to re-record after a genuine reduction.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const SCOPES = ["packages/design-system", "apps/hub/src", "packages/config"];
const SKIP = new Set(["node_modules", ".next", "dist", "storybook-static", "public", "coverage", "tokens.css", "tokens.ts"]);
const BASELINE = join(ROOT, "tools/token-consumers/baseline.json");

const tokens = readFileSync(join(ROOT, "packages/design-system/tokens.css"), "utf8");
const declared = [...new Set([...tokens.matchAll(/^\s*(--sa-[A-Za-z0-9-]+)\s*:/gm)].map((m) => m[1]))].filter((n) => !n.startsWith("--sa-ref-"));

function* walk(dir) {
  for (const e of readdirSync(dir)) {
    if (SKIP.has(e)) continue;
    const p = join(dir, e);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (/\.(css|tsx|ts|cjs|mjs)$/.test(e) && !/\.generated\./.test(e)) yield p;
  }
}
let corpus = "";
for (const scope of SCOPES) for (const f of walk(join(ROOT, scope))) corpus += readFileSync(f, "utf8") + "\n";
const referenced = new Set([...corpus.matchAll(/--sa-[A-Za-z0-9-]+/g)].map((m) => m[0]));

const unusedByFamily = {};
for (const name of declared) {
  if (referenced.has(name)) continue;
  const fam = name.slice(5).split("-")[0];
  (unusedByFamily[fam] ??= []).push(name);
}
const total = Object.values(unusedByFamily).reduce((n, a) => n + a.length, 0);
const perFamily = Object.fromEntries(Object.entries(unusedByFamily).map(([f, a]) => [f, a.length]).sort());

if (process.argv.includes("--baseline")) {
  writeFileSync(BASELINE, JSON.stringify({ $comment: "Tier-2 tokens with zero static consumers, per family; each family may only fall. Re-record with --baseline after a real reduction.", recordedAt: new Date().toISOString().slice(0, 10), total, perFamily }, null, 2) + "\n");
  console.log(`✔ token consumers: baseline recorded — ${total} of ${declared.length} Tier-2 tokens have no static consumer.`);
  process.exit(0);
}
const base = JSON.parse(readFileSync(BASELINE, "utf8"));
const grew = Object.entries(perFamily).filter(([f, n]) => n > (base.perFamily[f] ?? 0));
if (grew.length) {
  console.error(`✖ token consumers: unused Tier-2 tokens grew in ${grew.length} family(ies):`);
  for (const [f, n] of grew) console.error(`  ${f}: ${n} (baseline ${base.perFamily[f] ?? 0}) — ${unusedByFamily[f].slice(0, 6).join(", ")}${unusedByFamily[f].length > 6 ? " …" : ""}`);
  console.error("A new token needs a consumer in the same change, or it does not ship.");
  process.exit(1);
}
if (total < base.total) {
  console.error(`✖ token consumers: ${total} unused is BELOW the baseline of ${base.total} — good; re-record with \`node tools/token-consumers/check.mjs --baseline\` so the improvement is kept.`);
  process.exit(1);
}
console.log(`✔ token consumers: ${total} of ${declared.length} Tier-2 tokens have no static consumer — at the baseline, no family grew.`);
