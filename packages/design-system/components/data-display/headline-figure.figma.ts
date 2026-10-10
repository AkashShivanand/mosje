// url=<SAMAVESH>?node-id=58895-607
// source=packages/design-system/components/data-display/headline-figure.tsx
// component=HeadlineFigure
import figma from "figma";

const instance = figma.selectedInstance;

const value = instance.getString("Value");
const label = instance.getString("Label");
const context = instance.getString("Context");
const showContext = instance.getBoolean("Show context");
const size = instance.getEnum("Size", { XL: "xl", LG: "lg", MD: "md" });
const tone = instance.getEnum("Tone", { Default: "default", Inverse: "inverse" });

export default {
  example: figma.code`
    <HeadlineFigure
      size="${size}"
      ${tone === "inverse" ? figma.code`tone="inverse"` : ""}
      value="${value}"
      label="${label}"
      ${showContext ? figma.code`context="${context}"` : ""}
    />
  `,
  imports: ['import { HeadlineFigure } from "@mosje/design-system"'],
  id: "headline-figure",
  metadata: { nestable: true },
};
