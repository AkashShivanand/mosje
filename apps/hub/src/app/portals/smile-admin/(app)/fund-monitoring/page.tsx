"use client";

import Link from "next/link";
import { Receipt, Send, Wallet } from "lucide-react";
import { Badge, statusTone } from "@/components/smile-admin/ui/badge";
import { Button } from "@/components/smile-admin/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/smile-admin/ui/card";
import { PageHeader } from "@/components/smile-admin/shell/page-header";
import { Table, TD, TH, THead, TR } from "@/components/smile-admin/ui/table";
import { SANCTION_ORDERS, SCHEMES, type SanctionOrder } from "@/lib/smile-admin/mock-data";
import { ExportMenu } from "@/components/smile-admin/data/export-menu";
import { formatINR } from "@/lib/smile-admin/utils";

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
            <Button variant="outline" size="sm" asChild>
              <Link href="/portals/smile-admin/fund-monitoring/sanction-orders/create">
                <Receipt className="h-3.5 w-3.5" /> Sanction order
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/portals/smile-admin/fund-monitoring/nisd-releases/create">
                <Send className="h-3.5 w-3.5" /> Release order
              </Link>
            </Button>
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
            <CardContent className="flex items-center justify-between p-lg">
              <div>
                <div className="text-label-2 uppercase tracking-wide text-foreground-muted">{c.label}</div>
                <div className="mt-xs text-headline-3 font-bold text-foreground">{formatINR(c.value, true)}</div>
              </div>
              <div className={`grid h-12 w-12 place-items-center rounded-md ${c.tone}`}>
                <Wallet className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle>Recent sanction orders</CardTitle></CardHeader>
        <CardContent>
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
                  <TD><Badge tone={statusTone(o.status)}>{o.status}</Badge></TD>
                  <TD className="text-foreground-muted">{o.date}</TD>
                </TR>
              ))}
            </tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
