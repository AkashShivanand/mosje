"use client";

import Link from "next/link";
import { statusTone } from "@/lib/smile-admin/status-tone";
import { PageHeader } from "@/components/smile-admin/shell/page-header";
import { Table, TD, TH, THead, TR } from "@/components/smile-admin/table";
import { SANCTION_ORDERS, SCHEMES, type SanctionOrder } from "@/lib/smile-admin/mock-data";
import { ExportMenu } from "@/components/smile-admin/data/export-menu";
import { formatINR } from "@/lib/smile-admin/utils";
import { Badge, Card, CardBody, CardHeader, CardTitle, Icon, buttonClasses } from "@mosje/design-system";

export default function FundMonitoringPage() {
  const totals = SCHEMES.reduce(
    (acc, s) => ({ budget: acc.budget + s.budget, utilised: acc.utilised + s.utilised }),
    { budget: 0, utilised: 0 }
  );
  return (
    <div className="space-y-lg">
      <PageHeader
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
                <div className="text-label-2 uppercase tracking-wide text-ink-muted">{c.label}</div>
                <div className="mt-xs text-headline-3 font-bold text-ink">{formatINR(c.value, true)}</div>
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
          <Table>
            <THead>
              <tr>
                <TH>Order #</TH>
                <TH>Scheme</TH>
                <TH>State</TH>
                <TH className="text-right">Amount</TH>
                <TH>Status</TH>
                <TH>Date</TH>
              </tr>
            </THead>
            <tbody>
              {SANCTION_ORDERS.map((o) => (
                <TR key={o.id}>
                  <TD className="font-mono text-body-3">{o.id}</TD>
                  <TD>{o.scheme}</TD>
                  <TD>{o.state}</TD>
                  <TD className="text-right tabular-nums">{formatINR(o.amount, true)}</TD>
                  <TD><Badge status={statusTone(o.status)}>{o.status}</Badge></TD>
                  <TD className="text-ink-muted">{o.date}</TD>
                </TR>
              ))}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
}
