import type { Metadata } from "next";
import { ContentPage } from "@/components/website-next/templates/ContentPage";

const TITLE = "Grants-in-Aid to NGOs — FAQs";
const DESCRIPTION =
  "Frequently asked questions on eligibility, application and compliance for grant-in-aid to NGOs and voluntary organisations from the Department of Social Justice & Empowerment.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
};

/* Body text: dosje.gov.in/grants-in-aid-to-ngos-faqs/ as published, read 21 Sep 2026.
   Edits: the two nested "requirement" bullet lists (Q2, "basic conditions") were wrapped
   in a redundant outer <li><ul> in the source; flattened to one list, no items removed. */
export default function Page() {
  return (
    <ContentPage
      title={TITLE}
      breadcrumb={[{ label: "Tenders & Vacancies" }, { label: "Grants to Voluntary Organisations" }]}
      description={DESCRIPTION}
      lastUpdated="06 Jun 2026"
    >
      <h2>Frequently Asked Questions</h2>

      <h3>What are the projects for which assistance is given by the Ministry?</h3>
      <p>
        The ministry currently extends assistance to Non-Governmental Organizations working for the
        welfare of disadvantaged sections of the society like Scheduled Castes, Other Backward Classes,
        Minorities, the Aged, Drug Addicts, Street Children, Disabled under schemes separately designed
        to address these target groups. Generally all these schemes support projects in the area of
        education, training, rehabilitation of the targeted groups. Recurring expenditure on components
        such as honorarium to staff, other recurring non-honorarium items such as rent, food expenses,
        contingencies, stipend to trainees/students, transport allowances and non recurring items such
        as furniture, equipments, construction of building etc are supported under these projects.
      </p>

      <h3>Who are eligible to apply for assistance?</h3>
      <ul>
        <li>Body registered under the Society&apos;s Registration Act, 1860.</li>
        <li>Public Registered Trust.</li>
        <li>Charitable Company licensed under section 25 of the Companies Act, 1958.</li>
        <li>Indian Red Cross Society or its branches.</li>
        <li>Other public institutions having a legal status.</li>
        <li>
          Body should have been registered for at least two years at the time of applying for
          assistance, and should not be running for profit to any individual or body of individuals.
        </li>
      </ul>

      <h3>What basic conditions are required to be fulfilled by an eligible organization?</h3>
      <p>The basic conditions are required to be fulfilled by an eligible organization are:</p>
      <ul>
        <li>Should have been registered for two years</li>
        <li>A minimum of two years experience on the field of activity would normally be insisted on</li>
        <li>Financial soundness and capacity to bear at least 10% of the budgeted expenditure.</li>
      </ul>

      <h3>Can an NGO get assistance for various projects under different schemes?</h3>
      <p>
        Yes, provided the eligibility criterion and basic conditions are fulfilled. However, as a matter
        of policy, the Ministry seeks to broad base the voluntary action movement and at the same time
        ensure that there is wider sectoral as well as geographical coverage, by rationalizing its
        intervention on a circumstantial and regional needs basis.
      </p>

      <h3>Does an NGO need to have experience in the field for which assistance is sought?</h3>
      <p>
        Yes. A minimum of two years of experience in the field of activity for which assistance is
        sought is necessary.
      </p>

      <h3>How does an NGO apply for assistance?</h3>
      <ul>
        <li>
          Applications for getting assistance under various schemes have to be made in prescribed
          formats and in duplicate. Separate formats have been prescribed for new projects and ongoing
          projects.
        </li>
        <li>
          These formats are available under the respective schemes in the Website from where a print
          out can be obtained.
        </li>
        <li>
          All applications for new projects need to be routed through the designated Nodal
          Agency/State Government.
        </li>
      </ul>

      <h3>Whom do I address my application to?</h3>
      <p>
        All applications or advance copy of application as the case may be will have to be addressed to
        the Joint Secretary (NGO_Division) in the Ministry of Social Justice and Empowerment
      </p>

      <h3>What are the documents that would normally be required to be enclosed with the application?</h3>
      <p>The essential documents which should be enclosed with the application for 1st Instalment or new case are:</p>
      <ol>
        <li>
          Accounts in 4 parts for the project for which grant-in-aid is sought and for the organisation
          as a whole
          <ul>
            <li>Income &amp; Expenditure Statement</li>
            <li>Receipt &amp; Payments Statement</li>
            <li>Balance Sheet</li>
            <li>Auditors Report</li>
          </ul>
        </li>
        <li>Activity/Annual Report of The Organisation for the previous year.</li>
        <li>Budget Estimates for the project for current year</li>
        <li>Details of Beneficiaries</li>
        <li>Details Managing Committee</li>
        <li>Details of Employees on Form</li>
        <li>Copy of Registration Certificate</li>
        <li>Memorandum of Association/bye-laws/Articles.</li>
        <li>Utilisation Certificate in respect of grants released in the previous year</li>
        <li>List of Assets acquired wholly or substantially out of government grants under GFR 19</li>
      </ol>

      <h3>What is the limitation on the number of projects an NGO can apply for?</h3>
      <p>
        As a norm, a single project is considered in the first instance. However, the Ministry may
        exercise its discretion in awarding more than one project depending on the need and merit of
        the case.
      </p>

      <h3>Can one propose a project to be implemented only after receipt of grant assistance?</h3>
      <p>
        No, as was pointed out in FAQ [5] at least two years experience in the field is essential. The
        Ministry may exercise its discretion in waiving this condition on special grounds for proposals
        that pertain to insurgency prone regions like J&amp;K and the North-East.
      </p>

      <h3>What is the normal time taken for sanction of grant?</h3>
      <p>
        Assuming that all requisite documents is available and up-to-date, and that funds are available
        under the schemes, the processing and final sanction of grant takes one and a half to two months
        time
      </p>

      <h3>
        Can I get assistance from the Ministry which is for a project which is currently being funded
        from other government agencies?
      </h3>
      <p>Assistance for a particular project should be accessed from only one source of funding.</p>
    </ContentPage>
  );
}
