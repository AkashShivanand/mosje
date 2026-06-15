import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button, Card, FieldGrid, SectionTitle } from "@/components/ui";
import { VOLUNTEER_DETAIL } from "@/lib/mock-data";

export default async function VolunteerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await params;

  const v = VOLUNTEER_DETAIL;

  const details: [string, string][] = [
    ["FULL NAME", v.name],
    ["VOLUNTEER TYPE", v.type],
    ["GENDER", v.gender],
    ["DATE OF BIRTH", v.dob],
    ["STATUS", v.status],
  ];

  const contact: [string, string][] = [
    ["STATE", v.state],
    ["DISTRICT", v.district],
    ["PINCODE", v.pincode],
    ["MOBILE NUMBER", v.mobile],
    ["EMAIL", v.email],
  ];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/volunteers"
            aria-label="Back to Volunteers"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-ink-muted transition-colors hover:bg-black/5"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-ink">{v.name}</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="danger">Reject</Button>
          <Button variant="outline">Approve</Button>
        </div>
      </div>

      <Card className="space-y-10 p-6 sm:p-8">
        <section>
          <SectionTitle>VOLUNTEER DETAILS</SectionTitle>
          <FieldGrid items={details} />
        </section>

        <section>
          <SectionTitle>ADDRESS &amp; CONTACT</SectionTitle>
          <div className="mb-6">
            <div className="text-xs text-ink-hint">FULL ADDRESS</div>
            <div className="mt-1 text-sm text-ink">{v.address || "-"}</div>
          </div>
          <FieldGrid items={contact} />
        </section>

        <section>
          <SectionTitle>AREAS OF INTEREST</SectionTitle>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mb-2 text-xs text-ink-hint">INTERESTS</div>
              <div className="flex flex-wrap gap-2">
                {v.interests.map((interest) => (
                  <span
                    key={interest}
                    className="rounded-full bg-navy/5 px-3 py-1 text-xs text-navy"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-ink-hint">SUBMITTED ON</div>
              <div className="mt-1 text-sm text-ink">{v.submitted}</div>
            </div>
          </div>
        </section>
      </Card>
    </div>
  );
}
