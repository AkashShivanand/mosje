import type { Metadata } from "next";
import { ContentPage } from "@/components/templates/ContentPage";

export const metadata: Metadata = {
  title: "Prioritization Guidelines for Funding Projects by Voluntary Organisations",
  description:
    "Criteria and priorities applied by the Department of Social Justice & Empowerment when funding projects of voluntary organisations through grant-in-aid.",
};

export default function Page() {
  return (
    <ContentPage
      title="Prioritization Guidelines for Funding Projects by Voluntary Organisations"
      breadcrumb={[
        { label: "Department" },
        { label: "Prioritization Guidelines for Funding Projects by Voluntary Organisations" },
      ]}
      description="The priorities applied when considering proposals from voluntary organisations for grant-in-aid, to ensure that limited resources reach the most under-served groups and areas."
      lastUpdated="06 Jun 2026"
    >
      <h2>Purpose</h2>
      <p>
        The Department supports voluntary organisations that supplement Government efforts for the welfare
        of its target groups. As the demand for grant-in-aid normally exceeds available resources,
        proposals are prioritised against transparent criteria so that assistance flows first to the most
        deserving projects, groups and geographies.
      </p>

      <h2>Priority Areas</h2>
      <ul>
        <li>Projects benefitting Scheduled Castes, Other Backward Classes and other notified target groups.</li>
        <li>
          Projects located in <strong>aspirational districts</strong>, remote, hilly, tribal, border and
          left-wing-extremism-affected areas.
        </li>
        <li>Projects serving women, children, persons with disabilities and the elderly within target groups.</li>
        <li>Educational, residential (hostel) and skill-development projects that improve livelihoods.</li>
      </ul>

      <h2>Prioritisation Criteria</h2>
      <ul>
        <li>
          <strong>Need and coverage</strong> — extent of the gap the project fills and the number of
          beneficiaries reached.
        </li>
        <li>
          <strong>Track record</strong> — past performance, credibility and proper utilisation of earlier
          grants by the organisation.
        </li>
        <li>
          <strong>Cost-effectiveness</strong> — reasonableness of unit cost and the share of expenditure
          reaching beneficiaries.
        </li>
        <li>
          <strong>Sustainability</strong> — likelihood of the project continuing or producing lasting
          outcomes beyond the funding period.
        </li>
      </ul>

      <h2>Considerations</h2>
      <p>
        Proposals are appraised on documented need, the organisation&apos;s capacity, and the availability of
        budget within the relevant scheme. Preference is given to organisations with a clean compliance and
        audit record. Funding is not an entitlement; each proposal is assessed on merit by the competent
        authority.
      </p>
    </ContentPage>
  );
}
