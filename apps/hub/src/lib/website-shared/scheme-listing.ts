import listing from "./scheme-listing.json";

/**
 * THE LIVE SCHEMES & SERVICES LISTING — dosje.gov.in/schemes-services/?org=mosje,
 * Active tab, as the Department publishes it (instruction, 29 Sep 2026: "use the
 * live names and list"). Read on SCHEME_LISTING_AS_ON by
 * `scripts/build-scheme-listing.mjs`; re-run it when the live listing changes.
 *
 * The live page files one scheme under every group it serves — AVYAY and SMILE sit
 * in four groups each — so 42 entries in 11 groups are 28 schemes. The groups, their
 * order, the names and "Who It Is For" are the Department's; `publishedTitle` keeps
 * each name exactly as printed, and `title` is it in Title Case
 * (ui-restraint-and-copy.md §2, decided 1 Sep 2026) with the four repairs below.
 *
 * DBIM reads this list. Classic reads the same schemes from the register mirror
 * (`content/website/schemes.json`). New still lists the scheme master
 * (`lib/website-next/schemes.ts`), whose entries split several of these umbrellas
 * into their components — moving it is its own decision.
 */
export const SCHEME_LISTING_AS_ON: string = listing.asOn;
export const SCHEME_LISTING_SOURCE: string = listing.source;

/** The live listing's groups, in the live order. */
export const SCHEME_GROUPS: readonly string[] = listing.groups.map((g) => g.name);

/**
 * The live listing's one picture for every scheme — its share image
 * (`wp-content/uploads/2025/11/schemes.jpg`), byte-for-byte, 78 KB: under DBIM 3.0
 * A.5.2.1's 100 KB for a card image. The live cards carry no picture of their own.
 * `position` frames the State Emblem in a wide card and leaves out the words set
 * into the image, which would otherwise repeat on every card.
 */
export const SCHEME_IMAGE = {
  src: "/website/images/schemes/national-initiatives-and-schemes.jpg",
  width: 1024,
  height: 1024,
  position: "50% 30%",
} as const;

export interface ListedScheme {
  /** The scheme's address on dosje.gov.in (`/schemes-and-services/<slug>/`). */
  slug: string;
  /** The name as the listing prints it. */
  publishedTitle: string;
  /** The name as this website prints it: Title Case, with the repairs below. */
  title: string;
  /** "Who It Is For", as the listing's tags. */
  who: string[];
  /** Every group the listing files it under, in the live order. */
  groups: string[];
}

/*
 * Four repairs, each unambiguous: a letter the live name drops ("Upgadation"), a
 * space before a hyphen ("PM -YASASVI"), a missing space after "&" ("&Others"),
 * and a closing full stop on a name. No word is changed beyond these.
 */
const REPAIRS: [RegExp, string][] = [
  [/\bUpgadation\b/g, "Upgradation"],
  [/\s+-(?=[A-Z])/g, "-"],
  [/&(?=\S)/g, "& "],
  [/\s*\.\s*$/, ""],
];

/** Words a Title Case title keeps lowercase unless they open it (ui-restraint-and-copy.md §2). */
const SMALL = new Set(["a", "an", "the", "and", "or", "but", "to", "of", "in", "into", "for", "on", "with", "at", "by", "from", "as"]);

function titleWord(token: string, first: boolean): string {
  const m = /^([("“']*)(.*?)([)"”',.;:]*)$/.exec(token);
  const [, pre = "", core = "", post = ""] = m ?? [];
  /* An acronym, a mixed-case word (OBCs, NF-OBC) or a figure is kept as published. */
  if (!/[a-z]/i.test(core) || /\d/.test(core) || /[A-Z]/.test(core.slice(1))) return token;
  const lower = core.toLowerCase();
  if (lower === "etc" && post.startsWith(".")) return token;
  if (!first && SMALL.has(lower)) return `${pre}${lower}${post}`;
  return `${pre}${core.split("-").map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join("-")}${post}`;
}

export function schemeTitle(published: string): string {
  const fixed = REPAIRS.reduce((t, [re, to]) => t.replace(re, to), published.replace(/\s+/g, " ").trim());
  return fixed
    .split(" ")
    .map((w, i) => titleWord(w, i === 0))
    .join(" ");
}

const SCHEMES: ListedScheme[] = (() => {
  const out = new Map<string, ListedScheme>();
  for (const g of listing.groups) {
    for (const slug of g.slugs) {
      const rec = (listing.schemes as Record<string, { title: string; who: string[] }>)[slug];
      if (!rec) continue;
      const found = out.get(slug);
      if (found) {
        found.groups.push(g.name);
        continue;
      }
      out.set(slug, { slug, publishedTitle: rec.title, title: schemeTitle(rec.title), who: rec.who, groups: [g.name] });
    }
  }
  return [...out.values()];
})();

/** The live listing's schemes, once each, in the order the listing first shows them. */
export const listedSchemes = (): readonly ListedScheme[] => SCHEMES;

export const listedScheme = (slug: string): ListedScheme | undefined => SCHEMES.find((s) => s.slug === slug);
