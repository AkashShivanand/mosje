import type { Metadata } from "next";
import { Link } from "@mosje/design-system";
import { ContentPage } from "@/components/website-next/templates/ContentPage";

const TITLE = "Plan Division";
const DESCRIPTION = "Major activities of the Plan Division of the Department of Social Justice & Empowerment.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
};

const related = (
  <nav className="wn-panel" aria-labelledby="related-title">
    <h2 className="wn-panel__title" id="related-title">
      Related Pages
    </h2>
    <ul>
      {[
        ["Scheduled Caste Welfare Division", "/website/about-the-division"],
        ["Social Defence Division", "/website/about-the-division-social-defence"],
        ["Statistics Division", "/website/about-the-division-statistics-division"],
        ["Drug Division", "/website/drug-division"],
      ].map(([l, h]) => (
        <li key={h}>
          <Link href={h}>{l}</Link>
        </li>
      ))}
    </ul>
  </nav>
);

/* Body text: dosje.gov.in/about-the-division-2/ as published, read 21 Sep 2026.
   Edits: "Implementaion" → "Implementation"; "Manual Scavenges (SRMS)" →
   "Manual Scavengers (SRMS)" (SRMS expands to "...Rehabilitation of Manual
   Scavengers"); the sub-heading "Plan Division" the live page repeats directly
   under the h1 is not repeated again here — it is the page's own title. */
export default function Page() {
  return (
    <ContentPage
      title={TITLE}
      breadcrumb={[{ label: "About" }, { label: "Divisions", href: "/website/about-the-division" }, { label: TITLE }]}
      description={DESCRIPTION}
      lastUpdated="06 Jun 2026"
      sidebar={related}
    >
      <h2>Major Activities</h2>
      <ol>
        <li>Implementation of the PEMS Act [Prohibition of Employment as Manual Scavengers and their Rehabilitation Acts, 2013 (MS Act, 2013)]</li>
        <li>National Action for Mechanised Ecosystem (NAMASTE)</li>
        <li>All matters relating to the Self Employment Scheme for Rehabilitation of Manual Scavengers (SRMS)</li>
        <li>The National Safai Karamcharis Finance and Development Corporation (NSKFDC)</li>
        <li>Examination and preparation of comments on Draft Cabinet Note/CCEA/EFC/SFC/PIB/DIB Notes of other Ministries/Departments.</li>
        <li>Economic Survey</li>
        <li>Monitoring of PM-Gati Shakti National Master Plan (NMP) Portal</li>
        <li>Monitoring of AKAM</li>
        <li>Policy/regulatory framework to attract Private Sector Funds/PPP</li>
        <li>Matters related to SDG 2030/UNESCAP</li>
      </ol>
    </ContentPage>
  );
}
