import Link from "next/link";
import { Button, Card, FieldGrid, SectionEyebrow } from "@/components/scw/ui";
import { VOLUNTEER_DETAIL } from "@/lib/scw/mock-data";
import { Icon } from "@mosje/design-system";

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
            href="/portals/scw/admin/volunteers"
            aria-label="Back to Volunteers"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-ink-muted transition-colors hover:bg-black/5"
          >
            <Icon name="arrow_back" size={20} />
          </Link>
          <h1 className="text-headline-1 text-ink">{v.name}</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="danger">Reject</Button>
          <Button variant="outline">Approve</Button>
        </div>
      </div>

      <Card className="space-y-10 p-6 sm:p-8">
        <section>
          <SectionEyebrow>VOLUNTEER DETAILS</SectionEyebrow>
          <FieldGrid items={details} />
        </section>

        <section>
          <SectionEyebrow>ADDRESS &amp; CONTACT</SectionEyebrow>
          <div className="mb-6">
            <div className="text-label-3 uppercase text-ink-hint">FULL ADDRESS</div>
            <div className="mt-1 text-body-2 text-ink">{v.address || "-"}</div>
          </div>
          <FieldGrid items={contact} />
        </section>

        <section>
          <SectionEyebrow>AREAS OF INTEREST</SectionEyebrow>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mb-2 text-label-3 uppercase text-ink-hint">INTERESTS</div>
              <div className="flex flex-wrap gap-2">
                {v.interests.map((interest) => (
                  <span
                    key={interest}
                    className="rounded-full bg-navy/5 px-3 py-1 text-label-2 text-navy"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-right">
              <div className="text-label-3 uppercase text-ink-hint">SUBMITTED ON</div>
              <div className="mt-1 text-body-2 text-ink">{v.submitted}</div>
            </div>
          </div>
        </section>
      </Card>
    </div>
  );
}
