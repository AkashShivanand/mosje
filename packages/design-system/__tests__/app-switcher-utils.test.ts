import { describe, it, expect } from "vitest";
import {
  deriveAbbr,
  filterApps,
  matchActivePath,
  type AppEntry,
} from "../components/navigation/app-switcher-utils.js";

// ─── Helpers ────────────────────────────────────────────────────────────────

function makeApp(overrides: Partial<AppEntry> & { name: string }): AppEntry {
  return {
    path: "/portals/test",
    group: "Portals",
    ...overrides,
  };
}

// ─── deriveAbbr ─────────────────────────────────────────────────────────────

describe("deriveAbbr", () => {
  it("returns the explicit abbr when provided", () => {
    const app = makeApp({ name: "PM-AJAY", abbr: "PM" });
    expect(deriveAbbr(app)).toBe("PM");
  });

  it("single word: returns first two chars uppercased", () => {
    const app = makeApp({ name: "Website" });
    expect(deriveAbbr(app)).toBe("WE");
  });

  it("two space-separated words: returns first letter of each word uppercased", () => {
    const app = makeApp({ name: "E Utthan" });
    expect(deriveAbbr(app)).toBe("EU");
  });

  it("hyphen-separated words: treated as two words", () => {
    const app = makeApp({ name: "PM-AJAY" });
    // split on hyphen → ["PM", "AJAY"] → "P" + "A" = "PA"
    expect(deriveAbbr(app)).toBe("PA");
  });

  it("multiple words: only uses first two words", () => {
    const app = makeApp({ name: "SMILE Beggary Rehabilitation" });
    // "SM" + "BE" would be wrong — it's first letter of word[0] + first letter of word[1]
    // = "S" + "B" = "SB"
    expect(deriveAbbr(app)).toBe("SB");
  });

  it("already uppercase single-word stays first two chars", () => {
    const app = makeApp({ name: "NSFDC" });
    expect(deriveAbbr(app)).toBe("NS");
  });

  it("short single-word name with only 1 char still returns that char doubled", () => {
    const app = makeApp({ name: "A" });
    // name.slice(0, 2).toUpperCase() → "A"
    expect(deriveAbbr(app)).toBe("A");
  });

  it("name with leading/trailing spaces after split ignores empties", () => {
    // The split filter(Boolean) removes empty strings
    const app = makeApp({ name: "National Overseas" });
    expect(deriveAbbr(app)).toBe("NO");
  });

  it("abbr: undefined triggers auto-derivation", () => {
    // abbr is not set — should auto-derive
    const app = makeApp({ name: "Design System" });
    expect(deriveAbbr(app)).toBe("DS");
  });
});

// ─── filterApps ─────────────────────────────────────────────────────────────

describe("filterApps", () => {
  const apps: AppEntry[] = [
    makeApp({
      name: "PM-AJAY",
      abbr: "PM",
      desc: "MIS dashboard",
      org: "Ministry of Social Justice",
    }),
    makeApp({
      name: "SMILE Beggary Rehabilitation",
      abbr: "SM",
      desc: "Rehabilitation admin portal",
      org: "Ministry of Social Justice",
    }),
    makeApp({
      name: "Storybook",
      abbr: "SB",
      path: "/storybook",
      desc: "Component explorer",
      group: "Resources",
    }),
    makeApp({
      name: "National Overseas Scholarship",
      abbr: "NO",
      desc: "Scholarship scheme",
      org: "DoSJE",
    }),
  ];

  it("empty query returns all apps unchanged", () => {
    expect(filterApps(apps, "")).toEqual(apps);
  });

  it("whitespace-only query returns all apps unchanged", () => {
    expect(filterApps(apps, "   ")).toEqual(apps);
  });

  it("matches on name (case-insensitive)", () => {
    const result = filterApps(apps, "smile");
    expect(result).toHaveLength(1);
    expect(result[0]?.name).toBe("SMILE Beggary Rehabilitation");
  });

  it("matches on name with mixed case", () => {
    const result = filterApps(apps, "STORY");
    expect(result).toHaveLength(1);
    expect(result[0]?.name).toBe("Storybook");
  });

  it("matches on desc", () => {
    const result = filterApps(apps, "component explorer");
    expect(result).toHaveLength(1);
    expect(result[0]?.name).toBe("Storybook");
  });

  it("matches on org", () => {
    const result = filterApps(apps, "dosje");
    expect(result).toHaveLength(1);
    expect(result[0]?.name).toBe("National Overseas Scholarship");
  });

  it("partial name match works", () => {
    const result = filterApps(apps, "ajay");
    expect(result).toHaveLength(1);
    expect(result[0]?.name).toBe("PM-AJAY");
  });

  it("no match returns empty array", () => {
    expect(filterApps(apps, "xyznonexistent")).toHaveLength(0);
  });

  it("query matching multiple apps returns all of them", () => {
    // Both PM-AJAY and SMILE Beggary have org "Ministry of Social Justice"
    const result = filterApps(apps, "Ministry of Social");
    expect(result).toHaveLength(2);
  });

  it("handles apps with no desc or org (desc/org are optional)", () => {
    const minimalApps: AppEntry[] = [
      makeApp({ name: "DoSJE Website" }), // no desc, no org
    ];
    expect(filterApps(minimalApps, "dosje")).toHaveLength(1);
    expect(filterApps(minimalApps, "portal")).toHaveLength(0);
  });

  it("returns empty array when apps list is empty", () => {
    expect(filterApps([], "anything")).toHaveLength(0);
  });
});

// ─── matchActivePath ─────────────────────────────────────────────────────────

describe("matchActivePath", () => {
  const apps: AppEntry[] = [
    makeApp({ name: "Root", path: "/" }),
    makeApp({ name: "Website", path: "/website" }),
    makeApp({ name: "PM-AJAY", path: "/portals/pm-ajay" }),
    makeApp({ name: "SMILE", path: "/portals/smile-admin" }),
    makeApp({ name: "Storybook", path: "/storybook/" }),
  ];

  it("returns null when no apps match", () => {
    expect(matchActivePath(apps, "/nonexistent")).toBeNull();
  });

  it("exact match on non-root path returns that path", () => {
    expect(matchActivePath(apps, "/website")).toBe("/website");
  });

  it("prefix match: deep path matches parent entry", () => {
    expect(matchActivePath(apps, "/portals/pm-ajay/dashboard")).toBe(
      "/portals/pm-ajay"
    );
  });

  it("prefix match: path with sub-segment matches", () => {
    expect(matchActivePath(apps, "/portals/pm-ajay/reports/monthly")).toBe(
      "/portals/pm-ajay"
    );
  });

  it("root path '/' only matches exactly '/'", () => {
    expect(matchActivePath(apps, "/")).toBe("/");
  });

  it("root path does NOT match '/website'", () => {
    // The root matcher is pathname === "/" only
    const rootOnly: AppEntry[] = [makeApp({ name: "Root", path: "/" })];
    expect(matchActivePath(rootOnly, "/website")).toBeNull();
  });

  it("similar prefix does not cause false positive: /portals/smile does not match /portals/pm-ajay", () => {
    expect(matchActivePath(apps, "/portals/smile-admin/settings")).toBe(
      "/portals/smile-admin"
    );
  });

  it("picks the longest prefix when two entries could match", () => {
    const nested: AppEntry[] = [
      makeApp({ name: "Portals", path: "/portals" }),
      makeApp({ name: "PM-AJAY", path: "/portals/pm-ajay" }),
    ];
    // "/portals/pm-ajay/overview" matches both "/portals" and "/portals/pm-ajay"
    // longest prefix wins
    expect(matchActivePath(nested, "/portals/pm-ajay/overview")).toBe(
      "/portals/pm-ajay"
    );
  });

  it("trailing-slash path is normalised (storybook has trailing slash)", () => {
    // a.path = "/storybook/" → normalised to "/storybook" internally
    // "/storybook/button" should match
    expect(matchActivePath(apps, "/storybook/button")).toBe("/storybook");
  });

  it("exact match on storybook (trailing slash normalised)", () => {
    expect(matchActivePath(apps, "/storybook")).toBe("/storybook");
  });

  it("returns null when apps list is empty", () => {
    expect(matchActivePath([], "/portals/pm-ajay")).toBeNull();
  });

  it("returns path string not the full AppEntry", () => {
    const result = matchActivePath(apps, "/website");
    expect(typeof result).toBe("string");
  });
});
