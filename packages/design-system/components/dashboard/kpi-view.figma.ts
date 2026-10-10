// url=<SAMAVESH>?node-id=58898-2324
// source=packages/design-system/components/dashboard/kpi-view.tsx
// component=KpiView
import figma from "figma";

const instance = figma.selectedInstance;

/**
 * Kind is not a prop. In code the shape comes from the READING — `reading.value.kind` and,
 * for a breakdown, its chart and how many parts it has — so the template emits the reading
 * that draws each kind rather than a switch the component does not have.
 */
const reading = instance.getEnum("Kind", {
  Ring: '{ kind: "breakdown", chart: "donut", items: genderSplit }',
  "Two-part split": '{ kind: "breakdown", chart: "donut", items: [male, female] }',
  "Ranked bars": '{ kind: "breakdown", chart: "bar", items: callsByPurpose }',
  Line: '{ kind: "series", chart: "line", labels: months, series: [identified] }',
  "Bar series": '{ kind: "series", chart: "bar", labels: years, series: [expenditure] }',
  Funnel: '{ kind: "stages", stages: [identified, mobilised, rehabilitated] }',
  "State map": '{ kind: "areas", total, rows: byState }',
  Table: '{ kind: "table", columns, rows, againstMinimum }',
});

export default {
  example: figma.code`
    <KpiView
      kpi={kpi}
      reading={{ value: ${reading}, origin: "live", source: "Senior Citizens Welfare portal", asOn: "09.10.2026" }}
      areasAreStates
      quiet
    />
  `,
  imports: ['import { KpiView } from "@mosje/design-system"'],
  id: "kpi-view",
  metadata: { nestable: false },
};
