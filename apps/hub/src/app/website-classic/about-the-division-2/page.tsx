import type { Metadata } from "next";
import { ContentPage } from "@/components/website/templates/ContentPage";

export const metadata: Metadata = {
  title:
    "About the Division — Administration & Coordination | Department of Social Justice & Empowerment",
  description:
    "The Administration & Coordination Division of DoSJE handles establishment, personnel, coordination, vigilance and general administration functions of the Department.",
};

export default function Page() {
  return (
    <ContentPage
      title="About the Division — Administration & Coordination"
      breadcrumb={[
        { label: "Department" },
        { label: "About the Division — Administration & Coordination" },
      ]}
      description="The Division that keeps the Department running — managing people, processes and inter-divisional coordination."
      lastUpdated="06 Jun 2026"
    >
      <h2>Mandate</h2>
      <p>
        The Administration &amp; Coordination Division is responsible for the general administration
        of the Department of Social Justice &amp; Empowerment. It provides the institutional
        backbone that enables the policy and scheme divisions to function smoothly, and serves as the
        central point for coordination across the Department and with other Ministries.
      </p>

      <h2>Establishment &amp; Personnel</h2>
      <p>
        The Division manages all <strong>establishment and personnel matters</strong>, including
        recruitment, postings and transfers, promotions, service records, pay and allowances,
        pensionary benefits, and the cadre management of officers and staff. It also oversees
        welfare measures for employees and the implementation of service rules and conduct rules.
      </p>

      <h2>Coordination Functions</h2>
      <p>
        As the coordinating arm of the Department, the Division compiles inputs for{" "}
        <strong>Parliament Questions, Cabinet notes, and inter-ministerial consultations</strong>,
        and coordinates the preparation of the Annual Report, the Citizens&rsquo; Charter and
        Results-Framework documents. It liaises with the Department&rsquo;s autonomous bodies,
        corporations and institutes to ensure timely flow of information and consistent reporting.
      </p>

      <h2>General Administration</h2>
      <p>
        The Division also handles general administration functions such as office space and
        infrastructure, records management, official-language compliance, hospitality, security and
        the implementation of e-Office and other administrative reforms aimed at improving
        efficiency and transparency.
      </p>
    </ContentPage>
  );
}
