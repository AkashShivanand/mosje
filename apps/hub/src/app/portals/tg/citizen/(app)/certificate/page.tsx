"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, Button, EmptyState } from "@/components/tg/ui";
import { useTg } from "@/lib/tg/store/store";
import { DEMO_CITIZEN } from "@/lib/tg/store/seed";
import { Icon } from "@mosje/design-system";

export default function CertificatePage() {
  const { state, hydrated } = useTg();
  if (!hydrated) return null;

  const mine = state.applications.filter((a) => a.applicant.email === DEMO_CITIZEN.email);
  const cert = mine.find((a) => a.stage === "APPROVED_SIGNED");

  if (!cert) {
    return (
      <EmptyState
        title="No certificate issued yet"
        hint="Once your application is approved and signed, your certificate and ID card appear here."
      />
    );
  }

  const a = cert.applicant;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-approve-bg text-approve-fg">
              <Icon name="check_circle" />
            </span>
            <div>
              <h1 className="text-headline-3 text-ink">Application Approved</h1>
              <p className="text-body-2 text-ink-muted">You are officially recognized.</p>
            </div>
          </div>
          <p className="mt-4 text-body-2 text-ink-muted">
            Your Transgender Certificate and Identity Card have been issued by the District Magistrate
            under the Transgender Persons (Protection of Rights) Act, 2019.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button><Icon name="download" size={16} /> Download Certificate</Button>
            <Button variant="outline"><Icon name="badge" size={16} /> Download ID Card</Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-title-2 text-ink">Gender Revision Request</h2>
            <Link href="/portals/tg/citizen/apply" className="inline-flex items-center gap-1.5 text-label-1 font-semibold text-navy hover:underline">
              <Icon name="refresh" size={16} /> Request Revised Certificate
            </Link>
          </div>
          <p className="mt-2 text-body-2 text-ink-muted">
            Applied for a revised certificate after medical intervention? Start a Revised Certificate
            application to update your details.
          </p>
        </Card>
      </div>

      {/* Certificate card */}
      <Card className="h-fit overflow-hidden">
        <div className="bg-navy px-5 py-4 text-center text-white">
          <Image src="/portals/tg/brand/national-emblem-white.svg" alt="" width={44} height={62} className="mx-auto h-10 w-auto" />
          <div className="mt-2 text-body-3 text-white/80">Government of India</div>
          <div className="text-body-2 font-semibold">Ministry of Social Justice &amp; Empowerment</div>
        </div>
        <div className="space-y-3 p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-navy/10 text-title-1 font-bold text-navy">
              {a.chosenName.slice(0, 2).toUpperCase()}
            </span>
            <div>
              <div className="text-title-1 text-ink">{a.chosenName}</div>
              <div className="text-body-3 text-ink-muted">Transgender Identity Card</div>
            </div>
          </div>
          <dl className="space-y-1.5 text-body-2">
            <div className="flex justify-between"><dt className="text-ink-hint">DOB</dt><dd className="font-medium text-ink">{a.dob}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-hint">Gender</dt><dd className="font-medium text-ink">{a.genderRequested}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-hint">Certificate No.</dt><dd className="font-mono font-medium text-ink">{cert.certificateNo}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-hint">Validity</dt><dd className="font-medium text-approve-fg">Lifetime</dd></div>
          </dl>
        </div>
      </Card>
    </div>
  );
}
