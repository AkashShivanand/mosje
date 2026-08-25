// url=<SAMAVESH>?node-id=56159-903
// source=packages/design-system/components/feedback/ticker.tsx
// component=Ticker
//
// ─────────────────────────────────────────────────────────────────────────────
// Authored 2026-08-25 alongside the component itself. The BAR is recreated from
// MoSJE Handoff > Latest Updates (Ds5qx61QsI0ZkYSrLKxo0A, 8137:48790); the
// PANEL's behaviour follows UPSC + DBIM > Latest Updates (5jRf3OFlWlxKDgpnjYueFa,
// 759:40) while its surface stays SAMAVESH's. One Breakpoint x Direction x
// Motion set of 24 in the SAMAVESH library.
// ─────────────────────────────────────────────────────────────────────────────
import figma from "figma";

const instance = figma.selectedInstance;

/**
 * `Breakpoint` has NO PROP, and must not grow one.
 *
 * Desktop and Mobile are two drawings of one component. In code the difference
 * is entirely CSS — prev/next and the plinth's label drop below 640px, the
 * action below 1024px — so the browser picks, not the consumer. A `breakpoint`
 * prop would let a page pin the mobile row on a desktop screen, which is a way
 * to hide the "View All" route from people who can see it.
 *
 * `Motion` has no prop either, for a different reason: Playing and Paused are
 * the CITIZEN'S choice, held in component state. `autoplay` decides only what
 * the strip does on mount, and the frames are not that — they are what the
 * control looks like after somebody presses it. Emitting `autoplay={false}`
 * from Motion=Paused would tell a reader the page controls a thing the page
 * does not control.
 */
/**
 * `Direction` → `orientation`. Exhaustive: both values mapped.
 *
 * This one IS a prop, unlike the two above, because it selects which of the two
 * SHAPES you get — the 72px bar or the stacked scrolling panel — and that is a
 * decision the page makes and keeps, not something the browser picks by width
 * or the citizen toggles at runtime.
 */
const orientation = instance.getEnum("Direction", {
  Horizontal: "horizontal",
  Vertical: "vertical",
});

const label = instance.getString("Label");

/**
 * `Label` IS THE ONLY TEXT PROPERTY ON THE SET, AND THAT IS CORRECT.
 *
 * This template used to read `Title`, `Description`, `Show Description`,
 * `Action Label` and `Show Action` as well. **None of the five existed.** They
 * are properties of the NESTED parts — `Ticker / Message`, `Ticker / Row`,
 * `Ticker / Action` — and were never exposed on the parent, so every one of
 * those reads resolved to nothing.
 *
 * The sixth was worse than nothing. The parent's only text property was *named*
 * `Title` while it drove the PLINTH LABEL, so reading a property by that name
 * returned the strip's name — the emitted snippet put "What's New" into the
 * first notice's headline while leaving the label blank.
 * The property is named `Label` now,
 * which is what it has always actually been, and its default is the code
 * default rather than a third string nobody ships.
 *
 * Exposing the nested properties would be the wrong repair. `items` is DATA,
 * not a slot — one Figma frame draws one message, and the array is what makes
 * this a ticker rather than a banner — so the example seeds a realistic pair.
 * The action is a route the consuming site owns, so it stays a slot.
 */

// Seeded, not mirrored from the frame — see above.
const items = [
  '{ id: "1", title: "Expression of Interest for Rate of Interest on Fixed Deposit", description: "Notice", date: "15 May 2026", dateTime: "2026-05-15", href: "/website/notices" }',
  '{ id: "2", title: "Medical Aid Scheme for the Financial Year 2025-26", description: "Notice", date: "7 Dec 2025", dateTime: "2025-12-07", href: "/website/notices" }',
].join(",\n        ");

// `rows` is emitted only for the panel: in the bar it is meaningless, and a
// prop that does nothing is a prop somebody will later try to make do something.
const rowsProp = orientation === "vertical" ? "\n      rows={4}" : "";

export default {
  example: figma.code`
    <Ticker
      label="${label}"
      orientation="${orientation}"${rowsProp}
      linkAs={Link}
      items={[
        ${items},
      ]}
      action={
        <Link href="/website/notices" className={buttonClasses("primary", "inverseOutlined", "sm")}>
          View All Updates
        </Link>
      }
    />
  `,
  imports: ['import { Ticker, buttonClasses } from "@mosje/design-system"'],
  id: "ticker",
  // Not nestable: it is a page-level strip that spans the viewport, mounted
  // once under the masthead.
  metadata: { nestable: false },
};
