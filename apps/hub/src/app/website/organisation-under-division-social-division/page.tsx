import type { Metadata } from "next";
import { ContentPage } from "@/components/website-next/templates/ContentPage";

const TITLE = "Organisations under the Social Defence Division";
const DESCRIPTION =
  "The National Institute of Social Defence, the nodal training and research institute in the field of social defence, functions under the Social Defence Division.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
};

/* Body text: dosje.gov.in/organisation-under-division-social-division/ as
   published, read 21 Sep 2026. Title: the live h1 reads "Organisation under
   Division: Social Division" — "Social Division" is the live page's own short
   form of the Social Defence Division (the page's only content is the Social
   Defence Division's autonomous body, NISD), so the title here reads
   "Organisations under the Social Defence Division" for clarity; no other
   wording changed. No typos found. */
export default function Page() {
  return (
    <ContentPage
      title={TITLE}
      breadcrumb={[{ label: "About" }, { label: "Divisions", href: "/website/about-the-division" }, { label: TITLE }]}
      description={DESCRIPTION}
      lastUpdated="06 Jun 2026"
    >
      <h2>National Institute of Social Defence, Ministry of Social Justice and Empowerment, Government of India</h2>
      <p>
        National Institute of Social Defence is the nodal training and research institute in the field
        of social defence. Though social defence covers the entire gamut of activities and programmes
        for the protection of society, it is currently focusing on human resource development in the
        areas of drug abuse prevention, welfare of senior citizens and transgenders, beggary prevention,
        and other social defence issues.
      </p>
      <ol>
        <li>NISD is an Autonomous Body of the Ministry of Social Justice and Empowerment, Government of India.</li>
        <li>NISD reviews and evaluates the implementation of the Social Defence policies and programs.</li>
        <li>NISD coordinates and liaises with the Government and the Non-Government organisations at the State, National and International levels.</li>
        <li>The institute develops preventive, curative and rehabilitative tools, programmes and policies in the field of social defence, and also undertakes research, training and capacity building, consultancy, documentation and publication in the field.</li>
      </ol>
    </ContentPage>
  );
}
