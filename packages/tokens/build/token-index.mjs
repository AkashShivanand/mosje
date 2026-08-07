/**
 * Flat index of every authored token: { path, filePath }.
 *
 * Exists so tests can ask "what did we author, and where?" without booting Style Dictionary
 * or duplicating the source list. The source list is derived from the same BRAND env var the
 * build uses, so the index and the build can never disagree about what was compiled.
 */

import { readFileSync } from "node:fs";

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
