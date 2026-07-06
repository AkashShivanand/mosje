"use client";

import * as React from "react";
import { Star, MessageSquare } from "lucide-react";
import { PageHeader, Card, StatTile } from "@/components/ui";

// Portal feedback (captured feedback surface — representative entries).
const FEEDBACK = [
  { name: "Ramesh K.", rating: 5, when: "03 Jul 2026", text: "Filing the grievance was simple and I could track it easily." },
  { name: "Sunita D.", rating: 4, when: "02 Jul 2026", text: "Good process, but OTP took a while to arrive." },
  { name: "NGO – Samata", rating: 5, when: "01 Jul 2026", text: "Registering on behalf of beneficiaries worked smoothly." },
  { name: "Anonymous", rating: 3, when: "29 Jun 2026", text: "Would like SMS updates at each stage." },
];

export default function PortalFeedbackPage() {
  const avg = (FEEDBACK.reduce((s, f) => s + f.rating, 0) / FEEDBACK.length).toFixed(1);
  return (
    <div>
      <PageHeader title="Feedbacks" subtitle="Citizen feedback on the SAMBAL portal" />
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile label="Total Feedback" value={FEEDBACK.length} />
        <StatTile label="Average Rating" value={`${avg} / 5`} accent="approve" />
        <StatTile label="Positive (4★+)" value={FEEDBACK.filter((f) => f.rating >= 4).length} accent="await" />
      </div>
      <div className="space-y-3">
        {FEEDBACK.map((f, i) => (
          <Card key={i} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-navy/10 text-navy"><MessageSquare className="h-4 w-4" /></span>
                <div>
                  <p className="text-sm font-semibold text-ink">{f.name}</p>
                  <p className="mt-0.5 text-sm text-ink-muted">{f.text}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, s) => <Star key={s} className={`h-3.5 w-3.5 ${s < f.rating ? "fill-saffron text-saffron" : "text-line"}`} />)}
                </span>
                <span className="text-xs text-ink-hint">{f.when}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
