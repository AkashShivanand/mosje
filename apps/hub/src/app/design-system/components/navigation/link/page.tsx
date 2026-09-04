import type { Metadata } from "next";
import * as React from "react";

import { Callout, ComponentDocPage, MatrixTable, type A11yItem } from "@/components/design-system/docs-kit";
import { Link } from "@mosje/design-system";

import { Specimen } from "./specimen";

export const metadata: Metadata = {
  title: "Link",
  description:
    "Text that takes the reader somewhere. A link changes location; a button performs an action.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.4.1 Use of Color",
    level: "A",
    status: "verified",
    evidence: "e2e/design-system/link.spec.ts",
    description:
      "An inline link is always underlined. Colour is the only other signal a text link has, so inside a block of text the underline IS the compliance — and there is deliberately no modifier to remove it.",
  },
  {
    criterion: "2.4.4 Link Purpose (In Context)",
    level: "A",
    description:
      "The label names the destination. “Click here” and a bare “Read more” both fail a reader who navigates by pulling up a list of the page's links.",
  },
  {
    criterion: "1.4.3 Contrast (Minimum)",
    level: "AA",
    status: "verified",
    evidence: "computed from the token: #0373df on white is 4.64:1",
    description:
      "The resting ink binds `--sa-text-link-brand-default`, which clears the 4.5:1 body-text floor. Hover and active are darker still.",
  },
  {
    criterion: "2.4.7 Focus Visible",
    level: "AA",
    status: "verified",
    evidence: "e2e/design-system/link.spec.ts",
    description:
      "The same ring as every other control — `--sa-focus-width` in `--sa-focus-ring`, held clear by `--sa-focus-offset`.",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    status: "verified",
    evidence: "e2e/design-system/link.spec.ts",
    description:
      "A disabled link drops `href`, so the browser's own rules make it unfocusable and unactivatable, and carries `aria-disabled` because an anchor has no native disabled to read. The new-tab warning is inside the anchor, so it forms part of the accessible name rather than a separate node.",
  },
  {
    criterion: "GIGW 3.0 — New window notice",
    level: "GIGW",
    status: "verified",
    evidence: "e2e/design-system/link.spec.ts",
    description:
      "A link that opens a new tab says so: a glyph for the people who can see it, and a visually hidden “(opens in a new tab)” for the people who cannot.",
  },
];

export default function Page(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Link"
      status="Stable"
      summary="Text that takes the reader somewhere. A link changes location; a button performs an action — and getting that distinction right is the single most consequential accessibility decision for an interactive element."
      figma={{ node: "link" }}
      since="0.9.0"
      specimen={<Specimen />}
      propsFrom="LinkProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "The reader is taken to another page, another site, or another place on this page.",
          "A file is downloaded.",
          "A destination is named inside a sentence.",
        ],
        avoid: [
          "Something happens on the current page — that is a Button, and a screen-reader user who activates a “link” and finds nothing moved was given the wrong control.",
          "The control needs to look like a call to action — pass `href` to Button, which renders a real anchor, rather than dressing a link up as one.",
        ],
      }}
      related={[
        { label: "Button", href: "/design-system/components/actions/button", reason: "for an action, and for a link that must look like a call to action" },
        { label: "Breadcrumb", href: "/design-system/components/navigation/breadcrumb", reason: "for a trail back up the hierarchy" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-link-vs-button">
            <h2 id="cdp-link-vs-button" className="cdp__h2">
              A Link Changes Location
            </h2>
            <p>
              A button performs an action; a link changes location. If a screen-reader user
              activates your &ldquo;link&rdquo; and the page does not move, the control was
              wrong &mdash; and the reverse is just as wrong.
            </p>
            <Callout type="info" title="Where Button ends and Link begins">
              Button has an <code>href</code> form, and it is not a duplicate of this. Use
              it when the destination needs the <em>weight</em> of a call to action &mdash;
              a filled or outlined box at the end of a form. Use Link when the destination
              is text: in a sentence, in a list, under a heading.
            </Callout>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-link-variants">
            <h2 id="cdp-link-variants" className="cdp__h2">
              Inline and Standalone
            </h2>
            <p>
              An <strong>inline</strong> link sits inside a sentence and is{" "}
              <strong>always underlined</strong>. That is not a style choice: WCAG 2.2
              &sect;1.4.1 says a link inside a block of text must not be distinguished from
              the surrounding text by colour alone, and colour is the only other signal a
              text link has. There is deliberately no way to turn it off.
            </p>
            <p>
              A <strong>standalone</strong> link sits on its own &mdash; a card&rsquo;s
              &ldquo;Read more&rdquo;, a list of downloads, a call to action under a
              heading. It is not inside a block of text, so &sect;1.4.1 does not bind it and
              the underline waits for hover or focus. The moment one lands inside a
              paragraph, it is the wrong variant.
            </p>
            <MatrixTable
              caption="What each state means"
              columns={["State", "Treatment", "Why"]}
              rows={[
                ["Default", "--sa-text-link-brand-default, 4.64:1 on white.", "Clears the 4.5:1 body-text floor. Links are body text by definition."],
                ["Hover / Active", "Darker rungs of the same ramp.", "Deepening rather than changing hue, so the link does not appear to become a different kind of thing."],
                ["Visited", "--sa-text-link-visited-default.", "A link's one unique state, and the reason it is not a Button appearance. On a list of circulars, “have I already opened this?” is the question the reader is actually asking. Not applied on a brand surface, where the visited rung is unreadable."],
                ["Disabled", "Muted, inert, and unfocusable.", "`href` is dropped, so the browser's own rules do the work — the same mechanism Button's link form uses."],
                ["Windows High Contrast", "LinkText, and underlined even when standalone.", "The forced palette removes colour as a signal, so every link is underlined in that mode."],
              ]}
            />
          </section>

          <section className="cdp__section" aria-labelledby="cdp-link-external">
            <h2 id="cdp-link-external" className="cdp__h2">
              Leaving the Site
            </h2>
            <p>
              <code>external</code> does four things at once, and all four are needed:{" "}
              <code>target=&quot;_blank&quot;</code>,{" "}
              <code>rel=&quot;noopener noreferrer&quot;</code>, a trailing glyph, and a
              visually hidden &ldquo;(opens in a new tab)&rdquo; appended to the accessible
              name.
            </p>
            <p>
              <Link href="https://www.india.gov.in" external variant="standalone">
                National Portal of India
              </Link>
            </p>
            <Callout type="warning" title="The glyph and the hidden text are not alternatives">
              GIGW 3.0 requires telling the reader when a link opens a new window. The glyph
              tells the people who can see it; the hidden text tells the people who cannot.
              One without the other serves half the audience. Of the fifty-eight{" "}
              <code>target=&quot;_blank&quot;</code> call sites counted across the hub before
              this component, twenty-nine carried no <code>rel</code> at all.
            </Callout>
          </section>
        </>
      }
    />
  );
}
