import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ContentPage } from "@/components/templates/ContentPage";

interface Org {
  name: string;
  abbr: string;
  logo?: string;
  type: string;
  established: string;
  website: string;
  about: string[];
  functions: string[];
}

const ORGS: Record<string, Org> = {
  "national-commission-for-scheduled-castes": {
    name: "National Commission for Scheduled Castes",
    abbr: "NCSC",
    type: "Constitutional Body",
    established: "2004 (Article 338)",
    website: "https://ncsc.nic.in",
    about: [
      "The National Commission for Scheduled Castes (NCSC) is a constitutional body established under Article 338 of the Constitution of India to safeguard the interests of the Scheduled Castes.",
      "It investigates and monitors matters relating to the constitutional and legal safeguards provided to Scheduled Castes and inquires into specific complaints regarding deprivation of rights.",
    ],
    functions: [
      "Investigate and monitor safeguards for Scheduled Castes",
      "Inquire into specific complaints of rights violations",
      "Advise on socio-economic development planning",
      "Present reports to the President on the working of safeguards",
    ],
  },
  "national-commission-for-safai-karamcharis": {
    name: "National Commission for Safai Karamcharis",
    abbr: "NCSK",
    type: "Statutory / Non-Statutory Body",
    established: "1994",
    website: "https://ncsk.nic.in",
    about: [
      "The National Commission for Safai Karamcharis (NCSK) was set up to promote the welfare of Safai Karamcharis and to monitor the implementation of the Prohibition of Employment as Manual Scavengers and their Rehabilitation Act, 2013.",
    ],
    functions: [
      "Monitor implementation of the Manual Scavengers Act, 2013",
      "Investigate grievances of Safai Karamcharis",
      "Recommend welfare and rehabilitation measures",
    ],
  },
  "national-commission-for-backward-classes-ncbc": {
    name: "National Commission for Backward Classes",
    abbr: "NCBC",
    type: "Constitutional Body",
    established: "2018 (Article 338B)",
    website: "https://ncbc.nic.in",
    about: [
      "The National Commission for Backward Classes (NCBC) was granted constitutional status under the 102nd Amendment Act, 2018 (Article 338B) to safeguard the interests of socially and educationally backward classes.",
    ],
    functions: [
      "Examine requests for inclusion in the Central OBC list",
      "Hear grievances of backward classes",
      "Advise on socio-economic development",
    ],
  },
  "dr-ambedkar-foundation": {
    name: "Dr. Ambedkar Foundation",
    abbr: "DAF",
    type: "Autonomous Body",
    established: "1992",
    website: "https://ambedkarfoundation.nic.in",
    about: [
      "The Dr. Ambedkar Foundation (DAF) was set up to promote and propagate the ideology and message of Dr. B. R. Ambedkar and to implement various schemes and programmes in his memory.",
    ],
    functions: [
      "Administer Dr. Ambedkar National Award schemes",
      "Run Dr. Ambedkar International Centre programmes",
      "Promote Ambedkarite literature and scholarships",
    ],
  },
  nsfdc: {
    name: "National Scheduled Castes Finance and Development Corporation",
    abbr: "NSFDC",
    logo: "/images/nsfdc-1.png",
    type: "Section 8 Company (Govt of India undertaking)",
    established: "1989",
    website: "https://nsfdc.nic.in",
    about: [
      "NSFDC provides concessional finance for income-generating activities and skill development to persons belonging to Scheduled Castes living below double the poverty line.",
    ],
    functions: [
      "Provide concessional loans for self-employment",
      "Fund skill development and training",
      "Support micro-credit through channel partners",
    ],
  },
  nbcfdc: {
    name: "National Backward Classes Finance and Development Corporation",
    abbr: "NBCFDC",
    logo: "/images/NBCFDC.png",
    type: "Section 8 Company (Govt of India undertaking)",
    established: "1992",
    website: "https://nbcfdc.gov.in",
    about: [
      "NBCFDC provides concessional financial assistance for the economic empowerment of Other Backward Classes living below double the poverty line.",
    ],
    functions: [
      "Concessional term loans for self-employment",
      "Education and skill-development loans",
      "Micro-finance through State Channelising Agencies",
    ],
  },
  nskfdc: {
    name: "National Safai Karamcharis Finance and Development Corporation",
    abbr: "NSKFDC",
    logo: "/images/Logo-NSKFDC.png",
    type: "Section 8 Company (Govt of India undertaking)",
    established: "1997",
    website: "https://nskfdc.nic.in",
    about: [
      "NSKFDC works for the socio-economic upliftment of Safai Karamcharis, Manual Scavengers and their dependants by providing concessional finance and skill development.",
      "It is the apex corporation for the eradication of manual scavenging and the rehabilitation of liberated manual scavengers.",
    ],
    functions: [
      "Concessional loans for sanitation-related and other livelihoods",
      "Skill development and capacity building",
      "Implementation of mechanised sanitation schemes",
    ],
  },
  nisd: {
    name: "National Institute of Social Defence",
    abbr: "NISD",
    logo: "/images/NISD-.png",
    type: "Autonomous Body",
    established: "1961",
    website: "https://nisd.gov.in",
    about: [
      "The National Institute of Social Defence (NISD) is the apex training and research institute in the field of social defence, focusing on drug-abuse prevention, senior-citizen care and welfare of transgender persons.",
    ],
    functions: [
      "Training and human-resource development in social defence",
      "Research and documentation",
      "Capacity building of NGOs and field functionaries",
    ],
  },
  dwbdnc: {
    name: "Development and Welfare Board for De-notified, Nomadic and Semi-Nomadic Communities",
    abbr: "DWBDNC",
    type: "Welfare Board",
    established: "2019",
    website: "https://socialjustice.gov.in",
    about: [
      "The Board formulates and implements welfare and development programmes for De-notified, Nomadic and Semi-Nomadic Communities (DNCs) and identifies communities not yet covered by existing schemes.",
    ],
    functions: [
      "Implement welfare schemes for DNT/NT/SNT communities",
      "Identify communities for inclusion under reservation/welfare",
      "Coordinate with States on DNT development",
    ],
  },
  "national-overseas-scholarship": {
    name: "National Overseas Scholarship",
    abbr: "NOS",
    logo: "/images/NOS-Logo.png",
    type: "Central Sector Scheme",
    established: "1954-55",
    website: "https://nosmsje.gov.in",
    about: [
      "The National Overseas Scholarship (NOS) provides financial assistance to meritorious students from Scheduled Castes, De-notified Nomadic and Semi-Nomadic Tribes, Landless Agricultural Labourers and Traditional Artisans to pursue Master's and Ph.D. programmes abroad.",
    ],
    functions: [
      "Fund tuition and maintenance for overseas Master's/Ph.D.",
      "Select awardees through a transparent merit process",
      "Support globally competitive higher education for SCs",
    ],
  },
  nmba: {
    name: "Nasha Mukt Bharat Abhiyaan",
    abbr: "NMBA",
    logo: "/images/NMBA-1.png",
    type: "Flagship Campaign",
    established: "2020",
    website: "https://nmba.dosje.gov.in",
    about: [
      "Nasha Mukt Bharat Abhiyaan (NMBA) is a nationwide flagship campaign for a drug-free India, combining awareness generation, community outreach and de-addiction support.",
    ],
    functions: [
      "Community outreach and awareness against substance abuse",
      "Engagement of youth, volunteers and educational institutions",
      "Coordination of de-addiction and rehabilitation services",
    ],
  },
  "pm-ajay": {
    name: "Pradhan Mantri Anusuchit Jaati Abhyuday Yojna",
    abbr: "PM-AJAY",
    logo: "/images/PM-AJAY-logo.png",
    type: "Centrally Sponsored Scheme",
    established: "2021-22",
    website: "https://pmajay.dosje.gov.in",
    about: [
      "PM-AJAY merges three erstwhile schemes to reduce poverty among Scheduled Caste communities through income-generating opportunities, skill development and adequate infrastructure in SC-majority villages (Adarsh Grams).",
    ],
    functions: [
      "Develop Adarsh Grams in SC-majority villages",
      "Grants-in-aid for district/State-level SC development projects",
      "Construction of hostels for SC students",
    ],
  },
  "senior-citizens-welfare": {
    name: "Senior Citizens Welfare",
    abbr: "SCW",
    type: "Welfare Programme",
    established: "—",
    website: "https://socialjustice.gov.in",
    about: [
      "The Senior Citizens Welfare programmes promote the dignity, care and well-being of older persons through schemes such as the Atal Vayo Abhyuday Yojana (AVYAY) and the implementation of the Maintenance and Welfare of Parents and Senior Citizens Act, 2007.",
    ],
    functions: [
      "Support old-age homes and continuous-care institutions",
      "Provide assistive aids and devices to senior citizens",
      "Implement the MWPSC Act, 2007",
    ],
  },
  "transgender-portal": {
    name: "National Portal for Transgender Persons",
    abbr: "SMILE",
    logo: "/images/Logo-Transgender-Portal-1.png",
    type: "Scheme / e-Service Portal",
    established: "2020",
    website: "https://transgender.dosje.gov.in",
    about: [
      "The National Portal for Transgender Persons enables transgender individuals to apply online for a Certificate of Identity and Identity Card, and connects them to welfare and livelihood support under the SMILE scheme.",
    ],
    functions: [
      "Online issuance of transgender identity certificates & cards",
      "Access to welfare, education and livelihood support",
      "Grievance redressal for transgender persons",
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(ORGS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const org = ORGS[slug];
  if (!org) return { title: "Organisation — DoSJE" };
  return { title: `${org.name} (${org.abbr}) — DoSJE`, description: org.about[0] };
}

export default async function OrganisationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const org = ORGS[slug];
  if (!org) notFound();

  return (
    <ContentPage
      title={org.name}
      breadcrumb={[{ label: "Associated Organisations" }, { label: org.abbr }]}
      description={`${org.abbr} — ${org.type}`}
      lastUpdated="06 Jun 2026"
      sidebar={
        <div className="rounded-xl border border-gray-200 bg-surface-muted p-5 text-[14px]">
          {org.logo && (
            <Image src={org.logo} alt={`${org.abbr} logo`} width={120} height={60} className="mb-4 h-14 w-auto" />
          )}
          <dl className="space-y-3">
            <div>
              <dt className="font-semibold text-ink">Type</dt>
              <dd className="text-ink-muted">{org.type}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Established</dt>
              <dd className="text-ink-muted">{org.established}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Website</dt>
              <dd>
                <a href={org.website} target="_blank" rel="noreferrer" className="text-gov-blue hover:underline">
                  {org.website.replace("https://", "")}
                </a>
              </dd>
            </div>
          </dl>
        </div>
      }
    >
      <h2>About {org.abbr}</h2>
      {org.about.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
      <h2>Functions</h2>
      <ul>
        {org.functions.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
    </ContentPage>
  );
}
