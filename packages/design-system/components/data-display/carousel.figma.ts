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
 * Four variants (Placement × Pagination) since 22 September 2026. What used to be
 * variant axes now lives on the nested parts: which dot is current and whether it
 * is running is set on the dot itself, and Pause/Play on the rotation control.
 * `Rotation` is the switch that says the carousel auto-rotates at all.
 *
 * `Pagination` is not a prop: the component draws dots up to six slides and the
 * counter past them, so the choice follows the number of children. The Dot 3–6
 * switches draw how many slides there are, which the children decide in code.
 */
const autoPlay = instance.getBoolean("Rotation");

const placement = instance.getEnum("Placement", {
  Below: "below",
  Overlay: "overlay",
});

const pagination = instance.getEnum("Pagination", {
  Dots: "dots",
  Counter: "counter",
});

export default {
  example: figma.code`
    <Carousel
      label="Schemes for senior citizens"
      ${autoPlay ? figma.code`autoPlay interval={7}` : ""}
      ${placement === "overlay" ? figma.code`controls="overlay"` : ""}
      showDots
    >
      {/* ${pagination === "counter" ? "seven or more slides" : "two to six slides"} */}
      <Slide />
    </Carousel>
  `,
  imports: ['import { Carousel } from "@mosje/design-system"'],
  id: "carousel",
  metadata: { nestable: false },
};
