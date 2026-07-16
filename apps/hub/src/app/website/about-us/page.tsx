import type { Metadata } from "next";
import { ContentPage } from "@/components/website/templates/ContentPage";

export const metadata: Metadata = {
  title: "About Us — Department of Social Justice & Empowerment",
  description:
    "About the Department of Social Justice & Empowerment (DoSJE), its target groups, mandate, and history.",
};

const TARGET_GROUPS = [
  "Scheduled Castes",
  "Other Backward Classes",
  "Senior Citizens",
  "Victims of Substance Abuse",
  "Denotified, Nomadic and Semi Nomadic Tribes",
  "Manual Scavengers",
  "Sewer & Septic Tank workers",
  "Waste Pickers",
];

const HISTORY = [
  {
    title: "Formation of the Ministry of Welfare",
    body: "In the year 1985-86, the erstwhile Ministry of Welfare was bifurcated into the Department of Women and Child Development and the Department of Welfare. Simultaneously, the Scheduled Castes Development Division, Tribal Development Division and the Minorities and Backward Classes Welfare Division were moved from the Ministry of Home Affairs and also the Wakf Division from the Ministry of Law to form the then Ministry of Welfare.",
  },
  {
    title: "Renamed as Ministry of Social Justice & Empowerment",
    body: "Subsequently, the name of the Ministry was changed to the Ministry of Social Justice & Empowerment in May, 1998.",
  },
  {
    title: "Formation of the Ministry of Tribal Affairs",
    body: "Further, in October, 1999, the Tribal Development Division had moved out to form a separate Ministry of Tribal Affairs.",
  },
  {
    title: "Formation of Separate Ministries for Minorities and Women & Child Development",
    body: "In January, 2007, the Minorities Division along with Wakf Unit have been moved out of the Ministry and formed as a separate Ministry and the Child Development Division has gone to the Ministry of Women & Child Development.",
  },
  {
    title: "Government's Commitment to the Disability Sector",
    body: "Though the subject of “Disability” figures in the State List in the Seventh Schedule of the Constitution, the Government of India has always been proactive in the disability sector, running National Institutes dealing with various types of disabilities and implementing welfare schemes for persons with disabilities.",
  },
];

export default function AboutPage() {
  return (
    <ContentPage
      title="About Us"
      breadcrumb={[{ label: "Department" }, { label: "About Us" }]}
      description="Discover the Commissions, Corporations, Institutes and Foundations that work collectively towards social justice, inclusion and empowerment across India."
      lastUpdated="06 Jun 2026"
    >
      <h2>Overview</h2>
      <p>
        The Department of Social Justice &amp; Empowerment is entrusted with the empowerment of the
        disadvantaged and marginalized sections of the society. The target groups of the Ministry are:
      </p>
      <ul>
        {TARGET_GROUPS.map((g) => (
          <li key={g}>{g}</li>
        ))}
      </ul>
      <p>
        The Ministry has been implementing various programmes/schemes for social, educational and
        economic development of the target groups. As a result there has been considerable improvement
        in the welfare of these groups. Due to discontinuance of caste census after 1931, disaggregated
        demographic data for OBCs is not available. The Mandal Commission had estimated OBC population at
        52% of the total population. Similarly, authentic data for Victims of Substance Abuse is not
        available. At least 1% of the population is understood to be addicted.
      </p>

      <h2>Our History</h2>
      <p>Evolution of the Department Over Time.</p>
      {HISTORY.map((m) => (
        <div key={m.title}>
          <h4>{m.title}</h4>
          <p>{m.body}</p>
        </div>
      ))}
    </ContentPage>
  );
}
