import type { Metadata } from "next";
import { ContentPage } from "@/components/website-next/templates/ContentPage";
import { TableWrap } from "@/components/website-next/templates/content/TableWrap";

const TITLE = "Contact Person";
const DESCRIPTION = "Contact details of the accounts officers of the Department of Social Justice & Empowerment.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
};

/* Body text: dosje.gov.in/contact-person/ as published, read 21 Sep 2026 — a single table,
   no intro paragraph on the live page. Empty Intercom cells ("—") rendered as "–" per the
   estate's table convention. Telephone numbers kept as plain text (no STD code published,
   so no tel: link). No typos found. */
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
      <TableWrap label="Contact Person">
        <table>
          <caption className="sr-only">Contact Person</caption>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Designation</th>
              <th scope="col" className="num">
                Intercom
              </th>
              <th scope="col" className="num">
                Telephone (O)
              </th>
              <th scope="col">Room No.</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Dr. Deena Nath Pathak</td>
              <td>Pr. Chief Controller of Accounts</td>
              <td className="num">–</td>
              <td className="num">23382697</td>
              <td>515 &lsquo;C&rsquo; Wing</td>
            </tr>
            <tr>
              <td>Ms. N Sumati</td>
              <td>Chief Controller of Accounts</td>
              <td className="num">–</td>
              <td className="num">23380591</td>
              <td>403 &lsquo;C&rsquo; Wing</td>
            </tr>
            <tr>
              <td>B. K. Agarwal</td>
              <td>Controller of Accounts</td>
              <td className="num">–</td>
              <td className="num">23381269</td>
              <td>527 &lsquo;C&rsquo; Wing</td>
            </tr>
            <tr>
              <td>Ms. Jenny Keloung</td>
              <td>Controller of Accounts</td>
              <td className="num">–</td>
              <td className="num">23387360</td>
              <td>530-A &lsquo;C&rsquo; Wing</td>
            </tr>
            <tr>
              <td>P K Giri</td>
              <td>Sr. Accounts Officer</td>
              <td className="num">360</td>
              <td className="num">23073246 23073173(F)</td>
              <td>626 &lsquo;A&rsquo; Wing</td>
            </tr>
            <tr>
              <td>Sujit Kumar Singh</td>
              <td>Asstt. Accounts Officer</td>
              <td className="num">360</td>
              <td className="num">23073246 23073173(F)</td>
              <td>626 &lsquo;A&rsquo; Wing</td>
            </tr>
          </tbody>
        </table>
      </TableWrap>
    </ContentPage>
  );
}
