"use client";

import { Badge } from "@mosje/design-system";
import type { RegistrationProgress } from "@/lib/treatment-centre/types";

// FormSection / FormCard live in the design system (one definition, all portals).
// Re-exported so `@/components/treatment-centre/tc-form` imports stay stable.
export { FormSection, FormCard } from "@mosje/design-system";

const PROGRESS_STATUS = {
  Completed: "success",
  "In Progress": "warning",
  Pending: "neutral",
} as const;

/** Domain mapping of registration progress → DS Badge status (stays app-local). */
export function ProgressBadge({ value }: { value: RegistrationProgress }) {
  return <Badge status={PROGRESS_STATUS[value]}>{value}</Badge>;
}
