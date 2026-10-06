"use client";

import * as React from "react";
import { DotPlot } from "@mosje/design-system";


/** The page's live specimen. */
export function Specimen(): React.JSX.Element {

  return <DotPlot title="Spent as a share of the Budget Estimate, by scheme" reference={{ value: 50, label: "Year elapsed" }} rows={[{ label: "IPSrC", value: 42.7, detail: "₹162.4 Cr of ₹380 Cr" }, { label: "RVY", value: 41, detail: "₹47.2 Cr of ₹115 Cr" }, { label: "PM-SPECIAL", value: 24.2, detail: "₹14.5 Cr of ₹60 Cr" }]} />;
}
