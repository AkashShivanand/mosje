"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button, PageHeader, RadioGroup } from "@mosje/design-system";
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
      <>
        {/* The heading names the applicant's task, not the mechanism (design audit n2). The
            second sentence is here because the choice is consequential and looks as if it is
            not: each scheme runs a different form, of a different length, with its own
            checklist. */}
        <PageHeader
          title="Apply for Grant"
          meta="Choose the scheme you are applying under. Each has its own application form and document checklist."
        />
      </>

      <RadioGroup
        name="scheme"
        legend="Select a scheme"
        hideLegend
        variant="card"
        cardLayout="detailed"
        value={selected ?? undefined}
        onChange={setSelected}
        options={state.schemes.map((s) => ({
          value: s.code,
          label: s.name,
          description: s.description,
          meta: `Target: ${s.target}`,
        }))}
      />

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
