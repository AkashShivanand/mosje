import type { Metadata } from "next";
import { ContentPage } from "@/components/templates/ContentPage";

export const metadata: Metadata = {
  title: "Welfare of Other Backward Classes",
  description:
    "Mandate, schemes and institutional framework for the welfare and empowerment of Other Backward Classes (OBCs) under the Department of Social Justice & Empowerment.",
};

export default function Page() {
  return (
    <ContentPage
      title="Welfare of Other Backward Classes"
      breadcrumb={[{ label: "Department" }, { label: "Welfare of Other Backward Classes" }]}
      description="The Department implements educational and economic empowerment programmes for the Other Backward Classes, supported by the National Commission for Backward Classes."
      lastUpdated="06 Jun 2026"
    >
      <h2>Mandate</h2>
      <p>
        The Department of Social Justice &amp; Empowerment is responsible for the social, educational and
        economic advancement of the <strong>Other Backward Classes (OBCs)</strong>. The mandate covers the
        formulation of policy, administration of welfare schemes, and coordination with State Governments
        and Union Territory administrations for effective delivery of benefits to OBC communities.
      </p>
      <p>
        Following the recommendations of the Mandal Commission and successive policy decisions, reservation
        and welfare measures have been extended to OBCs to enable equitable participation in education,
        employment and economic activity.
      </p>

      <h2>Key Schemes</h2>
      <ul>
        <li>
          <strong>Pre-Matric and Post-Matric Scholarships</strong> for OBC students to support continued
          schooling and higher education.
        </li>
        <li>
          <strong>Dr. Ambedkar Post-Matric Scholarship for the Economically Backward Classes (EBCs)</strong>.
        </li>
        <li>
          <strong>Construction of Hostels for OBC Boys and Girls</strong> to improve access to education,
          especially in rural and remote areas.
        </li>
        <li>
          Credit and skill development support extended through the
          <strong> National Backward Classes Finance &amp; Development Corporation (NBCFDC)</strong>.
        </li>
      </ul>

      <h2>National Commission for Backward Classes</h2>
      <p>
        The <strong>National Commission for Backward Classes (NCBC)</strong>, accorded constitutional
        status through the <strong>102nd Constitutional Amendment Act, 2018</strong> (Article 338B),
        examines requests for inclusion in and complaints of under-inclusion or over-inclusion from the
        Central List of OBCs, and advises the Government on matters concerning the welfare and safeguards
        of backward classes. The Department works closely with the Commission to ensure that policy and
        scheme design remain responsive to the needs of OBC communities.
      </p>
    </ContentPage>
  );
}
