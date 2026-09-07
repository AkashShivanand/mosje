import type { Metadata } from "next";
import * as React from "react";

import {
  Callout,
  ComponentDocPage,
  MatrixTable,
  type A11yItem,
} from "@/components/design-system/docs-kit";
import { PageHeaderCarousel } from "@mosje/design-system";

export const metadata: Metadata = {
  title: "Hero Carousel — Design System",
  description:
    "The circular photo carousel in a landing page header — the second of the header's two media variants, and the one that is not decorative.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.1.1 Non-text Content",
    level: "A",
    description:
      "Every slide carries its own `alt`. The still portrait it replaces is decorative and hidden by contract; a carousel shows several different pictures, so each one describes itself.",
    status: "verified",
    evidence:
      "axe reports no image-alt violation on /website/organisation/nasha-mukt-bharat-abhiyaan; each slide's alt read back from the DOM after navigating with the arrows and the dots.",
  },
  {
    criterion: "2.2.2 Pause, Stop, Hide",
    level: "A",
    description:
      "`autoPlayMs` is opt-in, stops permanently on hover or focus, and never starts when the reader has asked for reduced motion.",
    status: "verified",
    evidence:
      "The interval is not created when `prefers-reduced-motion: reduce` matches, and `paused` latches on `mouseenter` and `focusin`. NMBA ships without autoplay, as the source does.",
  },
  {
    criterion: "2.5.8 Target Size (Minimum)",
    level: "AA",
    description:
      "The dot a reader sees is 8px; the button around it is 24×24, which is what the criterion measures.",
    status: "verified",
    evidence:
      "`.sa-hdrcar__dot` is 24×24 with the visible dot drawn on `::before`; axe reports no target-size violation on the NMBA page.",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    description:
      "The group carries `aria-roledescription=\"carousel\"` and a label; the dots are `role=\"tab\"` with `aria-selected`; a polite live region announces which photograph is showing.",
    status: "verified",
    evidence:
      "Read back from the rendered page: role=group, aria-label present, four tabs, six focusable controls, and no `aria-hidden` ancestor.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    description:
      "Every control is a real `<button>`, so it is reachable and operable from the keyboard without a custom key handler.",
    status: "verified",
    evidence: "All six controls report `tabIndex >= 0` and sit outside any `aria-hidden` subtree.",
  },
];

const SLIDES = [
  {
    src: "/website/content/organisation/nmba-hero-1.jpg",
    alt: "A Nasha Mukt Bharat Abhiyaan event at a Government of India venue",
  },
  { src: "/website/content/organisation/nmba-hero-2-goa.png", alt: "An Abhiyaan event in Goa" },
  {
    src: "/website/content/organisation/nmba-hero-3-blv.png",
    alt: "Shri B. L. Verma, Minister of State, at an Abhiyaan event",
  },
];

export default function PageHeaderCarouselPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Hero Carousel"
      status="Stable"
      summary="The circular photo carousel in a landing page header. It replaces the still portrait where an organisation publishes several pictures of itself, and unlike the still it is not decorative: it carries controls, so it carries a name."
      figma={{
        absent:
          "Published on the Page Header page as the landing header's Media=Carousel variant, alongside Media=Still.",
      }}
      specimen={
        <div style={{ width: 340, height: 340 }}>
          <PageHeaderCarousel slides={SLIDES} label="Abhiyaan photographs" />
        </div>
      }
      propsFrom="PageHeaderCarouselProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A landing page header whose organisation publishes several photographs of its own work.",
          "Where the source site being cloned cycles pictures in the same place — reproducing that as one still loses the rest.",
        ],
        avoid: [
          "A single photograph. The still portrait is decorative, hidden from assistive technology, and adds no controls to the tab order — that is the better answer when there is only one picture.",
          "Anything a reader must not miss. A carousel hides most of its content most of the time; a fact belongs in the copy or in FactStrip.",
          "An inner page header, which has no media column at all.",
        ],
      }}
      related={[
        {
          label: "Page Header",
          href: "/design-system/components/layout/page-header",
          reason: "the band this sits in, and its still-portrait variant",
        },
        {
          label: "Fact Strip",
          href: "/design-system/components/data-display/fact-strip",
          reason: "for figures that must be read, not cycled past",
        },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-variants">
            <h2 id="cdp-variants" className="cdp__h2">
              Two Media Variants, and the Difference Is Not Styling
            </h2>
            <p>
              The landing header has always drawn a still portrait in a haloed circle, and hidden
              it from assistive technology by contract: it repeats nothing the copy says, so a
              reader who never sees it loses nothing. A carousel cannot make that claim. It shows
              several different pictures and it carries buttons.
            </p>
            <MatrixTable
              caption="The landing header's two media variants"
              columns={["", "Media = Still", "Media = Carousel"]}
              rows={[
                ["Pictures", "One", "Two or more"],
                ["Alt text", "Empty — decorative", "One per slide"],
                ["Exposed to assistive tech", "No, aria-hidden", "Yes, a named region"],
                ["Controls in the tab order", "None", "Previous, next, one per slide"],
                ["Header prop", "media", "media + mediaLabel"],
              ]}
            />
            <Callout type="warning" title="A hidden control is worse than either option">
              Buttons inside an <code>aria-hidden</code> subtree stay in the tab order while being
              invisible to a screen reader — a reader tabs onto something that is not announced.
              That is why the carousel variant is gated on <code>mediaLabel</code> rather than
              being a free styling choice: passing the label is what stops the column being
              hidden.
            </Callout>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-autoplay">
            <h2 id="cdp-autoplay" className="cdp__h2">
              Autoplay Is Off Unless Asked For
            </h2>
            <p>
              <code>autoPlayMs</code> is opt-in. When it is set, the carousel stops for good the
              moment a reader hovers or focuses it, and it never starts at all under{" "}
              <code>prefers-reduced-motion</code>. A picture that moves while someone is reading
              the paragraph beside it is a distraction a departmental page does not need, which is
              why NMBA ships without it — as its source does.
            </p>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-dom">
            <h2 id="cdp-dom" className="cdp__h2">
              One Slide in the DOM at a Time
            </h2>
            <p>
              A track of images inside a circle means every picture but one is present and
              invisible: a screen-reader user walks through pictures a sighted reader cannot see,
              and the count they are given does not match the page. Only the current slide is
              rendered; a polite live region says which one it is.
            </p>
          </section>
        </>
      }
    />
  );
}
