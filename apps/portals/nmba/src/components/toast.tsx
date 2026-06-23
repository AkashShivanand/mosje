// Re-exports the shared design-system Toast so existing imports
// (`@/components/toast`) keep working. One definition lives in
// @mosje/design-system and syncs across every portal.
export { ToastProvider, useToast } from "@mosje/design-system";
export type { ToastVariant } from "@mosje/design-system";
