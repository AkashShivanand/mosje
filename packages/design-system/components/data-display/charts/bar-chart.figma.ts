// url=<SAMAVESH>?node-id=57417-15992
// source=packages/design-system/components/data-display/charts/bar-chart.tsx
// component=BarChart
import figma from "figma";

const instance = figma.selectedInstance;

/**
 * Figma `Type` → the React component of the same name, with the props that
 * distinguish the three bar forms. One Figma set holds every foundational chart
 * type at its reference size; one template answers for all fifteen, because a
 * designer picking `Type` in Dev Mode should see the component that draws it.
 * Exhaustive, 15 of 15 — `check:code-connect` fails if the set grows an option
 * this mapping does not name.
 */
const tag = instance.getEnum("Type", {
  Bar: "BarChart",
  "Bar horizontal": 'BarChart orientation="horizontal"',
  "Bar stacked": 'BarChart variant="stacked"',
  Line: "LineChart",
  Area: "AreaChart",
  Donut: "DonutChart",
  Pie: "PieChart",
  Gauge: "Gauge",
  Funnel: "FunnelChart",
  Heatmap: "Heatmap",
  Scatter: "ScatterChart",
  Sparkline: "Sparkline",
  Progress: "Progress",
  Bullet: "BulletChart",
  Combo: "ComboChart",
});

export default {
  example: figma.code`
    <${tag} title="Applications received against cleared, monthly" data={rows} />
  `,
  imports: ['import { BarChart } from "@mosje/design-system"'],
  id: "chart",
  metadata: { nestable: true },
};
