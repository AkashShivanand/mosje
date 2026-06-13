import type { DataTableColumn } from "@/components/ui/data-table";

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
  { key: "contact", label: "Contact Details", align: "left", className: "min-w-[160px]" },
  { key: "email", label: "Email", align: "left" },
  { key: "address", label: "Address", align: "left", className: "min-w-[200px]" },
];
