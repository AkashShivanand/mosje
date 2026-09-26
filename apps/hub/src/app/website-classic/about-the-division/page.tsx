import type { Metadata } from "next";
import { ContentPage } from "@/components/website/templates/ContentPage";

export const metadata: Metadata = {
  title: "About the Division — Welfare of Scheduled Castes",
  description:
    "Mandate, target group, key schemes and objectives of the Scheduled Castes Development Division under the Department of Social Justice & Empowerment.",
};

export default function Page() {
  return (
    <ContentPage
      title="About the Division — Welfare of Scheduled Castes"
      breadcrumb={[{ label: "Department" }, { label: "About the Division — Welfare of Scheduled Castes" }]}
      description="The Scheduled Castes Development Division works for the social, educational and economic empowerment of the Scheduled Castes through scholarships, protective legislation and development programmes."
      lastUpdated="06 Jun 2026"
    >
      <h2>Mandate</h2>
      <p>
        The Scheduled Castes Development Division is the nodal arm of the Department of Social Justice
        &amp; Empowerment for the welfare and empowerment of Scheduled Castes (SCs). The Division
        formulates policy, designs and administers Centrally Sponsored and Central Sector Schemes, and
        coordinates with State Governments, Union Territory administrations and the Scheduled Castes
        development corporations to ensure that the benefits of development reach the intended
        beneficiaries.
      </p>
      <p>
        Its work flows directly from the constitutional commitment to protect Scheduled Castes from
        social injustice and all forms of exploitation, and to promote their interests with special
        care, as envisaged in <strong>Article 46</strong> of the Constitution of India.
      </p>

      <h2>Target Group</h2>
      <p>
        The Division serves the communities notified as Scheduled Castes under <strong>Article 341</strong>
        of the Constitution. These communities have historically faced exclusion and disadvantage, and
        the Division&apos;s interventions are designed to bridge gaps in education, livelihood, dignity and
        access to opportunity.
      </p>

      <h2>Key Schemes</h2>
      <ul>
        <li>
          <strong>Pre-Matric and Post-Matric Scholarships</strong> for SC students to reduce drop-out and
          support continued education.
        </li>
        <li>
          <strong>Top Class Education Scheme</strong> supporting SC students in premier institutions of
          higher learning.
        </li>
        <li>
          <strong>Pradhan Mantri Anusuchit Jaati Abhyuday Yojana (PM-AJAY)</strong> for integrated
          village development, skilling and hostel infrastructure.
        </li>
        <li>
          Implementation support for the <strong>Protection of Civil Rights (PCR) Act, 1955</strong> and
          the <strong>SC/ST (Prevention of Atrocities) Act, 1989</strong>.
        </li>
      </ul>

      <h2>Objectives</h2>
      <ul>
        <li>Improve educational attainment and reduce the literacy and enrolment gap.</li>
        <li>Expand economic opportunity through skilling, credit and self-employment support.</li>
        <li>Strengthen protection against untouchability, discrimination and atrocities.</li>
        <li>Promote inclusive development in partnership with States and field organisations.</li>
      </ul>
    </ContentPage>
  );
}
