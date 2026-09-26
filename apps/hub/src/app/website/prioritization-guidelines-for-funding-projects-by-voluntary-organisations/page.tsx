import type { Metadata } from "next";
import { ContentPage } from "@/components/website-next/templates/ContentPage";

const TITLE = "Prioritization Guidelines for Funding Projects by Voluntary Organisations";
const DESCRIPTION =
  "The criteria the Ministry applies when deciding which projects of voluntary organisations to fund, and for how long.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
};

/* This route 404s at its own slug on dosje.gov.in. The Department publishes the same page at
   https://www.dosje.gov.in/prioritization-guidelines-for-funding-projects-by-vuluntary-organisations/
   — a different slug, with its own typo ("vuluntary" for "voluntary") — found via the
   WordPress search API and read 21 Sep 2026. Body text as published there, a single
   eleven-item list, no sub-headings. No typos found in the body text itself. */
export default function Page() {
  return (
    <ContentPage
      title={TITLE}
      breadcrumb={[
        { label: "Tenders & Vacancies" },
        { label: "Grants to Voluntary Organisations", href: "/website/grants-in-aid-to-ngos-faqs" },
        { label: TITLE },
      ]}
      description={DESCRIPTION}
      lastUpdated="06 Jun 2026"
    >
      <ol>
        <li>New projects will be favoured in rural areas, urban areas in cases of extreme need and in States where voluntary action has so far not been significant.</li>
        <li>
          In order to be eligible for assistance, a Voluntary Organization should have been registered
          for a period of at least two years and should have been actively working in its sector for a
          period of two years. Such projects will not be taken up for assistance where the activities
          are proposed to commence after the project is sanctioned and funds released by the Ministry.
          Besides, the NGO would be required to maintain its level of contribution at least at the
          level of expenses that were being incurred by it before assistance from the Ministry
          commenced. An undertaking in this regard would be required from the Voluntary Organization at
          the time of submission of the initial application for grant.
        </li>
        <li>Such projects will be favoured for sanction where the Voluntary Organization is locally based and its operations reflect involvement with the community.</li>
        <li>Projects proposed for implementation by established Voluntary Organization in green field areas by setting up their local chapters, will be favoured.</li>
        <li>A Project proposal complete in all respects (as per guidelines issued by the Ministry) will be funded initially for a period of one year at a time for five years.</li>
        <li>No grants will be released for acquisition of immoveable assets or the construction of buildings during the initial five year period of assistance by the Ministry to any NGO.</li>
        <li>Release of further grants will be conditional on satisfactory operation of the activities of the organization as established through monitoring reports and periodical inspections.</li>
        <li>
          Voluntary Organizations would be expected to raise resources through donations from general
          public, business houses etc. beyond initial requirement of 10% to be contributed by the
          Voluntary Organization itself so that the activities of the project become self sustainable
          and grants from the Ministry can be tapered off through a cut of around 15% every year after
          the first five years.
        </li>
        <li>Voluntary Organization would be expected to progressively professionalise their management and increase proportion of qualified staff.</li>
        <li>The Ministry would release grant in aid for a project at a particular location for a maximum period of 10 years.</li>
        <li>In case of Voluntary Organizations seeking grant for a new project it would be required to furnish complete information about all sources of funding and a list of projects financed / supported through such funding.</li>
      </ol>
    </ContentPage>
  );
}
