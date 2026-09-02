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
  { name: "a chart page", path: "/design-system/components/data-display/bar-chart" },
  { name: "the illustration foundation", path: "/design-system/foundations/illustration" },
  // The newest interactive component, and the one with the most keyboard model
  // to get wrong — a listbox with a roving active option.
  { name: "the filter select", path: "/design-system/components/forms/filter-select" },
  { name: "the website home", path: "/website" },
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

    const allowed = new Set(DECLARED.map((d) => d.selector));
    const isDeclared = (target: unknown[]) =>
      target.every((t) => allowed.has(String(t)));

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
