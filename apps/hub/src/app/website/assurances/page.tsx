import type { Metadata } from "next";
import { ContentPage } from "@/components/website-next/templates/ContentPage";
import { TableWrap } from "@/components/website-next/templates/content/TableWrap";

const TITLE = "Assurances";
const DESCRIPTION =
  "Guidelines and instructions on handling Parliamentary Assurances given by the Department, with frequently asked questions.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
};

/*
 * Body text: dosje.gov.in/assurances/ as published, read 21 Sep 2026.
 * Typos corrected (recorded per rule 91):
 *  - "Ministry Vis-à-vis handling" -> "Ministry vis-à-vis handling" (stray
 *    mid-sentence capital).
 *  - "ROCEDURE FOR FULFILLMENT OF ASSURANCE" -> "PROCEDURE FOR FULFILLMENT OF
 *    ASSURANCE" (dropped initial letter).
 *  - Missing space after a full stop: "Ministry of Parliamentary
 *    Affairs.The implementation reports" -> "Affairs. The implementation
 *    reports".
 *  - "Committee on Government assurances" -> "Committee on Government
 *    Assurances", matching the same proper noun's capitalisation everywhere
 *    else on the page.
 *  - Missing spaces after colons in the FAQ table: "copies(Hindi/English)" ->
 *    "copies (Hindi/English)"; "Ph:23034318" -> "Ph: 23034318";
 *    "Phone:23035493" -> "Phone: 23035493".
 * The FAQ table's own row numbering (1–5, then 7–8, skipping 6) is kept as
 * published — it is the Department's numbering, not a rendering fault.
 */
export default function Page() {
  return (
    <ContentPage
      title={TITLE}
      breadcrumb={[{ label: "Department" }, { label: "Parliamentary Matters" }, { label: TITLE }]}
      description={DESCRIPTION}
      lastUpdated="06 Jun 2026"
    >
      <h2>Guidelines and Instructions on Assurances – Frequently Asked Questions (FAQ)</h2>
      <p>
        Doubts have been expressed by various Divisions of this Ministry vis-à-vis handling
        Parliamentary Assurances. The following instructions may be adhered to while handling
        Parliamentary Assurances.
      </p>

      <h3>Definition</h3>
      <p>
        During the course of reply given to a question or a discussion, if a Minister gives an
        undertaking which involves further action on the part of the Government in reporting back
        to the House, it is called an &lsquo;assurance&rsquo;.
      </p>

      <h3>Dropping of Assurance</h3>
      <p>
        Requests for dropping of Assurance should have the approval of Hon&rsquo;ble Minister and
        this fact should be indicated in the communication containing the request to the Lok
        Sabha/Rajya Sabha Secretariat. If such a request is made towards the end of the stipulated
        period of three months, then it should invariably be accompanied with a request for
        extension of time.
      </p>
      <p>
        <em>
          The department should continue to seek extension of time till a decision of the
          Committee on Government Assurances is received by them.
        </em>{" "}
        Copy of the above communications should be simultaneously endorsed to the Ministry of
        Parliamentary Affairs.
      </p>

      <h3>Extension of Time for Fulfilling Assurance</h3>
      <p>
        If the department finds that it is not possible to fulfil the assurance within the
        stipulated period of three months or within the period of extension already granted, it
        may seek further extension of time direct from the respective Committee on Government
        Assurances under intimation to the Ministry of Parliamentary Affairs, indicating the
        reasons for delay and the probable additional time required.
      </p>
      <p>
        <em>Such a communication should be issued with the approval of the Minister.</em>
      </p>

      <h3>Procedure for Fulfilment of Assurance</h3>
      <p>
        Information of an assurance should be approved by the Minister concerned and 15 copies
        thereof (bilingual) in the prescribed proforma, together with its enclosures, along with
        one copy each in Hindi and English duly authenticated by the officer forwarding the
        implementation report, should be sent to the Ministry of Parliamentary Affairs. The
        implementation reports should be sent to the Ministry of the Parliamentary Affairs and not
        to the Lok/Rajya Sabha Secretariat.
      </p>

      <h3>Laying of Implementation Report</h3>
      <p>
        A copy of the statement, as laid on the Table, will be forwarded by the Ministry of
        Parliamentary Affairs to the member as well as the department concerned. The Parliament
        Unit of the department concerned and the concerned section will, on the basis of this
        statement, make a suitable entry in their registers.
      </p>

      <h3>Effect of Assurances on Dissolution of Lok Sabha</h3>
      <p>
        On dissolution of the Lok Sabha, all assurances, promises or undertakings pending
        implementation are scrutinised by the new Committee on Government Assurances for selection
        of such of them as are of considerable public importance. The Committee then submits a
        report to the Lok Sabha with a specific recommendation regarding the assurances to be
        dropped or retained for implementation by the Government.
      </p>

      <h2>FAQs</h2>
      <TableWrap label="Assurances — Frequently Asked Questions">
        <table>
          <caption className="sr-only">Assurances — Frequently Asked Questions</caption>
          <thead>
            <tr>
              <th scope="col" className="num">
                #
              </th>
              <th scope="col">Issue</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="num">1</td>
              <td>Is Extension required post sending Implementation Report?</td>
              <td>
                Yes. As per practice, till such time, the IR is laid in the respective House and
                the information of the same has been received in this Ministry.
              </td>
            </tr>
            <tr>
              <td className="num">2</td>
              <td>Laying?</td>
              <td>
                As per practice, a copy of the statement, as laid on the Table, will be forwarded
                by the Ministry of Parliamentary Affairs to the member as well as the department
                concerned. Till such time extensions shall have to be sought.
              </td>
            </tr>
            <tr>
              <td className="num">3</td>
              <td>Dropping?</td>
              <td>
                The department should continue to seek extension of time till a decision of the
                Committee on Government Assurances is received by them.
              </td>
            </tr>
            <tr>
              <td className="num">4</td>
              <td>Implementation Report?</td>
              <td>
                The implementation reports should be sent to the Ministry of the Parliamentary
                Affairs and not to the Lok/Rajya Sabha Secretariat. Till such time the
                confirmation of implementation is received, the extension shall have to be sought.
              </td>
            </tr>
            <tr>
              <td className="num">5</td>
              <td>No. of Copies?</td>
              <td>
                15 bilingual copies (Hindi/English) but in such cases where the members are more
                than one, additional copies may be sent.
              </td>
            </tr>
            <tr>
              <td colSpan={3}>
                <strong>For Further Enquiry</strong>
                <br />
                <strong>Committee on Government Assurances/Dropping/Seeking Extension to Assurance</strong>
              </td>
            </tr>
            <tr>
              <td className="num">7</td>
              <td>Lok Sabha</td>
              <td>
                Shri Kulvinder Singh, Committee Officer
                <br />
                Lok Sabha Secretariat, Ph: 23034318
              </td>
            </tr>
            <tr>
              <td className="num">8</td>
              <td>Rajya Sabha</td>
              <td>
                Shri Anil Kumar Saini, Committee Officer
                <br />
                Rajya Sabha Secretariat, Ph: 23034538
              </td>
            </tr>
            <tr>
              <td colSpan={3}>
                <strong>Laying of Implementation Report:</strong>
                <br />
                <strong>Implementation Cell: Ministry of Parliamentary Affairs</strong>
              </td>
            </tr>
            <tr>
              <td colSpan={3}>
                Shri A. B. Acharya, Under Secretary, Phone: 23035493
                <br />
                Shri Kiran Kumar, Section Officer, Phone: 23035489
              </td>
            </tr>
          </tbody>
        </table>
      </TableWrap>
    </ContentPage>
  );
}
