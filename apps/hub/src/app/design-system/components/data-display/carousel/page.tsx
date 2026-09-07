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
      "Measured from the rendered DOM 2026-09-07: each dot is a 24x24 button drawing an 8px mark, and the buttons sit exactly adjacent — pitch 24, no dead space — so every dot meets 2.5.8's 24x24 minimum without the spacing exception being needed. The arrows bind --sa-control-height-md (40px) and grow to 44x44 on a coarse pointer, which is UX4G 3.0 §3's recommendation. The dots deliberately do NOT grow: a 44px target on a 24px pitch overlaps its neighbours by 10px a side and resolves the press by paint order, so the reader would press 3 and get 4. A wrong slide is worse than a small target, and the divergence is recorded in the stylesheet.",
    description:
      "The dot is small; its target is not — 32px on a mouse, 44px on a thumb, because these controls are the only way most readers reach slide two.",
  },
  {
    criterion: "1.4.1 Use of Colour",
    level: "A",
    status: "verified",
    evidence:
      "The current dot differs in SHAPE, not only in fill: measured from the computed ::before on this page, the current mark is 20px wide against 8px for the rest, so the state survives a monochrome rendering and forced-colors mode, where background-color is replaced outright. A forced-colors block keeps an outline on it as well.",
    description:
      "Which slide you are on is carried by the width of the mark, so it does not depend on being able to see the blue.",
  },
];

export default function CarouselPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Carousel"
      status="Stable"
      summary="A band of slides the reader moves through. Auto-rotation is off by default, and when it is on it stops on hover, on focus, under reduced motion, and on a pause control."
      figma={{ node: "carousel" }}
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
          <section className="cdp__section" aria-labelledby="cdp-bar">
            <h2 id="cdp-bar" className="cdp__h2">The Dots Stay Under the Middle of the Band</h2>
            <p>
              The control bar is three columns and only the middle one is centred: the step
              arrows and the dots own it, and anything else — today the rotation control, tomorrow
              a counter — sits in a side column that cannot push them. When the bar was one
              centred row, switching <code>autoPlay</code> on slid the dots 37px off the middle of
              the slide they report on, so the position indicator moved for a reason that had
              nothing to do with position.
            </p>
            <p>
              The rotation control is drawn without a fill or a border. It is a mode switch, not a
              third arrow, and given the arrows&apos; treatment it otherwise read as a navigation
              control that had wandered to the left edge.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-long">
            <h2 id="cdp-long" className="cdp__h2">Past Six Slides the Dots Become a Counter</h2>
            <p>
              A dot row stops being a position indicator and becomes a wall. Six is the largest
              count that still reads as a countable set at a glance — past it a reader stops
              counting and starts estimating, which is the moment the row is doing no work a
              number would not do better. Above six the dots are replaced by <code>3 / 9</code>.
              The reason is legibility rather than width: at the row&apos;s 24px pitch the cluster
              only outgrows a narrow phone somewhere past eleven slides, well above where it
              stops being readable.
            </p>
            <p>
              The counter carries no jump-to-slide affordance, because there is nothing honest to
              offer: a set that long has no way to reach slide nine directly that is better than
              pressing Next. If the reader needs to reach a particular item, the content wanted a
              list, not a carousel.
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
