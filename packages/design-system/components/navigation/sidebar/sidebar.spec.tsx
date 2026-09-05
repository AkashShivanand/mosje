import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SidebarNav, activePathD, resolveCurrent, warnOversizedGroups } from "./sidebar";
import type { SidebarNavGroup } from "./types";

const html = (el: React.ReactElement): string => renderToStaticMarkup(el);

const GROUPS: SidebarNavGroup[] = [
  {
    items: [
      { label: "Dashboard", href: "/p", icon: "dashboard" },
      {
        label: "Applications",
        href: "/p/applications",
        icon: "description",
        badge: 3,
        children: [
          { label: "New Application", href: "/p/applications/new" },
          {
            label: "Track Applications",
            href: "/p/applications/track",
            children: [
              { label: "Under Review", href: "/p/applications/track/review" },
              { label: "Sanctioned", href: "/p/applications/track/sanctioned" },
            ],
          },
          { label: "Drafts", href: "/p/applications/drafts", disabled: true },
        ],
      },
    ],
  },
  {
    label: "Administration",
    items: [{ label: "Settings", href: "/p/settings", icon: "settings" }],
  },
];

describe("SidebarNav", () => {
  afterEach(() => vi.restoreAllMocks());

  it("renders three levels as nested lists and marks the current page at level 3", () => {
    const out = html(<SidebarNav groups={GROUPS} pathname="/p/applications/track/review" />);
    expect(out).toContain("ds-sidebar__list--l2");
    expect(out).toContain("ds-sidebar__list--l3");
    expect(out.match(/aria-current="page"/g)?.length).toBe(1);
    expect(out).toMatch(/Under Review<\/span><\/a>/);
    // the portal root ("/p") is a prefix of every route and must NOT be current here
    expect(out).not.toMatch(/aria-current="page"[^>]*>[^<]*<[^>]*>[^<]*<\/[^>]*><span[^>]*>Dashboard/);
    expect(resolveCurrent(GROUPS, "/p/applications/track/review")).toBe("/p/applications/track/review");
    expect(resolveCurrent(GROUPS, "/p")).toBe("/p");
    expect(resolveCurrent(GROUPS, "/p/applications")).toBe("/p/applications");
    expect(resolveCurrent(GROUPS, "/elsewhere")).toBeNull();
    // the ancestors are open and highlighted, not current; each list marks the entry on the path
    expect(out).toContain('aria-expanded="true"');
    expect(out.match(/data-active="true"/g)?.length).toBe(2); // Track Applications (level 2) and Under Review (level 3)
    expect(out.match(/is-active/g)?.length).toBeGreaterThanOrEqual(3);
  });

  it("draws the path to the current page with the connector's own geometry", () => {
    // first level-2 row: list padding 4, row centre 22 → y 26; trunk at 24, 16px arm to the pill at 40
    expect(activePathD(24, 26)).toBe("M 24 0 V 20 Q 24 26 30 26 H 40");
    // third row (two 44px rows and two 4px gaps above): 4 + 96 + 22
    expect(activePathD(40, 122)).toBe("M 40 0 V 116 Q 40 122 46 122 H 56");
  });

  it("names a labelled section as a group, and hides the label only visually when collapsed", () => {
    const expanded = html(<SidebarNav groups={GROUPS} pathname="/p" />);
    expect(expanded).toMatch(/role="group" aria-labelledby="[^"]+"/);
    expect(expanded).toContain("Administration");
    const collapsed = html(<SidebarNav groups={GROUPS} pathname="/p" collapsed />);
    expect(collapsed).toMatch(/ds-sidebar__group-label ds-sr-only[^>]*>Administration/);
  });

  it("collapses a group to a real button that owns a popup, and a leaf to a named link", () => {
    const out = html(<SidebarNav groups={GROUPS} pathname="/p" collapsed />);
    expect(out).toMatch(/<button[^>]*aria-haspopup="true"[^>]*aria-expanded="false"/);
    expect(out).toMatch(/<a[^>]*aria-label="Dashboard"/);
    expect(out).toContain('aria-label="Applications, 3 pending"');
    expect(out).toContain("ds-sidebar__dot");
    expect(out).not.toContain("ds-badge");
  });

  it("renders a disabled page as a named, non-operable span — never an anchor without an href", () => {
    const out = html(<SidebarNav groups={GROUPS} pathname="/p/applications" />);
    expect(out).toMatch(/<span[^>]*role="link"[^>]*aria-disabled="true"[^>]*>.*Drafts/);
    expect(out).not.toMatch(/<a class="[^"]*"(?![^>]*href)/);
  });

  it("puts the optional collapse control at the top of the rail, and only with a handler", () => {
    const withControl = html(
      <SidebarNav groups={GROUPS} pathname="/p" showCollapseControl onCollapsedChange={() => {}} />,
    );
    expect(withControl.indexOf("ds-sidebar__control")).toBeLessThan(withControl.indexOf("ds-sidebar__nav"));
    expect(withControl).toContain('aria-label="Collapse navigation"');
    expect(html(<SidebarNav groups={GROUPS} pathname="/p" showCollapseControl />)).not.toContain(
      "ds-sidebar__control",
    );
  });

  it("warns once in development when a group has more than seven children, and still renders it", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const big: SidebarNavGroup[] = [
      {
        items: [
          {
            label: "Registers",
            href: "/p/registers",
            icon: "list",
            children: Array.from({ length: 8 }, (_, i) => ({ label: `Register ${i + 1}`, href: `/p/registers/${i + 1}` })),
          },
        ],
      },
    ];
    expect(warnOversizedGroups(big)).toEqual(["Registers"]);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0]?.[0]).toMatch(/Registers.*more than seven children/);
    warnOversizedGroups(big);
    expect(warn).toHaveBeenCalledTimes(1);
    const out = html(<SidebarNav groups={big} pathname="/p/registers/8" />);
    expect(out.match(/Register \d/g)?.length).toBe(8);
    expect(warnOversizedGroups(GROUPS)).toEqual([]);
  });
});
