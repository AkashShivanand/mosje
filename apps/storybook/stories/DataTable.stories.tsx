import type { Meta, StoryObj } from "@storybook/react";
import { Badge, Button, DataTable, type DataTableColumn } from "@mosje/design-system";

/**
 * **DataTable** — the one paginated table for the whole estate.
 *
 * NMBA, SCW, SMILE and PM-AJAY each had their own before this existed; the
 * point of the component is that they no longer do. Never fork it per portal —
 * add the prop here instead.
 *
 * The prop worth understanding is **`total` vs `data.length`**. `total` is how
 * many records exist; `data` is what you handed it. Pass the whole set and they
 * match. Pass one page from a server and `total` is the server's count — that
 * is what drives the pager, so getting it wrong is what makes page 4 of 12
 * vanish.
 *
 * `render` is for display only. A column whose cell is a button or a badge must
 * also say how it exports: give it `exportValue`, or mark it `noExport` when it
 * is an action with no value to carry.
 *
 * Use it for records the user pages, scans and exports. For four figures side
 * by side use `KpiRow`; for a comparison a reader should see rather than read,
 * use a chart.
 *
 * Lifecycle: **Stable**.
 */
interface Application extends Record<string, unknown> {
  id: string;
  applicant: string;
  district: string;
  scheme: string;
  amount: string;
  status: "Approved" | "Pending" | "Returned";
}

const ROWS: Application[] = [
  { id: "MH/PUN/2026/004182", applicant: "Sunita Deshmukh", district: "Pune", scheme: "Pre-Matric (SC)", amount: "12,500", status: "Approved" },
  { id: "MH/NAS/2026/004183", applicant: "Aarav Pawar", district: "Nashik", scheme: "Post-Matric (SC)", amount: "38,000", status: "Pending" },
  { id: "MH/NAG/2026/004184", applicant: "Rehana Shaikh", district: "Nagpur", scheme: "Pre-Matric (SC)", amount: "12,500", status: "Returned" },
  { id: "MH/KOL/2026/004185", applicant: "Ganesh Jadhav", district: "Kolhapur", scheme: "Post-Matric (SC)", amount: "41,200", status: "Approved" },
  { id: "MH/SOL/2026/004186", applicant: "Vaishali More", district: "Solapur", scheme: "Pre-Matric (SC)", amount: "12,500", status: "Pending" },
  { id: "MH/AUR/2026/004187", applicant: "Imran Qureshi", district: "Chhatrapati Sambhajinagar", scheme: "Post-Matric (SC)", amount: "36,400", status: "Approved" },
  { id: "MH/THA/2026/004188", applicant: "Priya Bhosale", district: "Thane", scheme: "Pre-Matric (SC)", amount: "12,500", status: "Approved" },
  { id: "MH/AMR/2026/004189", applicant: "Kiran Wankhede", district: "Amravati", scheme: "Post-Matric (SC)", amount: "39,900", status: "Pending" },
  { id: "MH/RAI/2026/004190", applicant: "Sadhana Patil", district: "Raigad", scheme: "Pre-Matric (SC)", amount: "12,500", status: "Returned" },
  { id: "MH/SAT/2026/004191", applicant: "Mahesh Salunkhe", district: "Satara", scheme: "Post-Matric (SC)", amount: "37,600", status: "Approved" },
  { id: "MH/JAL/2026/004192", applicant: "Nasreen Khan", district: "Jalgaon", scheme: "Pre-Matric (SC)", amount: "12,500", status: "Pending" },
  { id: "MH/LAT/2026/004193", applicant: "Dattatray Kamble", district: "Latur", scheme: "Post-Matric (SC)", amount: "40,100", status: "Approved" },
];

const COLUMNS: DataTableColumn<Application>[] = [
  { key: "id", header: "Application ID" },
  { key: "applicant", header: "Applicant" },
  { key: "district", header: "District" },
  { key: "scheme", header: "Scheme" },
  { key: "amount", header: "Amount (₹)" },
  {
    key: "status",
    header: "Status",
    render: (row) => (
      <Badge
        status={
          row.status === "Approved" ? "success" : row.status === "Returned" ? "error" : "warning"
        }
      >
        {row.status}
      </Badge>
    ),
    // The cell is a Badge, so say what the export should carry instead.
    exportValue: (row) => row.status,
  },
  {
    key: "actions",
    header: "",
    render: () => (
      <Button size="sm" appearance="text">
        Review
      </Button>
    ),
    // An action column has no value worth exporting.
    noExport: true,
  },
];

const meta = {
  title: "Components/Data display/DataTable",
  component: DataTable,
  args: {
    columns: COLUMNS,
    data: ROWS,
    total: ROWS.length,
    pageSizes: [10, 50, 100],
    caption: "Scholarship applications awaiting district review",
    emptyLabel: "No records found.",
  },
  argTypes: {
    total: { control: { type: "number", min: 0 } },
    caption: { control: "text" },
    emptyLabel: { control: "text" },
    columns: { control: false },
    data: { control: false },
    pageSizes: { control: false },
  },
} satisfies Meta<typeof DataTable<Application>>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Twelve records at ten per page — change the page size to see the pager move. */
export const Playground: Story = {};

/**
 * Empty. `emptyLabel` should say *why* there is nothing, not just that there
 * is nothing — "No records found" leaves the user guessing whether the filter
 * or the data is at fault.
 */
export const Empty: Story = {
  args: {
    data: [],
    total: 0,
    emptyLabel: "No applications from Nashik are pending approval in 2026–27.",
  },
};

/** A single page — the pager stands down when there is nowhere to go. */
export const SinglePage: Story = {
  args: { data: ROWS.slice(0, 4), total: 4 },
};

/**
 * Server-side paging: `data` holds one page, `total` is the server's count.
 * The pager offers all 128 records even though only ten were sent.
 */
export const ServerPaged: Story = {
  args: { data: ROWS.slice(0, 10), total: 128 },
};

/** Fewer columns, and a page-size list suited to a dense review queue. */
export const CompactColumns: Story = {
  args: {
    columns: COLUMNS.slice(0, 4),
    pageSizes: [5, 10, 25],
    caption: "Applications by district",
  },
};
