"use client";

import * as React from "react";
import Link from "next/link";
import { Card, StatusPill, Button } from "@/components/tg/ui";
import { useTg } from "@/lib/tg/store/store";
import { DEMO_CITIZEN } from "@/lib/tg/store/seed";
import { Icon } from "@mosje/design-system";

const WELFARE = [
  { icon: "school", title: "Scholarships", desc: "National scholarships for transgender students.", cta: "Apply Now" },
  { icon: "build", title: "Skill Training", desc: "PM-DAKSH skilling & livelihood courses.", cta: "Browse Courses" },
  { icon: "home", title: "Garima Greh", desc: "Shelter homes providing safe accommodation.", cta: "Find Homes" },
  { icon: "monitor_heart", title: "Medical Support", desc: "Health & gender-affirming care assistance.", cta: "Register" },
];

export default function CitizenDashboardPage() {
  const { state, hydrated, withdrawApplication, transition } = useTg();
  if (!hydrated) return null;

  const mine = state.applications.filter((a) => a.applicant.email === DEMO_CITIZEN.email);
  const certificate = mine.find((a) => a.stage === "APPROVED_SIGNED");
  const inProgress = mine.filter((a) => !["APPROVED_SIGNED", "REJECTED", "WITHDRAWN"].includes(a.stage));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-headline-1 text-ink">Welcome, {DEMO_CITIZEN.chosenName}</h1>
        <p className="mt-1 text-body-2 text-ink-muted">Your Transgender Certificate &amp; Identity dashboard.</p>
      </div>

      {certificate ? (
        <Card className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-approve-bg text-approve-fg">
              <Icon name="badge" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-title-1 text-ink">Certificate Active</span>
                <StatusPill status="APPROVED_SIGNED" />
              </div>
              <p className="text-body-2 text-ink-muted">
                {certificate.certificateNo} • Valid Lifetime
              </p>
            </div>
          </div>
          <Link href="/portals/tg/citizen/certificate">
            <Button>View Details <Icon name="arrow_forward" size={16} /></Button>
          </Link>
        </Card>
      ) : (
        <Card className="flex flex-col items-start gap-3 p-6">
          <div>
            <h2 className="text-title-1 text-ink">No certificate yet</h2>
            <p className="text-body-2 text-ink-muted">Apply for your Transgender Certificate of Identity to get started.</p>
          </div>
          <Link href="/portals/tg/citizen/apply">
            <Button><Icon name="note_add" size={16} /> Start Application</Button>
          </Link>
        </Card>
      )}

      {inProgress.length > 0 && (
        <div>
          <h2 className="mb-3 text-label-3 uppercase text-ink-hint">Applications in Progress</h2>
          <div className="space-y-3">
            {inProgress.map((a) => (
              <Card key={a.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <div className="font-mono text-body-2 font-semibold text-navy">{a.id}</div>
                  <div className="text-body-3 text-ink-muted">{a.type} Certificate • Submitted {new Date(a.submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusPill status={a.stage} />
                  {a.stage === "CORRECTION_REQUESTED" && (
                    <Button
                      onClick={() => transition(a.id, "MAKER_REVIEW", "Resubmitted by applicant", "citizen")}
                    >
                      Edit &amp; Resubmit
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => withdrawApplication(a.id)}>Withdraw</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="mb-3 text-label-3 uppercase text-ink-hint">Welfare &amp; Benefits</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {WELFARE.map(({ icon: iconName, title, desc, cta }) => (
            <Card key={title} className="flex flex-col p-5">
              <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-navy/10 text-navy">
                <Icon name={iconName} size={20} />
              </span>
              <h3 className="text-title-2 text-ink">{title}</h3>
              <p className="mt-1 flex-1 text-body-2 text-ink-muted">{desc}</p>
              <Link href="/portals/tg/citizen/welfare" className="mt-4 inline-flex items-center gap-1 text-label-1 font-semibold text-navy hover:gap-2">
                {cta} →
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
