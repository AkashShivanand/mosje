// Re-exports the shared design-system DataTable so existing imports
// (`@/components/nmba/data-table`) keep working. One definition lives in
// @mosje/design-system and syncs across every portal.
export { DataTable } from "@mosje/design-system";
export type { DataTableColumn as ColumnDef, DataTableProps } from "@mosje/design-system";
