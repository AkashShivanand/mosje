"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { statusTone } from "@/lib/smile-admin/status-tone";
import { PageHeader } from "@/components/smile-admin/shell/page-header";
import { BENEFICIARIES } from "@/lib/smile-admin/mock-data";
import { Badge, Button, Card, CardBody, CardHeader, CardTitle, Icon, buttonClasses } from "@mosje/design-system";

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
        breadcrumbs={[{ label: "Beneficiaries", href: "/portals/smile-admin/persons" }, { label: "Beneficiary List", href: "/portals/smile-admin/persons" }, { label: person.name }]}
        title={person.name}
        subtitle={`Beneficiary ID · ${person.id}`}
        actions={
          <div className="flex items-center gap-sm">
            <Link href="/portals/smile-admin/persons" className={buttonClasses("primary", "outlined", "sm")}><Icon name="arrow_back" size={14} /> Back</Link>
            <Button size="sm">Edit record</Button>
          </div>
        }
      />

      <div className="grid gap-lg lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <Badge status={statusTone(person.status)}>{person.status.replace(/_/g, " ")}</Badge>
          </CardHeader>
          <CardBody className="grid grid-cols-2 gap-lg md:grid-cols-3">
            {[
              { label: "Age",       value: `${person.age} years`, icon: "calendar_today" },
              { label: "Gender",    value: person.gender,         icon: "groups" },
              { label: "Type",      value: person.type,           icon: "verified_user" },
              { label: "Aadhaar",   value: person.aadhaar,        icon: "document_scanner" },
              { label: "State",     value: person.state,          icon: "call" },
              { label: "District",  value: person.district,       icon: "call" },
            ].map((f) => (
              <div key={f.label} className="space-y-xs">
                <div className="text-label-2 uppercase tracking-wide text-ink-muted">{f.label}</div>
                <div className="flex items-center gap-xs text-body-2 font-semibold text-ink"><Icon name={f.icon} size={14} className="text-ink-muted" />{f.value}</div>
              </div>
            ))}
          </CardBody>
        </Card>
        <Card>
          <CardHeader><CardTitle>Implementing Agency</CardTitle></CardHeader>
          <CardBody>
            <div className="text-body-1 font-semibold text-ink">{person.ia ?? "Not yet assigned"}</div>
            <p className="mt-xs text-body-3 text-ink-muted">Field operations partner responsible for the active stage of this beneficiary&apos;s rehabilitation journey.</p>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Rehabilitation Timeline</CardTitle></CardHeader>
        <CardBody>
          <ol className="relative ml-md border-l border-stroke-200">
            {TIMELINE.map((t, i) => (
              <li key={t.stage} className="mb-lg ml-lg">
                <span className="absolute -left-2 grid h-4 w-4 place-items-center rounded-full bg-primary text-white">
                  <span className="text-label-3 font-bold">{i + 1}</span>
                </span>
                <div className="flex flex-wrap items-baseline gap-sm">
                  <div className="text-body-2 font-semibold text-ink">{t.stage}</div>
                  <div className="text-label-2 text-ink-muted">· {t.date}</div>
                </div>
                <div className="text-label-2 text-ink-muted">{t.who}</div>
                <p className="mt-xs text-body-3 text-ink">{t.note}</p>
              </li>
            ))}
          </ol>
        </CardBody>
      </Card>
    </div>
  );
}
