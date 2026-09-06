"use client";

import * as React from "react";
import { Icon, useToast, Card, Button } from "@mosje/design-system";

const SCHEMES = [
  {
    icon: "school",
    title: "Scholarships",
    desc: "Pre- and post-matric scholarships for transgender students, covering tuition, maintenance, and academic allowances.",
    cta: "Apply Now",
    eligibility: "Enrolled transgender students with a valid Certificate of Identity.",
  },
  {
    icon: "build",
    title: "Skill Training (PM-DAKSH)",
    desc: "Free skilling and livelihood courses with stipend support, delivered through empanelled training partners.",
    cta: "Browse Courses",
    eligibility: "Transgender persons aged 18–45 seeking employment or self-employment.",
  },
  {
    icon: "home",
    title: "Garima Greh",
    desc: "Shelter homes offering safe accommodation, food, medical care, and skill development in a supportive community.",
    cta: "Find Homes",
    eligibility: "Transgender persons in need of shelter and rehabilitation.",
  },
  {
    icon: "monitor_heart",
    title: "Medical Support",
    desc: "Assistance for health services and gender-affirming care through empanelled hospitals under the Ayushman Bharat convergence.",
    cta: "Register",
    eligibility: "Certificate-holding transgender persons requiring medical assistance.",
  },
];

export default function WelfarePage() {
  const { toast } = useToast();
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-headline-1 text-ink">Welfare &amp; Benefits</h1>
        <p className="mt-1 text-body-2 text-ink-muted">
          Schemes available to certified transgender persons under the SMILE umbrella.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {SCHEMES.map(({ icon: iconName, title, desc, cta, eligibility }) => (
          <Card key={title} className="flex flex-col p-6">
            <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-navy/10 text-navy">
              <Icon name={iconName} />
            </span>
            <h2 className="text-title-1 text-ink">{title}</h2>
            <p className="mt-2 text-body-2 text-ink-muted">{desc}</p>
            <p className="mt-3 text-body-3 text-ink-hint">
              <span className="text-label-3 uppercase">Eligibility:</span> {eligibility}
            </p>
            <div className="mt-5">
              <Button appearance="outlined" onClick={() => toast(`${title} — ${cta}: demo action, no real submission is made.`, "info")}>
                {cta} <Icon name="open_in_new" size={16} />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
