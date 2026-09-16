#!/usr/bin/env node
/**
 * Read the Figma library over REST, and cache what comes back.
 *
 * WHY THIS EXISTS. The Figma MCP server bills every `use_figma` and `get_screenshot`
 * against a PER-SEAT DAILY ALLOWANCE — 600 calls a day and 20 a minute on a Full seat of
 * an Organization plan, shared by every session signed in as the same person. On
 * 2026-09-16 that allowance ran out mid-task: a design pass, a token pass and three
 * parallel sessions had spent it between them, and the work stopped at the one step that
 * needed one more read.
 *
 * The REST API is a different quota, and it is the one this repo's own gates already use
 * (`tools/figma-doc-parity`, `figma-index-parity`, `figma-arrangements`). Anything those
 * gates can answer, an agent can answer the same way — for free, and repeatably.
 *
 * WHAT REST CANNOT DO, and so what MCP is still for:
 *   - variables and their values          (needs the Enterprise `file_variables:read` scope)
 *   - component property DEFINITIONS      (the file JSON carries overrides, not the schema)
 *   - anything that WRITES
 * Everything else — node geometry, names, fills, strokes, effects, styles, bound-variable
 * ids, text content, and rendered images — is here.
 *
 * USAGE
 *   node tools/figma-read/read.mjs nodes 2141:323870 4235:3169      # node subtrees, cached
 *   node tools/figma-read/read.mjs nodes 4235:3169 --depth 2        # shallower, smaller
 *   node tools/figma-read/read.mjs image 58143:59613 --scale 2      # render a PNG, cached
 *   node tools/figma-read/read.mjs styles                           # published text/effect styles
 *   node tools/figma-read/read.mjs nodes 4235:3169 --fresh          # ignore the cache
 *   node tools/figma-read/read.mjs nodes 4235:3169 --json           # print instead of summarising
 *
 * The cache lives in `.cache/figma/` (gitignored) keyed by file + node + depth. A second
 * read of the same node in the same session costs nothing at all.
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const CACHE = join(ROOT, ".cache", "figma");
const API = "https://api.figma.com/v1";
/** The SAMAVESH library — the file every rule in `.claude/rules/figma-*.md` is about. */
const DEFAULT_FILE = "3FF5l0SMNIwdpZrKkeyPTm";
/** A cached read older than this is re-fetched; the library moves during a working day. */
const MAX_AGE_MS = 6 * 60 * 60 * 1000;

const argv = process.argv.slice(2);
const command = argv[0];
const flag = (name, fallback = null) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? fallback : argv[i + 1];
};
const has = (name) => argv.includes(`--${name}`);
/** A node id is the only bare argument shaped `123:456`; flag VALUES never are. */
const ids = argv.slice(1).filter((a) => /^\d+[:-]\d+$/.test(a));
const fileKey = flag("file", DEFAULT_FILE);
const token = process.env.FIGMA_ACCESS_TOKEN;

function usage(message) {
  console.error(`${message}\n\n  node tools/figma-read/read.mjs nodes <id…> [--depth N] [--file KEY] [--fresh] [--json]\n  node tools/figma-read/read.mjs image <id> [--scale N] [--file KEY] [--fresh]\n  node tools/figma-read/read.mjs styles [--file KEY] [--fresh]\n`);
  process.exit(2);
}

if (!command) usage("Say what to read.");
if (!token) usage("FIGMA_ACCESS_TOKEN is not set in this shell.");

function cachePath(kind, key) {
  return join(CACHE, fileKey, `${kind}-${key.replace(/[^A-Za-z0-9._-]/g, "_")}.json`);
}

function readCache(path) {
  if (has("fresh") || !existsSync(path)) return null;
  if (Date.now() - statSync(path).mtimeMs > MAX_AGE_MS) return null;
  return JSON.parse(readFileSync(path, "utf8"));
}

function writeCache(path, data) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(data));
  return data;
}

async function rest(path) {
  const res = await fetch(`${API}${path}`, { headers: { "X-Figma-Token": token } });
  if (res.status === 429) {
    throw new Error("Figma REST answered 429 — too many requests. This is the REST quota, not the MCP seat allowance; wait and retry, or narrow the read with --depth.");
  }
  if (!res.ok) throw new Error(`Figma REST ${res.status} ${res.statusText} for ${path.split("?")[0]}`);
  return res.json();
}

/** One line per node: type, name, id, box — enough to decide what to look at next. */
function summarise(node, depth = 0, out = []) {
  const box = node.absoluteBoundingBox;
  const size = box ? ` ${Math.round(box.width)}×${Math.round(box.height)} @${Math.round(box.x)},${Math.round(box.y)}` : "";
  out.push(`${"  ".repeat(depth)}${node.type} “${node.name}” #${node.id}${size}`);
  for (const child of node.children ?? []) summarise(child, depth + 1, out);
  return out;
}

if (command === "nodes") {
  if (ids.length === 0) usage("Give at least one node id, e.g. 4235:3169.");
  const depth = flag("depth");
  const key = `${ids.join("+")}${depth ? `-d${depth}` : ""}`;
  const path = cachePath("nodes", key);
  let data = readCache(path);
  const cached = data != null;
  if (!data) {
    const q = `${ids.map((i) => i.replace("-", ":")).join(",")}${depth ? `&depth=${depth}` : ""}`;
    data = writeCache(path, await rest(`/files/${fileKey}/nodes?ids=${q}`));
  }
  if (has("json")) {
    console.log(JSON.stringify(data));
  } else {
    for (const id of Object.keys(data.nodes ?? {})) {
      const doc = data.nodes[id]?.document;
      if (!doc) { console.log(`${id} — not found`); continue; }
      console.log(summarise(doc).join("\n"));
    }
    console.error(`\n(${cached ? "cached" : "fetched"} · ${path.replace(ROOT + "/", "")} · add --json for the full payload)`);
  }
} else if (command === "image") {
  if (ids.length !== 1) usage("Give exactly one node id to render.");
  const scale = flag("scale", "1");
  const path = cachePath("image", `${ids[0]}-x${scale}`);
  let data = readCache(path);
  if (!data) data = writeCache(path, await rest(`/images/${fileKey}?ids=${ids[0].replace("-", ":")}&format=png&scale=${scale}`));
  const url = Object.values(data.images ?? {})[0];
  if (!url) usage("Figma returned no image for that node.");
  console.log(url);
  console.error("(download it with curl -sL -o <file>.png '<url>' — the URL is short-lived)");
} else if (command === "styles") {
  const path = cachePath("styles", "all");
  let data = readCache(path);
  if (!data) data = writeCache(path, await rest(`/files/${fileKey}/styles`));
  const styles = data.meta?.styles ?? [];
  for (const s of styles) console.log(`${s.style_type} “${s.name}” #${s.node_id}`);
  console.error(`\n(${styles.length} published style(s))`);
} else {
  usage(`Unknown command “${command}”.`);
}
