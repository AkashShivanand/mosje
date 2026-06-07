import type { Metadata } from "next";
import { ContentPage } from "@/components/templates/ContentPage";

export const metadata: Metadata = {
  title: "Contact Person — Grant-in-Aid",
  description:
    "Contact points in the Department of Social Justice & Empowerment for queries relating to grant-in-aid to NGOs and voluntary organisations.",
};

export default function Page() {
  return (
    <ContentPage
      title="Contact Person — Grant-in-Aid"
      breadcrumb={[{ label: "Connect" }, { label: "Contact Person — Grant-in-Aid" }]}
      description="Whom to approach for assistance with grant-in-aid proposals, releases and compliance matters."
      lastUpdated="06 Jun 2026"
    >
      <h2>Overview</h2>
      <p>
        For queries relating to grant-in-aid to voluntary organisations — including eligibility, submission
        of proposals, release of funds and compliance — applicants may contact the officers of the
        Grant-in-Aid Section listed below. Applicants are requested to quote their NGO Darpan unique ID and
        proposal reference number in all correspondence.
      </p>

      <h2>Contact Points</h2>
      <ul>
        <li>
          <strong>Under Secretary (Grant-in-Aid)</strong> — Policy and sanction matters.
          <br />
          Phone: 011-2338 XXXX · Email: us-gia[at]socialjustice[dot]gov[dot]in
        </li>
        <li>
          <strong>Section Officer (Grant-in-Aid)</strong> — Proposal scrutiny and status of applications.
          <br />
          Phone: 011-2338 XXXX · Email: so-gia[at]socialjustice[dot]gov[dot]in
        </li>
        <li>
          <strong>Accounts Officer</strong> — Release of funds, PFMS and utilisation certificates.
          <br />
          Phone: 011-2338 XXXX · Email: ao-gia[at]socialjustice[dot]gov[dot]in
        </li>
      </ul>

      <h2>Postal Address</h2>
      <p>
        Grant-in-Aid Section, Department of Social Justice &amp; Empowerment, Ministry of Social Justice
        &amp; Empowerment, Shastri Bhawan, New Delhi - 110001. Office hours are 9:00 AM to 5:30 PM on
        working days. For general grievances, applicants may also use the <a href="#">public grievance
        portal</a>.
      </p>
    </ContentPage>
  );
}
