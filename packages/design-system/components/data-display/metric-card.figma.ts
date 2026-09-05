// url=<SAMAVESH>?node-id=57414-15871
// source=packages/design-system/components/data-display/metric-card.tsx
// component=MetricCard
import figma from "figma";

const instance = figma.selectedInstance;

/**
 * Figma `Reading` → which of the five readings of one number the tile shows.
 * Not a prop: each reading is a different SET of props on the one component,
 * so the axis chooses which fragment the snippet emits. Exhaustive, 5 of 5.
 */
const reading = instance.getEnum("Reading", {
  Value: "value",
  Change: "change",
  Trend: "trend",
  Target: "target",
  Status: "status",
});

/**
 * Figma `Tone` → `tone`. Neutral is the absence of the prop. Warning and Danger
 * are claims — the code's own TSDoc says to set them only against a rule the
 * scheme has stated — so the snippet emits them only where the designer chose
 * them, never as a default.
 */
const tone = instance.getEnum("Tone", {
  Neutral: "",
  Warning: "warning",
  Danger: "danger",
});

export default {
  example: figma.code`
    <MetricCard
      label="Utilisation of Release"
      value="79.0%"
      ${tone ? figma.code`tone="${tone}"` : ""}
      ${reading === "change" || reading === "target" || reading === "trend" ? figma.code`changeValue="1.6 pts" changeDirection="down" changeLabel="utilised ÷ released"` : ""}
      ${reading === "trend" ? figma.code`aside={<Sparkline data={series} width={72} height={24} />}` : ""}
      ${reading === "target" ? figma.code`progress={{ value: 79, max: 100, target: 85, targetLabel: "Target 85%" }}` : ""}
      ${reading === "status" ? figma.code`detail="90 of 883 surveyed" status={{ label: "Below target", tone: "danger" }}` : ""}
    />
  `,
  imports: ['import { MetricCard, Sparkline } from "@mosje/design-system"'],
  id: "metric-card",
  metadata: { nestable: true },
};
