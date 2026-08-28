import * as React from "react";
import type { Metadata } from "next";
import { TickerPlayground } from "./ticker-playground";
import { Playground } from "@/components/design-system/playground";
import { PropsTable, DoDont, DocsTabs, MatrixTable } from "@/components/design-system/docs-kit";

export const metadata: Metadata = {
  title: "Ticker - SAMAVESH Design System",
  description:
    "Recent announcements in two shapes: the full-bleed bar under the masthead, and the stacked panel that scrolls them.",
};

export default function TickerPage(): React.JSX.Element {
  const h2Style: React.CSSProperties = {
    fontSize: "var(--sa-type-headline-2-size)",
    fontWeight: 600,
    margin: "0 0 var(--sa-stack-24) 0",
    color: "var(--sa-text-neutral-bolder)",
  };
  const proseStyle: React.CSSProperties = {
    color: "var(--sa-text-neutral-base)",
    fontSize: "var(--sa-type-body-1-size)",
    lineHeight: 1.6,
  };
  const leadStyle: React.CSSProperties = {
    ...proseStyle,
    fontSize: "var(--sa-type-headline-3-size)",
    color: "var(--sa-text-neutral-subtle)",
    marginBottom: "var(--sa-stack-24)",
  };
  const listStyle: React.CSSProperties = {
    ...proseStyle,
    paddingLeft: "var(--sa-padding-20)",
    marginTop: "var(--sa-stack-16)",
    lineHeight: 1.8,
  };
  const strong: React.CSSProperties = { color: "var(--sa-text-neutral-bolder)" };

  return (
    <main
      className="ds-prose"
      style={{ maxWidth: "800px", padding: "var(--sa-padding-40) var(--sa-padding-24)" }}
    >
      <header style={{ marginBottom: "var(--sa-stack-40)" }}>
        <h1 style={{ fontSize: "var(--sa-type-headline-1-size)", margin: "0 0 var(--sa-stack-16) 0" }}>
          Ticker
        </h1>
        <p className="ds-lead" style={leadStyle}>
          Recent announcements, in two shapes. <strong style={strong}>The bar</strong> is the
          full-bleed strip under the masthead, one message at a time.{" "}
          <strong style={strong}>The panel</strong> stacks the same items as rows and scrolls them
          upward under a header. One component, one data model, one pause control.
        </p>
      </header>

      <DocsTabs
        tabs={[
          {
            id: "design",
            label: "Design",
            content: (
              <div className="ds-prose">
                <section style={{ marginBottom: "var(--sa-section-48)" }}>
                  <h2 id="playground" style={h2Style}>Playground</h2>
                  <p style={proseStyle}>
                    Switch between the bar and the panel, between the two-line and single-line
                    content models, drop the action, and stop the motion. Two things worth trying:
                    pausing the bar is what turns screen-reader announcements on, and hovering the
                    panel stops its scroll without touching the button.
                  </p>
                  <div style={{ marginTop: "var(--sa-stack-24)" }}>
                    <TickerPlayground />
                  </div>
                </section>

                <section style={{ marginBottom: "var(--sa-section-48)" }}>
                  <h2 id="usage" style={h2Style}>1. Usage</h2>
                  <p style={proseStyle}>
                    One strip per page, directly under the masthead, carrying recent notices. It is
                    structural, not content-bound: every string, href and route arrives as a prop,
                    so the website&apos;s notices and a portal&apos;s scheme alerts are the same
                    component with different data. An empty list renders nothing at all rather than
                    an empty blue band.
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "var(--sa-inline-24)",
                      marginTop: "var(--sa-stack-24)",
                    }}
                  >
                    <DoDont
                      cards={[
                        {
                          type: "do",
                          label:
                            "Keep the headline to one short clause. Nothing is truncated, so a long one wraps and grows the strip — which is right, but a notice that takes three lines has stopped being a headline.",
                          preview: null,
                        },
                        {
                          type: "dont",
                          label:
                            "Don't hide the pause control to win space. A strip that moves on its own must be stoppable; prev and next do not satisfy WCAG 2.2.2.",
                          preview: null,
                        },
                      ]}
                    />
                  </div>
                </section>

                <section style={{ marginBottom: "var(--sa-section-48)" }}>
                  <h2 id="orientation" style={h2Style}>2. Orientation — two shapes</h2>
                  <p style={proseStyle}>
                    <code>horizontal</code> (default) is the <strong style={strong}>bar</strong>:
                    the 72px full-bleed strip under the masthead, one message at a time, stepped
                    with prev and next. <code>vertical</code> is the{" "}
                    <strong style={strong}>panel</strong>: the same items stacked as rows,
                    scrolling upward under a header that carries the name, the pause control and
                    the way out.
                  </p>
                  <p style={{ ...proseStyle, marginTop: "var(--sa-stack-16)" }}>
                    They are one component because the data is identical — a notice, its kind, a
                    date, a link — and a site usually wants both: the bar on the home page, the
                    panel in a column beside it.{" "}
                    <strong style={strong}>Every row is a title over a subtitle</strong>, in both
                    shapes: <code>title</code> is the notice, and <code>description</code> and{" "}
                    <code>date</code> fall to the quieter line beneath it. There is no colon and no
                    bold lead-in — that was the shape until it met the real list, and it read as a
                    label rather than a notice wherever the kinds repeat (the DoSJE list is{" "}
                    &quot;Documents&quot; seven times out of eight, so the rail carried the same
                    bold word four times over). Demoting the kind to the subtitle is what makes it
                    safe to show at all. <code>linkLabel</code> is ignored in the panel: on a
                    scrolling list it would repeat on every row, and the whole row is already the
                    link.
                  </p>
                  <p style={{ ...proseStyle, marginTop: "var(--sa-stack-16)" }}>
                    <strong style={strong}>The loop is seamless because one animated wrapper holds
                    two copies</strong> and travels exactly −50% — one list, exactly where the
                    second copy already sits, so the reset lands on an identical frame. Each copy
                    used to be its own animated element translating −50% of <em>its own</em> height,
                    which moved the list half a length per cycle and snapped back: one visible jump
                    per loop. The duplicate is <code>aria-hidden</code> and out of the tab order.
                  </p>
                </section>

                <section style={{ marginBottom: "var(--sa-section-48)" }}>
                  <h2 id="behaviour" style={h2Style}>3. Behaviour by width</h2>
                  <p style={proseStyle}>
                    The single most misread thing about this component: it does{" "}
                    <strong style={strong}>not behave the same at every size</strong>, and the
                    differences are deliberate rather than degradations. Both shapes reflow on
                    their <em>own</em> width, not the viewport&apos;s — a bar in a 659px docs column
                    behaves like a bar on a phone, because that is the only question that was ever
                    meant.
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
                  <p style={{ ...proseStyle, marginTop: "var(--sa-stack-16)" }}>
                    Two rules explain every row above.{" "}
                    <strong style={strong}>Nothing that cannot move may show a control that governs
                    motion</strong> — a pause button on a still list advertises movement a citizen
                    may be trying to escape, so the whole cluster goes.{" "}
                    <strong style={strong}>Pause never drops while anything is moving</strong>,
                    because trading a reflow failure for a 2.2.2 failure is not a trade. The phone
                    is a still list for a third reason: there is no hover to stop it with, so a
                    moving row would be a moving tap target.
                  </p>
                </section>

                <section style={{ marginBottom: "var(--sa-section-48)" }}>
                  <h2 id="states" style={h2Style}>4. States</h2>
                  <ul style={listStyle}>
                    <li>
                      <strong style={strong}>Nothing is truncated, in either shape.</strong> Both
                      clipped to an ellipsis until it met the real list — two DoSJE notices both
                      open &quot;Extension of Application Submission Date for Financial Adviser (FA)
                      Post at…&quot; and clipped to the <em>same visible string</em>, two links
                      reading identically and going to different pages. Text wraps: the bar has a
                      minimum height and grows, the panel measures its window.
                    </li>
                    <li>
                      <strong style={strong}>Playing / Paused</strong> — the only state a citizen
                      changes. Pausing also flips the live region from <code>off</code> to{" "}
                      <code>polite</code>.
                    </li>
                    <li>
                      <strong style={strong}>Hover / focus stops the panel.</strong> Not only the
                      button — a moving row is a moving tap target, so without this the line
                      somebody is reading walks out from under the pointer just as they reach for
                      it. <code>:focus-within</code> covers the keyboard, where a focused row that
                      scrolls away takes the focus ring with it.
                    </li>
                    <li>
                      <strong style={strong}>The panel does not scroll below 640px.</strong> On
                      touch there is no hover to stop it with, so it becomes a still list of its
                      first <code>rows</code> items with the rest behind the action. The bar is
                      unaffected: it holds one message, so nothing moves out from under a thumb.
                    </li>
                    <li>
                      <strong style={strong}>Nothing that cannot move shows motion controls.</strong>{" "}
                      Below two items (bar), or when the list is no longer than its own window
                      (panel), the whole cluster is removed — pause included. A pause control on
                      something that is not moving is worse than absent: it advertises motion a
                      citizen may be trying to escape. This is the one place pause legitimately
                      disappears.
                    </li>
                    <li>
                      <strong style={strong}>Empty</strong> — an empty list renders nothing at
                      all, not an empty blue band.
                    </li>
                    <li>
                      <strong style={strong}>Hover / pressed</strong> on the controls is a white
                      wash at 16% and 24%, plus a 0.94 press scale — a control that changes nothing
                      under the finger reads as not having registered. Hover is gated behind{" "}
                      <code>(hover: hover) and (pointer: fine)</code>, because on a touch screen{" "}
                      <code>:hover</code> sticks after a tap.
                    </li>
                    <li>
                      <strong style={strong}>Each row is marked, and the marker hangs.</strong> A
                      small 48%-ink dot sits in its own grid column, so wrapped lines return to the
                      text column and the dot is the only thing at the outer edge. Without it every
                      line starts at the same x and only a vertical gap — 32px between rows against
                      20px inside a wrapped title — says whether a line begins a notice or continues
                      one, which is thin enough to misread while the list is moving. The hanging
                      indent is the point, not the dot. The bar has none: one message, no list.
                    </li>
                    <li>
                      <strong style={strong}>Rows do not underline on hover.</strong> WCAG 1.4.1
                      asks that a link be distinguishable from the text <em>around</em> it, and in a
                      list where every row is a link there is no surrounding text to confuse it
                      with. The row&apos;s own background wash and the cursor carry the affordance;
                      an underline on a wrapped two-line notice struck through both lines and fought
                      the subtitle for the same few pixels.
                    </li>
                    <li>
                      <strong style={strong}>Pause holds its place.</strong> The animation is
                      applied whenever the list <em>can</em> scroll and only its{" "}
                      <code>animation-play-state</code> moves. Gating the animation property itself
                      on &quot;is it playing&quot; returned the track to zero, so resuming started
                      again from the top — a pause that loses your place is not a pause.
                    </li>
                    <li>
                      <strong style={strong}>Focus</strong> is inverse ink, not{" "}
                      <code>--sa-focus-ring</code>. See Accessibility.
                    </li>
                    <li>
                      <strong style={strong}>Reduced motion</strong> — nothing starts: not the
                      bar&apos;s timer, not the panel&apos;s scroll, not the mark&apos;s arcs.
                    </li>
                    <li>
                      <strong style={strong}>The mark follows the strip.</strong> Its arcs pulse
                      only while the list is moving. A mark that keeps broadcasting over a stopped
                      list contradicts the control the citizen just pressed.
                    </li>
                  </ul>
                </section>

                <section style={{ marginBottom: "var(--sa-section-48)" }}>
                  <h2 id="motion" style={h2Style}>5. Motion</h2>
                  <p style={proseStyle}>
                    Two mechanisms, each where it fits, and the same numbers in Figma as in
                    the CSS.
                  </p>
                  <MatrixTable
                    caption="What moves, and how"
                    columns={["What", "Duration", "Curve", "Why that curve"]}
                    rows={[
                      ["The bar's message", "240ms", "cubic-bezier(0.23, 1, 0.32, 1)", "A strong ease-out. It is entering, so it should start at full speed and settle"],
                      ["The panel's scroll", "interval x rows", "linear", "Any easing makes a marquee hesitate at the loop point"],
                      ["Hover / focus states", "150ms", "ease", "Not entering or leaving — just a colour changing under the pointer"],
                      ["The mark's arcs", "continuous", "ease-in-out", "They pulse outward and back, so they accelerate and settle at both ends"],
                      ["Control press", "160ms", "ease-out", "0.94 scale — a control that changes nothing under the finger reads as not having registered"],
                    ]}
                  />
                  <p style={{ ...proseStyle, marginTop: "var(--sa-stack-16)" }}>
                    <strong style={strong}>The message enters from the side it came from.</strong>{" "}
                    The offset was a fixed +2rem, so a message summoned by{" "}
                    <em>Previous</em> still slid in from the right — the motion saying
                    &quot;forward&quot; while the control said &quot;back&quot;. On a stepped
                    component that is the difference between holding a position and reshuffling,
                    and it is invisible in a still screenshot, which is why it survived several
                    visual passes. It is{" "}
                    <strong style={strong}>logical, not physical</strong>: the estate runs{" "}
                    <code>dir=&quot;rtl&quot;</code> in Urdu, where &quot;next&quot; travels
                    leftward, so the sign flips again with the writing direction.
                  </p>
                  <p style={{ ...proseStyle, marginTop: "var(--sa-stack-16)" }}>
                    <strong style={strong}>240ms and 12px, down from 320ms and 32px.</strong> A
                    citizen reading the page for a minute sees the message change a dozen times,
                    and at that frequency the job of the movement is to say &quot;this is
                    new&quot; and then get out of the way. It stays keyframes rather than a
                    transition because the item <em>mounts</em> — only the active message is in
                    the DOM, so there is no previous value to interpolate from. Under{" "}
                    <code>prefers-reduced-motion</code> the travel goes and a 200ms fade remains:
                    text that swaps with no transition at all is the jarring change the setting
                    exists to prevent.
                  </p>
                </section>

                <section style={{ marginBottom: "var(--sa-section-48)" }}>
                  <h2 id="divergences" style={h2Style}>6. Divergences from the Figma frame</h2>
                  <p style={proseStyle}>
                    Four, each recorded rather than hidden — a later reader will otherwise
                    &quot;fix&quot; them back.
                  </p>
                  <ul style={listStyle}>
                    <li>
                      <strong style={strong}>The plinth hugs its label</strong>, rather than being
                      the frame&apos;s absolutely-placed 265&times;72 rectangle. That width ends
                      just past &quot;Latest Updates&quot; in English — not in Hindi, and not once a
                      citizen raises their browser font size.
                    </li>
                    <li>
                      <strong style={strong}>The pause control is added.</strong> The frame draws
                      prev and next only. A published set of values is a floor, not a ceiling: what
                      accessibility needs gets added rather than the frame shipped as drawn.
                    </li>
                    <li>
                      <strong style={strong}>The nav gap is 8px, not 16px</strong> — the row runs
                      three controls now, and 16px would cost another 56px of a row that already had
                      to be taught to compress.
                    </li>
                    <li>
                      <strong style={strong}>The tile border is 1px, not 0.5px.</strong> Half a pixel
                      is not a colour any display renders predictably.
                    </li>
                  </ul>
                </section>

                <section style={{ marginBottom: "var(--sa-section-48)" }}>
                  <h2 id="code-example" style={h2Style}>7. Code Example</h2>
                  <Playground
                    code={`<Ticker
  items={updates}
  linkAs={Link}
  action={
    <Link href="/website/notices" className={buttonClasses("primary", "inverseOutlined", "sm")}>
      View All Updates
    </Link>
  }
/>`}
                  />
                </section>
              </div>
            ),
          },
          {
            id: "develop",
            label: "Develop",
            content: (
              <div className="ds-prose">
                <section style={{ marginBottom: "var(--sa-section-48)" }}>
                  <h2 id="api" style={h2Style}>8. API Reference</h2>
                  <PropsTable
                    props={[
                      {
                        name: "items",
                        type: "TickerItem[]",
                        required: true,
                        description:
                          "The messages: { id?, title, description?, date?, dateTime?, href, linkLabel? }. date is the display text and dateTime its ISO form; the component owns the separator between the kind and the date, so a notice without one does not trail a dangling middot. An empty list renders nothing.",
                      },
                      {
                        name: "label",
                        type: "string",
                        description:
                          "The plinth text and the section's accessible name. Defaults to \"Latest Updates\".",
                      },
                      {
                        name: "icon",
                        type: "ReactNode",
                        description:
                          "Override the mark. Defaults to <TickerMark>, a bespoke animated megaphone whose arcs pulse while the strip moves and stop when it is paused.",
                      },
                      {
                        name: "action",
                        type: "ReactNode",
                        description:
                          "The way out of the strip. Style it with buttonClasses(\"primary\", \"inverseOutlined\", \"sm\").",
                      },
                      {
                        name: "orientation",
                        type: '"horizontal" | "vertical"',
                        description:
                          "Which of the two shapes: the 72px one-message bar, or the stacked scrolling panel. Defaults to horizontal.",
                      },
                      {
                        name: "height",
                        type: '"auto" | "fill"',
                        description:
                          "auto (default) stands at the header plus the rows window; fill takes the height of the row it shares, making rows a floor. Vertical only. fill needs a parent whose height does not come from the panel — a grid item is sized by its own content, so give the rail position: relative and the panel's wrapper position: absolute; inset: 0.",
                      },
                      {
                        name: "rows",
                        type: "number",
                        description:
                          "How many rows are visible at once, and therefore the panel's height. Vertical only. Defaults to 4.",
                      },
                      {
                        name: "interval",
                        type: "number",
                        description:
                          "Horizontal: milliseconds each item holds. Vertical: milliseconds of travel per row, so the scroll speed stays constant however long the list gets. Defaults to 5000.",
                      },
                      { name: "autoplay", type: "boolean", description: "Start advancing on mount. Defaults to true." },
                      {
                        name: "linkAs",
                        type: "ElementType",
                        description: "Router-aware link for internal hrefs — pass next/link. Defaults to 'a'.",
                      },
                      { name: "className", type: "string", description: "Additional classes merged onto the root element." },
                      {
                        name: "...rest",
                        type: "HTMLAttributes<HTMLElement>",
                        description: "Standard section props are forwarded, except 'title'.",
                      },
                    ]}
                  />
                </section>
              </div>
            ),
          },
          {
            id: "accessibility",
            label: "Accessibility",
            content: (
              <div className="ds-prose">
                <section style={{ marginBottom: "var(--sa-section-48)" }}>
                  <h2 id="accessibility" style={h2Style}>9. Accessibility (A11y)</h2>
                  <ul style={listStyle}>
                    <li>
                      <strong style={strong}>Pause, Stop, Hide (2.2.2):</strong> the strip
                      auto-advances, so a mechanism to stop it is required. The pause control is
                      the one control that survives every breakpoint.
                    </li>
                    <li>
                      <strong style={strong}>Reduced motion:</strong> the timer never starts under{" "}
                      <code>prefers-reduced-motion</code>. Suppressing only the animation would leave
                      the message replacing itself every few seconds, which is the part that hurts.
                    </li>
                    <li>
                      <strong style={strong}>Live region:</strong> <code>aria-live=&quot;off&quot;</code>{" "}
                      while playing, <code>polite</code> once paused. An auto-rotating polite region
                      interrupts a screen-reader user every interval with text they did not ask for.
                    </li>
                    <li>
                      <strong style={strong}>Tab order:</strong> one item is in the DOM at a time. The
                      frame fades inactive slides to <code>opacity: 0</code>, but an invisible link is
                      still focusable — a citizen would tab through eight links they cannot see.
                    </li>
                    <li>
                      <strong style={strong}>Focus ring (1.4.11 / 2.4.11):</strong> inverse ink, not{" "}
                      <code>--sa-focus-ring</code>. The ring token is this bar&apos;s own fill and
                      measures 1:1 against it.
                    </li>
                    <li>
                      <strong style={strong}>The panel is a list, not a live region.</strong> A
                      screen reader reads it as one, at whatever pace the reader chooses — so
                      there is no <code>aria-live</code> on it and nothing interrupts. The
                      duplicated scrolling copy is <code>aria-hidden</code> with{" "}
                      <code>tabIndex=-1</code>, so it is announced once and tabbed through once.
                    </li>
                    <li>
                      <strong style={strong}>Reflow (1.4.10):</strong> prev/next drop below 640px, the
                      action below 1024px, the plinth label below 640px. Pause never drops.
                    </li>
                    <li>
                      <strong style={strong}>Contrast:</strong> the ground is{" "}
                      <code>primaryScale/600</code>, not <code>/500</code>, and that is a fix rather
                      than a preference. White on <code>/500</code> is{" "}
                      <strong style={strong}>4.64:1</strong> — clearing 1.4.3&apos;s 4.5:1 by four
                      hundredths — and any dimming fails outright: 90% is 4.06:1, 80% is 3.52:1.
                      This component shipped an 80% line on that ground and this page claimed 6.3:1,
                      which was wrong. On <code>/600</code> the title is 6.36:1 and the subtitle
                      4.66:1, so the two-line structure is possible at all.
                    </li>
                  </ul>
                </section>
              </div>
            ),
          },
        ]}
      />
    </main>
  );
}
