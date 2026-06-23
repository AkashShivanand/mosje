"use client";

import * as React from "react";
import { ImageIcon } from "lucide-react";
import { useTCSession } from "@/lib/treatment-centre/session-context";

const PHOTOS = [
  { caption: "Centre entrance" },
  { caption: "Counselling room" },
  { caption: "Group therapy session" },
  { caption: "Awareness rally" },
  { caption: "Yoga & wellness" },
  { caption: "Recreation area" },
];

export default function CenterPhotosPage() {
  const session = useTCSession();
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl bg-navy px-5 py-3.5 text-white">
        <h1 className="text-lg font-bold">Center Photos</h1>
        <p className="text-xs text-white/70">{session.centerName}</p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {PHOTOS.map((p) => (
          <figure key={p.caption} className="overflow-hidden rounded-xl border border-line bg-white">
            <div className="flex aspect-[4/3] items-center justify-center bg-brandwash text-navy/40">
              <ImageIcon className="h-10 w-10" aria-hidden />
            </div>
            <figcaption className="px-3 py-2 text-sm text-ink-muted">{p.caption}</figcaption>
          </figure>
        ))}
      </div>
      <p className="text-xs text-ink-hint">Demo gallery — synthetic placeholders, no real centre photos.</p>
    </div>
  );
}
