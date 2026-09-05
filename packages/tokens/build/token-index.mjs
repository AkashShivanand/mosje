/**
 * Flat index of every authored token: { path, filePath }.
 *
 * Exists so tests can ask "what did we author, and where?" without booting Style Dictionary
 * or duplicating the source list. The source list is derived from the same BRAND env var the
 * build uses, so the index and the build can never disagree about what was compiled.
 */

import { readFileSync } from "node:fs";
import { addDevanagariLeading } from "./devanagari-leading.mjs";

const here = (p) => new URL(p, import.meta.url).pathname;

export const SOURCES = [
  `brands/${process.env.BRAND || "mosje"}/brand.json`,
  "src/primitive.json",
  "src/semantic.json",
  "src/system.generated.json",
  "src/component.json",
  "src/component.generated.json",
];

export function index() {
  const out = [];
  for (const rel of SOURCES) {
    const json = JSON.parse(readFileSync(here("../" + rel), "utf8"));
    // "Authored" means the source AFTER the build's own derivations: the 21 per-role
    // `lhDevanagari` leaves are made by a preprocessor from the offset primitive, and a test
    // that read the raw file counted them as invented. The rule lives in one function; the
    // index applies it exactly as the build does.
    if (rel.endsWith("src/primitive.json")) addDevanagariLeading(json);
    walk(json, [], rel, out);
  }
  return out;
}

function walk(node, path, filePath, out) {
  if (!node || typeof node !== "object") return;
  if (node.$value !== undefined || node.value !== undefined) {
    out.push({ path, filePath });
    return;
  }
  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith("$")) continue;
    walk(child, [...path, key], filePath, out);
  }
}
