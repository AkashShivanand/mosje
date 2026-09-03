/**
 * The theming hooks must reach EVERY appearance — including the inverse ladder.
 *
 * `button.css` offers four public hooks (`--sa-btn-fill`, `-ink`, `-edge`, `-ring`) and
 * the documentation says setting one is "complete by construction". That sentence was
 * false for the whole of this component's life until 2026-09-03: the inverse appearances
 * read `--_inv-*` straight from the variant block, so a portal that rethemed a button got
 * its colour on a default ground and the stock brand colour the moment the button sat on
 * a brand surface.
 *
 * A claim with no gate is worth what the last one was. This is the gate: no appearance
 * rule may read a variant-local colour variable directly — it must read the resolved
 * `--_c-*` value, which is the only place a hook is applied.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const CSS = join(ROOT, "packages/design-system/components/actions/button.css");
const src = readFileSync(CSS, "utf8");

/*
 * Comments are stripped first. Prose mentioning `var(--_fill)` is not a use site, and the
 * contrast gate next door learned this expensively when a code sample inside a comment was
 * parsed as a declaration block and silently disarmed it.
 */
const code = src.replace(/\/\*[\s\S]*?\*\//g, "");

const LOCAL = ["--_fill", "--_on", "--_color", "--_ring", "--_inv-fill", "--_inv-on", "--_inv-edge"];

/*
 * Remove the RESOLVER lines before looking for uses.
 *
 * The first version of this gate skipped any use that had a `--_c-*: var(` within 200
 * characters, which is a proximity heuristic and not a parse — it still passed when
 * `var(--_c-inv-fill)` was reverted to `var(--_inv-fill)`, because the resolver block was
 * simply nearby. Deleting the resolver lines outright leaves only genuine use sites, so
 * the check cannot be fooled by adjacency. Verified by reverting that exact line and
 * watching this fail.
 */
const withoutResolver = code
  .split("\n")
  .filter((l) => !/^\s*--_c-[a-z-]+\s*:/.test(l))
  .join("\n");

const findings = [];
for (const name of LOCAL) {
  const re = new RegExp(`var\\(\\s*${name.replace(/-/g, "\\-")}\\s*[,)]`, "g");
  let m;
  while ((m = re.exec(withoutResolver)) !== null) {
    findings.push({ name, line: withoutResolver.slice(0, m.index).split("\n").length });
  }
}

if (findings.length) {
  console.error(`\n✖ button hooks: ${findings.length} appearance rule(s) read a variant-local value directly.\n`);
  for (const f of findings) console.error(`   ${f.name} used near button.css:${f.line}`);
  console.error(
    `\n   Every appearance must read the resolved \`--_c-*\` value, or the public theming\n` +
    `   hooks (--sa-btn-fill / -ink / -edge / -ring) silently do not reach it. Setting one\n` +
    `   hook has to be complete, or the documentation saying so is untrue.\n`,
  );
  process.exit(1);
}
console.log("✔ button hooks: every appearance resolves through --_c-*, so one hook reaches all of them.");
