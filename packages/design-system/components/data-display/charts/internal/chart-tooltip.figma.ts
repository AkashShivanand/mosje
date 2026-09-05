// url=<SAMAVESH>?node-id=57420-16041
// source=packages/design-system/components/data-display/charts/internal/tooltip.tsx
// component=ChartTooltip
import figma from "figma";

/**
 * The tooltip carries no Figma properties: its title row is the category and
 * each row a series. In code it is driven by `useChartTooltip`, whose
 * controller every chart passes to the frame — it is never placed by hand.
 */
export default {
  example: figma.code`
    const { canvasRef, tip, show, hide } = useChartTooltip();
    <ChartFrame canvasRef={canvasRef} overlay={<ChartTooltip tip={tip} />} onDismiss={hide} …>
  `,
  imports: ['import { ChartTooltip, useChartTooltip } from "@mosje/design-system"'],
  id: "chart-tooltip",
  metadata: { nestable: false },
};
