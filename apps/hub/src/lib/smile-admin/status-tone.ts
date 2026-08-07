import type { BadgeStatus } from "@mosje/design-system";

/**
 * Maps a SMILE domain status string onto a DS `<Badge status>` value.
 *
 * This is portal domain logic, not design-system logic — the vocabulary
 * ("mobilised", "rehabilitated", "under audit") is specific to SMILE's
 * beneficiary and scheme workflows, so it stays in the app. It lived on the
 * old shadcn Badge component; it moved here when that component was retired.
 *
 * Matching is substring-based and order-sensitive: the first rule that matches
 * wins, so the more specific statuses are tested before the generic ones.
 */
export function statusTone(status: string): BadgeStatus {
  const k = status.toLowerCase();
  if (
    k.includes("rehab") ||
    k.includes("active") ||
    k.includes("approved") ||
    k.includes("success") ||
    k.includes("sent")
  )
    return "success";
  if (
    k.includes("identif") ||
    k.includes("draft") ||
    k.includes("pilot") ||
    k.includes("invited") ||
    k.includes("scheduled")
  )
    return "info";
  if (k.includes("mobiliz") || k.includes("mobilised") || k.includes("shelter"))
    return "primary";
  if (
    k.includes("under") ||
    k.includes("audit") ||
    k.includes("pending") ||
    k.includes("medium")
  )
    return "warning";
  if (
    k.includes("rejected") ||
    k.includes("failure") ||
    k.includes("suspended") ||
    k.includes("closed") ||
    k.includes("high")
  )
    return "danger";
  return "neutral";
}
