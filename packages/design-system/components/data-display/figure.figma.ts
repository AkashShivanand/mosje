// url=<SAMAVESH>?node-id=57524-850
// source=packages/design-system/components/data-display/figure.tsx
// component=Figure
import figma from "figma";

const instance = figma.selectedInstance;

const caption = instance.getString("Caption");
const credit = instance.getString("Credit");
const showCredit = instance.getBoolean("Show credit");

const ratio = instance.getEnum("Ratio", {
  Auto: "auto",
  Square: "square",
  Video: "video",
  Photo: "photo",
  Portrait: "portrait",
});

const fit = instance.getEnum("Fit", {
  Cover: "cover",
  Contain: "contain",
});

/**
 * There is deliberately no `alt` in this template, and none in the component. The
 * alternative text belongs to the IMAGE the caller passes as a child, not to the
 * figure around it — and a figure that accepted an `alt` prop would let a caller
 * believe they had described a picture they had not.
 */
export default {
  example: figma.code`
    <Figure
      ratio="${ratio}"
      fit="${fit}"
      caption="${caption}"
      ${showCredit ? figma.code`credit="${credit}"` : ""}
    >
      <img src="…" alt="…" />
    </Figure>
  `,
  imports: ['import { Figure } from "@mosje/design-system"'],
  id: "figure",
  metadata: { nestable: false },
};
