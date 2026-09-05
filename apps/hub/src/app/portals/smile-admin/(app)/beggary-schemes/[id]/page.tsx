"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { statusTone } from "@/lib/smile-admin/status-tone";
import { PageHeader } from "@/components/smile-admin/shell/page-header";
import { MonthlyPerf } from "@/components/smile-admin/dashboard/charts";
import { PERF_MONTHLY, SCHEMES } from "@/lib/smile-admin/mock-data";
import { formatINR } from "@/lib/smile-admin/utils";
import { Badge, Card, CardBody, CardHeader, CardTitle, Icon, buttonClasses } from "@mosje/design-system";

export default function SchemeDetail() {
  const { id } = useParams<{ id: string }>();
  const scheme = SCHEMES.find((s) => s.id === id);
  if (!scheme) notFound();
  const pct = Math.round((scheme.utilised / scheme.budget) * 100);

  return (
    <div className="space-y-lg">
      <PageHeader
        breadcrumbs={[{ label: "Field Operations" }, { label: "Beggary Schemes", href: "/portals/smile-admin/beggary-schemes" }, { label: scheme.name }]}
        title={scheme.name}
        subtitle={`${scheme.type} · ${scheme.states} states · ${scheme.beneficiaries.toLocaleString("en-IN")} beneficiaries`}
        actions={
          <div className="flex items-center gap-sm">
            <Link href="/portals/smile-admin/beggary-schemes" className={buttonClasses("primary", "outlined", "sm")}><Icon name="arrow_back" size={14} /> Back</Link>
            <Badge status={statusTone(scheme.status)} size="lg">{scheme.status}</Badge>
          </div>
        }
      />
      <div className="grid gap-lg md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Budget</CardTitle></CardHeader>
          <CardBody>
            <div className="text-headline-2 tabular-nums text-ink">{formatINR(scheme.budget, true)}</div>
            <div className="text-body-3 text-ink-muted">Sanctioned for FY 2025–26</div>
          </CardBody>
        </Card>
        <Card>
          <CardHeader><CardTitle>Utilised</CardTitle></CardHeader>
          <CardBody>
            <div className="text-headline-2 tabular-nums text-ink">{formatINR(scheme.utilised, true)}</div>
            <div className="text-body-3 text-ink-muted">{pct}% of sanctioned budget</div>
          </CardBody>
        </Card>
        <Card>
          <CardHeader><CardTitle>Reach</CardTitle></CardHeader>
          <CardBody>
            <div className="text-headline-2 tabular-nums text-ink">{scheme.beneficiaries.toLocaleString("en-IN")}</div>
            <div className="text-body-3 text-ink-muted">Across {scheme.states} states / UTs</div>
          </CardBody>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Monthly momentum</CardTitle></CardHeader>
        <CardBody><MonthlyPerf data={PERF_MONTHLY} /></CardBody>
      </Card>
    </div>
  );
}
