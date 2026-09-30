/**
 * The Department's scheme pages, as ingested, set their structure by hand: a
 * sub-heading is a plain paragraph, a numbered list is a run of paragraphs that
 * each begin "1)", "2)", an indent is a run of hard spaces. Rendered as they are,
 * the DBIM scheme page reads as one undifferentiated block.
 *
 * `tidyProse` restores the structure the text already states — never its words:
 *   - hard-space indents at the start of a paragraph or list item go;
 *   - empty paragraphs go, and a double line break is a paragraph break;
 *   - "1.Assistance" gains the space after its number;
 *   - two or more consecutive paragraphs numbered 1, 2, 3… or a, b, c… become a list;
 *   - a short standalone line with no closing punctuation, followed by more text,
 *     is the sub-heading it was written as, and becomes an <h3>.
 * Tables are left exactly as they are.
 */

const WS = "(?:\\s|&nbsp;|&#160;|\\u00a0)";
/** Inline wrappers the ingest leaves at the start of a block: <span>, <strong>… */
const LEAD = "(?:<(?:span|strong|b|em|i|u|font)\\b[^>]*>\\s*)*";

const plain = (html: string) =>
  html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/[\s ]+/g, " ")
    .trim();

type Kind = "1" | "a";
const ENUM = /^(\d{1,2}|[a-z])[.)]\s+/;

function enumOf(text: string): { kind: Kind; n: number } | null {
  const m = ENUM.exec(text);
  if (!m) return null;
  const v = m[1]!;
  return /\d/.test(v) ? { kind: "1", n: Number(v) } : { kind: "a", n: v.charCodeAt(0) - 96 };
}

const stripEnum = (inner: string) => inner.replace(new RegExp(`^(${WS}*${LEAD})(?:\\d{1,2}|[a-z])[.)]${WS}*`), "$1");

interface Para {
  start: number;
  end: number;
  inner: string;
}

function paragraphs(html: string): Para[] {
  const out: Para[] = [];
  const re = /<p\b[^>]*>([\s\S]*?)<\/p>/gi;
  for (let m = re.exec(html); m; m = re.exec(html)) out.push({ start: m.index, end: m.index + m[0].length, inner: m[1] ?? "" });
  return out;
}

/** Runs of two or more adjacent paragraphs numbered in sequence become <ol>. */
function lists(html: string): string {
  const ps = paragraphs(html);
  const edits: { start: number; end: number; html: string }[] = [];
  let i = 0;
  while (i < ps.length) {
    const first = enumOf(plain(ps[i]!.inner));
    if (!first) {
      i++;
      continue;
    }
    let j = i + 1;
    while (
      j < ps.length &&
      !html.slice(ps[j - 1]!.end, ps[j]!.start).trim() &&
      (() => {
        const e = enumOf(plain(ps[j]!.inner));
        return e?.kind === first.kind && e.n === first.n + (j - i);
      })()
    )
      j++;
    if (j - i >= 2) {
      const type = first.kind === "a" ? ' type="a"' : "";
      const start = first.n > 1 ? ` start="${first.n}"` : "";
      const items = ps.slice(i, j).map((p) => `<li>${stripEnum(p.inner)}</li>`);
      edits.push({ start: ps[i]!.start, end: ps[j - 1]!.end, html: `<ol${type}${start}>${items.join("")}</ol>` });
    }
    i = j;
  }
  let out = html;
  for (const e of edits.reverse()) out = out.slice(0, e.start) + e.html + out.slice(e.end);
  return out;
}

/**
 * A line with no closing punctuation. Not a label and its value ("Sector:
 * Education"), not a lead-in ("…are as under: –"), not a long sentence the
 * Department left without a full stop.
 */
function shortLine(text: string): boolean {
  if (text.length < 3 || text.length > 140 || text.split(" ").length > 15) return false;
  if (/[.;,!?]$/.test(text) || /:\s*[-–—]*$/.test(text) || /\S\s*:\s*\S/.test(text)) return false;
  return /^(?:[A-Z‘'"(]|\d{1,2}\.\s|[A-Z]\.\s)/.test(text) && !/^\d+\s/.test(text);
}

/**
 * A short line standing alone between longer text is the sub-heading it was
 * written as. A run of short lines is a list the page never marked up, and is
 * left as it is.
 */
function headings(html: string): string {
  const ps = paragraphs(html);
  const short = ps.map((p) => shortLine(plain(p.inner)) && !/<a\b|<img\b/i.test(p.inner));
  const adjacent = (i: number, j: number) => !html.slice(ps[i]!.end, ps[j]!.start).replace(/<\/?div\b[^>]*>/gi, "").trim();
  let out = html;
  for (let i = ps.length - 1; i >= 0; i--) {
    if (!short[i]) continue;
    if (i > 0 && short[i - 1] && adjacent(i - 1, i)) continue;
    if (i < ps.length - 1 && short[i + 1] && adjacent(i, i + 1)) continue;
    /* A value under a label ("Applicant" → "Belong to DNT/SBC Community") is not a heading. */
    const before = out.slice(0, ps[i]!.start).replace(/<\/?div\b[^>]*>/gi, "").trimEnd();
    if (/<\/h[4-6]>$/i.test(before)) continue;
    /* Only when the section goes on with more than the line itself: a last line is
       not a heading over nothing, and "Total No. of Camps" over a figure is a label. */
    const rest = out.slice(ps[i]!.end).replace(/<\/?div\b[^>]*>/gi, "").trim();
    if (!/^<(p|ul|ol|table|h[2-6])\b/i.test(rest)) continue;
    const next = ps[i + 1];
    if (/^<p\b/i.test(rest) && next && plain(next.inner).length <= plain(ps[i]!.inner).length) continue;
    const inner = ps[i]!.inner.replace(/<\/?(?:strong|b)\b[^>]*>/gi, "");
    out = out.slice(0, ps[i]!.start) + `<h3>${inner}</h3>` + out.slice(ps[i]!.end);
  }
  return out;
}

function tidyChunk(html: string): string {
  let h = html
    // a double line break inside a paragraph is a paragraph break
    .replace(/(?:<br\s*\/?>\s*){2,}/gi, "</p><p>")
    // hard-space indents at the start of a paragraph or list item
    .replace(new RegExp(`(<(?:p|li)\\b[^>]*>${LEAD})${WS}+`, "gi"), "$1")
    // "1.Assistance" → "1. Assistance"
    .replace(new RegExp(`(<(?:p|li)\\b[^>]*>${LEAD})(\\d{1,2}|[a-z])([.)])(?=[A-Z‘'"(])`, "g"), "$1$2$3 ");
  // empty paragraphs, once the indents are gone
  h = h.replace(/<p\b[^>]*>(?:\s|&nbsp;|&#160;| |<br\s*\/?>|<\/?(?:span|strong|b|em)\b[^>]*>)*<\/p>/gi, "");
  return headings(lists(h));
}

export function tidyProse(html: string): string {
  return html
    .split(/(<table\b[\s\S]*?<\/table>)/i)
    .map((chunk, i) => (i % 2 ? chunk : tidyChunk(chunk)))
    .join("");
}
