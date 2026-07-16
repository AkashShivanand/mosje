import type { Metadata } from "next";
import { ContentPage } from "@/components/website/templates/ContentPage";

export const metadata: Metadata = {
  title: "Right to Information (RTI) — Department of Social Justice & Empowerment",
  description:
    "Right to Information (RTI) disclosures under the RTI Act, 2005, and how to file an RTI application with the Department of Social Justice & Empowerment (DoSJE), Government of India.",
};

export default function RtiPage() {
  return (
    <ContentPage
      title="Right to Information (RTI)"
      breadcrumb={[{ label: "Policies" }, { label: "Right to Information (RTI)" }]}
      description="Suo-moto disclosures and the procedure to seek information from the Department of Social Justice & Empowerment under the Right to Information Act, 2005."
      lastUpdated="06 Jun 2026"
    >
      <p>
        The Right to Information Act, 2005, empowers every citizen of India to seek information from a public
        authority. As a public authority under the Act, the Department of Social Justice &amp; Empowerment
        (DoSJE), Government of India, is committed to transparency and accountability and provides the
        following information to facilitate the exercise of this right.
      </p>

      <h2>Suo-Moto Disclosures under Section 4(1)(b)</h2>
      <p>
        In accordance with Section 4(1)(b) of the RTI Act, 2005, the Department proactively discloses
        particulars of its organisation, functions and duties, including:
      </p>
      <ul>
        <li>The organisation, functions and duties of the Department;</li>
        <li>The powers and duties of its officers and employees;</li>
        <li>The procedure followed in the decision-making process, including channels of supervision and
          accountability;</li>
        <li>The norms set for the discharge of its functions;</li>
        <li>The rules, regulations, instructions, manuals and records held by it or under its control;</li>
        <li>A directory of its officers and employees and the monthly remuneration received by them;</li>
        <li>The budget allocated to each agency, indicating particulars of all plans and proposed
          expenditures;</li>
        <li>The manner of execution of subsidy programmes and details of beneficiaries of such programmes.</li>
      </ul>

      <h2>How to File an RTI Application</h2>
      <p>
        Any citizen may request information by submitting an application, in writing or through electronic
        means, in English or Hindi or in the official language of the area, to the Central Public Information
        Officer (CPIO). The application should clearly specify the particulars of the information sought. You
        may file your application in either of the following ways:
      </p>
      <ul>
        <li>
          <strong>Online:</strong> Through the RTI Online portal of the Government of India at{" "}
          <a href="https://rtionline.gov.in" rel="noopener noreferrer" target="_blank">
            https://rtionline.gov.in
          </a>
          .
        </li>
        <li>
          <strong>By post or in person:</strong> By submitting a written application addressed to the Central
          Public Information Officer of the Department, along with the prescribed fee.
        </li>
      </ul>

      <h2>Central Public Information Officer (CPIO)</h2>
      <ul>
        <li>
          <strong>Name:</strong> [CPIO name]
        </li>
        <li>
          <strong>Designation:</strong> Central Public Information Officer
        </li>
        <li>
          <strong>Address:</strong> Department of Social Justice &amp; Empowerment, [office address]
        </li>
        <li>
          <strong>Telephone:</strong> [CPIO telephone]
        </li>
        <li>
          <strong>Email:</strong> [CPIO email]
        </li>
      </ul>

      <h2>First Appellate Authority</h2>
      <p>
        If you do not receive a response within the stipulated time, or are not satisfied with the response
        received from the CPIO, you may file a first appeal with the First Appellate Authority within thirty
        days of the expiry of the prescribed period or of the receipt of the decision.
      </p>
      <ul>
        <li>
          <strong>Name:</strong> [Appellate Authority name]
        </li>
        <li>
          <strong>Designation:</strong> First Appellate Authority
        </li>
        <li>
          <strong>Address:</strong> Department of Social Justice &amp; Empowerment, [office address]
        </li>
        <li>
          <strong>Telephone:</strong> [Appellate Authority telephone]
        </li>
        <li>
          <strong>Email:</strong> [Appellate Authority email]
        </li>
      </ul>

      <h2>Fees</h2>
      <p>
        An application fee of ₹10 is payable along with the RTI application, except where the applicant is
        below the poverty line (BPL), in which case no fee is charged on production of proof. Additional fees
        may be payable for the provision of information, as prescribed under the Right to Information
        (Regulation of Fee and Cost) Rules, 2005:
      </p>
      <ul>
        <li>₹2 for each page (in A4 or A3 size) created or copied;</li>
        <li>The actual cost or price of a sample or model;</li>
        <li>For information provided on a CD or other media, the actual cost of the media;</li>
        <li>For inspection of records, no fee for the first hour, and a fee of ₹5 for each subsequent
          fifteen minutes.</li>
      </ul>
      <p>
        Fees may be paid online through the RTI Online portal, or by demand draft, banker&apos;s cheque or
        Indian Postal Order payable to the Accounts Officer of the Department.
      </p>
    </ContentPage>
  );
}
