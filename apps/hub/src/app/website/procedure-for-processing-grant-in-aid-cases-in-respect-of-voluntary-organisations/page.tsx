import type { Metadata } from "next";
import { ContentPage } from "@/components/website-next/templates/ContentPage";

const TITLE = "Procedure for Processing Grant-in-Aid Cases in Respect of Voluntary Organisations";
const DESCRIPTION =
  "The stages by which the Ministry receives, processes and disburses grant-in-aid to voluntary organisations, from application to release of funds.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
};

/* Body text: dosje.gov.in/procedure-for-processing-grant-in-aid-cases-in-respect-of-voluntary-organisations/
   as published, read 21 Sep 2026. The live page's bold-paragraph labels "(A) Application:",
   "(B) Processing of cases:", "(C) Disbursement of funds:" are converted to h2 headings.
   Typos corrected: "30thSept." -> "30th Sept."; "31stMay" -> "31st May"; "30thOctober" ->
   "30th October" (missing spaces after ordinal superscripts, which are rendered as plain
   text here since the body carries no other superscripts); "organizataions" -> "organizations". */
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
      <h2>Application</h2>
      <ol>
        <li>
          Format for making application for release of grant in aid are part of the prescribed schemes
          (which would be consolidated into a reference compendium for the use of the Voluntary
          Organizations).
        </li>
        <li>Cases for sanction of new projects should be received latest by 30th Sept. of the financial year in question.</li>
        <li>
          In respect of continuing projects, cases for first instalment shall be forwarded by the
          implementing Voluntary Organizations by 31st May and for second instalment by 30th October to
          the designated agency / State Govt. which shall be required to complete the inspection and
          ensure that the cases for release of the first and second instalments reach the Ministry by
          30th June and 30th October, respectively.
        </li>
        <li>
          In case the inspection is to be carried out by the State Govt., the District Magistrate (or
          DWO through DM) can send his/her report directly to the Ministry which shall await the State
          Government&apos;s recommendations for a period of one month and failing its receipt shall
          proceed on the recommendations made by the District Magistrate.
        </li>
      </ol>

      <h2>Processing of Cases</h2>
      <ol>
        <li>Each Voluntary Organization assisted by the Ministry will be assigned a registration number which will be used in tracking cases.</li>
        <li>Application received in the Ministry will be processed within 30 days and queries, if any, will be referred to the voluntary organization within this period.</li>
        <li>
          Funding by the Ministry is not a matter of right even if the NGO fulfils all eligibility
          conditions but the application for assistance will be considered on merits keeping in view
          the need for intervention through voluntary action in the particular sector and area, number
          of organizations already funded in the area/state and availability of financial resources
          with the Ministry. The Ministry&apos;s decision in this regard will be final.
        </li>
        <li>
          Quantum of assistance would depend on the area of operation of the voluntary organization. The
          financial norms indicated in the schemes are only indicative and the actual funding may be
          lower keeping in view the local situation. Special consideration may have to be made in the
          case of hilly and difficult areas and the island UTs.
        </li>
        <li>If the application is complete in all respects, grant in aid will be sanctioned within 45 days in eligible cases.</li>
        <li>Where voluntary organization is connected with e-mail, this facility will be used for communicating with the voluntary organization and receiving return responses.</li>
        <li>After a period of 45 days has elapsed from the receipt of application in the Ministry, the concerned voluntary organization will be entitled to obtain the status of the case through e-mail.</li>
        <li>Procedure will separately be prescribed for accelerated release of installments in case of established voluntary organizations.</li>
      </ol>

      <h2>Disbursement of Funds</h2>
      <ol>
        <li>
          After sanction order is issued by the Ministry duly filled in bond will be called from the
          voluntary organization with pre-receipted bill for the amount sanctioned to the voluntary
          organizations.
        </li>
        <li>
          Undertaking regarding immovable assets created and developed through assistance from Ministry
          devolving to local body / State Govt. / body to be prescribed by Ministry in case of
          unsatisfactory utilization of the same by voluntary organization to be furnished before
          release of funds.
        </li>
        <li>Funds will be released through Demand Draft to be issued in favour of the voluntary organization payable into designated account.</li>
        <li>The feasibility of direct transfer of funds from the Ministry&apos;s bankers to the designated bank account of the voluntary organization would be explored.</li>
      </ol>
    </ContentPage>
  );
}
