"use client";

import * as React from "react";
import { PortalPageHeader, Card, StatTile } from "@/components/nhapoa/ui";
import { Icon } from "@mosje/design-system";

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
      <PortalPageHeader title="Feedbacks" meta="Citizen feedback on the SAMBAL portal" />
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
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-navy/10 text-navy"><Icon name="chat" size={16} /></span>
                <div>
                  <p className="text-title-3 text-ink">{f.name}</p>
                  <p className="mt-0.5 text-body-2 text-ink-muted">{f.text}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="flex items-center gap-0.5">
                  {/* `fill` is the font's FILL axis, not an SVG paint — a
                      Tailwind `fill-*` class does nothing to a glyph, so the
                      earned stars use the filled variant instead. */}
                  {Array.from({ length: 5 }).map((_, s) => <Icon name="star" size={14} key={s} fill={s < f.rating} className={s < f.rating ? "text-saffron" : "text-line"} />)}
                </span>
                <span className="text-body-3 text-ink-hint">{f.when}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
