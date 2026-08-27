import * as React from "react";
import type { Metadata } from "next";

import { ArchetypesContent } from "./content";

export const metadata: Metadata = {
  title: "Dashboard Archetypes",
  description:
    "Five named dashboard boards — scheme performance, geographic distribution, application pipeline, compliance status and beneficiary demographics — composed from the SAMAVESH visualisation layer.",
};

/**
 * Server shell. The content is a client component because every chart is one —
 * formatter functions and cell renderers cannot cross the RSC boundary, and the
 * charts take both.
 */
export default function ArchetypesPage(): React.JSX.Element {
  return <ArchetypesContent />;
}
