"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Calendar,
  ClipboardCheck,
  MapPin,
  Pencil,
  ShieldAlert,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Badge } from "@/components/smile-admin/ui/badge";
import { Button } from "@/components/smile-admin/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/smile-admin/ui/card";
import { PageHeader } from "@/components/smile-admin/shell/page-header";
import { SURVEY_LOCATIONS } from "@/lib/smile-admin/mock-data";
import { formatNumber } from "@/lib/smile-admin/utils";

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
            <Button variant="outline" size="sm" asChild>
              <Link href="/portals/smile-admin/surveys">
                <ArrowLeft aria-hidden className="h-3.5 w-3.5" /> Back
              </Link>
            </Button>
            <Button size="sm">
              <Pencil aria-hidden className="h-3.5 w-3.5" /> Edit location
            </Button>
          </div>
        }
      />

      <div className="grid gap-lg lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Location summary</CardTitle>
            {loc.ia ? (
              <Badge tone="success" withDot>
                Assigned
              </Badge>
            ) : (
              <Badge tone="warning" withDot>
                Unassigned
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-md sm:grid-cols-2">
              <Field
                icon={<MapPin aria-hidden className="h-4 w-4" />}
                label="State / District"
                value={`${loc.state} · ${loc.district}`}
              />
              <Field
                icon={<Building2 aria-hidden className="h-4 w-4" />}
                label="Implementing Agency"
                value={
                  loc.ia ?? (
                    <span className="inline-flex items-center gap-xs text-warning-600">
                      <ShieldAlert aria-hidden className="h-3.5 w-3.5" />
                      Unassigned
                    </span>
                  )
                }
              />
              <Field
                icon={<MapPin aria-hidden className="h-4 w-4" />}
                label="Address"
                value={loc.address ?? "—"}
                wide
              />
              <Field
                icon={<MapPin aria-hidden className="h-4 w-4" />}
                label="Pincode"
                value={loc.pincode ?? "—"}
                mono
              />
              <Field
                icon={<Calendar aria-hidden className="h-4 w-4" />}
                label="Last surveyed on"
                value={loc.lastSurveyed}
                mono
              />
              <Field
                icon={<ClipboardCheck aria-hidden className="h-4 w-4" />}
                label="Location type"
                value={loc.type}
              />
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Field activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-stroke-100">
              <li className="flex items-center justify-between py-md">
                <div className="flex items-center gap-md">
                  <span className="grid h-9 w-9 place-items-center rounded-md bg-info-50 text-info-600 ring-1 ring-inset ring-info-100">
                    <Users aria-hidden className="h-[18px] w-[18px]" />
                  </span>
                  <span className="text-body-2 font-medium text-foreground">
                    Surveyors assigned
                  </span>
                </div>
                <span className="text-title-2 font-bold tabular-nums text-foreground">
                  {formatNumber(loc.surveyors)}
                </span>
              </li>
              <li className="flex items-center justify-between py-md">
                <div className="flex items-center gap-md">
                  <span className="grid h-9 w-9 place-items-center rounded-md bg-success-50 text-success-600 ring-1 ring-inset ring-success-100">
                    <ShieldCheck aria-hidden className="h-[18px] w-[18px]" />
                  </span>
                  <span className="text-body-2 font-medium text-foreground">
                    Identified
                  </span>
                </div>
                <span className="text-title-2 font-bold tabular-nums text-foreground">
                  {formatNumber(loc.identified)}
                </span>
              </li>
            </ul>
            <p className="mt-md text-label-2 text-foreground-hint">
              Activity counts roll up from the surveyors mapped to this location.
            </p>
          </CardContent>
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
      <dt className="inline-flex items-center gap-xs text-label-3 font-semibold uppercase tracking-[0.08em] text-foreground-muted">
        <span className="text-foreground-hint">{icon}</span>
        {label}
      </dt>
      <dd
        className={
          "mt-1 text-body-2 text-foreground" + (mono ? " font-mono" : "")
        }
      >
        {value}
      </dd>
    </div>
  );
}
