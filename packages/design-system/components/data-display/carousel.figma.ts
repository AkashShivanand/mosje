// url=<SAMAVESH>?node-id=57548-1159
// source=packages/design-system/components/data-display/carousel.tsx
// component=Carousel
import figma from "figma";

const instance = figma.selectedInstance;

/**
 * Figma publishes the CONTROLS; code publishes the carousel. A slide is whatever the
 * page puts in it, so publishing a panel master would fix a size and a composition
 * that no two carousels on this estate share.
 *
 * `Current` is not a prop — the component holds its own position and announces it in
 * a polite live region ("Slide 3 of 5"). Pinning it from outside would let a page
 * contradict what the reader has just done.
 */
const autoPlay = instance.getEnum("Autoplay", {
  Off: "off",
  Running: "on",
  Paused: "on",
});

const placement = instance.getEnum("Placement", {
  Below: "below",
  Overlay: "overlay",
});

/**
 * `Pagination` is not a prop either: the component draws dots up to six slides and
 * the counter past them, so the choice follows the number of children. `Paused` is
 * a moment in an auto-rotating carousel, not a different carousel, so it maps to
 * `autoPlay` like `Running`.
 */
const pagination = instance.getEnum("Pagination", {
  Dots: "dots",
  Counter: "counter",
});

const current = instance.getEnum("Current", {
  "1": "1",
  "2": "2",
  "3": "3",
  "4": "4",
  "5": "5",
  "6": "6",
});

export default {
  example: figma.code`
    <Carousel
      label="Schemes for senior citizens"
      ${autoPlay === "on" ? figma.code`autoPlay interval={7}` : ""}
      ${placement === "overlay" ? figma.code`controls="overlay"` : ""}
      showDots
    >
      {/* ${pagination === "counter" ? "seven or more slides" : "two to six slides"}, current ${current} */}
      <Slide />
    </Carousel>
  `,
  imports: ['import { Carousel } from "@mosje/design-system"'],
  id: "carousel",
  metadata: { nestable: false },
};
