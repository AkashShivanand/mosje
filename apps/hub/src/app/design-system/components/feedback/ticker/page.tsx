import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  MatrixTable,
  type A11yItem,
  type PropDef,
} from "@/components/design-system/docs-kit";

import { TickerPlayground } from "./ticker-playground";

export const metadata: Metadata = {
  title: "Ticker — Design System",
  description:
    "Recent announcements in two shapes: the full-bleed bar under the masthead, and the stacked panel that scrolls them.",
};

/*
 * Read off `TickerProps` and `TickerItem` in
 * packages/design-system/components/feedback/ticker.tsx. The interface extends
 * `Omit<React.HTMLAttributes<HTMLElement>, "title">`, so standard section
 * attributes pass through.
 *
 * Corrected 2026-09-02: `labelAs` was missing, which is the prop that puts the
 * strip's name in the document outline — the single most useful thing on a
 * notice board for a screen-reader user navigating by heading.
 */
const PROPS: PropDef[] = [
  {
    name: "items",
    type: "TickerItem[]",
    required: true,
    description:
      "The notices. Each is `{ id?, title, description?, date?, dateTime?, href, linkLabel? }`. `date` is the display text and `dateTime` its ISO form; the component owns the separator between the kind and the date, so a notice without one does not trail a dangling middot. An empty list renders nothing at all.",
  },
  {
    name: "label",
    type: "string",
    default: '"Latest Updates"',
    description: "The plinth text and the section's accessible name.",
  },
  {
    name: "labelAs",
    type: '"h2" | "h3" | "h4" | "h5" | "h6" | "span"',
    default: '"span"',
    description:
      "Render the strip's name as a heading, so it can be reached by heading navigation and not only by landmark. It defaults to a span because the right level depends on the page — a panel inside a section that already owns an h2 wants h3, a bar under the masthead wants h2 — and guessing would skip a level.",
  },
  {
    name: "icon",
    type: "React.ReactNode",
    default: "<TickerMark>",
    description:
      "Override the mark. The default is the broadcasting megaphone, whose arcs pulse while the strip is moving and stop when it is paused — it is deliberately tied to the strip's state, so replace it only where a site genuinely has its own emblem for this.",
  },
  {
    name: "action",
    type: "React.ReactNode",
    default: "undefined",
    description:
      'The way out — "View All Updates". A slot, because the route belongs to the consuming site. Style it with buttonClasses("primary", "inverseOutlined", "sm"); the strip is a solid brand surface, so a normal outlined button would draw its border in a blue nobody can see.',
  },
  {
    name: "orientation",
    type: '"horizontal" | "vertical"',
    default: '"horizontal"',
    description:
      "Which of the two shapes: the 72px one-message bar, or the stacked panel that scrolls upward under a header.",
  },
  {
    name: "height",
    type: '"auto" | "fill"',
    default: '"auto"',
    description:
      "Vertical only. `auto` stands at the header plus the `rows` window; `fill` takes the height of the row it shares, making `rows` a floor. `fill` needs a parent whose height does not come from the panel — give the rail position: relative and the panel's wrapper position: absolute with inset: 0.",
  },
  {
    name: "rows",
    type: "number",
    default: "4",
    description: "How many rows are visible at once, and therefore the panel's height. Vertical only.",
  },
  {
    name: "interval",
    type: "number",
    default: "5000",
    description:
      "Horizontal: milliseconds each item holds before the next replaces it. Vertical: milliseconds of travel per row, so a longer list takes proportionally longer to loop and the scroll speed stays constant however many notices there are.",
  },
  {
    name: "autoplay",
    type: "boolean",
    default: "true",
    description: "Start moving on mount. It never starts under prefers-reduced-motion, whatever this is set to.",
  },
  {
    name: "linkAs",
    type: "React.ElementType",
    default: '"a"',
    description: "Router-aware link component for internal hrefs — pass next/link.",
  },
  {
    name: "className",
    type: "string",
    default: "undefined",
    description: "Merged onto the root element.",
  },
];

const A11Y: A11yItem[] = [
  {
    criterion: "2.2.2 Pause, Stop, Hide",
    level: "A",
    description:
      "The strip advances on its own, so a mechanism to stop it is required. The pause control is the one control that survives every breakpoint, and it is removed only where nothing can move at all.",
  },
  {
    criterion: "4.1.3 Status Messages",
    level: "AA",
    description:
      'The bar\'s live region is aria-live="off" while playing and polite once paused. An auto-rotating polite region interrupts a screen-reader user every few seconds with text they did not ask for. The panel is a list rather than a live region, so it is read at whatever pace the reader chooses.',
  },
  {
    criterion: "2.4.3 Focus Order",
    level: "A",
    description:
      "One bar item is in the DOM at a time, so there is nothing invisible to tab through. The panel's duplicated scrolling copy is aria-hidden with tabIndex -1, so every notice is announced once and tabbed through once.",
  },
  {
    criterion: "2.4.7 Focus Visible",
    level: "AA",
    description:
      "The focus ring is inverse ink rather than `--sa-focus-ring`. The ring token is this bar's own fill and measures 1:1 against it, so the standard ring would be invisible here.",
  },
  {
    criterion: "1.4.10 Reflow",
    level: "AA",
    description:
      "Both shapes reflow on their own width, not the viewport's, so a bar in a narrow column behaves like a bar on a phone. Prev and next drop below 640px, the action moves into the header below 1024px, and pause never drops.",
  },
  {
    criterion: "1.4.3 Contrast (Minimum)",
    level: "AA",
    description:
      "The ground is `primaryScale/600`, not `/500`, and that is a fix rather than a preference. White on /500 measures 4.64:1 and any dimming fails outright — 90% is 4.06:1, 80% is 3.52:1. On /600 the title is 6.36:1 and the subtitle 4.66:1, which is what makes the two-line structure possible at all.",
  },
  {
    criterion: "2.3.3 Animation from Interactions",
    level: "AAA",
    description:
      "Under prefers-reduced-motion nothing starts: not the bar's timer, not the panel's scroll, not the mark's arcs. The bar's travel is replaced by a 200ms fade, because text that swaps with no transition at all is the jarring change the setting exists to prevent.",
  },
];

export default function TickerPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Ticker"
      status="Stable"
      summary="Recent announcements, in two shapes. The bar is the full-bleed strip under the masthead, one message at a time. The panel stacks the same items as rows and scrolls them upward under a header. One component, one data model, one pause control."
      figma={{ node: "ticker" }}
      specimen={<TickerPlayground />}
      props={PROPS}
      a11y={A11Y}
      whenToUse={{
        use: [
          "A home page carries recent notices and one of them should be visible without scrolling — use the bar, directly under the masthead.",
          "A column beside the main content should hold several headlines at once — use the panel.",
          "Every string, route and label arrives as data, so the same strip serves the website's notices and a portal's scheme alerts.",
        ],
        avoid: [
          "The message is a condition about the page the reader is on — use an Alert; a ticker is a list of destinations, not a status.",
          "There is one announcement and it matters — put it on the page. A strip with a single item moves nothing and says less than a paragraph would.",
          "The list is a searchable archive — use a Data Table; a ticker shows the newest few and hands off to the archive through its action.",
          "A second strip would appear on the same page. One per page.",
        ],
      }}
      related={[
        {
          label: "Alert",
          href: "/design-system/components/feedback/alert",
          reason: "for a condition about the current page",
        },
        {
          label: "Data Table",
          href: "/design-system/components/data-display/data-table",
          reason: "for the archive the ticker's action leads to",
        },
        {
          label: "Site Header",
          href: "/design-system/components/section-templates/site-header",
          reason: "the masthead the bar sits directly under",
        },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-orientation">
            <h2 id="cdp-orientation" className="cdp__h2">
              Two Shapes, One Data Model
            </h2>
            <p>
              <code>horizontal</code> is the <strong>bar</strong>: a 72px full-bleed strip under the
              masthead, one message at a time, stepped with previous and next.{" "}
              <code>vertical</code> is the <strong>panel</strong>: the same items stacked as rows,
              scrolling upward under a header that carries the name, the pause control and the way
              out.
            </p>
            <p>
              They are one component because the data is identical — a notice, its kind, a date, a
              link — and a site usually wants both: the bar on the home page, the panel in a column
              beside it.
            </p>
            <p>
              <strong>Every row is a title over a subtitle</strong>, in both shapes.{" "}
              <code>title</code> is the notice; <code>description</code> and <code>date</code> fall
              to the quieter line beneath. There is no colon and no bold lead-in — that was the
              shape until it met the real list, and it read as a label rather than a notice wherever
              the kinds repeat. The department&apos;s own list is “Documents” seven times out of
              eight, so the rail carried the same bold word four times over; demoting the kind to the
              subtitle is what makes it safe to show at all. <code>linkLabel</code> is ignored in the
              panel: on a scrolling list it would repeat on every row, and the whole row is already
              the link.
            </p>
            <p>
              <strong>The loop is seamless because one animated wrapper holds two copies</strong> and
              travels exactly −50% — one list, exactly where the second copy already sits, so the
              reset lands on an identical frame. Each copy used to be its own animated element
              translating −50% of its own height, which moved the list half a length per cycle and
              snapped back: one visible jump per loop.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-behaviour">
            <h2 id="cdp-behaviour" className="cdp__h2">
              Behaviour by Width
            </h2>
            <p>
              The single most misread thing about this component: it does <strong>not</strong> behave
              the same at every size, and the differences are deliberate rather than degradations.
              Both shapes reflow on their <em>own</em> width, not the viewport&apos;s — a bar in a
              659px column behaves like a bar on a phone, because that is the only question that was
              ever meant.
            </p>
            <MatrixTable
              caption="The bar (horizontal)"
              columns={["Width", "Auto-advance", "Pause", "Prev / Next", "View All", "Name"]}
              rows={[
                ["1024px and up", "Yes, every 5s", "Yes", "Yes", "Button, same row", "Shown"],
                ["Below 1024px", "Yes, every 5s", "Yes", "Dropped", "Link, in the header", "Shown"],
                ["Reduced motion", "Never starts", "Yes", "Yes", "As above", "Shown"],
              ]}
            />
            <MatrixTable
              caption="The panel (vertical)"
              columns={["Width", "Auto-scroll", "Pause", "Scroll by hand", "Edge fade", "View All"]}
              rows={[
                ["640px and up", "Yes, continuous", "Yes", "n/a — it moves", "Yes, 20px", "Yes"],
                ["Below 640px", "No — a still list", "Removed", "Yes", "No", "Yes"],
                ["List fits its window", "No — nothing to scroll", "Removed", "No", "No", "Yes"],
                ["Reduced motion", "Never starts", "Removed", "Yes", "No", "Yes"],
              ]}
            />
            <p>
              Two rules explain every row above.{" "}
              <strong>Nothing that cannot move may show a control that governs motion</strong> — a
              pause button on a still list advertises movement a citizen may be trying to escape, so
              the whole cluster goes. <strong>Pause never drops while anything is moving</strong>,
              because trading a reflow failure for a 2.2.2 failure is not a trade. The phone is a
              still list for a third reason: there is no hover to stop it with, so a moving row would
              be a moving tap target.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-states">
            <h2 id="cdp-states" className="cdp__h2">
              States
            </h2>
            <ul>
              <li>
                <strong>Nothing is truncated, in either shape.</strong> Both clipped to an ellipsis
                until they met the real list — two notices both opening “Extension of Application
                Submission Date for Financial Adviser (FA) Post at…” clipped to the same visible
                string, two links reading identically and going to different pages. Text wraps: the
                bar has a minimum height and grows, the panel measures its window.
              </li>
              <li>
                <strong>Playing and paused</strong> — the only state a citizen changes. Pausing also
                flips the bar&apos;s live region from off to polite.
              </li>
              <li>
                <strong>Hover and focus stop the panel.</strong> Not only the button: a moving row is
                a moving tap target, so without this the line somebody is reading walks out from
                under the pointer just as they reach for it. <code>:focus-within</code> covers the
                keyboard, where a focused row that scrolls away takes the focus ring with it.
              </li>
              <li>
                <strong>The panel does not scroll below 640px.</strong> On touch there is no hover to
                stop it with, so it becomes a still list of its first <code>rows</code> items with
                the rest behind the action.
              </li>
              <li>
                <strong>Nothing that cannot move shows motion controls.</strong> Below two items in
                the bar, or when the panel&apos;s list is no longer than its own window, the whole
                cluster is removed — pause included. This is the one place pause legitimately
                disappears.
              </li>
              <li>
                <strong>Empty</strong> — an empty list renders nothing at all, not an empty blue
                band.
              </li>
              <li>
                <strong>Each row is marked, and the marker hangs.</strong> A small dot sits in its own
                grid column, so wrapped lines return to the text column and the dot is the only thing
                at the outer edge. Without it every line starts at the same x and only a vertical gap
                says whether a line begins a notice or continues one, which is thin enough to misread
                while the list is moving. The hanging indent is the point, not the dot; the bar has
                none, because one message is not a list.
              </li>
              <li>
                <strong>Rows do not underline on hover.</strong> WCAG 1.4.1 asks that a link be
                distinguishable from the text <em>around</em> it, and in a list where every row is a
                link there is no surrounding text to confuse it with. The row&apos;s own background
                wash and the cursor carry the affordance; an underline on a wrapped two-line notice
                struck through both lines and fought the subtitle for the same few pixels.
              </li>
              <li>
                <strong>Pause holds its place.</strong> The animation is applied whenever the list{" "}
                <em>can</em> scroll and only its <code>animation-play-state</code> moves. Gating the
                animation property itself on “is it playing” returned the track to zero, so resuming
                started again from the top — a pause that loses your place is not a pause.
              </li>
              <li>
                <strong>The mark follows the strip.</strong> Its arcs pulse only while the list is
                moving. A mark that keeps broadcasting over a stopped list contradicts the control
                the citizen just pressed.
              </li>
            </ul>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-motion">
            <h2 id="cdp-motion" className="cdp__h2">
              Motion
            </h2>
            <MatrixTable
              caption="What moves, and how"
              columns={["What", "Duration", "Curve", "Why that curve"]}
              rows={[
                [
                  "The bar's message",
                  "240ms",
                  "cubic-bezier(0.23, 1, 0.32, 1)",
                  "A strong ease-out. It is entering, so it should start at full speed and settle",
                ],
                [
                  "The panel's scroll",
                  "interval × rows",
                  "linear",
                  "Any easing makes a marquee hesitate at the loop point",
                ],
                [
                  "Hover and focus states",
                  "150ms",
                  "ease",
                  "Not entering or leaving — a colour changing under the pointer",
                ],
                [
                  "The mark's arcs",
                  "continuous",
                  "ease-in-out",
                  "They pulse outward and back, so they accelerate and settle at both ends",
                ],
                [
                  "Control press",
                  "160ms",
                  "ease-out",
                  "A 0.94 scale — a control that changes nothing under the finger reads as not having registered",
                ],
              ]}
            />
            <p>
              <strong>The message enters from the side it came from.</strong> The offset was a fixed
              +2rem, so a message summoned by <em>Previous</em> still slid in from the right — the
              motion saying “forward” while the control said “back”. It is{" "}
              <strong>logical, not physical</strong>: the estate runs <code>dir=&quot;rtl&quot;</code>{" "}
              in Urdu, where “next” travels leftward, so the sign flips again with the writing
              direction.
            </p>
            <p>
              <strong>240ms and 12px, down from 320ms and 32px.</strong> A citizen reading the page
              for a minute sees the message change a dozen times, and at that frequency the job of
              the movement is to say “this is new” and then get out of the way.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-divergences">
            <h2 id="cdp-divergences" className="cdp__h2">
              Divergences from the Figma Frame
            </h2>
            <p>Four, each recorded rather than hidden — a later reader will otherwise “fix” them back.</p>
            <ul>
              <li>
                <strong>The plinth hugs its label</strong>, rather than being the frame&apos;s
                absolutely-placed 265×72 rectangle. That width ends just past “Latest Updates” in
                English — not in Hindi, and not once a citizen raises their browser font size.
              </li>
              <li>
                <strong>The pause control is added.</strong> The frame draws previous and next only.
                A published set of values is a floor, not a ceiling: what accessibility needs gets
                added rather than the frame shipped as drawn.
              </li>
              <li>
                <strong>The nav gap is 8px, not 16px</strong> — the row runs three controls now, and
                16px would cost another 56px of a row that already had to be taught to compress.
              </li>
              <li>
                <strong>The tile border is 1px, not 0.5px.</strong> Half a pixel is not a colour any
                display renders predictably.
              </li>
            </ul>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { Ticker, buttonClasses } from "@mosje/design-system";
import Link from "next/link";

<Ticker
  items={updates}
  linkAs={Link}
  labelAs="h2"
  action={
    <Link href="/website/notices" className={buttonClasses("primary", "inverseOutlined", "sm")}>
      View All Updates
    </Link>
  }
/>`}</CodeBlock>
          <p>
            The panel is the same call with an orientation. Where it shares a row with other content,
            <code> height=&quot;fill&quot;</code> needs a parent whose height does not come from the
            panel — a grid item is sized by its own content, so a long list will grow the row and the
            panel will then dutifully fill what it just inflated.
          </p>
          <CodeBlock>{`<div style={{ position: "relative" }}>
  <div style={{ position: "absolute", inset: 0 }}>
    <Ticker
      items={updates}
      linkAs={Link}
      orientation="vertical"
      height="fill"
      rows={4}
      labelAs="h3"
    />
  </div>
</div>`}</CodeBlock>
          <p>
            Dates arrive already formatted. <code>date</code> is what is shown and{" "}
            <code>dateTime</code> is its ISO form, rendered as a <code>&lt;time&gt;</code> — locale
            and time zone are the site&apos;s policy, not the design system&apos;s, and en-IN in IST
            is not a default this component should impose on a portal that needs otherwise.
          </p>
        </section>
      }
      accessibility={
        <>
          <section className="cdp__section" aria-labelledby="cdp-motion-a11y">
            <h2 id="cdp-motion-a11y" className="cdp__h2">
              Motion, Pause and the Live Region
            </h2>
            <p>
              The strip auto-advances, so a way to stop it is not optional. The pause control is the
              one control that survives every breakpoint, and previous and next do not satisfy 2.2.2
              in its place — stepping is not stopping.
            </p>
            <p>
              Under <code>prefers-reduced-motion</code> the timer never starts at all. Suppressing
              only the animation would leave the message replacing itself every few seconds, which is
              the part that hurts.
            </p>
            <p>
              The bar&apos;s live region is <code>off</code> while playing and{" "}
              <code>polite</code> once paused. A rotating polite region interrupts a screen-reader
              user every interval with text they did not ask for; pausing is the citizen asking for
              it.
            </p>
            <p>
              <strong>The panel is a list, not a live region.</strong> A screen reader reads it as
              one, at whatever pace the reader chooses, so there is no <code>aria-live</code> on it
              and nothing interrupts.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-heading">
            <h2 id="cdp-heading" className="cdp__h2">
              Put the Name in the Outline
            </h2>
            <p>
              The section is labelled, so a screen-reader user can reach it by landmark and hears
              “Latest Updates”. But heading navigation — pressing H, one of the commonest ways people
              move through a page — skips it entirely while the name is a span. On a notice board
              that is the one thing somebody is most likely to jump to.
            </p>
            <p>
              Pass <code>labelAs</code> with the level the page needs: <code>h2</code> for a bar under
              the masthead, <code>h3</code> for a panel inside a section that already owns an{" "}
              <code>h2</code>. The default stays a span because a component cannot know which, and
              guessing would skip a level — which is worse than not being a heading at all.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-focus">
            <h2 id="cdp-focus" className="cdp__h2">
              Focus and Tab Order
            </h2>
            <p>
              One bar item is in the DOM at a time. The Figma frame fades inactive slides to zero
              opacity, but an invisible link is still focusable — a citizen would tab through eight
              links they cannot see.
            </p>
            <p>
              In the panel, the duplicated copy that makes the loop seamless is{" "}
              <code>aria-hidden</code> with <code>tabIndex=-1</code>, so every notice is announced
              once and tabbed through once.
            </p>
            <p>
              The focus ring is inverse ink rather than <code>--sa-focus-ring</code>, because the
              ring token is this bar&apos;s own fill and measures 1:1 against it.
            </p>
          </section>
        </>
      }
    />
  );
}
