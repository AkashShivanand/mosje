import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * THE ESTATE'S ACCESSIBILITY CLAIM, MADE FALSIFIABLE.
 *
 * `CLAUDE.md` calls accessibility non-negotiable and puts WCAG 2.2 AA at the top
 * of the standards ladder. Until this file the enforcement mechanism was a human
 * remembering to type a slash command: a repository-wide grep for `axe-core`,
 * `pa11y`, `jest-axe` and `lighthouse` returned NOTHING, across every
 * package.json, workflow and script — while radius tokens carried six contract
 * tests and a per-page ratchet.
 *
 * So the estate had twenty-plus gates pointed at design-token drift and none at
 * the thing it is legally obliged to deliver, and 526 published criteria claims
 * that no machine had ever checked.
 *
 * WHAT THIS DOES AND DOES NOT COVER. axe finds roughly a third of WCAG failures
 * — the machine-checkable third. It cannot judge whether alt text is truthful,
 * whether a heading describes its section, or whether a keyboard path is
 * sensible. A green run here is not conformance; it is the floor below which we
 * do not ship, and `check:a11y-evidence` tracks the human half separately.
 *
 * SERIOUS AND CRITICAL FAIL THE BUILD. Moderate and minor are reported and do
 * not, because a gate everyone learns to silence is not a gate — the same
 * reasoning `ds-linkage` records for its advisory split.
 */

/**
 * DECLARED, EVIDENCED DEVIATIONS — the only things allowed to fail.
 *
 * Not an exclusion list of inconvenient findings. Each entry names a selector
 * whose failure is a RECORDED decision with evidence behind it, and each has to
 * be defensible on its own. If a reason cannot be written here, the defect gets
 * fixed instead.
 *
 * A violation whose nodes are ALL in this list is reported and does not block.
 * One that touches anything else still fails, so the allowance cannot quietly
 * absorb a new defect on the same rule.
 */
const DECLARED: { selector: string; why: string }[] = [
  {
    selector: ".ds-samavesh-banner__title",
    why:
      "White on India Saffron, 2.91:1. `samavesh-banner.tsx` records the full evidence: " +
      "saffron is a saturated mid-tone that no ink clears on under BOTH WCAG 2 and APCA, " +
      "`light` scores the best available perceptual result (APCA Lc 59.8) and matches the " +
      "Figma reference, and `tint` is shipped as the tone that clears both. Changing the " +
      "default is a brand decision with evidence on both sides, not a bug fix.",
  },
  {
    selector: ".ds-samavesh-banner__subline",
    why: "Same band, same ink, same recorded decision as the title above.",
  },
  {
    selector: ".sa-ticker__control",
    why:
      "target-size, and a FALSE POSITIVE that was measured before it was declared. " +
      "axe reports the control 'partially obscured, smallest space 40x18.5' because the " +
      "ticker's scrolling track is twice the window's height and its UNCLIPPED rect " +
      "reaches down over the control. It is never painted or hit there: the viewport is " +
      "`overflow-y: hidden` while `[data-scroll]` is set, and axe's obscuring test reads " +
      "bounding rects with no notion of an ancestor's clip. Measured 2026-09-02 at 1280px " +
      "— `elementFromPoint` returns the control or its own glyph at 8/25/50/75/92% of its " +
      "height, and Playwright's actionability check passes. The control is 40x40, above " +
      "the 24x24 floor, and fully clickable. Re-measure if the ticker stops clipping.",
  },
  {
    selector: "#dark-btn",
    why:
      "`nested-interactive` inside the UX4G accessibility widget — MeitY's own " +
      "CDN-loaded control, a <button> wrapping a focusable <input>. The four " +
      "CRITICAL `button-name` failures beside it WERE repaired, in " +
      "`ux4g-accessibility-widget.tsx`, by pointing `aria-labelledby` at each " +
      "toggle's own visible heading — additive, no suppression, no restyle. " +
      "This one is not, deliberately: fixing it means changing which element is " +
      "focusable in a vendor control, and getting that wrong makes the theme " +
      "switch unreachable rather than merely mislabelled. It is a defect in the " +
      "widget and belongs upstream.",
  },
  {
    selector: ".leaflet-marker-icon.leaflet-interactive.leaflet-zoom-animated*",
    why:
      "target-size on OVERLAPPING map pins, under WCAG 2.5.8's Essential exception. " +
      "Each marker was given a 24x24 hit area and its own accessible name in " +
      "`facility-map.tsx` (the visible dot stays 14px inside a transparent box), which " +
      "cleared ten `aria-command-name` failures and the standalone size failures. What " +
      "remains is two facilities close enough together that their boxes overlap at the " +
      "default zoom — and a pin's position is geographic, so it cannot be moved to make " +
      "room without misplacing the facility. 2.5.8 exempts a target whose particular " +
      "presentation is essential. Zooming separates them, and every marker opens a popup " +
      "naming the facility. Re-measure if the marker size changes.",
  },
  {
    selector: ".ds-btn--inverseOutlined",
    why:
      "The ticker's 'View All' route, 52.6x32, failing on the same phantom overlap as the " +
      "control above and measured the same way — clickable at every probe point, real " +
      "click check passes. Both clear 24x24 on their own geometry.",
  },
];

/** One route per surface the estate actually ships, plus the docs shell. */
const ROUTES: { name: string; path: string }[] = [
  { name: "design system landing", path: "/design-system" },
  { name: "a component page", path: "/design-system/components/forms/checkbox" },
  { name: "the radio and its group", path: "/design-system/components/forms/radio" },
  { name: "a chart page", path: "/design-system/components/data-display/bar-chart" },
  { name: "the bullet chart", path: "/design-system/components/data-display/bullet-chart" },
  { name: "small multiples", path: "/design-system/components/data-display/small-multiples" },
  { name: "the illustration foundation", path: "/design-system/foundations/illustration" },
  // The newest interactive component, and the one with the most keyboard model
  // to get wrong — a listbox with a roving active option.
  { name: "the filter select", path: "/design-system/components/forms/filter-select" },
  { name: "the date picker", path: "/design-system/components/forms/date-picker" },
  { name: "the combobox", path: "/design-system/components/forms/combobox" },
  { name: "the error summary", path: "/design-system/components/forms/error-summary" },
  { name: "the website home", path: "/website" },
  /*
    PORTALS — added 2026-09-02, and the reason they are here is what they found.
    The suite watched six routes and NONE of the twenty portals, so it was
    measuring the surface built to be measured. One run against three portals
    returned seven serious contrast failures and four CRITICAL unnamed buttons,
    including one in the design system's own sidebar that the documentation
    could never have shown because no docs page renders an ACTIVE row.
    These three carry the estate's three private UI kits — the 27 of 41
    shadow-UI collisions — so they are where DS fixes are least likely to land.
  */
  { name: "the scw portal", path: "/portals/scw" },
  { name: "the tg admin portal", path: "/portals/tg/admin" },
  { name: "the nhapoa portal", path: "/portals/nhapoa" },
  // The remaining five. Every portal is watched now, so a DS fix that misses a
  // portal is a failing build rather than something an audit finds later.
  { name: "the e-anudaan portal", path: "/portals/e-anudaan" },
  { name: "the eutthan admin portal", path: "/portals/eutthan-admin" },
  { name: "the nmba portal", path: "/portals/nmba" },
  { name: "the pm-ajay portal", path: "/portals/pm-ajay" },
  { name: "the smile-admin portal", path: "/portals/smile-admin" },
  /*
    LOGIN ROUTES — added 2026-09-05. The suite watched every portal landing and
    NOT ONE login page, so `PortalLoginShell` shipped an `aria-hidden` column
    with a focusable Change link inside it on four live routes, green throughout.
    All ten login routes are here, plus the two docs pages that render the
    template and the shell as specimens. Desktop viewport: the hero column is
    `hidden lg:flex`, so anything below 1024px never exercises it.
  */
  { name: "e-anudaan login — NGO tab", path: "/portals/e-anudaan/login?role=ngo" },
  { name: "e-anudaan login — officer tab", path: "/portals/e-anudaan/login?role=officer" },
  { name: "nmba admin login", path: "/portals/nmba/admin/login" },
  { name: "nmba treatment-centre otp login", path: "/portals/nmba/treatment-centre/login-otp" },
  { name: "nhapoa login", path: "/portals/nhapoa/login" },
  { name: "scw login", path: "/portals/scw/login" },
  { name: "tg admin login", path: "/portals/tg/admin/login" },
  { name: "tg citizen sign-in", path: "/portals/tg/citizen/sign-in" },
  { name: "pm-ajay login", path: "/portals/pm-ajay/login" },
  { name: "smile-admin login", path: "/portals/smile-admin/login" },
  { name: "the login template docs page", path: "/design-system/components/auth/portal-login-template" },
  { name: "the login shell docs page", path: "/design-system/components/auth/portal-login-shell" },
];

for (const route of ROUTES) {
  test(`${route.name} has no serious or critical accessibility violations`, async ({ page }) => {
    await page.goto(route.path, { waitUntil: "domcontentloaded" });
    // The docs shell hydrates its tabs and sidebar; scanning before that reports
    // the pre-hydration markup, which is not what a reader gets.
    await page.waitForLoadState("networkidle").catch(() => {});

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      /*
       * The UX4G accessibility widget is third-party markup this estate is
       * required to embed and forbidden to restyle
       * (.claude/rules/accessibility-entry-point.md §7 — "hiding a row inside an
       * official government widget is not a change this estate makes"). Its own
       * panel accounts for a critical `button-name` on three controls and a
       * `nested-interactive`, on every page in the estate; excluding it is the
       * difference between a gate that reports OUR defects and one that reports
       * MeitY's forever. `#uw-main` is the panel — `#uw-main-wrapper` does not
       * exist, and getting that wrong is why the first run looked estate-wide.
       */
      .exclude("#uw-main")
      .exclude("#uw-widget-custom-trigger")
      .analyze();

    /*
      Exact match, with ONE deliberate exception: a declared selector may end in
      `*` to cover a family whose tail is generated. Leaflet stamps every marker
      `.leaflet-marker-icon.leaflet-interactive.leaflet-zoom-animated:nth-child(N)`,
      and N moves whenever the facility list changes — pinning the exact strings
      would make the allowance quietly stop matching the day a facility is added,
      turning a declared deviation into a build failure nobody expected.

      The wildcard is a PREFIX, never a substring, so `.foo*` cannot be widened
      into "anything containing .foo". A declaration still has to name the thing
      it is excusing.
    */
    const exact = new Set(DECLARED.filter((d) => !d.selector.endsWith("*")).map((d) => d.selector));
    const prefixes = DECLARED.filter((d) => d.selector.endsWith("*")).map((d) => d.selector.slice(0, -1));
    const isDeclared = (target: unknown[]) =>
      target.every((t) => {
        const s = String(t);
        return exact.has(s) || prefixes.some((p) => s.startsWith(p));
      });

    const severe = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );
    // A violation is waved through only when EVERY node it names is declared.
    const blocking = severe.filter((v) => !v.nodes.every((n) => isDeclared(n.target)));

    for (const v of severe.filter((x) => !blocking.includes(x))) {
      console.warn(`${route.path}: ${v.id} — declared deviation, not blocking.`);
    }

    if (blocking.length) {
      const detail = blocking
        .map(
          (v) =>
            `  [${v.impact}] ${v.id} — ${v.help}\n` +
            v.nodes.slice(0, 3).map((n) => `      ${n.target.join(" ")}`).join("\n"),
        )
        .join("\n");
      throw new Error(`${blocking.length} blocking violation(s) on ${route.path}:\n${detail}`);
    }

    // Moderate and minor are surfaced without failing — see the header.
    const advisory = results.violations.filter(
      (v) => v.impact !== "serious" && v.impact !== "critical",
    );
    if (advisory.length) {
      console.warn(
        `${route.path}: ${advisory.length} advisory violation(s) — ` +
          advisory.map((v) => v.id).join(", "),
      );
    }
    expect(blocking).toHaveLength(0);
  });
}
