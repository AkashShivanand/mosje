import type { Metadata } from "next";
import { ContentPage } from "@/components/website-next/templates/ContentPage";
import type { DocumentRow } from "@/components/website-next/templates/content/DocumentTable";
import { DocumentTable } from "@/components/website-next/templates/content/DocumentTable";

const TITLE = "Drug Division";
const DESCRIPTION =
  "The sections of the Drug Division and the matters each handles, under the Department of Social Justice & Empowerment.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
};

const DOCS: DocumentRow[] = [
  {
    title: "NAPDDR (National Action Plan for Drug Demand Reduction) Scheme 5th Revised Guidelines w.e.f. 27-02-2023",
    published: "1 Mar 2023",
    size: "1.78 MB",
    href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/NAPDDR-1.pdf",
  },
  {
    title: "6th revised NAPDDR GUIDELINES wef 14-06-2023",
    published: "17 Dec 2024",
    size: "1.46 MB",
    href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/NAPDDR2.pdf",
  },
];

/* Body text: dosje.gov.in/drug-division/ as published, read 21 Sep 2026. The
   live page numbers each section's points as "i)/ii)/iii)/iv)" typed inside
   <p> tags and mislabels some of them (Section I repeats "vi)" for two
   different points; Section III has no "ii)" and repeats "iii)" instead);
   converted to real <ol type="i"> lists in the order published, so every point
   is kept and correctly numbered by the list itself. No wording changed. */
export default function Page() {
  return (
    <ContentPage
      title={TITLE}
      breadcrumb={[{ label: "About" }, { label: "Divisions", href: "/website/about-the-division" }, { label: TITLE }]}
      description={DESCRIPTION}
      lastUpdated="06 Jun 2026"
    >
      <h2>Drug Prevention &ndash; I Section</h2>
      <ol type="i">
        <li>All Policy work of National Action Plan for Drug Demand Reduction (NAPDDR)</li>
        <li>Release of Funds to State/UT Govt. for State Action Plan under NAPDDR scheme</li>
        <li>Budget matters pertaining to DP Division</li>
        <li>Selection of District De-Addiction Centres</li>
        <li>Policy matters of Setting up of De-Addiction Centres in Central Jails</li>
        <li>Programme Monitoring Unit</li>
        <li>Matters/References pertaining to Standing Committee of Parliament</li>
      </ol>

      <h2>Drug Prevention &ndash; II Section</h2>
      <ol type="i">
        <li>Nasha Mukt Bharat Abhiyaan (NMBA)</li>
        <li>Addiction Treatment Facilities in Govt. Hospitals</li>
        <li>International matters related to Drug Demand Reduction</li>
        <li>Matters/References pertaining to Consultative Committee of Parliament</li>
      </ol>

      <h2>Drug Prevention &ndash; III Section</h2>
      <ol type="i">
        <li>Release of grant in aid to NGOs and other eligible organizations working in various States/UTs for identification, counselling, treatment and rehabilitation of addicts.</li>
        <li>Navchetna Modules</li>
        <li>Administrative matters of National Institute for Social Defence</li>
        <li>Policy matters and release of grant-in-aid to State Level Coordinating Agencies (SLCAs)</li>
      </ol>

      <h2>Drug Prevention &ndash; IV Section</h2>
      <ol type="i">
        <li>Release of grant in aid to NGOs and other eligible organizations working in various States/UTs for identification, counselling, treatment and rehabilitation of addicts.</li>
        <li>All policy matters pertaining to the welfare of Transgender Persons</li>
      </ol>

      <h2>Documents</h2>
      <DocumentTable caption="Documents Published by the Drug Division" rows={DOCS} />
    </ContentPage>
  );
}
