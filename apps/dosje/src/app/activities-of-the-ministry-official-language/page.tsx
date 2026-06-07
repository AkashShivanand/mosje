import type { Metadata } from "next";
import { ContentPage } from "@/components/templates/ContentPage";

export const metadata: Metadata = {
  title:
    "Official Language Activities of the Ministry | Department of Social Justice & Empowerment",
  description:
    "Activities undertaken by the Ministry to promote the use of Hindi — Hindi Pakhwada, Rajbhasha committees, training and incentive schemes.",
};

export default function Page() {
  return (
    <ContentPage
      title="Official Language Activities of the Ministry"
      breadcrumb={[{ label: "Department" }, { label: "Official Language Activities of the Ministry" }]}
      description="Initiatives that promote the progressive use of Hindi in the day-to-day work of the Ministry."
      lastUpdated="06 Jun 2026"
    >
      <h2>Overview</h2>
      <p>
        In line with the constitutional provisions and the Annual Programme issued by the Department
        of Official Language, the Ministry undertakes a range of activities to promote the
        progressive use of Hindi in official work. These activities aim to encourage officials to
        use Hindi voluntarily and to create an enabling environment for Hindi in the workplace.
      </p>

      <h2>Hindi Pakhwada &amp; Hindi Diwas</h2>
      <p>
        Every year the Ministry observes <strong>Hindi Diwas</strong> on 14 September and organises{" "}
        <strong>Hindi Pakhwada</strong>, a fortnight of activities to promote Hindi. Competitions
        such as Hindi noting and drafting, essay writing, Hindi typing, debate and quiz are held for
        officials, and prizes and certificates are awarded to encourage participation.
      </p>

      <h2>Rajbhasha Committees</h2>
      <p>
        An <strong>Official Language Implementation Committee (Rajbhasha Karyanvayan Samiti)</strong>{" "}
        is constituted in the Ministry and meets every quarter to review progress in the use of
        Hindi and to plan corrective measures. The Committee monitors the achievement of targets set
        in the Annual Programme and oversees the work of subordinate offices and attached bodies.
      </p>

      <h2>Training &amp; Incentive Schemes</h2>
      <p>
        Officials are deputed for training in Hindi language, Hindi typing and Hindi stenography
        under the Hindi Teaching Scheme. The Ministry also operates{" "}
        <strong>incentive schemes</strong> that grant cash awards to officials who do a prescribed
        quantum of their official work in Hindi, and organises Hindi workshops to build confidence in
        the day-to-day use of the language.
      </p>
    </ContentPage>
  );
}
