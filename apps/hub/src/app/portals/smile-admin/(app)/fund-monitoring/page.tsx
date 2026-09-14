"use client";

import Link from "next/link";
import { statusTone } from "@/lib/smile-admin/status-tone";
import { SmilePageHeader } from "@/components/smile-admin/shell/page-header";
import { SANCTION_ORDERS, SCHEMES, type SanctionOrder } from "@/lib/smile-admin/mock-data";
import { ExportMenu } from "@/components/smile-admin/data/export-menu";
import { formatINR } from "@/lib/smile-admin/utils";
import { Badge, Card, CardBody, CardHeader, CardTitle, DataTable, Icon, buttonClasses, type DataTableColumn } from "@mosje/design-system";

const COLUMNS: DataTableColumn<SanctionOrder & Record<string, unknown>>[] = [
  { key: "id", header: "Order #", sortable: true, className: "font-mono text-body-2" },
  { key: "scheme", header: "Scheme", sortable: true },
  { key: "state", header: "State", sortable: true },
  {
    key: "amount",
    header: "Amount",
    sortable: true,
    className: "text-right tabular-nums",
    // Sorted on the rupee figure — a string sort on "₹1.20 Cr" beats "₹9.00 Cr".
    sortValue: (o) => o.amount,
    render: (o) => formatINR(o.amount, true),
    exportValue: (o) => formatINR(o.amount, true),
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (o) => <Badge status={statusTone(o.status)}>{o.status}</Badge>,
    exportValue: (o) => o.status,
  },
  { key: "date", header: "Date", sortable: true, className: "text-ink-muted" },
];

export default function FundMonitoringPage() {
  const totals = SCHEMES.reduce(
    (acc, s) => ({ budget: acc.budget + s.budget, utilised: acc.utilised + s.utilised }),
    { budget: 0, utilised: 0 }
  );
  return (
    <div className="space-y-lg">
      <SmilePageHeader
        breadcrumbs={[{ label: "Reports & Analytics" }, { label: "Fund Monitoring" }]}
        eyebrow="Reports & analytics"
        title="Fund Monitoring"
        subtitle="Sanction orders, releases and onward disbursements across SMILE schemes."
        actions={
          <div className="flex items-center gap-sm">
            <ExportMenu
              filename="smile-sanction-orders"
              title="Fund Monitoring — Sanction Orders"
              subtitle="Sanction orders issued across SMILE schemes."
              columns={[
                { header: "S.no", accessor: (r: SanctionOrder & { sno: number }) => r.sno },
                { header: "Order #", accessor: "id" },
                { header: "Scheme", accessor: "scheme" },
                { header: "State / UT", accessor: "state" },
                { header: "Amount", accessor: (r) => formatINR(r.amount, true) },
                { header: "Status", accessor: "status" },
                { header: "Sanction Date", accessor: "date" },
              ]}
              rows={SANCTION_ORDERS.map((o, i) => ({ ...o, sno: i + 1 }))}
            />
            <Link href="/portals/smile-admin/fund-monitoring/sanction-orders/create" className={buttonClasses("primary", "outlined", "sm")}>
                <Icon name="receipt_long" size={14} /> Sanction order
              </Link>
            <Link href="/portals/smile-admin/fund-monitoring/nisd-releases/create" className={buttonClasses("primary", "filled", "sm")}>
                <Icon name="send" size={14} /> Release order
              </Link>
          </div>
        }
      />
      <div className="grid gap-lg md:grid-cols-3">
        {[
          { label: "Budget sanctioned", value: totals.budget, tone: "bg-primary-50 text-primary" },
          { label: "Funds utilised",    value: totals.utilised, tone: "bg-success-50 text-success-600" },
          { label: "Balance",           value: totals.budget - totals.utilised, tone: "bg-warning-50 text-warning-600" },
        ].map((c) => (
          <Card key={c.label}>
            <CardBody className="flex items-center justify-between p-lg">
              <div>
                <div className="text-label-3 uppercase text-ink-muted">{c.label}</div>
                <div className="mt-xs text-headline-3 tabular-nums text-ink">{formatINR(c.value, true)}</div>
              </div>
              <div className={`grid h-12 w-12 place-items-center rounded-md ${c.tone}`}>
                <Icon name="account_balance_wallet" />
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle>Recent sanction orders</CardTitle></CardHeader>
        <CardBody>
          <DataTable
            columns={COLUMNS}
            data={SANCTION_ORDERS as Array<SanctionOrder & Record<string, unknown>>}
            total={SANCTION_ORDERS.length}
            showPageSizes={false}
            caption="Recent sanction orders by scheme, state and amount"
            emptyLabel="No sanction order has been issued yet."
          />
        </CardBody>
      </Card>
    </div>
  );
}
