import type { Metadata } from "next";
import { ContentPage } from "@/components/website/templates/ContentPage";

export const metadata: Metadata = {
  title:
    "List of Research & Evaluation Studies | Department of Social Justice & Empowerment",
  description:
    "A list of research and evaluation studies commissioned by the Department of Social Justice & Empowerment on its schemes and target groups.",
};

const STUDIES = [
  "Evaluation Study of the Post-Matric Scholarship Scheme for Scheduled Castes Students",
  "Impact Assessment of the Pre-Matric Scholarship Scheme for Children of those engaged in Unclean Occupations",
  "Concurrent Evaluation of the National Action Plan for Drug Demand Reduction (NAPDDR)",
  "Study on the Welfare and Living Conditions of Senior Citizens in Old-Age Homes",
  "Assessment of the Self-Employment Scheme for Rehabilitation of Manual Scavengers (SRMS)",
  "Evaluation of the SMILE Scheme for the Welfare of Transgender Persons",
  "Study on the Socio-Economic Status of Denotified, Nomadic and Semi-Nomadic Tribes",
  "Impact Evaluation of the National Overseas Scholarship Scheme",
  "Assessment of Skill Development and Livelihood Outcomes under the Department's Corporations",
  "Study on Implementation of the Maintenance and Welfare of Parents and Senior Citizens Act, 2007",
];

export default function Page() {
  return (
    <ContentPage
      title="List of Research & Evaluation Studies"
      breadcrumb={[{ label: "Documents" }, { label: "List of Research & Evaluation Studies" }]}
      description="Research and evaluation studies that inform the design and improvement of the Department's schemes."
      lastUpdated="06 Jun 2026"
    >
      <h2>Overview</h2>
      <p>
        The Department of Social Justice &amp; Empowerment commissions research, evaluation and
        concurrent studies to assess the reach, effectiveness and impact of its schemes and to guide
        evidence-based policy making. Studies are undertaken through reputed research institutions,
        universities and independent agencies. The following is an indicative list of studies; the
        full reports may be accessed using the links provided.
      </p>

      <h2>Studies</h2>
      <ul>
        {STUDIES.map((title) => (
          <li key={title}>
            <a href="#">{title}</a>
          </li>
        ))}
      </ul>
    </ContentPage>
  );
}
