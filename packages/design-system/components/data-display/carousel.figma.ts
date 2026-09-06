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
  On: "on",
});

const current = instance.getEnum("Current", {
  "1": "1",
  "2": "2",
  "3": "3",
  "4": "4",
});

export default {
  example: figma.code`
    <Carousel
      label="Schemes for senior citizens"
      ${autoPlay === "on" ? figma.code`autoPlay interval={7000}` : ""}
      showDots
    >
      <Slide />
    </Carousel>
  `,
  imports: ['import { Carousel } from "@mosje/design-system"'],
  id: "carousel",
  metadata: { nestable: false },
};
