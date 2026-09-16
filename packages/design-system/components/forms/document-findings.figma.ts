// url=<SAMAVESH>?node-id=58267-821
// source=packages/design-system/components/forms/document-findings.tsx
// component=DocumentFindings
//
// What was read from an uploaded document, compared against what the application says.
//
// PROPERTY COVERAGE
//   State=Populated -> fields
//   State=Empty     -> emptyText, from Empty text
//   Show summary    -> summary, from Summary
//   Show confidence -> confidence (a { value, threshold } the reader supplies)
//   Show reasons    -> reasons
//   Fields          -> deliberatelyOmitted. Two column / One column is decided by the
//                      component's own width in CSS (two columns from 800px of panel
//                      width), not by a prop, so a snippet cannot choose it.
import figma from "figma";

const instance = figma.selectedInstance;
const state = instance.getEnum("State", { Populated: "populated", Empty: "empty" });
const showSummary = instance.getBoolean("Show summary");
const showConfidence = instance.getBoolean("Show confidence");
const showReasons = instance.getBoolean("Show reasons");
const summary = instance.getString("Summary");
const emptyText = instance.getString("Empty text");

export default {
  example: figma.code`<DocumentFindings${state === "populated" ? figma.code`
  fields={fields}` : figma.code`
  emptyText="${emptyText}"`}${showSummary ? figma.code`
  summary="${summary}"` : ""}${showConfidence ? figma.code`
  confidence={confidence}` : ""}${showReasons ? figma.code`
  reasons={reasons}` : ""}
/>`,
  imports: ['import { DocumentFindings } from "@mosje/design-system"'],
  id: "document-findings",
  metadata: { nestable: true },
};
