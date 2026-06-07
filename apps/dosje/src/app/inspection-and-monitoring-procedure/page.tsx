import type { Metadata } from "next";
import { ContentPage } from "@/components/templates/ContentPage";

export const metadata: Metadata = {
  title: "Inspection and Monitoring Procedure",
  description:
    "How the Department of Social Justice & Empowerment inspects and monitors projects funded through grant-in-aid to voluntary organisations.",
};

export default function Page() {
  return (
    <ContentPage
      title="Inspection and Monitoring Procedure"
      breadcrumb={[{ label: "Department" }, { label: "Inspection and Monitoring Procedure" }]}
      description="The mechanisms used to verify that grant-aided projects are implemented as sanctioned and deliver intended benefits to the target groups."
      lastUpdated="06 Jun 2026"
    >
      <h2>Purpose</h2>
      <p>
        Inspection and monitoring ensure that funds released to voluntary organisations are used for the
        sanctioned purpose, that projects are implemented to standard, and that the intended beneficiaries
        actually receive the benefits. Monitoring is continuous and combines documentary review with field
        verification.
      </p>

      <h2>Methods of Monitoring</h2>
      <ul>
        <li>
          <strong>Documentary monitoring</strong> — examination of progress reports, utilisation
          certificates, audited accounts and beneficiary data submitted by the organisation.
        </li>
        <li>
          <strong>Field inspection</strong> — site visits by officers of the Department, the State
          Government, or the District administration to verify physical and financial progress.
        </li>
        <li>
          <strong>Third-party evaluation</strong> — periodic independent evaluation of major or
          long-running projects by accredited institutions.
        </li>
        <li>
          <strong>Portal-based tracking</strong> — online monitoring of releases and outcomes through PFMS
          and the scheme management system.
        </li>
      </ul>

      <h2>Inspection Process</h2>
      <ul>
        <li>Inspections may be scheduled or conducted at short notice; the organisation shall extend full cooperation.</li>
        <li>Inspecting officers verify records, attendance, infrastructure, and a sample of beneficiaries.</li>
        <li>An inspection report is prepared noting compliance, shortfalls and corrective action required.</li>
        <li>The organisation is given an opportunity to respond to observations and rectify deficiencies.</li>
      </ul>

      <h2>Follow-up</h2>
      <p>
        Findings feed directly into decisions on the release of further instalments and on renewal of
        assistance. Persistent or serious irregularities are escalated for recovery, suspension or other
        action in accordance with the applicable guidelines.
      </p>
    </ContentPage>
  );
}
