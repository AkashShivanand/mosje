import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { ContentPage } from "@/components/templates/ContentPage";

interface Scheme {
  title: string;
  abbr: string;
  targetGroup: string;
  type: "Central Sector" | "Centrally Sponsored";
  agency: string;
  applyLabel: string;
  applyHref: string;
  overview: string[];
  objectives: string[];
  eligibility: string[];
  benefits: string[];
}

const SCHEMES: Record<string, Scheme> = {
  "pm-ajay": {
    title: "Pradhan Mantri Anusuchit Jaati Abhyuday Yojna",
    abbr: "PM-AJAY",
    targetGroup: "Scheduled Caste villages, families & students",
    type: "Centrally Sponsored",
    agency: "Department of Social Justice & Empowerment, Government of India",
    applyLabel: "Apply on PM-AJAY Portal",
    applyHref: "https://pmajay.dosje.gov.in",
    overview: [
      "Pradhan Mantri Anusuchit Jaati Abhyuday Yojna (PM-AJAY) is an umbrella scheme launched by merging three erstwhile schemes — Pradhan Mantri Adarsh Gram Yojana (PMAGY), the Special Central Assistance to Scheduled Castes Sub Plan (SCA to SCSP), and the Babu Jagjivan Ram Chhatrawas Yojana (BJRCY).",
      "The scheme aims to reduce poverty among Scheduled Caste communities by generating additional employment opportunities through skill development, income-generating schemes and other initiatives, and by improving the socio-economic indicators of SC-dominated villages.",
    ],
    objectives: [
      "Develop SC-majority villages into model 'Adarsh Grams' with adequate infrastructure and socio-economic development",
      "Provide grants-in-aid for socio-economic betterment of SC communities",
      "Construct hostels to enable students from SC communities to pursue higher education",
      "Reduce the gap in key socio-economic indicators between SC and non-SC populations",
    ],
    eligibility: [
      "Villages with a Scheduled Caste population of 50% or more (for the Adarsh Gram component)",
      "Below-poverty-line households belonging to Scheduled Castes (for the grants-in-aid component)",
      "SC students enrolled in recognised schools, colleges and universities (for the hostel component)",
      "Implementing State Governments and Union Territory administrations",
    ],
    benefits: [
      "Central assistance for infrastructure and development projects in Adarsh Grams, viability-gap funding for income-generating assets, and construction of hostels for SC students.",
    ],
  },
  "pm-yasasvi": {
    title: "PM Young Achievers Scholarship Award Scheme for Vibrant India",
    abbr: "PM-YASASVI",
    targetGroup: "OBC, EBC and DNT students (Classes 9–12)",
    type: "Central Sector",
    agency: "Department of Social Justice & Empowerment, Government of India",
    applyLabel: "Apply on NTA YASASVI Portal",
    applyHref: "https://yet.nta.ac.in",
    overview: [
      "PM Young Achievers Scholarship Award Scheme for Vibrant India (PM-YASASVI) is an umbrella scheme for the welfare of students belonging to Other Backward Classes (OBC), Economically Backward Classes (EBC) and Denotified, Nomadic and Semi-Nomadic Tribes (DNT).",
      "It provides pre-matric and post-matric scholarships and top-class school and college education support to meritorious students from these communities, enabling them to complete their education without financial hardship.",
    ],
    objectives: [
      "Provide financial assistance to OBC, EBC and DNT students for school and college education",
      "Improve enrolment and retention rates among backward-class students",
      "Support meritorious students to study in top-class schools and colleges",
      "Promote equity of educational opportunity for socially and educationally backward groups",
    ],
    eligibility: [
      "Students belonging to OBC, EBC or DNT categories notified by the Central Government",
      "Annual family income from all sources not exceeding ₹2.5 lakh",
      "Students studying in Classes 9 to 12 in recognised institutions",
      "Selection through the YASASVI Entrance Test conducted by the National Testing Agency (NTA)",
    ],
    benefits: [
      "Scholarships covering tuition fees, academic allowances and hostel charges, along with admission support in top-class schools and colleges for selected meritorious students.",
    ],
  },
  "pre-matric-scholarship-sc": {
    title: "Pre-Matric Scholarship for Scheduled Caste Students",
    abbr: "Pre-Matric SC",
    targetGroup: "Scheduled Caste students (Classes 9 & 10)",
    type: "Centrally Sponsored",
    agency: "Department of Social Justice & Empowerment, Government of India",
    applyLabel: "Apply on National Scholarship Portal",
    applyHref: "https://scholarships.gov.in",
    overview: [
      "The Pre-Matric Scholarship for Scheduled Caste Students supports the education of SC children studying in Classes 9 and 10, the stage at which the dropout rate among these students is highest.",
      "By defraying the cost of pre-matric education, the scheme encourages SC parents to send their children to school and helps retain them up to the matriculation level.",
    ],
    objectives: [
      "Reduce the dropout rate among Scheduled Caste students at the pre-matriculation stage",
      "Support the cost of education for SC students in Classes 9 and 10",
      "Promote universalisation of education up to the secondary level",
      "Provide an incentive for the schooling of children of families engaged in unclean occupations",
    ],
    eligibility: [
      "Students belonging to the Scheduled Castes notified by the Central Government",
      "Studying in Class 9 or Class 10 in a Government or recognised institution",
      "Annual parental/guardian income not exceeding ₹2.5 lakh from all sources",
      "Not in receipt of any other pre-matric scholarship for the same purpose",
    ],
    benefits: [
      "A monthly maintenance allowance for day-scholars and hostellers, an annual ad-hoc grant for books and stationery, and reimbursement of compulsory non-refundable fees.",
    ],
  },
  "post-matric-scholarship-sc": {
    title: "Post-Matric Scholarship for Scheduled Caste Students",
    abbr: "Post-Matric SC",
    targetGroup: "Scheduled Caste students (post-matriculation)",
    type: "Centrally Sponsored",
    agency: "Department of Social Justice & Empowerment, Government of India",
    applyLabel: "Apply on National Scholarship Portal",
    applyHref: "https://scholarships.gov.in",
    overview: [
      "The Post-Matric Scholarship for Scheduled Caste Students is the flagship scheme of the Department, providing financial assistance to SC students pursuing studies beyond the matriculation level.",
      "It covers a wide range of recognised courses — from higher secondary and graduation to professional, technical and doctoral programmes — to enable SC students to complete their post-matric education.",
    ],
    objectives: [
      "Provide financial assistance to SC students studying at the post-matriculation stage",
      "Enable completion of higher, professional and technical education",
      "Improve participation of Scheduled Caste students in higher education",
      "Bridge the socio-economic gap through educational empowerment",
    ],
    eligibility: [
      "Students belonging to the Scheduled Castes notified by the Central Government",
      "Pursuing recognised post-matriculation or post-secondary courses",
      "Annual parental/guardian income not exceeding ₹2.5 lakh from all sources",
      "Indian nationals studying in recognised institutions within India",
    ],
    benefits: [
      "Reimbursement of compulsory non-refundable fees, a monthly maintenance allowance, study-tour charges, thesis-typing/printing charges and book allowances as per the prescribed course group.",
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(SCHEMES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const scheme = SCHEMES[slug];
  if (!scheme) return { title: "Scheme — DoSJE" };
  return {
    title: `${scheme.title} (${scheme.abbr}) — DoSJE`,
    description: scheme.overview[0],
  };
}

export default async function SchemeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const scheme = SCHEMES[slug];
  if (!scheme) notFound();

  return (
    <ContentPage
      title={scheme.title}
      breadcrumb={[
        { label: "Offerings" },
        { label: "Schemes & Services", href: "/schemes-services" },
        { label: scheme.abbr },
      ]}
      description={`${scheme.abbr} — ${scheme.type} Scheme`}
      lastUpdated="06 Jun 2026"
      sidebar={
        <div className="rounded-xl border border-gray-200 bg-surface-muted p-5 text-[14px]">
          <h2 className="mb-4 text-[15px] font-semibold text-gov-blue-dark">Key Information</h2>
          <dl className="space-y-3">
            <div>
              <dt className="font-semibold text-ink">Target Group</dt>
              <dd className="text-ink-muted">{scheme.targetGroup}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Type</dt>
              <dd className="text-ink-muted">{scheme.type}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Implementing Agency</dt>
              <dd className="text-ink-muted">{scheme.agency}</dd>
            </div>
          </dl>
          <a
            href={scheme.applyHref}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-saffron px-4 py-2 text-[14px] font-semibold text-white transition-colors hover:bg-saffron/90"
          >
            {scheme.applyLabel}
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      }
    >
      <h2>Overview</h2>
      {scheme.overview.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
      <h2>Objectives</h2>
      <ul>
        {scheme.objectives.map((o) => (
          <li key={o}>{o}</li>
        ))}
      </ul>
      <h2>Eligibility</h2>
      <ul>
        {scheme.eligibility.map((e) => (
          <li key={e}>{e}</li>
        ))}
      </ul>
      <h2>Benefits</h2>
      {scheme.benefits.map((b, i) => (
        <p key={i}>{b}</p>
      ))}
    </ContentPage>
  );
}
