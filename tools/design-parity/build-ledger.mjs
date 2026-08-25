#!/usr/bin/env node
/**
 * Design↔code parity ledger.
 *
 * Cross-references every COMPONENT_SET published to the SAMAVESH Figma library
 * against every component exported from @mosje/design-system, and emits the
 * ledger as markdown. Generated, never hand-written — a hand-maintained parity
 * table is wrong the day after it is written.
 *
 * Refreshing the Figma side needs an MCP call this script cannot make:
 *
 *   list_file_components_for_code_connect({ fileKey: "3FF5l0SMNIwdpZrKkeyPTm" })
 *
 * Save its output to tools/design-parity/figma-components.json, then run:
 *
 *   node tools/design-parity/build-ledger.mjs > docs/design-system/parity-ledger.md
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = join(HERE, "..", "..");

const FIGMA_FILE_KEY = "3FF5l0SMNIwdpZrKkeyPTm";

/**
 * Figma component set → code export.
 *
 * Only pairings a human has confirmed belong here. Name similarity is a hint,
 * not a mapping: Figma's `Loader` on the Carousel page is a carousel-specific
 * spinner, not the `Loader` atom, and pairing them by name would publish a
 * wrong snippet.
 */
const PAIRINGS = {
  Button: "Button",
  IconButton: "Button",
  Link: "Button",
  Badge: "Badge",
  Avatar: "Avatar",
  Card: "Card",
  Checkbox: "Checkbox",
  Radio: "Radio",
  Toggle: "Toggle",
  Chip: "Chip",
  "Chip / User": "Chip",
  Search: "Search",
  Alert: "Alert",
  Ticker: "Ticker",
  EmptyState: "EmptyState",
  Tooltip: "Tooltip",
  Modal: "Modal",
  "Modal / Backdrop": "Modal",
  Dropdown: "Select",
  "Dropdown / MenuItem": "Select",
  "Input Field": "Input",
  "Input Area": "Textarea",
  "Input Field — Label & Description": "Label",
  "Tabs / Tab": "Tabs",
  "Tabs / Tab (Alt)": "Tabs",
  Table: "DataTable",
  "Table / Cell": "DataTable",
  "Table / Row": "DataTable",
  "Footer/Desktop": "Footer",
  "Footer/Mobile": "Footer",
  "navbar/sitebar": "SiteHeader",
  "navbar/appbar": "SiteHeader",
  "sidebar/type-1": "SidebarNav",
  "sidebar/type-1/main-item": "SidebarNav",
  "sidebar/type-1/child-item": "SidebarNav",
  "Stepper / Horizontal": "Stepper",
  "Stepper / Vertical": "Stepper",
  "Stepper / Step": "Stepper",
  Chart: "LineChart",
  IndiaMap: "IndiaMap",
  AccessibilityBar: "UX4GAccessibilityWidget",
  "AccessibilityWidget / FAB": "UX4GAccessibilityWidget",
  "AccessibilityPanel / Item": "UX4GAccessibilityWidget",
  Loader: "Loader", // Loader page only — the Carousel one is excluded below
};

/** Figma sets deliberately not mapped, with the reason shown in the ledger. */
const FIGMA_UNMAPPED_REASON = {
  ".AccessibilityIcons": "Internal icon set, not a component",
  ".AccordionLayoutBlocks": "Internal layout scaffold",
  ".ToastStatus": "Internal sub-part of Alert",
  ".RightContent": "Internal sub-part of Alert",
  ".FeedbackEmojis": "Internal sub-part of Feedback Widget",
  ".PaginationPage": "Internal sub-part of Pagination",
  "Ticker / Control": "Internal sub-part of Ticker — its interaction states",
  "Ticker / Action": "Internal sub-part of Ticker — its interaction states",
  "Ticker / Message": "Internal sub-part of Ticker — the bar's message",
  "Ticker / Row": "Internal sub-part of Ticker — the panel's row",
  Logo: "Brand asset — inline SVG in code, not a component",
  "org-logo": "Brand asset — inline SVG in code, not a component",
  "navbar/logo": "Brand asset — inline SVG in code, not a component",
  "Gov Dept.": "Footer sub-part",
  "Footer - Bottom Strip": "Footer sub-part",
};

/** Code exports that are deliberately not in Figma. */
const CODE_UNMAPPED_REASON = {
  DemoDock: "Demo tooling — never product UI",
  DemoFab: "Demo tooling — never product UI",
  DemoAccountsPanel: "Demo tooling — never product UI",
  AppSwitcherPanel: "Demo tooling — never product UI",
  Icon: "Handled by the single icon mapping, not one per glyph",
  LiveRegion: "Non-visual accessibility utility",
  ColorModeProvider: "Non-visual provider",
  ToastProvider: "Non-visual provider",
  cn: "Utility",
  tokens: "Token object",
};

/** Type-only or non-component exports to drop from the code census. */
const NOT_A_COMPONENT = new Set([
  "ColorMode",
  "ColorModeId",
  "ColorModeProviderProps",
]);

function loadFigmaSets() {
  const path = join(HERE, "figma-components.json");
  let raw;
  try {
    raw = readFileSync(path, "utf8");
  } catch {
    console.error(
      `MISSING: ${path}\nRefresh it with the MCP call documented at the top of this file.`,
    );
    process.exit(1);
  }
  const all = JSON.parse(raw);
  return all
    .filter((c) => c.type === "COMPONENT_SET")
    .map((c) => ({
      name: c.name,
      page: c.pageName,
      nodeId: c.nodeId,
      props: Object.keys(c.properties ?? {}),
    }));
}

function loadCodeExports() {
  const src = readFileSync(
    join(REPO, "packages", "design-system", "index.ts"),
    "utf8",
  );
  const found = new Map();
  for (const m of src.matchAll(
    /export\s*\{([^}]*)\}\s*from\s*['"]([^'"]+)['"]/g,
  )) {
    for (let n of m[1].split(",")) {
      n = n.trim().replace(/^type\s+/, "").split(/\s+as\s+/).pop().trim();
      if (/^[A-Z][A-Za-z0-9]*$/.test(n) && !NOT_A_COMPONENT.has(n)) {
        if (!found.has(n)) found.set(n, m[2]);
      }
    }
  }
  return found;
}

function figmaUrl(nodeId) {
  return `https://www.figma.com/design/${FIGMA_FILE_KEY}/SAMAVESH-Design-System?node-id=${nodeId.replace(":", "-")}`;
}

const sets = loadFigmaSets();
const codeExports = loadCodeExports();

// The Carousel page's `Loader` is a different component from the Loader atom.
const pairingFor = (set) =>
  set.name === "Loader" && set.page === "Carousel" ? undefined : PAIRINGS[set.name];

const rows = sets.map((set) => {
  const code = pairingFor(set);
  if (code && codeExports.has(code))
    return { ...set, code, verdict: "mapped" };
  if (code) return { ...set, code, verdict: "broken-pairing" };
  if (FIGMA_UNMAPPED_REASON[set.name])
    return { ...set, verdict: "deliberately-unmapped", reason: FIGMA_UNMAPPED_REASON[set.name] };
  return { ...set, verdict: "figma-only" };
});

const mappedCode = new Set(rows.filter((r) => r.code).map((r) => r.code));
const codeOnly = [...codeExports.entries()]
  .filter(([name]) => !mappedCode.has(name))
  .map(([name, from]) => ({
    name,
    from,
    reason: CODE_UNMAPPED_REASON[name],
  }));

const count = (v) => rows.filter((r) => r.verdict === v).length;
const realCodeOnly = codeOnly.filter((c) => !c.reason);

const out = [];
out.push("# Design ↔ code parity ledger");
out.push("");
out.push(
  "> **GENERATED** by `tools/design-parity/build-ledger.mjs`. Do not hand-edit — regenerate.",
);
out.push(
  `> Figma file \`${FIGMA_FILE_KEY}\` (SAMAVESH Design System) ↔ \`@mosje/design-system\`.`,
);
out.push("");
out.push("## Summary");
out.push("");
out.push("| Verdict | Count | Meaning |");
out.push("|---|---:|---|");
out.push(`| \`mapped\` | ${count("mapped")} | A Figma component set with a confirmed code counterpart |`);
out.push(`| \`figma-only\` | ${count("figma-only")} | Designed, never built. Backlog item or retire from the library |`);
out.push(`| \`code-only\` | ${realCodeOnly.length} | Built, never designed. Figma backlog item |`);
out.push(`| \`deliberately-unmapped\` (Figma) | ${count("deliberately-unmapped")} | Internal sub-parts and brand assets |`);
out.push(`| \`deliberately-unmapped\` (code) | ${codeOnly.length - realCodeOnly.length} | Demo tooling, providers, utilities |`);
out.push(`| \`broken-pairing\` | ${count("broken-pairing")} | Pairing names a code export that no longer exists — **fix immediately** |`);
out.push("");
out.push(
  `**${sets.length}** published component sets · **${codeExports.size}** code components · ` +
    `**${count("mapped")}** paired.`,
);
out.push("");

out.push("## Figma → code");
out.push("");
out.push("| Figma component set | Page | Code | Verdict | Node |");
out.push("|---|---|---|---|---|");
for (const r of rows.sort((a, b) => a.page.localeCompare(b.page) || a.name.localeCompare(b.name))) {
  const code = r.code ? `\`${r.code}\`` : r.reason ? `_${r.reason}_` : "—";
  out.push(
    `| ${r.name} | ${r.page} | ${code} | \`${r.verdict}\` | [${r.nodeId}](${figmaUrl(r.nodeId)}) |`,
  );
}
out.push("");

out.push("## Code → Figma (no design counterpart)");
out.push("");
out.push("| Code component | Source | Verdict |");
out.push("|---|---|---|");
for (const c of codeOnly.sort((a, b) => a.name.localeCompare(b.name))) {
  out.push(
    `| \`${c.name}\` | \`${c.from}\` | ${c.reason ? `\`deliberately-unmapped\` — _${c.reason}_` : "`code-only`"} |`,
  );
}
out.push("");

console.log(out.join("\n"));
