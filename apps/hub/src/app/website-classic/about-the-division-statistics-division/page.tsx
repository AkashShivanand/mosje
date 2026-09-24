import type { Metadata } from "next";
import { ContentPage } from "@/components/website/templates/ContentPage";

export const metadata: Metadata = {
  title: "About the Division — Statistics | Department of Social Justice & Empowerment",
  description:
    "The Statistics Division of DoSJE is responsible for data collection, monitoring, evaluation and the publication of statistical material on the Department's schemes and target groups.",
};

export default function Page() {
  return (
    <ContentPage
      title="About the Division — Statistics"
      breadcrumb={[{ label: "Department" }, { label: "About the Division — Statistics" }]}
      description="Evidence for policy — collecting, monitoring and disseminating reliable data on the Department's work."
      lastUpdated="06 Jun 2026"
    >
      <h2>Mandate</h2>
      <p>
        The Statistics Division serves as the statistical and monitoring arm of the Department of
        Social Justice &amp; Empowerment. It supports evidence-based policy making by maintaining
        reliable data on the Department&rsquo;s schemes, target groups and outcomes, and by enabling
        systematic monitoring and evaluation of programmes.
      </p>

      <h2>Data Collection</h2>
      <p>
        The Division coordinates the <strong>collection and compilation of data</strong> from scheme
        divisions, State Governments, autonomous bodies and corporations. It maintains datasets on
        physical and financial progress, beneficiary coverage and demographic profiles of the
        target groups, and works to improve the timeliness, completeness and quality of statistics.
      </p>

      <h2>Monitoring &amp; Evaluation</h2>
      <p>
        The Division supports the <strong>monitoring of scheme implementation</strong> against
        approved targets and outcomes, and commissions or coordinates{" "}
        <strong>evaluation and concurrent studies</strong> to assess the impact and effectiveness of
        programmes. The findings feed back into scheme design, mid-course corrections and budgetary
        planning.
      </p>

      <h2>Publications</h2>
      <p>
        The Division compiles and brings out <strong>statistical publications</strong>, including
        statistical handbooks, dashboards and inputs for the Annual Report and Outcome Budget. These
        publications make data on the Department&rsquo;s work accessible to policymakers, researchers
        and the public, in keeping with the principles of transparency and open data.
      </p>
    </ContentPage>
  );
}
