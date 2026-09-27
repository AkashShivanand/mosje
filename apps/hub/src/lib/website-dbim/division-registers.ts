/**
 * The Department's division registers, as DBIM pages under their division:
 * `/ministry/our-division/<division>/<register>`.
 *
 * A division's Related Links (`DIVISIONS[].links`) point at pages of the 2026 design.
 * Where such a page is a register the estate holds as DATA — a file list or the NGO
 * enforcement table in `@/data/website` — the DBIM design renders the same data here,
 * in its own document list. Nothing is transcribed: every row is read from the module
 * the 2026 page reads, and the page title is the division's own link label. The full
 * old-href → new-destination table is `DBIM_DIVISION_LINK_MAP` in `./ministry.ts` and
 * docs/research/dbim-reference/components/link-map.spec.md.
 *
 * SOURCE: `@/data/website/scheduled-castes.ts` (registers transcribed from dosje.gov.in
 * on 18 Sep 2026) and `@/data/website/ngo-grants.ts` (the Grants-in-Aid to NGOs
 * enforcement and screening records).
 */
import {
  BLACKLISTING_ORDERS,
  DE_BLACKLISTED_NGO_ORDERS,
  DETAILED_DEMAND_FOR_GRANT,
  DIVISIONS,
  NCSC_FUNCTION_CIRCULARS,
  NGO_ENFORCEMENT_REGISTER,
  SCHEDULED_CASTE_LISTS,
  SCREENING_COMMITTEE_MINUTES,
  SOCIAL_WELFARE_STATISTICS,
  SPECIAL_MENTION_MATTERS,
  type GrantDocument,
  type RegisterEntry,
} from "@/data/website";
import type { DbimDocRow } from "./documents";

/** One list on a register page; `heading` only where a page carries two. */
export interface DbimRegisterFiles {
  heading?: string;
  rows: DbimDocRow[];
}

/** An organisation in the NGO enforcement register, and the Department's own wording of the action. */
export interface DbimEnforcementRow {
  key: string;
  name: string;
  action: string;
}

export interface DbimRegister {
  /** The division the register belongs to (`DIVISIONS[].id`). */
  division: string;
  /** The last segment of the 2026 design's route, kept so the mapping is mechanical. */
  slug: string;
  /** The 2026 design's href this page replaces in the DBIM design. */
  from: string;
  lists: DbimRegisterFiles[];
  /** The NGO enforcement table, where the register is one. */
  enforcement?: DbimEnforcementRow[];
}

const MONTHS: Record<string, string> = {
  Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
  Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12",
};

/** "26 Jan 2024" (the Department's print form) → "2024-01-26", which the DBIM lists format and sort. */
function isoDate(date: string | undefined): string | undefined {
  const m = /^(\d{1,2}) ([A-Z][a-z]{2}) (\d{4})$/.exec(date?.trim() ?? "");
  const mm = m ? MONTHS[m[2]!] : undefined;
  return m && mm ? `${m[3]}-${mm}-${m[1]!.padStart(2, "0")}` : undefined;
}

const fileRow = (key: string, title: string, href: string, date?: string, size?: string): DbimDocRow => ({
  key,
  title,
  href,
  date: isoDate(date),
  size,
  external: /^https?:\/\//i.test(href),
});

const fromEntries = (entries: RegisterEntry[]): DbimDocRow[] =>
  entries.map((e, i) => fileRow(`${i}-${e.href}`, e.label, e.href, e.date, e.fileSize));

const fromGrantDocs = (docs: GrantDocument[]): DbimDocRow[] =>
  docs.flatMap((d, i) => (d.fileUrl ? [fileRow(`${i}-${d.fileUrl}`, d.title, d.fileUrl, d.date, d.fileSize)] : []));

/*
 * State and UT names as the Constitution's First Schedule spells them. The register
 * transcribes the Department's page verbatim, misspellings included; the 2026 design
 * corrects these four for display only (`app/website/list-of-scheduled-castes/page.tsx`,
 * issue CON-11, a Blocker) and the DBIM design shows the same names. The linked
 * gazette files are untouched.
 */
const STATE_NAME: Record<string, string> = {
  Gujrat: "Gujarat",
  Maharastra: "Maharashtra",
  "Pondicherri/Puducherry": "Puducherry",
  Laddakh: "Ladakh",
};

export const DBIM_REGISTERS: DbimRegister[] = [
  {
    division: "scheduled-caste-welfare",
    slug: "list-of-scheduled-castes",
    from: "/website/list-of-scheduled-castes",
    lists: [
      {
        // The two headings are the Department's own, as the 2026 page sets them.
        heading: "State-wise / UT-wise List of Scheduled Castes",
        rows: fromEntries(SCHEDULED_CASTE_LISTS.map((s) => ({ ...s, label: STATE_NAME[s.label] ?? s.label }))).sort((a, b) =>
          a.title.localeCompare(b.title),
        ),
      },
      { heading: "Functions of NCSC", rows: fromEntries(NCSC_FUNCTION_CIRCULARS) },
    ],
  },
  {
    division: "grants-in-aid-to-ngos",
    slug: "minutes-of-screening-committees",
    from: "/website/minutes-of-screening-committees",
    lists: [{ rows: fromGrantDocs(SCREENING_COMMITTEE_MINUTES) }],
  },
  {
    division: "grants-in-aid-to-ngos",
    slug: "grants-suspended-list-blacklisted-ngos",
    from: "/website/grants-suspended-list-blacklisted-ngos",
    enforcement: NGO_ENFORCEMENT_REGISTER.map((r, i) => ({ key: `${i}`, name: r.name, action: r.action })),
    lists: [{ heading: "Recent Blacklisting Orders", rows: fromGrantDocs(BLACKLISTING_ORDERS) }],
  },
  {
    division: "grants-in-aid-to-ngos",
    slug: "list-of-de-blacklisted-ngos",
    from: "/website/list-of-de-blacklisted-ngos",
    lists: [{ rows: fromGrantDocs(DE_BLACKLISTED_NGO_ORDERS) }],
  },
  {
    division: "budget-and-account",
    slug: "detailed-demand-for-grant",
    from: "/website/detailed-demand-for-grant",
    lists: [{ rows: fromEntries(DETAILED_DEMAND_FOR_GRANT) }],
  },
  {
    division: "statistics-division",
    slug: "handbook-on-social-welfare-statistics",
    from: "/website/handbook-on-social-welfare-statistics",
    lists: [{ rows: fromEntries(SOCIAL_WELFARE_STATISTICS) }],
  },
  {
    division: "parliamentary-matters",
    slug: "special-mention-matters-raised-under-377",
    from: "/website/special-mention-matters-raised-under-377",
    lists: [{ rows: fromEntries(SPECIAL_MENTION_MATTERS) }],
  },
];

/** The DBIM path of a register page. */
export const registerPath = (r: Pick<DbimRegister, "division" | "slug">) => `/ministry/our-division/${r.division}/${r.slug}`;

/** A register page: the register, its title (the division's own link label) and its division's name. */
export function divisionRegister(division: string, slug: string) {
  const r = DBIM_REGISTERS.find((x) => x.division === division && x.slug === slug);
  const d = DIVISIONS.find((x) => x.id === division);
  const title = d?.links.find((l) => l.href === r?.from)?.label;
  return r && d && title ? { ...r, title, divisionName: d.name } : undefined;
}
