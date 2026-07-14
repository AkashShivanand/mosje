export interface AppEntry {
  /** Full display name — never abbreviated. */
  name: string;
  /**
   * 2-letter icon abbreviation. Derived automatically if omitted:
   * first letters of first two words (split on space/hyphen), uppercased.
   * Single-word names use first two characters.
   * Examples: "PM-AJAY" → "PM", "E-Utthan Admin" → "EU", "SMILE Beggary" → "SM".
   */
  abbr?: string;
  /** Hub-origin path (e.g. "/portals/pm-ajay"). */
  path: string;
  /** Short description shown below the name. */
  desc?: string;
  /** Organisation / scheme owner — included in search matching. */
  org?: string;
  /** Which section this entry appears in. */
  group: "Website" | "Portals" | "Dev";
  /**
   * Optional finer sub-grouping within a `group` (e.g. "Finance & development
   * corporations"). The estate gate uses this to section the portal grid; the
   * compact AppSwitcher ignores it and groups by `group` only.
   */
  category?: string;
  /**
   * "live" → clickable, full opacity.
   * "planned" → grayed out at 45% opacity, not clickable.
   * Omitting defaults to "live".
   */
  status?: "live" | "planned";
}

/** Derive 2-letter icon abbreviation from an AppEntry. */
export function deriveAbbr(entry: AppEntry): string {
  if (entry.abbr) return entry.abbr;
  const words = entry.name.split(/[\s\-]+/).filter(Boolean);
  if (words.length >= 2) {
    const first = words[0]?.[0];
    const second = words[1]?.[0];
    if (first && second) {
      return (first + second).toUpperCase();
    }
  }
  return entry.name.slice(0, 2).toUpperCase();
}

/**
 * Case-insensitive filter across name, desc, and org.
 * Returns the full list unchanged when query is blank.
 */
export function filterApps(apps: AppEntry[], query: string): AppEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return apps;
  return apps.filter(
    (a) =>
      a.name.toLowerCase().includes(q) ||
      (a.desc ?? "").toLowerCase().includes(q) ||
      (a.org ?? "").toLowerCase().includes(q),
  );
}

/**
 * Longest-prefix match: returns the normalised path of the active entry,
 * or null if no entry matches pathname.
 */
export function matchActivePath(
  apps: AppEntry[],
  pathname: string,
): string | null {
  let best: string | null = null;
  for (const a of apps) {
    const p = a.path === "/" ? "/" : a.path.replace(/\/$/, "");
    const matches =
      p === "/"
        ? pathname === "/"
        : pathname === p || pathname.startsWith(p + "/");
    if (matches && (best === null || p.length > best.length)) best = p;
  }
  return best;
}

/** Sub-group labels used by the estate gate, in display order. */
export const PORTAL_CATEGORIES = [
  "Finance & development corporations",
  "Schemes & scholarships",
  "Social defence & welfare",
  "Commissions & boards",
] as const;

/**
 * Default MoSJE estate registry — the single source of truth for the gate and
 * the AppSwitcher. Mirrors the scope in MOSJE-ARCHITECTURE.md: one unified
 * website, the SAMAVESH design system, and the full slate of ~20 workflow
 * portals across 33+ organisations & schemes (live + planned).
 */
export const DEFAULT_APPS: AppEntry[] = [
  // ── Website ────────────────────────────────────────────────────────────
  {
    name: "DoSJE Website",
    abbr: "W",
    path: "/website",
    desc: "Unified informational site for the department and its associated organisations",
    org: "Department of Social Justice & Empowerment",
    group: "Website",
    status: "live",
  },

  // ── Portals · Finance & development corporations ───────────────────────
  {
    name: "NSFDC",
    abbr: "NS",
    path: "/portals/nsfdc",
    desc: "Scheduled Castes finance & development corporation",
    org: "National Scheduled Castes Finance & Development Corporation",
    group: "Portals",
    category: "Finance & development corporations",
    status: "planned",
  },
  {
    name: "NSKFDC",
    abbr: "NK",
    path: "/portals/nskfdc",
    desc: "Safai Karamcharis finance & development corporation",
    org: "National Safai Karamcharis Finance & Development Corporation",
    group: "Portals",
    category: "Finance & development corporations",
    status: "planned",
  },
  {
    name: "NBCFDC",
    abbr: "NB",
    path: "/portals/nbcfdc",
    desc: "Backward Classes finance & development corporation",
    org: "National Backward Classes Finance & Development Corporation",
    group: "Portals",
    category: "Finance & development corporations",
    status: "planned",
  },

  // ── Portals · Schemes & scholarships ───────────────────────────────────
  {
    name: "PM-AJAY",
    abbr: "PM",
    path: "/portals/pm-ajay",
    desc: "MIS dashboard — Pradhan Mantri Anusuchit Jaati Abhyuday Yojana",
    org: "Ministry of Social Justice & Empowerment",
    group: "Portals",
    category: "Schemes & scholarships",
    status: "live",
  },
  {
    name: "E-Utthan Admin",
    abbr: "EU",
    path: "/portals/eutthan-admin",
    desc: "Scheme management & monitoring",
    org: "Ministry of Social Justice & Empowerment",
    group: "Portals",
    category: "Schemes & scholarships",
    status: "live",
  },
  {
    name: "National Overseas Scholarship",
    abbr: "NO",
    path: "/portals/nos",
    desc: "Overseas study scholarship for SC, DNT & landless labourers",
    org: "Ministry of Social Justice & Empowerment",
    group: "Portals",
    category: "Schemes & scholarships",
    status: "planned",
  },
  {
    name: "PM-YASASVI",
    abbr: "PY",
    path: "/portals/pm-yasasvi",
    desc: "Young Achievers Scholarship — OBC, EBC & DNT",
    org: "Ministry of Social Justice & Empowerment",
    group: "Portals",
    category: "Schemes & scholarships",
    status: "planned",
  },
  {
    name: "Pre-Matric Scholarship",
    abbr: "PR",
    path: "/portals/pre-matric-sc",
    desc: "Pre-matric scholarship for SC & other eligible students",
    org: "Ministry of Social Justice & Empowerment",
    group: "Portals",
    category: "Schemes & scholarships",
    status: "planned",
  },
  {
    name: "Post-Matric Scholarship",
    abbr: "PO",
    path: "/portals/post-matric-sc",
    desc: "Post-matric scholarship for Scheduled Caste students",
    org: "Ministry of Social Justice & Empowerment",
    group: "Portals",
    category: "Schemes & scholarships",
    status: "planned",
  },
  {
    name: "Top Class Education",
    abbr: "TC",
    path: "/portals/top-class-obc",
    desc: "Top-class education scholarship — OBC, EBC & DNT",
    org: "Ministry of Social Justice & Empowerment",
    group: "Portals",
    category: "Schemes & scholarships",
    status: "planned",
  },

  // ── Portals · Social defence & welfare ─────────────────────────────────
  {
    name: "SMILE Beggary Rehabilitation",
    abbr: "SM",
    path: "/portals/smile-admin",
    desc: "Rehabilitation admin portal for persons engaged in begging",
    org: "Ministry of Social Justice & Empowerment",
    group: "Portals",
    category: "Social defence & welfare",
    status: "live",
  },
  {
    name: "Nasha Mukt Bharat Abhiyaan",
    abbr: "NM",
    path: "/portals/nmba",
    desc: "Drug-free India campaign management",
    org: "Ministry of Social Justice & Empowerment",
    group: "Portals",
    category: "Social defence & welfare",
    status: "live",
  },
  {
    name: "SAMBAL",
    abbr: "SB",
    path: "/portals/nhapoa",
    desc: "National Helpline Against Atrocities (formerly NHAA) — grievance redressal, rescue & relief under the PoA Act",
    org: "Ministry of Social Justice & Empowerment",
    group: "Portals",
    category: "Social defence & welfare",
    status: "live",
  },
  {
    name: "Transgender Persons",
    abbr: "TG",
    path: "/portals/tg",
    desc: "National Portal for Transgender Persons — certificate/ID application, review workflow & welfare access",
    org: "Ministry of Social Justice & Empowerment",
    group: "Portals",
    category: "Social defence & welfare",
    status: "live",
  },
  {
    name: "NISD",
    abbr: "NI",
    path: "/portals/nisd",
    desc: "National Institute of Social Defence — training & programmes",
    org: "National Institute of Social Defence",
    group: "Portals",
    category: "Social defence & welfare",
    status: "planned",
  },
  {
    name: "Senior Citizens Welfare",
    abbr: "SR",
    path: "/portals/senior-citizens",
    desc: "Welfare services & schemes for senior citizens",
    org: "Ministry of Social Justice & Empowerment",
    group: "Portals",
    category: "Social defence & welfare",
    status: "planned",
  },

  // ── Portals · Commissions & boards ─────────────────────────────────────
  {
    name: "NCSC",
    abbr: "NC",
    path: "/portals/ncsc",
    desc: "Grievance & workflow portal",
    org: "National Commission for Scheduled Castes",
    group: "Portals",
    category: "Commissions & boards",
    status: "planned",
  },
  {
    name: "NCSK",
    abbr: "CK",
    path: "/portals/ncsk",
    desc: "Grievance & workflow portal",
    org: "National Commission for Safai Karamcharis",
    group: "Portals",
    category: "Commissions & boards",
    status: "planned",
  },
  {
    name: "NCBC",
    abbr: "CB",
    path: "/portals/ncbc",
    desc: "Grievance & workflow portal",
    org: "National Commission for Backward Classes",
    group: "Portals",
    category: "Commissions & boards",
    status: "planned",
  },
  {
    name: "DWBDNC",
    abbr: "DW",
    path: "/portals/dwbdnc",
    desc: "Board for Denotified, Nomadic & Semi-Nomadic communities",
    org: "Development & Welfare Board for DNT Communities",
    group: "Portals",
    category: "Commissions & boards",
    status: "planned",
  },

  // ── Dev (hidden in production) ─────────────────────────────────────────
  {
    name: "Design System",
    abbr: "DS",
    path: "/design-system",
    desc: "SAMAVESH foundations, components & documentation",
    group: "Dev",
    status: "live",
  },
  {
    name: "Storybook",
    abbr: "SB",
    path: "/storybook/",
    desc: "Interactive component explorer",
    group: "Dev",
    status: "live",
  },
];
