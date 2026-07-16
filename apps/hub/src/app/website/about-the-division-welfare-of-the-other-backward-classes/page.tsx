import type { Metadata } from "next";
import { ContentPage } from "@/components/website/templates/ContentPage";

export const metadata: Metadata = {
  title: "About the Division — Welfare of OBC",
  description:
    "Structure, functions and working of the Backward Classes Division within the Department of Social Justice & Empowerment.",
};

export default function Page() {
  return (
    <ContentPage
      title="About the Division — Welfare of OBC"
      breadcrumb={[{ label: "Department" }, { label: "About the Division — Welfare of OBC" }]}
      description="The Backward Classes Division is the nodal unit responsible for policy, schemes and coordination for the welfare of Other Backward Classes."
      lastUpdated="06 Jun 2026"
    >
      <h2>Overview</h2>
      <p>
        The <strong>Backward Classes Division</strong> is the dedicated unit within the Department of Social
        Justice &amp; Empowerment that handles all matters relating to the welfare and empowerment of the
        Other Backward Classes (OBCs) and the Economically Backward Classes (EBCs). The Division operates
        under the supervision of a Joint Secretary, supported by Directors, Deputy Secretaries and
        subordinate officers organised into functional sections.
      </p>

      <h2>Structure</h2>
      <ul>
        <li>
          <strong>Policy &amp; Legislation Section</strong> — handles matters relating to the Central List of
          OBCs, reservation policy and coordination with the National Commission for Backward Classes.
        </li>
        <li>
          <strong>Scholarship Section</strong> — administers Pre-Matric, Post-Matric and EBC scholarship
          schemes and the National Scholarship Portal interface for OBC students.
        </li>
        <li>
          <strong>Schemes &amp; Hostels Section</strong> — oversees hostel construction grants and other
          development programmes.
        </li>
        <li>
          <strong>Finance &amp; Coordination Section</strong> — liaises with NBCFDC and State channelising
          agencies for credit-linked self-employment support.
        </li>
      </ul>

      <h2>Functions</h2>
      <ul>
        <li>Formulating and reviewing policy and guidelines for OBC welfare.</li>
        <li>Administering and monitoring Centrally Sponsored and Central Sector Schemes.</li>
        <li>Releasing and reconciling grants to State Governments and implementing agencies.</li>
        <li>Coordinating with the NCBC, States and Union Territories on inclusion and welfare matters.</li>
        <li>Responding to Parliament questions, RTI applications and grievances relating to OBC welfare.</li>
      </ul>
    </ContentPage>
  );
}
