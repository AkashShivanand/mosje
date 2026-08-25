import * as React from "react";
import type { Metadata } from "next";
import { TickerPlayground } from "./ticker-playground";
import { Playground } from "@/components/design-system/playground";
import { PropsTable, DoDont, DocsTabs } from "@/components/design-system/docs-kit";

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
                            "Keep the headline to one short clause — it is clipped, not wrapped, and the sentence under it carries the detail.",
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
                    They are one component because the data is identical — a lead-in, a sentence,
                    a link — and a site usually wants both: the bar on the home page, the panel in
                    a column beside it. In the panel <code>title</code> becomes the{" "}
                    <strong style={strong}>bold lead-in before the colon</strong> (the kind of
                    notice — Vacancies, Result, Tender) and <code>description</code> the sentence
                    after it. <code>linkLabel</code> is ignored there: on a scrolling list it would
                    repeat on every row, and the whole row is already the link.
                  </p>
                  <p style={{ ...proseStyle, marginTop: "var(--sa-stack-16)" }}>
                    <strong style={strong}>The loop is seamless because the list is rendered
                    twice</strong> and the track travels exactly −50%, so the second copy lands
                    precisely where the first began. Any other distance produces a visible jump,
                    and a percentage of the track is the only figure that stays correct as notices
                    are added. The duplicate is <code>aria-hidden</code> and out of the tab order.
                  </p>
                </section>

                <section style={{ marginBottom: "var(--sa-section-48)" }}>
                  <h2 id="states" style={h2Style}>3. States</h2>
                  <ul style={listStyle}>
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
                      wash at 16% and 24% — a transparency of the single ink, never a second
                      colour. The message underlines its headline.
                    </li>
                    <li>
                      <strong style={strong}>Focus</strong> is inverse ink, not{" "}
                      <code>--sa-focus-ring</code>. See Accessibility.
                    </li>
                    <li>
                      <strong style={strong}>Reduced motion</strong> — the timer never starts;
                      the citizen steps through with the arrows.
                    </li>
                  </ul>
                </section>

                <section style={{ marginBottom: "var(--sa-section-48)" }}>
                  <h2 id="divergences" style={h2Style}>4. Divergences from the Figma frame</h2>
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
                  <h2 id="code-example" style={h2Style}>5. Code Example</h2>
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
                  <h2 id="api" style={h2Style}>6. API Reference</h2>
                  <PropsTable
                    props={[
                      {
                        name: "items",
                        type: "TickerItem[]",
                        required: true,
                        description:
                          "The messages to cycle: { id?, title, description?, href, linkLabel? }. An empty list renders nothing.",
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
                          "The mark on the white tile. Defaults to the Material Symbols 'campaign' glyph.",
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
                  <h2 id="accessibility" style={h2Style}>7. Accessibility (A11y)</h2>
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
                      <strong style={strong}>Contrast:</strong> the description runs at 80% white on
                      the brand blue — 6.3:1, past the 4.5:1 of WCAG 1.4.3.
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
