import type { Metadata } from "next";
import { ContentPage } from "@/components/website-next/templates/ContentPage";

const TITLE = "Inspection and Monitoring Procedure";
const DESCRIPTION =
  "How the Department inspects and monitors the working of voluntary organisations assisted through grant-in-aid.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
};

/* Body text: dosje.gov.in/inspection-and-monitoring-procedure/ as published, read 21 Sep 2026 —
   a single numbered list, no sub-headings on the live page. Typos corrected: "State Panel /
   State Government.The" -> "State Panel / State Government. The" (missing space after full
   stop); "such tasks.Keeping" -> "such tasks. Keeping"; "on half yearly basis.This shall
   enable comparisonwith" -> "on half yearly basis. This shall enable comparison with";
   "Institues" -> "Institutes"; "assisted Voluntary Organization.These agencies" -> "assisted
   Voluntary Organization. These agencies". */
export default function Page() {
  return (
    <ContentPage
      title={TITLE}
      breadcrumb={[
        { label: "Tenders & Vacancies" },
        { label: "Grants to Voluntary Organisations", href: "/website/grants-in-aid-to-ngos-faqs" },
        { label: TITLE },
      ]}
      description={DESCRIPTION}
      lastUpdated="06 Jun 2026"
    >
      <ol>
        <li>
          State-wise panels would be prepared by each Bureau / NGO Division. The application for the
          new projects would be sanctioned on the recommendation of the State Panel / State Government.
        </li>
        <li>
          The assisted voluntary organization would be required to submit annual reports in the
          prescribed format indicating physical achievements and utilization progress regarding
          released funds.
        </li>
        <li>
          In addition, voluntary organizations shall be required to incorporate in their report the
          actual number of beneficiaries who may have been rehabilitated in different callings where
          the voluntary organizations are involved in such tasks. Keeping data on this aspect also
          would help the Ministry to make an assessment of the impact of its policies on the ultimate
          beneficiary and also help in grading voluntary organizations.
        </li>
        <li>
          The Annual Report that would be submitted shall include the details of the entire gamut of
          their activities and the financial assistance they may be receiving from all the sources for
          all the projects they are undertaking. Financial assistance received under any head may also
          be included in the report with the purpose for which the assistance may have been extended.
        </li>
        <li>Periodic interaction on regional basis between voluntary organizations, beneficiaries, and Ministry&apos;s officials should be arranged.</li>
        <li>Whenever funds are released, information about it should be sent to the District authorities, Zila Parishad, the MP and MLA representing the region.</li>
        <li>
          In a prescribed format, the voluntary organization should report the progress achieved on
          half yearly basis. This shall enable comparison with the project projections that may have
          made at the beginning of the year.
        </li>
        <li>
          State-wise panels of designated agencies would be prepared by each bureau/NGO Division for
          carrying out periodic physical inspection of the working of the assisted Voluntary
          Organization. These agencies could be the National Institutes, Institutes of Social work
          Universities etc. in the respective States.
        </li>
        <li>For ongoing projects, inspection would be carried out by teams deputed by the designated agency for this purpose.</li>
        <li>Inspection would be carried out by Ministry officials each year in 5% of the cases.</li>
        <li>
          The designated agency would be released an amount of Rs. 3000/- per month or the amount that
          may be agreed upon for the maintenance of records and would perform its role as such for a
          period of two years.
        </li>
        <li>
          The inspection team from the designated agency shall also be paid remuneration that would not
          exceed 1% of the assistance that is being given to the NGO and which would further be subject
          to the ceilings prescribed from time to time by the Ministry.
        </li>
      </ol>
    </ContentPage>
  );
}
