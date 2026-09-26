/**
 * Pure helpers for the organisation template of the redesign.
 *
 * The ingested organisation pages carry the source site's WIDGETS as prose: a
 * "Latest Updates" tab strip, a "Social Media" block of empty embeds, a "Gallery"
 * of captions without pictures, the at-a-glance pairs as h4/div runs. Rendered as
 * prose they are the empty boxes and orphaned captions the register lists (BRD-12,
 * LAY-13). These functions sort each ingested section into what it really is, so
 * the template can render real content as prose and turn each widget into the
 * designed section it stood for.
 *
 * Nothing here invents a value. Every title, date, link and label is read out of
 * the ingested markup or the organisation record; a widget with nothing
 * recoverable in it is dropped, not filled.
 */
import type { BrandGlyphName } from "@mosje/design-system";
import type { ContentSection } from "@/types/website/content";
import { withAssetBasePath } from "@/lib/website/content";
import { applyCorrections } from "@/lib/website-next/content-corrections";
import { trimRedundantOpening } from "@/lib/website/organisation-prose";

export const stripTags = (html: string) =>
  html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&rsquo;/g, "’")
    .replace(/\s+/g, " ")
    .trim();

/** Path segments that name a post, not an account. */
const NOT_A_PROFILE = new Set(["p", "reel", "reels", "status", "watch", "share", "sharer", "shorts", "embed", "hashtag", "intent"]);

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const SMALL = new Set(["a", "an", "the", "and", "or", "but", "to", "of", "in", "into", "for", "on", "with", "at", "by"]);

/**
 * A record title, tidied: runs of spaces collapsed, trailing punctuation dropped,
 * a missing space before an opening bracket restored ("Welfare(SCW)"), and a title
 * set wholly in capitals put into Title Case (the estate's standing instruction).
 * The words themselves are never changed.
 */
export function tidyTitle(raw: string): string {
  let t = raw.replace(/\u200b/g, "").replace(/\s+/g, " ").trim().replace(/[\s:;,.–—-]+$/, "");
  t = t.replace(/(\w)\(/g, "$1 (");
  const letters = t.replace(/[^A-Za-z]/g, "");
  if (letters.length > 8 && letters === letters.toUpperCase() && t.includes(" ")) {
    t = t
      .toLowerCase()
      .split(" ")
      .map((w, i) => (i > 0 && SMALL.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
      .join(" ");
  }
  return t;
}

/** "ABOUT US" → "About Us", for the record's upper-case nav group labels. */
export function titleCaseLabel(raw: string): string {
  const t = raw.replace(/\s+/g, " ").trim();
  if (t !== t.toUpperCase()) return t;
  return t
    .toLowerCase()
    .split(" ")
    .map((w, i) => (i > 0 && SMALL.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

/** The first sentence of a paragraph, without breaking on "Dr." or "No.". */
export function firstSentence(text?: string): string | undefined {
  if (!text) return undefined;
  const clean = stripTags(text);
  if (!clean) return undefined;
  const m = clean.match(/^.*?[a-z0-9)]{2}\.(?=\s+[A-Z‘“"(]|$)/);
  return (m ? m[0] : clean).trim();
}

/** The organisation's abbreviation, from the bracket at the end of its title. */
export function abbreviationOf(title: string): string | undefined {
  const m = title.match(/\(([^()]+)\)\s*$/);
  return m?.[1]?.trim();
}

/** Record action labels, in the site's one set of action words (CON-21). */
export function actionLabel(label: string): string {
  const bare = label.replace(/[→›»]/g, "").trim();
  if (/^(know|read|learn) more$/i.test(bare)) return "View Details";
  if (/^view all$/i.test(bare)) return "View All";
  return tidyTitle(bare);
}

export const isExternal = (href: string) => /^https?:\/\//.test(href);

/* ── At a glance ───────────────────────────────────────────────────────────── */

export interface GlanceFact {
  value: string;
  label: string;
}

/**
 * The source's at-a-glance strip (`<h4>value</h4><div>label</div>` repeated),
 * lifted out of the prose. Where the pair is written the other way round —
 * `<h4>Launched On</h4><div>12 February 2022</div>` — the half with a digit is the
 * value.
 */
export function extractGlance(html: string): { html: string; facts: GlanceFact[] } {
  const facts: GlanceFact[] = [];
  const cleaned = html.replace(
    /<h4[^>]*>([\s\S]*?)<\/h4>\s*<div[^>]*>([\s\S]*?)<\/div>/gi,
    (match, rawA: string, rawB: string) => {
      let value = stripTags(rawA);
      let label = stripTags(rawB);
      if (!value || !label || label.length > 60 || value.length > 60) return match;
      if (/\d/.test(label) && !/\d/.test(value)) [value, label] = [label, value];
      facts.push({ value, label });
      return "";
    },
  );
  return { html: cleaned, facts };
}

export const sameLabel = (a: string, b: string) =>
  a.toLowerCase().replace(/[^a-z0-9]/g, "") === b.toLowerCase().replace(/[^a-z0-9]/g, "");

/* ── Prose ─────────────────────────────────────────────────────────────────── */

/**
 * Ingested HTML made safe to render as running text in the redesign:
 * asset paths prefixed and document links localised; anchors with no href or
 * no text removed (axe `link-name`); headings brought under the section's own
 * level so the outline never skips (ACC-03); every table wrapped in a labelled,
 * focusable scroll region (MOB-03, ACC-16); external links marked (ACC-17).
 */
export function cleanHtml(raw: string, opts: { headingLevel: 2 | 3; label: string }): string {
  let html = applyCorrections(withAssetBasePath(trimRedundantOpening(raw)));
  html = html.replace(/<a(?![^>]*\shref=)[^>]*>([\s\S]*?)<\/a>/gi, "$1");
  html = html.replace(/<a\b[^>]*>((?:(?!<img)[\s\S])*?)<\/a>/gi, (m, inner: string) =>
    stripTags(inner) === "" ? "" : m,
  );
  // Icon-font husks the source used for arrows.
  html = html.replace(/<i\b[^>]*>\s*<\/i>/gi, "");
  const lvl = opts.headingLevel;
  html = html
    .replace(/<h[1-6](\s[^>]*)?>/gi, (_m, attrs: string | undefined) => `<h${lvl}${attrs ?? ""}>`)
    .replace(/<\/h[1-6]>/gi, `</h${lvl}>`);
  let n = 0;
  html = html.replace(/<table[\s\S]*?<\/table>/gi, (table) => {
    n += 1;
    const clean = table.replace(/\s(?:class|style|border|cellpadding|cellspacing|width|align)="[^"]*"/gi, "");
    return `<div class="wn-table-wrap" role="region" tabindex="0" aria-label="${opts.label.replace(/"/g, "&quot;")}${n > 1 ? ` (table ${n})` : ""}">${clean}</div>`;
  });
  html = html.replace(/<a\s([^>]*href="https?:\/\/[^"]+"[^>]*)>([\s\S]*?)<\/a>/gi, (m, attrs: string, inner: string) => {
    if (/opens in a new window/.test(inner)) return m;
    const a = attrs.replace(/\s(?:target|rel)="[^"]*"/gi, "");
    return `<a ${a} target="_blank" rel="noopener noreferrer">${inner}<span class="sr-only"> (opens in a new window)</span></a>`;
  });
  // Empty wrappers the widgets leave behind.
  for (let i = 0; i < 3; i++) html = html.replace(/<(div|span|p)>\s*<\/\1>/gi, "");
  return html.trim();
}

/* ── Sorting ingested sections ─────────────────────────────────────────────── */

export type SectionKind = "prose" | "updates" | "social" | "gallery" | "drop";

/**
 * What an ingested section actually is. Widget headings are matched by name; any
 * section whose text is empty once its markup is gone is a husk and is dropped.
 */
export function kindOf(section: ContentSection): SectionKind {
  const h = (section.heading ?? "").trim();
  const text = stripTags(section.html);
  if (/^(latest updates|what'?s new)/i.test(h)) return "updates";
  if (/^social media/i.test(h)) return "social";
  if (/^(gallery|photos)$/i.test(h)) return /<img\b/i.test(section.html) ? "gallery" : "drop";
  if (/^(videos|testimonials|messages|legend|advertisement|resources|results|useful links|related & quick links|state offices|policies|pearls of wisdom|success story|geo tagged)/i.test(h) && text.length < 200) {
    return "drop";
  }
  if (text.length === 0 && !/<img\b/i.test(section.html)) return "drop";
  return "prose";
}

export interface UpdateItem {
  title: string;
  href: string;
  /** ISO date where known. */
  date?: string;
  /** What kind of record it is, where the source says. */
  kind?: string;
}

const MONTH = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* (\d{4})$/;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "24" + "Aug 2026" → "2026-08-24". */
export function dayMonthToIso(day: string, monthYear: string): string | undefined {
  const m = monthYear.trim().match(MONTH);
  if (!m) return undefined;
  const mm = MONTHS.indexOf(m[1]!.slice(0, 3)) + 1;
  const dd = Number(day);
  if (!mm || !dd) return undefined;
  return `${m[2]}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;
}

/**
 * The dated items and the "View All" routes out of an ingested Latest Updates
 * widget. The widget prints its categories as a row of labels and then one
 * "View All" per category, in the same order, so they are paired by position —
 * and only when the counts agree.
 */
export function extractUpdates(html: string): { items: UpdateItem[]; viewAll: { label: string; href: string }[] } {
  const items: UpdateItem[] = [];
  const re = /<div>\s*(\d{1,2})\s*<\/div>\s*<div>\s*([A-Za-z]{3,9} \d{4})\s*<\/div>[\s\S]*?<h[56][^>]*>([\s\S]*?)<\/h[56]>[\s\S]*?<a href="([^"]+)"/g;
  for (const m of html.matchAll(re)) {
    const title = tidyTitle(stripTags(m[3] ?? ""));
    if (!title) continue;
    items.push({ title, href: m[4]!, date: dayMonthToIso(m[1]!, m[2]!) });
  }
  const firstLinkAt = html.search(/<a\s/i);
  const head = firstLinkAt > 0 ? html.slice(0, firstLinkAt) : "";
  const labels = [...head.matchAll(/<span>\s*([^<]{2,40}?)\s*<\/span>/g)].map((m) => tidyTitle(m[1]!));
  const hrefs = [...html.matchAll(/<a href="([^"]+)"[^>]*>\s*<span>\s*<span>\s*(?:<i><\/i>)?\s*<\/span>\s*<span>View All<\/span>/g)].map((m) => m[1]!);
  const viewAll = labels.length > 0 && labels.length === hrefs.length ? labels.map((label, i) => ({ label, href: hrefs[i]! })) : [];
  return { items, viewAll };
}

export interface SocialProfile {
  platform: BrandGlyphName;
  name: string;
  handle: string;
  href: string;
}

const PLATFORM_NAME: Record<BrandGlyphName, string> = {
  facebook: "Facebook",
  x: "X",
  instagram: "Instagram",
  youtube: "YouTube",
  whatsapp: "WhatsApp",
};
export const platformName = (p: BrandGlyphName) => PLATFORM_NAME[p];

/**
 * Profiles out of an ingested Social Media block. An embedded post links to one
 * status; the profile it belongs to is the first path segment of that link. A
 * platform whose block holds no link at all is dropped rather than guessed.
 */
export function extractSocial(html: string): SocialProfile[] {
  const out: SocialProfile[] = [];
  const seen = new Set<string>();
  for (const m of html.matchAll(/href="(https?:\/\/(?:www\.)?(facebook\.com|twitter\.com|x\.com|instagram\.com|youtube\.com)\/(@?[A-Za-z0-9_.-]+))[^"]*"/g)) {
    const host = m[2]!;
    const user = m[3]!;
    if (NOT_A_PROFILE.has(user.toLowerCase())) continue;
    const platform: BrandGlyphName = host.startsWith("facebook")
      ? "facebook"
      : host.startsWith("instagram")
        ? "instagram"
        : host.startsWith("youtube")
          ? "youtube"
          : "x";
    if (seen.has(platform)) continue;
    seen.add(platform);
    const href = `https://${host}/${user}`;
    out.push({ platform, name: PLATFORM_NAME[platform], handle: user.startsWith("@") ? user : `@${user}`, href });
  }
  return out;
}

/** Images inside an ingested gallery block, captioned by their own alt text. */
export function extractImages(html: string): { src: string; alt: string }[] {
  const out: { src: string; alt: string }[] = [];
  for (const m of withAssetBasePath(html).matchAll(/<img\b[^>]*>/gi)) {
    const tag = m[0];
    const src = tag.match(/\ssrc="([^"]+)"/)?.[1];
    const alt = tag.match(/\salt="([^"]*)"/)?.[1] ?? "";
    if (src) out.push({ src, alt });
  }
  return out;
}

/** "PDF, 10.62 MB" out of a record's meta line, for a document link's accessible name. */
export function sizeOf(meta?: string): string | undefined {
  return meta?.match(/(\d+(?:\.\d+)?\s?(?:KB|MB|GB))/i)?.[1]?.replace(/\s?(KB|MB|GB)/i, " $1");
}

/** The file type a link leads to, by its extension. */
export function typeOfHref(href: string): string {
  const ext = href.split("?")[0]!.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return "PDF";
  if (ext === "pptx" || ext === "ppt") return "Presentation";
  if (ext === "png" || ext === "jpg" || ext === "jpeg" || ext === "webp") return "Image";
  if (ext === "xlsx" || ext === "xls") return "Spreadsheet";
  if (ext === "docx" || ext === "doc") return "Word document";
  return "Web page";
}

/* ── Figures ───────────────────────────────────────────────────────────────── */

const INDIAN = new Intl.NumberFormat("en-IN");

/**
 * A figure the record stores as a string, re-grouped the Indian way (issue: the
 * NMBA counters printed "345,703,321" beside "28,29,661+"). Only a bare count —
 * digits and grouping commas, an optional trailing "+" — is touched; "23 crore+",
 * "755+", a date or a percentage is returned exactly as written.
 */
export function formatFigure(value: string): string {
  const m = value.trim().match(/^(\d{1,3}(?:,\d{2,3})+|\d{5,})(\+?)$/);
  if (!m) return value;
  const n = Number(m[1]!.replace(/,/g, ""));
  return Number.isSafeInteger(n) ? `${INDIAN.format(n)}${m[2]}` : value;
}

/* ── Card grids ────────────────────────────────────────────────────────────── */

/**
 * The most columns a grid of `n` cards may take so its last row is not left
 * holding one or two orphans: 6 cards in a four-column row became 4 + 2, and
 * are now 3 + 3. The CSS still wraps below this on a narrower screen; this only
 * caps it. Ties go to the wider grid.
 */
export function balancedColumns(n: number, max: number): number {
  if (n <= max) return Math.max(n, 2);
  let best = max;
  let bestGap = Infinity;
  for (let c = max; c >= 2; c--) {
    const gap = Math.ceil(n / c) * c - n;
    if (gap < bestGap) {
      best = c;
      bestGap = gap;
    }
    if (gap === 0) break;
  }
  return best;
}

/* ── Copy ──────────────────────────────────────────────────────────────────── */

/**
 * A record's description without the sentences that narrate the page instead
 * of describing the organisation (`ui-restraint-and-copy.md` §1): "Files open on
 * the Department's own site, so a reader always gets the current version." The
 * record is shared with the archived site, so it is filtered here, not edited.
 */
export function withoutNarration(text?: string): string | undefined {
  if (!text) return text;
  const kept = text
    .split(/(?<=\.)\s+/)
    .filter((s) => !/\b(files open|a reader|this page|on this site|below|click)\b/i.test(s));
  return kept.join(" ").trim() || undefined;
}

/* ── Frequently asked questions ────────────────────────────────────────────── */

export interface FaqItem {
  question: string;
  /** Answer markup, wrappers removed; run it through `cleanHtml` before rendering. */
  answerHtml: string;
}

export interface FaqGroup {
  id: string;
  title: string;
  items: FaqItem[];
}

/** Acronyms the NMBA FAQ headings set in capitals, kept so when the heading is title-cased. */
const FAQ_ACRONYMS = new Set(["SUD", "NPS"]);

function faqGroupTitle(raw: string): string {
  const t = raw.replace(/^\s*frequently asked questions\s*:\s*/i, "").replace(/\s+/g, " ").trim();
  return t
    .split(" ")
    .map((w, i) => {
      const bare = w.replace(/[^A-Za-z]/g, "");
      if (FAQ_ACRONYMS.has(bare)) return w;
      const lower = w.toLowerCase();
      if (i > 0 && SMALL.has(lower)) return lower;
      return lower.replace(/[a-z]/, (ch) => ch.toUpperCase());
    })
    .join(" ");
}

/**
 * The questions and answers out of the source's accordion widget. The source
 * writes each pair as `<span><div>Question</div></span>` + an icon husk + the
 * answer in nested divs, so the answer is everything up to the next question.
 */
export function extractFaqs(html: string): FaqItem[] {
  const re = /<span>\s*<div>([\s\S]*?)<\/div>\s*<\/span>\s*<span>\s*(?:<span>\s*<i><\/i>\s*<\/span>\s*)+<\/span>/g;
  const marks = [...html.matchAll(re)];
  return marks
    .map((m, i) => {
      const start = m.index! + m[0].length;
      const end = i + 1 < marks.length ? marks[i + 1]!.index! : html.length;
      const answerHtml = html
        .slice(start, end)
        .replace(/<\/?div[^>]*>/gi, "")
        .trim();
      return { question: stripTags(m[1]!), answerHtml };
    })
    .filter((f) => f.question && stripTags(f.answerHtml));
}

/**
 * Every FAQ section of a page as a group, or null when the page is not an FAQ
 * page. An answer that repeats one given earlier on the page is dropped with its
 * question. On the NMBA FAQs (General) the ICD-10 diagnostic criteria answer
 * "How is Dependence or Addiction diagnosed?", and the source then lists "What
 * are the different kinds of drugs/ substances of abuse?" TWICE: first with a
 * word-for-word copy of the ICD-10 answer, then with its real answer. The copy
 * is the one dropped; the question keeps its real answer.
 */
export function faqGroups(sections: ContentSection[]): FaqGroup[] | null {
  if (sections.length === 0 || !sections.every((s) => /^\s*frequently asked questions/i.test(s.heading ?? ""))) return null;
  const seen = new Set<string>();
  const groups: FaqGroup[] = [];
  for (const s of sections) {
    const items = extractFaqs(s.html).filter((f) => {
      const key = stripTags(f.answerHtml).toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    if (items.length === 0) continue;
    const title = faqGroupTitle(s.heading ?? "");
    groups.push({ id: `faq-${slugify(title)}`, title, items });
  }
  return groups.length > 0 ? groups : null;
}
