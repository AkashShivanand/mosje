/**
 * Figma library Index ↔ library parity.
 *
 * The SAMAVESH library has an `Index` page: one card per content page, each carrying a
 * preview, a status chip and a link. It is the only place anyone sees the whole library
 * at once, which is exactly why a stale Index is worse than no Index — it is a directory
 * that confidently sends people to the wrong place.
 *
 * It was built on 3 September 2026 and was wrong within a day, then wrong again within
 * hours of being repaired. Neither lapse was neglect; both were ordinary good work:
 *
 *   • `Buttons` split into Button / Icon Button / Button Group, `Inputs` split into
 *     Input Field / Input Area / Select, `Link`, `OTP Input` and `Bot Check` arrived.
 *     Eleven pages the Index did not know about; three cards pointing at pages that had
 *     gone.
 *   • `Close Button` was deleted outright. Its card survived it, linking to node
 *     303:9207, which no longer resolves.
 *   • `Modal` and `Tables` both read "Published" — *you can place it, its page is not
 *     written* — while both pages had carried a full documentation frame for some time,
 *     and both cards linked PAST that documentation to the master.
 *
 * The rule that says to fix this by hand is `.claude/rules/figma-library-index.md`, and
 * this estate has already measured what a rule without a gate is worth: three of a
 * hundred pages carried the documentation shape three weeks after it was written down
 * (`ds-documentation-standard.md`). So the rule shipped naming the gate it needed. This
 * is that gate.
 *
 * WHY IT CANNOT BE PURELY OFFLINE. The Index indexes FIGMA PAGES. The repository has no
 * idea what pages the file has, so the parity question is unanswerable without the API.
 * That is the same position `figma-doc-parity` is in, and this takes the same shape:
 *
 *   • Offline, on every PR — the committed snapshot must be internally coherent. Every
 *     page carded, every card naming a page, statuses on the ladder, group counts and
 *     the stat line agreeing with the cards they count. This is cheap, needs no secret,
 *     and catches a hand-edited snapshot.
 *   • `--verify-figma`, guarded on FIGMA_ACCESS_TOKEN — re-reads the live file and asks
 *     the questions that matter: does every page have a card, does every card name a
 *     page that exists, does every link still resolve, and does any card understate a
 *     page that is in fact documented.
 *
 * TWO REQUESTS, NOT SIXTY-SIX. `?depth=2` returns every page AND its top-level frames in
 * one call — enough to derive both the page list and which pages carry a
 * `— Documentation` frame. A second call pulls the Index subtree to read the cards.
 * Walking page-by-page would be 60+ calls to learn the same thing.
 *
 * WHAT IT CANNOT CHECK, AND WHY. Two things, both stated out loud rather than quietly
 * skipped:
 *
 *   • WHERE A LINK POINTS. The REST API renders a NODE hyperlink as `"hyperlink": {}` —
 *     it says a link is there and refuses to say where it goes. (Verified 4 September
 *     2026 against this file's own cards.) So the Close Button defect is caught by NAME
 *     parity instead: a card naming a page the file does not have fails, whatever its
 *     link says. What stays out of reach is a card whose name is right but whose link
 *     points at a node deleted by a page RESTRUCTURE. That needs the Plugin API, which
 *     is not available to a CI runner.
 *   • WHETHER A PREVIEW STILL LOOKS LIKE ITS MASTER. Previews are baked PNGs with no
 *     timestamp and nothing to diff against — open item 09 on `Index — Component
 *     record`. The gate checks a preview EXISTS and says nothing about its currency.
 *
 * A gate that cannot see a defect should say so rather than pass and imply it looked.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const SNAPSHOT = join(ROOT, "tools/figma-index-parity/index.json");

const args = new Set(process.argv.slice(2));
const VERIFY_FIGMA = args.has("--verify-figma");
const SYNC = args.has("--sync");

if (!existsSync(SNAPSHOT)) {
  console.error(`✖ figma-index-parity: snapshot missing: ${relative(ROOT, SNAPSHOT)}`);
  process.exit(2);
}

const snap = JSON.parse(readFileSync(SNAPSHOT, "utf8"));
const norm = (s) => String(s ?? "").replace(/\s+/g, " ").trim();

// A gate that passes on an empty snapshot is not a gate. `--sync` is exempt because it
// is the path that FILLS the snapshot — bootstrapping and repair both come through here.
if (!SYNC && (!Array.isArray(snap.contentPages) || snap.contentPages.length === 0)) {
  console.error("✖ figma-index-parity: the snapshot lists no content pages — it cannot pass vacuously.");
  process.exit(2);
}
if (!SYNC && (!Array.isArray(snap.groups) || snap.groups.length === 0)) {
  console.error("✖ figma-index-parity: the snapshot lists no groups — it cannot pass vacuously.");
  process.exit(2);
}

const cardsOf = (groups) => groups.flatMap((g) => g.cards.map((c) => ({ ...c, group: g.name })));

/**
 * The page list is derived, never listed by hand: dividers, the ten empty group-label
 * pages, `Thumbnail` and `Index` itself are scaffolding, not content. Deriving it means
 * a new group label does not have to be remembered anywhere.
 */
function contentPagesFrom(pageNames, rules) {
  const skip = new Set([...(rules.groupLabels ?? []), ...(rules.special ?? [])]);
  return pageNames.filter((n) => n !== rules.divider && !skip.has(n));
}

// ── Offline: is the snapshot coherent with itself? ──────────────────────────
const failures = [];
const pages = snap.contentPages ?? [];
const cards = cardsOf(snap.groups ?? []);
const excluded = snap.excludedPages ?? {};

function parity(pageList, cardList, label) {
  const cardNames = new Set(cardList.map((c) => c.name));
  const pageSet = new Set(pageList);
  for (const p of pageList) {
    if (cardNames.has(p)) continue;
    if (Object.prototype.hasOwnProperty.call(excluded, p)) continue;
    failures.push({ where: label, why: `page "${p}" has no card`, hint: "Add a card, or record the exclusion in `excludedPages` with the reason." });
  }
  for (const c of cardList) {
    if (!pageSet.has(c.name)) {
      failures.push({ where: `${label} › ${c.group}`, why: `card "${c.name}" names no page in the library`, hint: "The page was renamed or deleted. Fix the card, do not leave it pointing at nothing." });
    }
  }
  for (const name of Object.keys(excluded)) {
    if (!pageSet.has(name)) {
      failures.push({ where: label, why: `"${name}" is recorded as a deliberate exclusion but is not a page`, hint: "Drop the exclusion — it now hides nothing." });
    }
  }
}

parity(pages, cards, "snapshot");

const seen = new Set();
for (const c of cards) {
  if (seen.has(c.name)) failures.push({ where: `snapshot › ${c.group}`, why: `"${c.name}" is carded twice` });
  seen.add(c.name);
  if (!snap.statuses.includes(c.status)) {
    failures.push({ where: `snapshot › ${c.group}`, why: `"${c.name}" carries status "${c.status}", which is not on the ladder`, hint: `The ladder is: ${snap.statuses.join(" · ")}` });
  }
  if (c.linked !== true) failures.push({ where: `snapshot › ${c.group}`, why: `"${c.name}" carries no link to its page` });
}

for (const g of snap.groups) {
  if (g.stated !== g.cards.length) {
    failures.push({ where: `snapshot › ${g.name}`, why: `header says ${g.stated}, the grid holds ${g.cards.length}`, hint: "Derive the count from the page, never from what you meant to put there." });
  }
}

const statedPages = /^(\d+)\s+pages/.exec(norm(snap.statLine));
if (SYNC) {
  failures.length = 0; // the snapshot is about to be replaced; judging it first is noise
} else if (!statedPages) {
  failures.push({ where: "snapshot › stat line", why: `cannot read a page count out of "${snap.statLine}"` });
} else if (Number(statedPages[1]) !== pages.length) {
  failures.push({ where: "snapshot › stat line", why: `says ${statedPages[1]} pages, the snapshot lists ${pages.length}`, hint: "The stat line tells the reader how much to trust the rest of the page." });
}

// ── Live: is the snapshot still what the file holds? ────────────────────────
const API = "https://api.figma.com/v1";

async function figma(path, token) {
  const res = await fetch(`${API}${path}`, { headers: { "X-Figma-Token": token } });
  if (!res.ok) throw new Error(`Figma API ${res.status} ${res.statusText} for ${path.split("?")[0]}`);
  return res.json();
}

/**
 * REST gives `"hyperlink": {}` for a NODE link — presence, never the target. A link can
 * sit on the run style or in the override table, so look in both; the answer is boolean
 * because that is all the API is willing to say.
 */
function hasHyperlink(text) {
  const runs = [text.style, ...Object.values(text.styleOverrideTable ?? {})];
  return runs.some((r) => r && Object.prototype.hasOwnProperty.call(r, "hyperlink"));
}

const descend = (node, fn, out = []) => {
  if (fn(node)) out.push(node);
  for (const c of node.children ?? []) descend(c, fn, out);
  return out;
};
const childNamed = (node, name) => (node.children ?? []).find((c) => c.name === name);

/** Read the cards straight out of the live Index subtree, in the shape the snapshot uses. */
function readIndex(indexFrame) {
  const groupsFrame = descend(indexFrame, (n) => n.name === "Groups")[0];
  if (!groupsFrame) throw new Error("the Index frame has no `Groups` container — the page was restructured");
  const groups = [];
  for (const g of groupsFrame.children ?? []) {
    const header = childNamed(g, "group header");
    const grid = childNamed(g, "grid");
    if (!grid) continue;
    const countText = descend(header ?? {}, (n) => n.type === "TEXT" && /^\d+$/.test(norm(n.characters)))[0];
    const cardList = [];
    for (const card of grid.children ?? []) {
      const body = childNamed(card, "body");
      const row = body?.children?.[0];
      const titleText = (row?.children ?? []).find((c) => c.type === "TEXT");
      const chip = (row?.children ?? []).find((c) => c.type !== "TEXT");
      const chipText = descend(chip ?? {}, (n) => n.type === "TEXT")[0];
      const preview = childNamed(card, "preview");
      cardList.push({
        name: norm(card.name),
        status: norm(chipText?.characters),
        linked: titleText ? hasHyperlink(titleText) : false,
        hasPreview: !!descend(preview ?? {}, (n) => (n.fills ?? []).some((f) => f.type === "IMAGE"))[0],
      });
    }
    groups.push({ name: norm(g.name), stated: countText ? Number(norm(countText.characters)) : null, cards: cardList });
  }
  return groups;
}

async function verifyFigma() {
  const token = process.env.FIGMA_ACCESS_TOKEN;
  if (!token) {
    console.log("  · --verify-figma skipped: FIGMA_ACCESS_TOKEN not set. The offline half still ran.");
    return { drift: [], skipped: true };
  }
  const drift = [];

  // 1 — every page, and its top-level frames, in one request.
  const file = await figma(`/files/${snap.file}?depth=2`, token);
  const livePageNames = (file.document.children ?? []).map((p) => norm(p.name));
  const livePages = contentPagesFrom(livePageNames, snap.pageExclusionRules);

  const documented = new Set(
    (file.document.children ?? [])
      .filter((p) => (p.children ?? []).some((c) => c.name.includes("— Documentation")))
      .map((p) => norm(p.name)),
  );

  // 2 — the Index subtree, to read the cards as they stand.
  const idxRes = await figma(`/files/${snap.file}/nodes?ids=${encodeURIComponent(snap.indexFrame)}`, token);
  const indexFrame = idxRes.nodes?.[snap.indexFrame]?.document;
  if (!indexFrame) throw new Error(`the Index frame ${snap.indexFrame} is not in the file any more`);
  const liveGroups = readIndex(indexFrame);
  const liveCards = cardsOf(liveGroups);
  const liveStat = descend(indexFrame, (n) => n.type === "TEXT" && /^\d+\s+pages/.test(norm(n.characters)))[0];
  const liveStatLine = norm(liveStat?.characters);

  if (SYNC) {
    snap.contentPages = livePages;
    snap.groups = liveGroups.map((g) => ({ name: g.name, stated: g.stated, cards: g.cards.map(({ name, status, linked }) => ({ name, status, linked })) }));
    snap.statLine = liveStatLine;
    snap.capturedOn = new Date().toISOString().slice(0, 10);
    writeFileSync(SNAPSHOT, JSON.stringify(snap, null, 2) + "\n");
    console.log(`  · --sync rewrote ${relative(ROOT, SNAPSHOT)} from the live file.`);
    return { drift: [], synced: true };
  }

  // A/B — the parity that is the whole point, asked of the LIVE file.
  const before = failures.length;
  parity(livePages, liveCards, "figma");
  for (const f of failures.splice(before)) drift.push(f);

  // C — a card with no link at all. Where it POINTS is not something REST will say.
  for (const c of liveCards) {
    if (!c.linked) {
      drift.push({ where: `figma › ${c.group}`, why: `"${c.name}" carries no link to its page`, hint: "A card is a name, a preview, a status and a way through. Three of four is a dead end." });
    }
  }

  // D/E — counts the page states about itself.
  for (const g of liveGroups) {
    if (g.stated !== g.cards.length) drift.push({ where: `figma › ${g.name}`, why: `header says ${g.stated}, the grid holds ${g.cards.length}` });
  }
  const liveStated = /^(\d+)\s+pages/.exec(liveStatLine);
  if (!liveStated) drift.push({ where: "figma › stat line", why: "no stat line naming a page count was found on the Index" });
  else if (Number(liveStated[1]) !== livePages.length) {
    drift.push({ where: "figma › stat line", why: `says ${liveStated[1]} pages, the file has ${livePages.length}` });
  }

  // F — a card that understates a page that IS documented. The Modal/Tables defect.
  for (const c of liveCards) {
    if (!snap.understatedBy.includes(c.status)) continue;
    if (!documented.has(c.name)) continue;
    drift.push({
      where: `figma › ${c.group}`,
      why: `"${c.name}" is carded "${c.status}", but its page carries a — Documentation frame`,
      hint: "Status is derived, never assigned. Re-read the page and raise the chip — and point the link at the documentation.",
    });
  }

  // A missing preview is visible to the API even though its currency is not.
  for (const c of liveCards) {
    if (!c.hasPreview) drift.push({ where: `figma › ${c.group}`, why: `"${c.name}" has no preview image` });
  }

  return { drift, livePages: livePages.length, liveCards: liveCards.length };
}

let live = { drift: [] };
if (VERIFY_FIGMA) {
  try {
    live = await verifyFigma();
  } catch (err) {
    console.error(`✖ figma-index-parity: ${err.message}`);
    process.exit(2);
  }
}

// ── Report ──────────────────────────────────────────────────────────────────
// Read from `snap` rather than the pre-sync locals, so a --sync run reports what it wrote.
console.log(
  `figma-index-parity: ${(snap.contentPages ?? []).length} content page(s) · ` +
    `${cardsOf(snap.groups ?? []).length} card(s) · ${(snap.groups ?? []).length} group(s) · ` +
    `snapshot captured ${snap.capturedOn} · ${snap.file}`,
);
if (live.livePages !== undefined) {
  console.log(`  · live: ${live.livePages} content page(s) · ${live.liveCards} card(s)`);
}

function report(list, title, tail) {
  if (!list.length) return;
  console.error(`\n✖ ${list.length} ${title}:\n`);
  for (const f of list) {
    console.error(`   ${f.where}`);
    console.error(`     ${f.why}`);
    if (f.hint) console.error(`     ${f.hint}`);
    console.error("");
  }
  console.error(tail);
}

report(failures, "problem(s) in the committed Index snapshot",
  "   The snapshot is hand-editable and therefore wrong sooner than the file is.\n" +
  "   Re-capture it with `npm run check:figma-index:sync`.\n");

report(live.drift, "way(s) the Index no longer describes the library",
  "   Follow §3 of .claude/rules/figma-library-index.md — recount, diff, fix the cards,\n" +
  "   then `npm run check:figma-index:sync` to re-capture the snapshot.\n" +
  "   A stale index is worse than none: it sends people somewhere with confidence.\n");

if (failures.length || live.drift.length) process.exit(1);
if (live.skipped) console.log("✔ the Index snapshot is coherent. Live parity was not checked.");
else if (live.synced) console.log("✔ snapshot re-captured from the live file.");
else if (VERIFY_FIGMA) console.log("✔ the Index still describes the library, page for page.");
else console.log("✔ the Index snapshot is coherent.");
