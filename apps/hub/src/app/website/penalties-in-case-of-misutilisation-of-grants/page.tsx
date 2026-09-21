import type { Metadata } from "next";
import { ContentPage } from "@/components/website-next/templates/ContentPage";

const TITLE = "Penalties in Case of Misutilization of Grants";
const DESCRIPTION =
  "The action taken against a voluntary organisation and its managing committee where grant-in-aid is mis-utilised, and how assets created from the grant are then treated.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
};

/* This route 404s at its own slug on dosje.gov.in. The Department publishes the same page at
   https://www.dosje.gov.in/penalties-in-case-of-misutilization-of-grands/ — a different slug,
   with its own typo ("Grands" for "Grants") — found via the WordPress search API and read
   21 Sep 2026. Body text as published there, a single two-item list, no sub-headings.
   Typo corrected: the live page's title spells "Misutilization" (American) where this route's
   slug spells "misutilisation" (British); kept the Department's own spelling in the title, and
   fixed only "Grands" -> "Grants". No other typos found. */
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
        <li>
          The members of the executive of the Voluntary Organization would be liable for recovery of
          misused grants. The V.O. as well as members of its Managing Committee would also be
          blacklisted by the Ministry.
        </li>
        <li>
          All immovable assets created out of the funds from the Govt. shall be in the name of the
          Govt. and ownership shall be with the Ministry of Social Justice and Empowerment. Immovable
          assets created from the funds of the Ministry, if not utilized as envisaged in the scheme,
          would be taken over by the local body / State Government / body prescribed by Ministry.
        </li>
      </ol>
    </ContentPage>
  );
}
