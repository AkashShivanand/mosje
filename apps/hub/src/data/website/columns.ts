import type { DataTableColumn } from "@/components/website/ui/data-table";

/** T2 — document/listing table columns (Title, Organisation, Year, Size, Date, Action). */
export const documentColumns: DataTableColumn[] = [
  { key: "title", label: "Title", sortable: true, align: "left", className: "min-w-[260px] font-medium text-ink" },
  { key: "org", label: "Organisation", sortable: true, align: "center" },
  { key: "year", label: "Year", sortable: true, align: "center" },
  { key: "size", label: "Size", align: "right" },
  { key: "date", label: "Publish Date", sortable: true, align: "center" },
  { key: "action", label: "Action", align: "center", type: "link", hrefKey: "href", linkLabel: "View" },
];

/** T2 — shared document-listing columns (Title, Published, Action) for the 10 document pages. */
export const documentListColumns: DataTableColumn[] = [
  { key: "title", label: "Title", sortable: true, align: "left", className: "min-w-[360px] font-medium text-ink" },
  { key: "date", label: "Published", sortable: true, align: "center", className: "min-w-[120px]" },
  { key: "action", label: "Action", align: "center", type: "link", hrefKey: "href", linkLabel: "View" },
];

/** T2 — simpler listing (Title, Date, Action) for notices/circulars/policies. */
export const noticeColumns: DataTableColumn[] = [
  { key: "title", label: "Title", sortable: true, align: "left", className: "min-w-[320px] font-medium text-ink" },
  { key: "date", label: "Published", sortable: true, align: "center" },
  { key: "action", label: "Action", align: "center", type: "link", hrefKey: "href", linkLabel: "View" },
];

/** T3 — directory/contacts table columns. */
export const directoryColumns: DataTableColumn[] = [
  { key: "sno", label: "S.No.", align: "center" },
  { key: "name", label: "Name", sortable: true, align: "left", className: "min-w-[180px] font-medium text-ink" },
  { key: "designation", label: "Designation", sortable: true, align: "left", className: "min-w-[200px]" },
  { key: "intercom", label: "Intercom", align: "center" },
  { key: "phone", label: "Contact Details", align: "left", className: "min-w-[160px]" },
  { key: "email", label: "Email", align: "left" },
  { key: "address", label: "Address", align: "left", className: "min-w-[200px]" },
];

/** T3 — grant document listings (Title, Published, Size, Action). */
export const grantDocumentColumns: DataTableColumn[] = [
  { key: "sno", label: "S.No.", align: "center" },
  { key: "title", label: "Title", sortable: true, align: "left", className: "min-w-[380px] font-medium text-ink" },
  { key: "date", label: "Published", sortable: true, align: "center", className: "min-w-[120px]" },
  { key: "fileSize", label: "Size", align: "right" },
  { key: "action", label: "Action", align: "center", type: "link", hrefKey: "fileUrl", linkLabel: "View" },
];

/**
 * T3 — the NGO enforcement register (Name, Action Taken).
 *
 * No Action column: these are register entries, not documents. The Ministry publishes the
 * wording, not a file, and inventing a "View" link with nothing behind it would be worse
 * than showing none.
 */
export const ngoEnforcementColumns: DataTableColumn[] = [
  { key: "sno", label: "S.No.", align: "center" },
  { key: "name", label: "Name of the NGO", sortable: true, align: "left", className: "min-w-[320px] font-medium text-ink" },
  { key: "action", label: "Action Taken by the Ministry", align: "left", className: "min-w-[280px]" },
];
