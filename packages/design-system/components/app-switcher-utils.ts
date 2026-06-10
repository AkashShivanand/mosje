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

/** Default MoSJE estate registry — mirrors apps/hub/src/data/portals.ts. */
export const DEFAULT_APPS: AppEntry[] = [
  // ── Website ────────────────────────────────────────────────────────────
  {
    name: "DoSJE Website",
    abbr: "W",
    path: "/website",
    desc: "Unified informational site",
    group: "Website",
  },
  // ── Portals — live ─────────────────────────────────────────────────────
  {
    name: "PM-AJAY",
    abbr: "PM",
    path: "/portals/pm-ajay",
    desc: "MIS dashboard",
    org: "Ministry of Social Justice & Empowerment",
    group: "Portals",
    status: "live",
  },
  {
    name: "E-Utthan Admin",
    abbr: "EU",
    path: "/portals/eutthan-admin",
    desc: "Scheme management",
    org: "Ministry of Social Justice & Empowerment",
    group: "Portals",
    status: "live",
  },
  {
    name: "SMILE Beggary Rehabilitation",
    abbr: "SM",
    path: "/portals/smile-admin",
    desc: "Rehabilitation admin portal",
    org: "Ministry of Social Justice & Empowerment",
    group: "Portals",
    status: "live",
  },
  // ── Portals — planned ──────────────────────────────────────────────────
  {
    name: "NSFDC",
    path: "/portals/nsfdc",
    desc: "Nat. Scheduled Castes Finance & Dev. Corp",
    org: "National Scheduled Castes Finance & Development Corporation",
    group: "Portals",
    status: "planned",
  },
  {
    name: "NSKFDC",
    path: "/portals/nskfdc",
    desc: "Nat. Safai Karamcharis Finance & Dev. Corp",
    org: "National Safai Karamcharis Finance & Development Corporation",
    group: "Portals",
    status: "planned",
  },
  {
    name: "NBCFDC",
    path: "/portals/nbcfdc",
    desc: "Nat. Backward Classes Finance & Dev. Corp",
    org: "National Backward Classes Finance & Development Corporation",
    group: "Portals",
    status: "planned",
  },
  {
    name: "National Overseas Scholarship",
    abbr: "NO",
    path: "/portals/nos",
    desc: "National Overseas Scholarship scheme",
    org: "Ministry of Social Justice & Empowerment",
    group: "Portals",
    status: "planned",
  },
  {
    name: "PM YASASVI",
    abbr: "PY",
    path: "/portals/pm-yasasvi",
    desc: "Young Achievers Scholarship — OBC/EBC/DNT",
    org: "Ministry of Social Justice & Empowerment",
    group: "Portals",
    status: "planned",
  },
  // ── Dev (hidden in production) ─────────────────────────────────────────
  {
    name: "Storybook",
    abbr: "SB",
    path: "/storybook/",
    desc: "Component explorer",
    group: "Dev",
  },
  {
    name: "Design System",
    abbr: "DS",
    path: "/design-system",
    desc: "SAMAVESH docs",
    group: "Dev",
  },
];
