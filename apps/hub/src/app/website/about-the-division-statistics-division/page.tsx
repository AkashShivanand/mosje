import type { Metadata } from "next";
import { ContentPage } from "@/components/website-next/templates/ContentPage";
import type { DocumentRow } from "@/components/website-next/templates/content/DocumentTable";
import { DocumentTable } from "@/components/website-next/templates/content/DocumentTable";

const TITLE = "Statistics Division";
const DESCRIPTION =
  "The Statistics Division of the Department of Social Justice & Empowerment is primarily responsible for sponsoring evaluation and research studies on the schemes for its target groups.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
};

const DOCS: DocumentRow[] = [
  {
    title: "Annual Report of 2024–25 of the Department",
    published: "16 Apr 2025",
    size: "195.41 MB",
    href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/86481744793621.pdf",
  },
  {
    title: "Handbook on Social Welfare Statistics, May 2024",
    published: "14 Aug 2024",
    size: "5.81 MB",
    href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/29821723632438.pdf",
  },
  {
    title: "Evaluation Studies",
    published: "25 Apr 2025",
    size: "705.43 KB",
    href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/92891745565255.pdf",
  },
];

/* Body text: dosje.gov.in/about-the-division-statistics-division/ as published,
   read 21 Sep 2026. No typos found. The sub-heading "Statistics Division" the
   live page repeats directly under the h1 is not repeated again here — it is
   the page's own title. */
export default function Page() {
  return (
    <ContentPage
      title={TITLE}
      breadcrumb={[{ label: "About" }, { label: "Divisions", href: "/website/about-the-division" }, { label: TITLE }]}
      description={DESCRIPTION}
      lastUpdated="06 Jun 2026"
    >
      <p>
        Statistics Division of the Department of Social Justice &amp; Empowerment is primarily
        responsible for sponsoring evaluation/research studies on schemes of its target groups namely
        Scheduled Castes, Other Backward Classes (OBCs), Senior Citizens and Victims of Substance Abuse.
        The Division is also responsible for sponsoring seminars, grant to individual scholar and
        publication grant on the subject areas relating to target groups. The Division is also
        responsible to fulfill the data needs of the Department for Planning and Policy intervention.
      </p>
      <p>
        The Department of Social Justice &amp; Empowerment sponsors Evaluation Studies to Universities,
        Research Institutions, Voluntary Organizations and Professional Associations working in the
        field of social welfare and similar organizations/agencies including institutions set-up and
        fully funded by Central/State Governments/Public Sector Undertakings as per GFR 2017.
      </p>

      <h2>Major Activities</h2>
      <ol>
        <li>Evaluation Studies of the schemes of D/o SJE</li>
        <li>Sectoral Group of Secretaries (SGoS)/Vision 2047 Document</li>
        <li>Work related with 55th Session of United Nations Statistical Commission (UNSC)</li>
        <li>Smart India Hackathon</li>
        <li>Matters related to Pragati Portal</li>
        <li>Gender Budgeting of D/o SJE</li>
        <li>PM Cares Scheme</li>
        <li>PM Reference Portal</li>
        <li>Overall coordination of E-Samiksha</li>
        <li>I-MESA &ndash; Aware generation, Research, Evaluation and Training Scheme, Central Smart Surveillance Unit, MIS etc.</li>
        <li>Development Action Plan for SCs (DAPSC) and monitoring of obligated Ministries/Departments</li>
        <li>Social Audits of Schemes of D/o SJE</li>
        <li>DGQI Monitoring matters and issues related to NITI Aayog</li>
        <li>Output-Outcome framework of D/o SJE</li>
        <li>Annual Report &amp; Hand Book on Social Welfare Statistics</li>
        <li>Handling Public Grievances at CPGRAMS portal as a Nodal Division of D/o SJE and dispose off/forward them to concerned Divisions/Departments etc.</li>
        <li>Parliament Questions/VIP References/RTI etc.</li>
      </ol>

      <h2>Documents</h2>
      <DocumentTable caption="Documents Published by the Statistics Division" rows={DOCS} />
    </ContentPage>
  );
}
