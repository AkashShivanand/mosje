import type { Metadata } from "next";
import * as React from "react";

import { CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";
import { CarouselPlayground } from "./carousel-playground";

export const metadata: Metadata = {
  title: "Carousel — Design System",
  description:
    "A band of slides the reader moves through, with auto-rotation off by default and a pause control whenever it is on.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "2.2.2 Pause, Stop, Hide",
    level: "A",
    status: "verified",
    evidence:
      "Measured on the auto-rotating specimen: the pause control renders only when autoPlay is on, its label flipped from 'Stop rotating…' to 'Start rotating…' when pressed, and the announced slide index then held at 'Slide 2 of 4' across seven seconds with a five-second interval. The suspend-on-hover and suspend-on-focus behaviour is implemented but was NOT measurable here — the automation pane runs unfocused (document.hasFocus() is false and focusin never dispatches), so that half is reasoned rather than observed. WCAG 2.2.2 is satisfied by the pause control alone, which is what was measured.",
    description:
      "Anything moving for more than five seconds can be stopped, and moves only while the reader is not engaged with it.",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    status: "verified",
    evidence:
      'Read from the rendered DOM: the region carries aria-roledescription="carousel" and its aria-label; each slide is role="group" with aria-roledescription="slide" and an "N of M" aria-label; the dots carry aria-current on the active one and a "Slide N of M" label each.',
    description:
      "The carousel, its slides and its controls are each named and given the role the pattern expects.",
  },
  {
    criterion: "4.1.3 Status Messages",
    level: "AA",
    status: "verified",
    evidence:
      'A visually hidden <p role="status" aria-live="polite"> holds "Slide N of M" and updates on every move. Read from the DOM after pressing Next: the element\'s text changed without focus moving.',
    description:
      "Moving between slides is announced, because the visual change alone tells a screen-reader user nothing.",
  },
  {
    criterion: "2.5.8 Target Size (Minimum)",
    level: "AA",
    status: "verified",
    evidence:
      "Arrows bind --sa-control-height-md (40px). The dots draw an 8px mark inside a 32px button, so the mark is small and the target is not. Measured with getBoundingClientRect on this page.",
    description:
      "The dot is small; its target is 32px square, because these controls are the only way most readers reach slide two.",
  },
];

export default function CarouselPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Carousel"
      status="Stable"
      summary="A band of slides the reader moves through. Auto-rotation is off by default, and when it is on it stops on hover, on focus, under reduced motion, and on a pause control."
      figma={{
        absent:
          "What is on the library's Carousel page is a MOCKUP, not a component: five hardcoded \"Slide N/Desktop\" frames with light and dark control sets. A real master matching this API has still to be drawn.",
      }}
      specimen={<CarouselPlayground />}
      propsFrom="CarouselProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A set of equally important, genuinely optional items — photographs from a scheme, a handful of promotional cards.",
          "The space is fixed and the items are browsable rather than comparable.",
        ],
        avoid: [
          "Anything a citizen needs. Slides two onwards sit behind an interaction most people never perform, so put the announcement on the page.",
          "Items the reader should compare — a list or a grid shows them all at once.",
          "Navigation. A carousel of links is a menu nobody can see.",
        ],
      }}
      related={[
        { label: "List Group", href: "/design-system/components/data-display/list-group", reason: "when every item should be visible at once" },
        { label: "Figure", href: "/design-system/components/data-display/figure", reason: "for the images a carousel usually holds" },
        { label: "Ticker", href: "/design-system/components/feedback/ticker", reason: "for a single line of moving announcements" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-autoplay">
            <h2 id="cdp-autoplay" className="cdp__h2">Auto-Rotation Is Off, and Should Stay Off</h2>
            <p>
              A carousel that moves on its own takes the sentence a citizen is reading away
              mid-sentence, and it does that most to the slowest readers — the ones these schemes
              most often serve. WCAG 2.2.2 is met when <code>autoPlay</code> is on: the pause
              control appears, rotation halts on hover and on focus, and{" "}
              <code>prefers-reduced-motion</code> disables it outright.
            </p>
            <p>
              Meeting the criterion is not the same as the thing being a good idea. Turn it on only
              for decorative content nobody has to read.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-hidden">
            <h2 id="cdp-hidden" className="cdp__h2">Everything Essential Lives Outside It Too</h2>
            <p>
              Slides two onwards are, in practice, unread. If an announcement matters, it belongs on
              the page — the carousel may repeat it, but it must not be the only place it appears.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-track">
            <h2 id="cdp-track" className="cdp__h2">The Track Is the Source of Truth</h2>
            <p>
              Slides sit in a scroll-snap track, so a swipe on a phone is the native gesture rather
              than a reimplementation of one. The component reads the track&apos;s scroll position
              back to work out which slide is current, which is why a swipe and a button press can
              never disagree about where the reader is.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">Example</h2>
          <CodeBlock>{`import { Carousel } from "@mosje/design-system";

<Carousel label="Departmental announcements">
  {announcements.map((a) => (
    <AnnouncementCard key={a.id} {...a} />
  ))}
</Carousel>`}</CodeBlock>
          <p>
            Each child becomes one slide and is labelled &ldquo;N of M&rdquo; automatically — pass
            the content only, with no wrapper of your own.
          </p>
        </section>
      }
      accessibility={
        <>
          <section className="cdp__section" aria-labelledby="cdp-announce">
            <h2 id="cdp-announce" className="cdp__h2">Moving Is Announced</h2>
            <p>
              Pressing Next changes what is on screen and nothing else. A visually hidden live
              region carries &ldquo;Slide 3 of 4&rdquo; so a screen-reader user learns that the
              press did something — without the position being printed on screen a second time,
              where the dots already show it.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-dots">
            <h2 id="cdp-dots" className="cdp__h2">The Dots Are Buttons, Not Tabs</h2>
            <p>
              They carry <code>aria-current</code> rather than <code>role=&quot;tab&quot;</code>.
              A tablist promises panels that stay put and a roving arrow-key model; these move a
              scrolling track. Claiming the role without the behaviour is worse than not claiming it.
            </p>
          </section>
        </>
      }
    />
  );
}
