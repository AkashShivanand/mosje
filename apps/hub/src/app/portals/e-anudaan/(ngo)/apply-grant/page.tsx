"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";

/**
 * "Select Grant Scheme" — the live portal offers FOUR schemes here, while every officer nav on
 * the admin side only ever exposed SHRESHTA_M2. Copy is verbatim (user INVENTORY §4).
 */
export default function SelectSchemePage() {
  const router = useRouter();
  const { state } = useEAnudaan();
  const [selected, setSelected] = React.useState<string | null>(null);

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        {/* The heading names the applicant's task, not the mechanism (design audit n2). The
            second sentence is here because the choice is consequential and looks as if it is
            not: each scheme runs a different form, of a different length, with its own
            checklist. */}
        <h1 className="text-headline-1 text-ink">Apply for a Grant</h1>
        <p className="mt-1 text-body-2 text-ink-muted">
          Choose the scheme you are applying under. Each has its own application form and document
          checklist.
        </p>
      </div>

      <div className="space-y-3" role="radiogroup" aria-label="Select a scheme">
        {state.schemes.map((s) => (
          <button
            key={s.code}
            type="button"
            role="radio"
            onClick={() => setSelected(s.code)}
            aria-checked={selected === s.code}
            className={`w-full rounded-lg border-2 px-5 py-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy ${
              selected === s.code ? "border-navy bg-brandwash" : "border-line bg-surface hover:border-navy/40"
            }`}
          >
            <span className="block font-semibold text-ink">{s.name}</span>
            <span className="mt-1 block text-body-2 text-ink-muted">{s.description}</span>
            <span className="mt-2 block text-body-3 text-ink-hint">Target: {s.target}</span>
          </button>
        ))}
      </div>

      <div className="flex justify-end">
        <Button
          disabled={!selected}
          onClick={() => router.push(`/portals/e-anudaan/apply-grant/scheme/${selected}/step-1`)}
        >
          Continue →
        </Button>
      </div>
    </div>
  );
}
