// url=<SAMAVESH>?node-id=57418-15985
// source=packages/design-system/components/dashboard/chart-card.tsx
// component=ChartCard
import figma from "figma";

const instance = figma.selectedInstance;

/**
 * Figma `State` → `loading` or `state`. Populated is the absence of both.
 * The Figma set draws six of the eight states the code carries — Restricted
 * and Offline share the Empty layout with different words — and the mapping is
 * exhaustive over what is drawn.
 */
const state = instance.getEnum("State", {
  Populated: "",
  Loading: "loading",
  Empty: "empty",
  "No results": "no-results",
  Error: "error",
  "Not published": "not-published",
});

export default {
  example: figma.code`
    <ChartCard
      title="Applications Cleared"
      subtitle="Monthly, FY 2025–26"
      ${state === "loading" ? "loading" : ""}
      ${state && state !== "loading" ? figma.code`state="${state}"` : ""}
      ${state === "error" || state === "no-results" ? figma.code`onRetry={refetch}` : ""}
      ${state === "no-results" ? figma.code`filterLabel="state filter"` : ""}
      ${state ? "" : figma.code`exportable provenance={{ source: "Scheme MIS", asOf: "2026-08-27" }}`}
    >
      <BarChart title="Applications cleared, monthly" data={rows} />
    </ChartCard>
  `,
  imports: ['import { ChartCard, BarChart } from "@mosje/design-system"'],
  id: "chart-card",
  metadata: { nestable: true },
};
