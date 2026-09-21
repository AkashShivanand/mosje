import type { Metadata } from "next";
import { ContentPage } from "@/components/website-next/templates/ContentPage";

const TITLE = "Cessation of Voluntary Organisation Activities";
const DESCRIPTION =
  "What happens to immovable assets created with the Ministry's assistance when a voluntary organisation permanently closes a project.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
};

/* Body text: dosje.gov.in/cessation-of-voluntary-organisation-activities/ as published, read
   21 Sep 2026 — a single paragraph, no sub-headings on the live page. No typos found. */
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
      <p>
        In the case of permanent closure of a project in any area by the Voluntary Organization,
        immovable assets created through assistance of the Ministry would be handed over through the
        State Govt. to local body / Panchayat.
      </p>
    </ContentPage>
  );
}
