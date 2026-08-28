import * as React from "react";
import type { Metadata } from "next";

import { DataVisualisationContent } from "./content";

export const metadata: Metadata = {
  title: "Data Visualisation",
  description:
    "Every chart, metric, table and container in the SAMAVESH data-visualisation layer, rendered live against government data — the reference both designers and developers benchmark against.",
};

/**
 * Server shell. The content is a client component because every chart is one —
 * formatter functions and cell renderers cannot cross the RSC boundary, and the
 * charts take both.
 */
export default function DataVisualisationPage(): React.JSX.Element {
  return <DataVisualisationContent />;
}
