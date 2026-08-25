// url=<SAMAVESH>?node-id=56148-37528
// source=packages/design-system/components/feedback/ticker.tsx
// component=Ticker
//
// ─────────────────────────────────────────────────────────────────────────────
// Authored 2026-08-25 alongside the component itself, recreated from
// MoSJE Handoff > Latest Updates (Ds5qx61QsI0ZkYSrLKxo0A, 8137:48790) into the
// SAMAVESH library as a Breakpoint x Motion variant set.
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
const label = instance.getString("Label");
const title = instance.getString("Title");
const description = instance.getBoolean("Show Description")
  ? instance.getString("Description")
  : "";
const actionLabel = instance.getString("Action Label");
const showAction = instance.getBoolean("Show Action");

// `items` is DATA, not a slot — there is no <TickerItem> export and there must
// not be. One Figma frame can only draw one message; the array is what makes
// the strip a ticker rather than a banner, so the example seeds a realistic
// pair rather than mirroring the single frame back.
const item = `{ id: "1", title: "${title}", description: "${description}", href: "/website/notices", linkLabel: "Learn More" }`;

export default {
  example: figma.code`
    <Ticker
      label="${label}"
      linkAs={Link}
      items={[
        ${item},
        { id: "2", title: "New Opportunity!", description: "Ministry launches ‘Skill India Connect’.", href: "/website/notices", linkLabel: "Learn More" },
      ]}
      ${showAction
        ? `action={
        <Link href="/website/notices" className={buttonClasses("primary", "inverseOutlined", "sm")}>
          ${actionLabel}
        </Link>
      }`
        : ""}
    />
  `,
  imports: ['import { Ticker, buttonClasses } from "@mosje/design-system"'],
  id: "ticker",
  // Not nestable: it is a page-level strip that spans the viewport, mounted
  // once under the masthead.
  metadata: { nestable: false },
};
