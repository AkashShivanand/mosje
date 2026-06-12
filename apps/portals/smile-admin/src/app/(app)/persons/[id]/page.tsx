"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ArrowLeft, Calendar, ScanLine, Phone, ShieldCheck, Users2 } from "lucide-react";
import { Badge, statusTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shell/page-header";
import { BENEFICIARIES } from "@/lib/mock-data";

const TIMELINE = [
  { stage: "Identified",      date: "2026-03-12", who: "Surveyor · Ravi Menon",   note: "Initial sighting at Dadar Station approach." },
  { stage: "Under Mobilization", date: "2026-03-18", who: "IA · Mumbai Rehab Foundation", note: "Outreach team engaged subject; consent recorded." },
  { stage: "Mobilized",       date: "2026-03-24", who: "IA · Mumbai Rehab Foundation", note: "Subject opted for shelter at Asha Niketan Mumbai." },
  { stage: "Shelter Assigned",date: "2026-03-26", who: "Shelter Manager · Pranav Joshi", note: "Bed 24 · Wing B." },
  { stage: "Rehabilitated",   date: "2026-04-22", who: "Reskilling Programme",     note: "Completed tailoring module · placed with Saraswati Garments." },
];

export default function PersonDetail() {
  const { id } = useParams<{ id: string }>();
  const person = BENEFICIARIES.find((b) => b.id === id);
  if (!person) notFound();

  return (
    <div className="space-y-lg">
      <PageHeader
        breadcrumbs={[{ label: "Beneficiaries", href: "/persons" }, { label: "Beneficiary List", href: "/persons" }, { label: person.name }]}
        title={person.name}
        subtitle={`Beneficiary ID · ${person.id}`}
        actions={
          <div className="flex items-center gap-sm">
            <Button variant="outline" size="sm" asChild><Link href="/persons"><ArrowLeft className="h-3.5 w-3.5" /> Back</Link></Button>
            <Button size="sm" variant="primary">Edit record</Button>
          </div>
        }
      />

      <div className="grid gap-lg lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <Badge tone={statusTone(person.status)}>{person.status.replace(/_/g, " ")}</Badge>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-lg md:grid-cols-3">
            {[
              { label: "Age",       value: `${person.age} years`, icon: Calendar },
              { label: "Gender",    value: person.gender,         icon: Users2 },
              { label: "Type",      value: person.type,           icon: ShieldCheck },
              { label: "Aadhaar",   value: person.aadhaar,        icon: ScanLine },
              { label: "State",     value: person.state,          icon: Phone },
              { label: "District",  value: person.district,       icon: Phone },
            ].map((f) => (
              <div key={f.label} className="space-y-xs">
                <div className="text-label-2 uppercase tracking-wide text-foreground-muted">{f.label}</div>
                <div className="flex items-center gap-xs text-body-2 font-semibold text-foreground"><f.icon className="h-3.5 w-3.5 text-foreground-muted" />{f.value}</div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Implementing Agency</CardTitle></CardHeader>
          <CardContent>
            <div className="text-body-1 font-semibold text-foreground">{person.ia ?? "Not yet assigned"}</div>
            <p className="mt-xs text-body-3 text-foreground-muted">Field operations partner responsible for the active stage of this beneficiary&apos;s rehabilitation journey.</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Rehabilitation Timeline</CardTitle></CardHeader>
        <CardContent>
          <ol className="relative ml-md border-l border-stroke-200">
            {TIMELINE.map((t, i) => (
              <li key={t.stage} className="mb-lg ml-lg">
                <span className="absolute -left-2 grid h-4 w-4 place-items-center rounded-full bg-primary text-white">
                  <span className="text-label-3 font-bold">{i + 1}</span>
                </span>
                <div className="flex flex-wrap items-baseline gap-sm">
                  <div className="text-body-2 font-semibold text-foreground">{t.stage}</div>
                  <div className="text-label-2 text-foreground-muted">· {t.date}</div>
                </div>
                <div className="text-label-2 text-foreground-muted">{t.who}</div>
                <p className="mt-xs text-body-3 text-foreground">{t.note}</p>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
