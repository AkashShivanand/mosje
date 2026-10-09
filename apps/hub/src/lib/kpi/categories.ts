import type { KpiCategory } from "./types.ts";

/**
 * Section headings for the normalised KPI categories, in reading order.
 *
 * The left column is what the proforma's tabs actually wrote; the heading is ours,
 * Title Case, shortened to what a section heading on a Government page can carry.
 */
export const KPI_CATEGORIES: { id: KpiCategory; title: string; proforma: string[] }[] = [
  { id: "coverage", title: "Coverage and Outreach", proforma: ["Beneficiary Coverage & Outreach"] },
  { id: "geography", title: "Where the Scheme Works", proforma: ["Geographic / State-UT Coverage"] },
  { id: "funds", title: "Funds", proforma: ["Financial / Fund Utilisation", "Financial & Budget Utilisation (Division-wise)"] },
  { id: "outcomes", title: "Outcomes", proforma: ["Outcome & Impact (e.g. GER, Enrolment)"] },
  { id: "trends", title: "Trends", proforma: ["Year-on-Year Trend"] },
  { id: "digital", title: "Digital Delivery", proforma: ["DBT & Digital Delivery"] },
  { id: "workflow", title: "Applications and Pendency", proforma: ["Application / Case Processing", "Application / Workflow Processing"] },
  { id: "turnaround", title: "Turnaround Time", proforma: ["Turnaround Time (TAT) & SLA Compliance"] },
  { id: "deficiency", title: "Deficiencies and Clarifications", proforma: ["Grievance / Deficiency Management"] },
  { id: "system", title: "System Health", proforma: ["System & Integration Health (PFMS/Aadhaar/DBT Bharat)"] },
  { id: "monitoring", title: "State and District Monitoring", proforma: ["State/UT Implementation Monitoring"] },
  { id: "onboarding", title: "Implementing Agencies", proforma: ["NGO / Institution Onboarding & Verification"] },
];

export function categoryTitle(id: KpiCategory): string {
  return KPI_CATEGORIES.find((c) => c.id === id)?.title ?? id;
}
