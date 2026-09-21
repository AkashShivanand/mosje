import type { Metadata } from "next";
import { Link } from "@mosje/design-system";
import { ContentPage } from "@/components/website-next/templates/ContentPage";
import { TableWrap } from "@/components/website-next/templates/content/TableWrap";

const TITLE = "Welfare of the Other Backward Classes FAQs";
const DESCRIPTION =
  "Frequently asked questions on scholarships, hostels and funding for Other Backward Classes (OBCs), published by the Department of Social Justice & Empowerment.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
};

const related = (
  <nav className="wn-panel" aria-labelledby="related-title">
    <h2 className="wn-panel__title" id="related-title">
      Related Pages
    </h2>
    <ul>
      <li>
        <Link href="/website/about-the-division-welfare-of-the-other-backward-classes">
          Welfare of the Other Backward Classes Division
        </Link>
      </li>
    </ul>
  </nav>
);

/* Body text: dosje.gov.in/welfare-of-the-other-backward-classes/ as published,
   read 21 Sep 2026 (an accordion FAQ on the live page; rendered here as
   heading + answer pairs since the body may not use interactive components).
   No typos found; the questions carry no punctuation edits beyond adding the
   heading markup. */
export default function Page() {
  return (
    <ContentPage
      title={TITLE}
      breadcrumb={[
        { label: "About" },
        { label: "Divisions", href: "/website/about-the-division" },
        { label: "Welfare of the Other Backward Classes Division", href: "/website/about-the-division-welfare-of-the-other-backward-classes" },
        { label: TITLE },
      ]}
      description={DESCRIPTION}
      lastUpdated="06 Jun 2026"
      sidebar={related}
    >
      <h2>Frequently Asked Questions</h2>

      <h3>What Are the Eligibility Conditions for Pre-Matric &amp; Post-Matric Scholarship Schemes for OBCs?</h3>
      <ul>
        <li>
          <strong>Pre-Matric Scholarship:</strong> award will be sanctioned to those OBC candidates whose
          parents&rsquo;/guardians&rsquo; income from all sources does not exceed Rs. 44500/- p.a.
        </li>
        <li>
          <strong>Post-Matric Scholarship:</strong> award will be sanctioned to those OBC candidates
          whose parents&rsquo;/guardians&rsquo; income from all sources does not exceed Rs. 1 lakh p.a.
        </li>
      </ul>

      <h3>How Does One Apply for the Scholarship?</h3>
      <p>
        The respective State&rsquo;s Department of Social Welfare/Department of Social Justice &amp;
        Empowerment/District Social Welfare Officers may be contacted.
      </p>

      <h3>Which Courses Are Covered under A, B, C, &amp; D Groups?</h3>
      <p>The scholars have been categorized in four groups A to D:</p>

      <h4>Group A</h4>
      <ul>
        <li>
          Degree and Post Graduate level courses including M.Phil., Ph.D. and Post Doctoral research in
          Medicine (Allopathic, Indian and other recognized systems of medicines), Engineering,
          Technology, Planning, Architecture, Design, Fashion Technology, Agriculture, Veterinary &amp;
          Allied Sciences, Management, Business Finance/Administration, Computer Science/Applications.
        </li>
        <li>Commercial Pilot License (including helicopter pilot and multiengine rating) course.</li>
        <li>Post Graduate Diploma course in various branches of management &amp; medicine.</li>
        <li>C.A/I.C.W.A./C.S./I.C.F.A. etc.</li>
        <li>M. Phil., Ph.D. and Post Doctoral Programmes (D. Litt., D.Sc. etc)</li>
        <li>L.L.M.</li>
      </ul>

      <h4>Group B</h4>
      <ul>
        <li>
          Graduate/Post Graduate courses leading to Degree, Diploma, Certificate in areas like Pharmacy
          (B Pharma), Nursing (B Nursing), LLB, BFS, other para-medical branches like rehabilitation,
          diagnostics etc., Mass Communication, Hotel Management &amp; Catering,
          Travel/Tourism/Hospitality Management, Interior Decoration, Nutrition &amp; Dietetics,
          Commercial Art, Financial Services (e.g. Banking, Insurance, Taxation etc.) for which entrance
          qualification is minimum Sr. Secondary (10+2).
        </li>
        <li>Post Graduate courses not covered under Group A e.g. MA/M.Sc/M.Com/M.Ed./M.Pharma etc.</li>
      </ul>

      <h4>Group C</h4>
      <p>All other courses leading to a graduate degree not covered under Group A &amp; B e.g. BA/B.Sc/B.Com etc.</p>

      <h4>Group D</h4>
      <p>
        All post-matriculation level non-degree course for which entrance qualification is High School
        (Class X), e.g. senior secondary certificate (Class XI and XII); both general and vocational
        stream, ITI courses, 3 year diploma courses in Polytechnics, etc.
      </p>

      <h3>Is There a Scholarship for CPL Training for OBCs &amp; What Are the Rates of Scholarship?</h3>
      <p>
        Under the Scheme of Post-Matric Scholarship to the students belonging to OBCs, there is a
        provision of scholarship for CPL course also. The number of awards for CPL is 20 per annum on
        first-come-first serve basis. The Scheme provides for scholarship of Rs. 5000/- per flying hour
        in single/multiengine aircraft for 200 hours.
      </p>
      <p>In addition, maintenance allowance at rates applicable to group &lsquo;A&rsquo; course will also be provided.</p>

      <h3>What Is Committed Liability?</h3>
      <p>
        The total expenditure incurred in the terminal year of the Five Year Plan under Centrally
        Sponsored Schemes of Scholarships is the committed liability of the States/UTs for every year of
        the subsequent Five Year Plan.
      </p>
      <p>However, N.E. States are exempted from the concept of committed liability.</p>

      <h3>Which Institutions/Organizations Are Eligible for Grants for Construction of Hostels for OBC Boys and Girls?</h3>
      <p>Eligibility conditions:</p>
      <p>The organizations eligible for assistance are:</p>
      <ol>
        <li>The State Government/Union Territory Administration;</li>
        <li>
          Institutions or organizations set up by Government as autonomous body under statute or as a
          society under the Registration of Societies Act, 1860 or otherwise;
        </li>
        <li>
          Well established NGOs with good track record in implementation of development scheme for
          OBCs, especially in the education sector. These organizations should have been registered for
          at least two years at the time of applying the grants under construction of Hostel Scheme for
          OBC Boys and Girls.
        </li>
      </ol>

      <h3>Who Are Eligible for Accommodation in the Hostel?</h3>
      <p>Students whose castes are included in Central/State/UT list of OBC and who do not belong to the &ldquo;Creamy Layer&rdquo;.</p>

      <h3>What Is the Existing Funding Pattern under the Scheme of Construction of Hostel for OBC Boys and Girls?</h3>
      <TableWrap label="Funding Pattern under the Scheme of Construction of Hostel for OBC Boys and Girls">
        <table>
          <caption className="sr-only">Funding Pattern under the Scheme of Construction of Hostel for OBC Boys and Girls</caption>
          <thead>
            <tr>
              <th scope="col">Recipient Agency</th>
              <th scope="col">% of Central Share</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>a. State Govt. (other than in the North East)</td>
              <td>
                Boys Hostel 60%
                <br />
                Girls Hostel 90%
              </td>
            </tr>
            <tr>
              <td>b. State Govts. in the North East including Sikkim</td>
              <td>90%</td>
            </tr>
            <tr>
              <td>c. UTs</td>
              <td>100%</td>
            </tr>
            <tr>
              <td>d. Central University/Institute</td>
              <td>90%</td>
            </tr>
            <tr>
              <td>e. NGOs</td>
              <td>
                % of Central Share: 45%
                <br />
                % of State Share: 45%
                <br />
                % of NGO Share: 10%
              </td>
            </tr>
          </tbody>
        </table>
      </TableWrap>
    </ContentPage>
  );
}
