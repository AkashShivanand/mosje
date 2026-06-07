"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Badge, statusTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shell/page-header";
import { MonthlyPerf } from "@/components/dashboard/charts";
import { PERF_MONTHLY, SCHEMES } from "@/lib/mock-data";
import { formatINR } from "@/lib/utils";

export default function SchemeDetail() {
  const { id } = useParams<{ id: string }>();
  const scheme = SCHEMES.find((s) => s.id === id);
  if (!scheme) notFound();
  const pct = Math.round((scheme.utilised / scheme.budget) * 100);

  return (
    <div className="space-y-lg">
      <PageHeader
        breadcrumbs={[{ label: "Field Operations" }, { label: "Beggary Schemes", href: "/beggary-schemes" }, { label: scheme.name }]}
        title={scheme.name}
        subtitle={`${scheme.type} · ${scheme.states} states · ${scheme.beneficiaries.toLocaleString("en-IN")} beneficiaries`}
        actions={
          <div className="flex items-center gap-sm">
            <Button variant="outline" size="sm" asChild><Link href="/beggary-schemes"><ArrowLeft className="h-3.5 w-3.5" /> Back</Link></Button>
            <Badge tone={statusTone(scheme.status)} size="md">{scheme.status}</Badge>
          </div>
        }
      />
      <div className="grid gap-lg md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Budget</CardTitle></CardHeader>
          <CardContent>
            <div className="text-display-5 font-bold text-foreground">{formatINR(scheme.budget, true)}</div>
            <div className="text-body-3 text-foreground-muted">Sanctioned for FY 2025–26</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Utilised</CardTitle></CardHeader>
          <CardContent>
            <div className="text-display-5 font-bold text-foreground">{formatINR(scheme.utilised, true)}</div>
            <div className="text-body-3 text-foreground-muted">{pct}% of sanctioned budget</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Reach</CardTitle></CardHeader>
          <CardContent>
            <div className="text-display-5 font-bold text-foreground">{scheme.beneficiaries.toLocaleString("en-IN")}</div>
            <div className="text-body-3 text-foreground-muted">Across {scheme.states} states / UTs</div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Monthly momentum</CardTitle></CardHeader>
        <CardContent><MonthlyPerf data={PERF_MONTHLY} /></CardContent>
      </Card>
    </div>
  );
}
