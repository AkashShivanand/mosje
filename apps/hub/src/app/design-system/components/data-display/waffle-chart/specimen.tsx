"use client";

import * as React from "react";
import { WaffleChart } from "@mosje/design-system";


/** The page's live specimen. */
export function Specimen(): React.JSX.Element {

  return <WaffleChart title="Indicators by data feed" unit="indicator" categories={[{ id: "live", label: "Live", color: "var(--sa-chart-cat-4)" }, { id: "none", label: "No API", color: "var(--sa-chart-cat-2)" }, { id: "ns", label: "Not Yet Stated", color: "var(--sa-chart-cat-7)" }]} rows={[{ label: "NMBA", counts: { live: 5, none: 1 } }, { label: "Senior Citizens", counts: { none: 22, ns: 0 } }, { label: "SMILE", counts: { ns: 42 } }]} />;
}
