import type { Metadata } from "next";
import { ContentPage } from "@/components/website/templates/ContentPage";

export const metadata: Metadata = {
  title: "Parliamentary Assurances | Department of Social Justice & Empowerment",
  description:
    "Information on Parliamentary Assurances given by the Department of Social Justice & Empowerment — what they are and how they are tracked and fulfilled.",
};

export default function Page() {
  return (
    <ContentPage
      title="Parliamentary Assurances"
      breadcrumb={[{ label: "Documents" }, { label: "Parliamentary Assurances" }]}
      description="Commitments made on the floor of the House and the system that ensures they are honoured."
      lastUpdated="06 Jun 2026"
    >
      <h2>What are Parliamentary Assurances?</h2>
      <p>
        During the proceedings of Parliament, Ministers often make statements that constitute a
        promise or undertaking to take some action. Such statements are culled out by the Committee
        on Government Assurances of the Lok Sabha and the Rajya Sabha and are termed{" "}
        <strong>Parliamentary Assurances</strong>. Once an assurance is identified, the concerned
        Ministry or Department is required to take action and to fulfil it within the prescribed
        period.
      </p>

      <h2>How Assurances are Tracked</h2>
      <p>
        In the Department of Social Justice &amp; Empowerment, assurances are monitored centrally.
        Each assurance is allotted to the concerned division, which prepares the implementation
        report. The status is reviewed periodically to ensure timely action, and{" "}
        <strong>extensions of time</strong> are sought from the Committee where an assurance cannot
        be fulfilled within the stipulated period, with reasons.
      </p>

      <h2>Fulfilment of Assurances</h2>
      <p>
        On completion of the required action, an{" "}
        <strong>Implementation Report</strong> is laid on the Table of the House through the Ministry
        of Parliamentary Affairs, and the assurance is treated as fulfilled. The Department&rsquo;s
        endeavour is to keep pending assurances to a minimum and to honour the commitments made to
        Parliament in a transparent and time-bound manner.
      </p>

      <h2>Categories of Action</h2>
      <ul>
        <li>
          <a href="#">Assurances pending implementation</a> — those under action by the concerned
          divisions.
        </li>
        <li>
          <a href="#">Assurances fulfilled</a> — those for which Implementation Reports have been
          laid on the Table of the House.
        </li>
        <li>
          <a href="#">Requests for dropping or extension</a> — assurances proposed to be dropped or
          for which additional time has been sought, with reasons.
        </li>
      </ul>
    </ContentPage>
  );
}
