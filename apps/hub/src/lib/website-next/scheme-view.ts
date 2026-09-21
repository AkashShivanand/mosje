import {
  OFFERINGS,
  PERSONAS,
  ROUTES,
  SCHEMES,
  applyLabel,
  matchSchemes,
  type OfferingId,
  type PersonaId,
  type Scheme,
} from "./schemes";
import master from "@/content/website/scheme-master.json";

/**
 * Views over the scheme master for the finder, the scheme pages and the persona
 * landings. Nothing here adds a fact: every label is either the master's own or
 * the Department's name for one of its divisions (the "About the Division"
 * pages under /website).
 */

/** The date the master was compiled from its sources: the pages' honest "last updated". */
export const MASTER_DATE: string = (master as { generated?: string }).generated ?? "";

export function getMasterScheme(id: string): Scheme | undefined {
  return SCHEMES.find((s) => s.id === id);
}

/** The division codes in the master, as the Department's own division pages name them. */
const DIVISIONS: Record<string, { label: string; href: string }> = {
  SCD: { label: "Welfare of Scheduled Castes Division", href: "/website/about-the-division" },
  BC: {
    label: "Welfare of Other Backward Classes Division",
    href: "/website/about-the-division-welfare-of-the-other-backward-classes",
  },
  "Social Defence": { label: "Social Defence Division", href: "/website/about-the-division-social-defence" },
};

/** One entry per division a scheme is recorded against. "Other" and "All" name no division. */
export function divisionsOf(s: Scheme): { label: string; href: string }[] {
  if (!s.division) return [];
  return s.division
    .split("/")
    .map((d) => DIVISIONS[d.trim()])
    .filter((d): d is { label: string; href: string } => Boolean(d));
}

/** "Administered by" as one short line: the umbrella, else the division. */
export function administeredBy(s: Scheme): string | undefined {
  if (s.umbrella) return s.umbrella;
  const d = divisionsOf(s);
  return d.length ? d.map((x) => x.label).join(" and ") : undefined;
}

export const offeringLabel = (id: OfferingId) => OFFERINGS.find((o) => o.id === id)?.label ?? id;
export const offeringShort = (id: OfferingId) => {
  const o = OFFERINGS.find((x) => x.id === id);
  return o?.short ?? o?.label ?? id;
};
export const personaLabel = (id: PersonaId) => PERSONAS.find((p) => p.id === id)?.label ?? id;

/** The kinds of support a scheme gives to `who` (all of them when no group is chosen). */
export function offersTo(s: Scheme, who?: PersonaId): OfferingId[] {
  if (!who || !s.offersFor) return s.offers;
  return s.offers.filter((o) => !s.offersFor![o] || s.offersFor![o]!.includes(who));
}

/** Budget classifications present in the master, in the order the Department's
 *  Demand for Grants uses them, then the rest as they appear. */
const TYPE_ORDER = ["Central Sector", "Centrally Sponsored", "Corporation", "Foundation"];
export const SCHEME_TYPES: string[] = Array.from(new Set(SCHEMES.map((s) => s.type))).sort((a, b) => {
  const ia = TYPE_ORDER.indexOf(a);
  const ib = TYPE_ORDER.indexOf(b);
  return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
});

export interface FinderFilter {
  who?: PersonaId;
  offer?: OfferingId;
  type?: string;
  q?: string;
}

/** The finder's one expression: the master's matcher, then the Type facet. */
export function findSchemes(f: FinderFilter): Scheme[] {
  return matchSchemes({ who: f.who, offer: f.offer, q: f.q }).filter((s) => !f.type || s.type === f.type);
}

export interface SchemeGroup {
  id: string;
  title: string;
  schemes: Scheme[];
}

/** Grouped by What You Get. A scheme giving two kinds of support sits under both. */
export function groupByOffering(list: readonly Scheme[], f: FinderFilter = {}): SchemeGroup[] {
  return OFFERINGS.filter((o) => !f.offer || o.id === f.offer)
    .map((o) => ({
      id: o.id,
      title: o.label,
      schemes: list.filter((s) => offersTo(s, f.who).includes(o.id)),
    }))
    .filter((g) => g.schemes.length > 0);
}

/** Grouped by the umbrella scheme, else the division, that administers it. */
export function groupByAdministrator(list: readonly Scheme[]): SchemeGroup[] {
  const groups = new Map<string, Scheme[]>();
  for (const s of list) {
    const key = administeredBy(s) ?? "Other Schemes of the Department";
    groups.set(key, [...(groups.get(key) ?? []), s]);
  }
  return Array.from(groups, ([title, schemes]) => ({
    id: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    title,
    schemes,
  }));
}

export interface ApplyRoute {
  id: string;
  label: string;
  action: string;
  href: string | null;
  external: boolean;
}

/** Where to apply, with the link only where the master confirms one. */
export function applyRoutes(s: Scheme): ApplyRoute[] {
  return s.apply.flatMap((id) => {
      const r = ROUTES[id];
      if (!r) return [];
      return [{
        id,
        label: r.label,
        action: applyLabel(id),
        href: r.href,
        external: Boolean(r.href && /^https?:/.test(r.href)),
      }];
    });
}

/** Other schemes that give the same kind of support, nearest first (same umbrella). */
export function relatedSchemes(s: Scheme, limit = 6): Scheme[] {
  const others = SCHEMES.filter((x) => x.id !== s.id && x.offers.some((o) => s.offers.includes(o)));
  const same = others.filter((x) => s.umbrella && x.umbrella === s.umbrella);
  const rest = others.filter((x) => !same.includes(x));
  return [...same, ...rest].slice(0, limit);
}

/** Citation codes, expanded as the master's own header defines them. */
export function expandSource(code: string): { text: string; href?: string } {
  const [head, ...restParts] = code.split(" ");
  const rest = restParts.join(" ");
  switch (head) {
    case "AR":
      return {
        text: `Annual Report 2025-26, Chapter 3${rest ? `, ${rest}` : ""}`,
        href: "https://socialjustice.gov.in/writereaddata/UploadFile/71441776233188.pdf",
      };
    case "SBE":
      return {
        text: `Notes on Demands for Grants 2026-27, Demand No. 93${rest ? `, item ${rest}` : ""}`,
        href: "https://www.indiabudget.gov.in/doc/eb/sbe93.pdf",
      };
    case "PIB":
      return { text: rest ? `Press Information Bureau release ${rest}` : "Year-End Review 2025 of the Department, Press Information Bureau" };
    case "SJ":
      return /^\d+$/.test(rest)
        ? { text: `Scheme page ${rest}, socialjustice.gov.in`, href: `https://socialjustice.gov.in/schemes/${rest}` }
        : { text: "socialjustice.gov.in" };
    case "DOSJE":
      return { text: `dosje.gov.in organisation page${rest ? `, ${rest}` : ""}` };
    default:
      return { text: code };
  }
}

/**
 * A scheme's status where a source states one. Only PM-DAKSH has one today:
 * the Notes on Demands for Grants 2026-27 (item 11) record its merger with PM
 * Kaushal Vikas Yojana from 2026-27. Absent means no source states a change —
 * not that the scheme is confirmed open, so nothing is shown.
 */
export const SCHEME_STATUS: Record<string, { label: string; detail: string; source: string }> = {
  "pm-daksh": {
    label: "Merging into PM Kaushal Vikas Yojana",
    detail: "The scheme is merged with PM Kaushal Vikas Yojana from 2026-27.",
    source: "SBE 11",
  },
};
