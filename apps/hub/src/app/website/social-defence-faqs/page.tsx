import type { Metadata } from "next";
import { ContentPage } from "@/components/website/templates/ContentPage";

export const metadata: Metadata = {
  title: "Social Defence — FAQs | Department of Social Justice & Empowerment",
  description:
    "Frequently asked questions about the Social Defence Division of DoSJE — senior citizens, drug demand reduction, transgender welfare and related schemes.",
};

const FAQS = [
  {
    q: "What does the Social Defence Division do?",
    a: "The Social Defence Division is responsible for the welfare, care, protection and rehabilitation of vulnerable groups such as senior citizens, victims of substance abuse, transgender persons and persons in situations of destitution. It formulates policy, runs schemes and coordinates with States and voluntary organisations.",
  },
  {
    q: "Which groups does the Division serve?",
    a: "The Division primarily serves senior citizens, victims of substance abuse, transgender persons, and persons engaged in the act of begging, who require care, protection and rehabilitation.",
  },
  {
    q: "What support is available for senior citizens?",
    a: "Under the Atal Vayo Abhyuday Yojana, the Department supports old-age homes, continuous care homes, physical aids and assisted-living devices, and awareness activities for the welfare of the elderly. The Maintenance and Welfare of Parents and Senior Citizens Act, 2007 provides for their maintenance and protection.",
  },
  {
    q: "How can a voluntary organisation seek assistance for a de-addiction centre?",
    a: "Eligible voluntary organisations may apply for financial assistance under the National Action Plan for Drug Demand Reduction (NAPDDR) to run Integrated Rehabilitation Centres for Addicts and other interventions, subject to the scheme guidelines and the recommendation of the State Government.",
  },
  {
    q: "What is the Nasha Mukt Bharat Abhiyaan?",
    a: "The Nasha Mukt Bharat Abhiyaan is a nationwide awareness and outreach movement against substance abuse. It engages educational institutions, youth volunteers and community organisations to spread awareness, identify dependent persons and link them to counselling and treatment.",
  },
  {
    q: "What welfare measures exist for transgender persons?",
    a: "The Transgender Persons (Protection of Rights) Act, 2019 protects their rights and provides for their welfare. Measures include the National Portal for issuing certificates of identity, scholarships, skill development under the SMILE scheme, and Garima Greh shelter homes.",
  },
  {
    q: "How can a senior citizen claim maintenance from children or relatives?",
    a: "Under the Maintenance and Welfare of Parents and Senior Citizens Act, 2007, a senior citizen or parent may apply to the Maintenance Tribunal constituted by the State Government in the concerned district, which can order monthly maintenance.",
  },
  {
    q: "Whom should I contact for more information?",
    a: "Information may be obtained from the Social Defence Division of the Department, the National Institute of Social Defence (NISD), or the concerned State Government's department dealing with social justice and empowerment.",
  },
];

export default function Page() {
  return (
    <ContentPage
      title="Social Defence — FAQs"
      breadcrumb={[{ label: "Department" }, { label: "Social Defence — FAQs" }]}
      description="Answers to common questions about the work, schemes and services of the Social Defence Division."
      lastUpdated="06 Jun 2026"
    >
      <h2>Frequently Asked Questions</h2>
      {FAQS.map((item) => (
        <div key={item.q}>
          <h3>{item.q}</h3>
          <p>{item.a}</p>
        </div>
      ))}
    </ContentPage>
  );
}
