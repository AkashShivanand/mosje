/**
 * Regenerate the visual-contract fixture from the current dist/tokens.css.
 *
 * Deliberately NOT part of the test run: a snapshot test that can rewrite its own
 * baseline proves nothing. Run this only when you have decided a value change is
 * intended, and say so in the commit message.
 *
 *   npm run build -w @mosje/tokens && node test/lib/write-visual-contract.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolveContract } from "./css-resolve.mjs";

const count = (contract) =>
  Object.values(contract).reduce((sum, props) => sum + Object.keys(props).length, 0);

const targets = new Set(process.argv.slice(2));
if (targets.size === 0) {
  console.error(
    "Regenerating a fixture DISCARDS the baseline it was proving against — for the visual\n" +
      "contract that also makes every declared RENAME stale, which is the whole audit trail.\n" +
      "So name the target explicitly:\n" +
      "  node test/lib/write-visual-contract.mjs --visual\n" +
      "  node test/lib/write-visual-contract.mjs --ux4g\n" +
      "  node test/lib/write-visual-contract.mjs --visual --ux4g",
  );
  process.exit(1);
}

const css = readFileSync(new URL("../../dist/tokens.css", import.meta.url), "utf8");
const contract = resolveContract(css);
if (targets.has("--visual")) {
  writeFileSync(new URL("../visual-contract.fixture.json", import.meta.url), `${JSON.stringify(contract, null, 2)}\n`);
  console.log(
    `wrote ${Object.keys(contract).length} selector contexts, ${count(contract)} resolved tokens -> test/visual-contract.fixture.json`,
  );
}

// UX4G is resolved AFTER tokens.css, matching the documented import order — on its own
// every --sa-* reference in it would dangle and the fixture would pin nothing.
if (targets.has("--ux4g")) {
const ux4gCss = readFileSync(new URL("../../dist/ux4g.css", import.meta.url), "utf8");
const full = resolveContract(`${css}\n${ux4gCss}`);
// EVERY property, not just --ux4g-*. ux4g.css also emits --sa-* overrides inside its
// colour-mode blocks — that is how the UX4G palette repaints the SAMAVESH tokens — and
// nothing else pins those. Filtering to --ux4g-* would leave exactly that hole open.
const ux4g = full;
writeFileSync(new URL("../ux4g-contract.fixture.json", import.meta.url), `${JSON.stringify(ux4g, null, 2)}\n`);
console.log(
  `wrote ${Object.keys(ux4g).length} selector contexts, ${count(ux4g)} resolved tokens (--sa-* and --ux4g-*) -> test/ux4g-contract.fixture.json`,
);
}
