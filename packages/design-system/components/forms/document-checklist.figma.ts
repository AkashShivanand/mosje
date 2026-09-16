// url=<SAMAVESH>?node-id=58283-1076
// source=packages/design-system/components/forms/document-checklist.tsx
// component=DocumentChecklist
//
// The upload step's checklist: progress, filters, one drop zone, and the groups of
// document rows. Groups are the application's own data, so they are passed as
// `groups` rather than rebuilt from the drawn instances.
//
// PROPERTY COVERAGE
//   Body=Populated           -> children (the groups)
//   Body=Loading             -> loading — the component draws its own skeleton, role="status"
//   Body=Empty               -> no children; the component's default emptyText is shown
//   Body=Filtered to nothing -> activeFilter set to a filter that matches no rows
import figma from "figma";

const instance = figma.selectedInstance;
const body = instance.getEnum("Body", {
  Populated: "populated",
  Loading: "loading",
  Empty: "empty",
  "Filtered to nothing": "filtered",
});

export default {
  example: figma.code`<DocumentChecklist
  required={required}
  ready={ready}
  filters={filters}
  activeFilter={activeFilter}
  onFilterChange={setActiveFilter}
  onFiles={handleFiles}${body === "loading" ? figma.code`
  loading` : ""}
>${body === "populated" || body === "filtered" ? figma.code`
  {groups}` : ""}
</DocumentChecklist>`,
  imports: ['import { DocumentChecklist } from "@mosje/design-system"'],
  id: "document-checklist",
  metadata: { nestable: false },
};
