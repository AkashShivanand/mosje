"use client";

import * as React from "react";
import { formatIndian } from "@mosje/design-system";
import { ADARSH_GRAM_DESCRIPTOR, type AdarshGramFeed } from "@/lib/website/adarsh-gram-api";
import { GIA_PHYSICAL_DESCRIPTOR, HOSTEL_DESCRIPTOR, type GiaData, type HostelData } from "@/lib/website/pmajay-api";
import { ADARSH_GRAM_AS_ON } from "@/lib/website/adarsh-gram-stats";
import { GIA_AS_ON, HOSTEL_AS_ON } from "@/lib/website/pmajay-stats";
import { useDataMode } from "@/lib/data-mode/context";
import { mergeData } from "@/lib/data-mode/merge";
import type { Provenance } from "@/lib/data-mode/types";
import { ProvenanceChip } from "@/components/website/ProvenanceChip";

interface DashboardGlanceProps {
  adarshGram: AdarshGramFeed;
  gia: GiaData;
  hostel: HostelData;
}

interface Figure {
  id: string;
  label: string;
  value: number;
  period: string;
  asOn: string;
  provenance: Provenance;
  /** The section below that carries the figure in full. */
  anchor: string;
  anchorLabel: string;
  /** Whether the feed said anything for this figure at all. */
  read: boolean;
}

/**
 * At a Glance — four headline figures, each with the same four parts: label,
 * number, period and source (issue LAY-11).
 *
 * ONE REQUEST, ONE ANSWER (`.claude/rules/data-state-completeness.md` §2).
 * Every figure here is also drawn by a dashboard further down the page, so each
 * is resolved with the SAME expression that dashboard uses —
 * `mergeData(descriptor, reading, snapshot, mode)` on the same reading — and
 * the strip and the section below can never print two different numbers.
 *
 * The source line says which one the reader is looking at
 * (`live-data-fallback.md`): the live report feed, or the mirrored snapshot
 * and the date it is as on. The `ProvenanceChip` beside it follows the demo
 * rail's marks setting, as on every other dashboard card.
 */
export function DashboardGlance({ adarshGram, gia, hostel }: DashboardGlanceProps) {
  const { mode } = useDataMode();

  const figures = React.useMemo<Figure[]>(() => {
    const ag = mergeData(ADARSH_GRAM_DESCRIPTOR, adarshGram.reading, adarshGram.mock, mode);
    const physical = mergeData(GIA_PHYSICAL_DESCRIPTOR, gia.allPhysical, gia.mockAllPhysical, mode);
    const hs = mergeData(HOSTEL_DESCRIPTOR, hostel.reading, hostel.mock, mode);
    return [
      {
        id: "declared",
        label: "Villages Declared Adarsh Gram",
        value: ag.values.adarsh_gram_declared,
        period: "Cumulative",
        asOn: ADARSH_GRAM_AS_ON,
        provenance: ag.provenance.adarsh_gram_declared,
        anchor: "#adarsh-gram-progress",
        anchorLabel: "Adarsh Gram progress",
        read: adarshGram.reading.adarsh_gram_declared != null,
      },
      {
        id: "villages",
        label: "Villages Selected for Adarsh Gram",
        value: ag.values.villages,
        period: "Cumulative",
        asOn: ADARSH_GRAM_AS_ON,
        provenance: ag.provenance.villages,
        anchor: "#adarsh-gram-progress",
        anchorLabel: "Adarsh Gram progress",
        read: adarshGram.reading.villages != null,
      },
      {
        id: "gia",
        label: "Projects Under Grants-in-Aid",
        value: physical.values.totalProjects,
        period: "All financial years",
        asOn: GIA_AS_ON,
        provenance: physical.provenance.totalProjects,
        anchor: "#gia-progress",
        anchorLabel: "Grants-in-Aid progress",
        read: gia.allPhysical.totalProjects != null,
      },
      {
        id: "hostel",
        label: "Hostel Beneficiaries Covered",
        value: hs.values.beneficiaries_covered,
        period: "Cumulative",
        asOn: HOSTEL_AS_ON,
        provenance: hs.provenance.beneficiaries_covered,
        anchor: "#hostel-progress",
        anchorLabel: "hostel progress",
        read: hostel.reading.beneficiaries_covered != null,
      },
    ].filter((f) => mode !== "live" || f.read);
    // In Live mode a figure the feed did not answer is ABSENT, not a zero:
    // `mergeData` returns 0 for it, and "0 villages declared" would be a claim.
  }, [adarshGram, gia, hostel, mode]);

  if (figures.length === 0) return null;

  return (
    <ul className="wn-glance">
      {figures.map((f) => {
        const live = f.provenance !== "mock";
        return (
          <li key={f.id} className="wn-glance__item">
            <p className="wn-glance__label" id={`glance-${f.id}`}>
              {f.label}
            </p>
            <p className="wn-glance__value" aria-describedby={`glance-${f.id}`}>
              {formatIndian(f.value)}
            </p>
            <p className="wn-glance__period">{f.period}</p>
            <p className="wn-glance__source">
              Source: PM-AJAY Management Information System
              {live ? ", live report feed" : `, as on ${f.asOn}`}
            </p>
            <div className="wn-glance__foot">
              <a href={f.anchor} className="wn-glance__more">
                View Details<span className="sr-only"> in {f.anchorLabel}</span>
              </a>
              <ProvenanceChip kind={live ? "live" : "mock"} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
