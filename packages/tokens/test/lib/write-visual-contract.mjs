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

const css = readFileSync(new URL("../../dist/tokens.css", import.meta.url), "utf8");
const contract = resolveContract(css);
const target = new URL("../visual-contract.fixture.json", import.meta.url);

writeFileSync(target, `${JSON.stringify(contract, null, 2)}\n`);

const tokens = Object.values(contract).reduce((sum, props) => sum + Object.keys(props).length, 0);
console.log(
  `wrote ${Object.keys(contract).length} selector contexts, ${tokens} resolved tokens -> test/visual-contract.fixture.json`,
);
