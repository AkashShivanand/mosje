"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { PageHeader } from "@/components/smile-admin/shell/page-header";
import { SURVEY_LOCATIONS } from "@/lib/smile-admin/mock-data";
import { formatNumber } from "@/lib/smile-admin/utils";
import { Badge, Button, Card, CardBody, CardHeader, CardTitle, Icon, buttonClasses } from "@mosje/design-system";

export default function SurveyLocationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const loc = SURVEY_LOCATIONS.find((s) => s.id === id);
  if (!loc) notFound();

  return (
    <div className="space-y-lg">
      <PageHeader
        breadcrumbs={[
          { label: "Survey Operations" },
          { label: "Survey Locations", href: "/portals/smile-admin/surveys" },
          { label: loc.name },
        ]}
        eyebrow={loc.type}
        title={loc.name}
        subtitle={`Location ID · ${loc.id}`}
        actions={
          <div className="flex items-center gap-sm">
            <Link href="/portals/smile-admin/surveys" className={buttonClasses("primary", "outlined", "sm")}>
                <Icon name="arrow_back" size={14} aria-hidden /> Back
              </Link>
            <Button size="sm">
              <Icon name="edit" size={14} aria-hidden /> Edit location
            </Button>
          </div>
        }
      />

      <div className="grid gap-lg lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Location summary</CardTitle>
            {loc.ia ? (
              <Badge status="success" dot>
                Assigned
              </Badge>
            ) : (
              <Badge status="warning" dot>
                Unassigned
              </Badge>
            )}
          </CardHeader>
          <CardBody>
            <dl className="grid grid-cols-1 gap-md sm:grid-cols-2">
              <Field
                icon={<Icon name="location_on" size={16} aria-hidden />}
                label="State / District"
                value={`${loc.state} · ${loc.district}`}
              />
              <Field
                icon={<Icon name="apartment" size={16} aria-hidden />}
                label="Implementing Agency"
                value={
                  loc.ia ?? (
                    <span className="inline-flex items-center gap-xs text-warning-600">
                      <Icon name="gpp_maybe" size={14} aria-hidden />
                      Unassigned
                    </span>
                  )
                }
              />
              <Field
                icon={<Icon name="location_on" size={16} aria-hidden />}
                label="Address"
                value={loc.address ?? "—"}
                wide
              />
              <Field
                icon={<Icon name="location_on" size={16} aria-hidden />}
                label="Pincode"
                value={loc.pincode ?? "—"}
                mono
              />
              <Field
                icon={<Icon name="calendar_today" size={16} aria-hidden />}
                label="Last surveyed on"
                value={loc.lastSurveyed}
                mono
              />
              <Field
                icon={<Icon name="assignment_turned_in" size={16} aria-hidden />}
                label="Location type"
                value={loc.type}
              />
            </dl>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Field activity</CardTitle>
          </CardHeader>
          <CardBody>
            <ul className="divide-y divide-stroke-100">
              <li className="flex items-center justify-between py-md">
                <div className="flex items-center gap-md">
                  <span className="grid h-9 w-9 place-items-center rounded-md bg-info-50 text-info-600 ring-1 ring-inset ring-info-100">
                    <Icon name="group" aria-hidden className="h-[18px] w-[18px]" />
                  </span>
                  <span className="text-body-2 font-medium text-ink">
                    Surveyors assigned
                  </span>
                </div>
                <span className="text-title-2 tabular-nums text-ink">
                  {formatNumber(loc.surveyors)}
                </span>
              </li>
              <li className="flex items-center justify-between py-md">
                <div className="flex items-center gap-md">
                  <span className="grid h-9 w-9 place-items-center rounded-md bg-success-50 text-success-600 ring-1 ring-inset ring-success-100">
                    <Icon name="verified_user" aria-hidden className="h-[18px] w-[18px]" />
                  </span>
                  <span className="text-body-2 font-medium text-ink">
                    Identified
                  </span>
                </div>
                <span className="text-title-2 tabular-nums text-ink">
                  {formatNumber(loc.identified)}
                </span>
              </li>
            </ul>
            <p className="mt-md text-label-2 text-ink-hint">
              Activity counts roll up from the surveyors mapped to this location.
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function Field({
  icon,
  label,
  value,
  wide,
  mono,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  wide?: boolean;
  mono?: boolean;
}) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <dt className="inline-flex items-center gap-xs text-label-3 uppercase text-ink-muted">
        <span className="text-ink-hint">{icon}</span>
        {label}
      </dt>
      <dd
        className={
          "mt-1 text-body-2 text-ink" + (mono ? " font-mono" : "")
        }
      >
        {value}
      </dd>
    </div>
  );
}
