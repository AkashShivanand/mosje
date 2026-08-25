"use client";


import Image from "next/image";
import {
  Accordion,
  AccordionItem,
  ProfileCard,
  VerticalTimeline,
  VerticalTimelineItem,
} from "@mosje/design-system";
import { PageLayout } from "@/components/website/layout/PageLayout";

const TARGET_GROUPS = [
  "Scheduled Castes",
  "Socially & Educationally Backward Classes",
  "Social Defence",
  "Economically Weaker Sections",
  "Denotified, Nomadic and Semi-Nomadic Tribes",
  "Beggary",
  "Transgender",
  "Manual Scavengers",
  "Sewer & Septic Tank workers",
  "Waste Pickers",
];

const HISTORY_TIMELINE = [
  {
    title: "Formation of the Ministry of Welfare",
    date: "1985-1986",
    body: "In the year 1985-86, the erstwhile Ministry of Welfare was bifurcated into the Department of Women and Child Development and the Department of Welfare. Simultaneously, the Scheduled Castes Development Division, Tribal Development Division and the Minorities and Backward Classes Welfare Division were moved from the Ministry of Home Affairs and also the Wakf Division from the Ministry of Law to form the then Ministry of Welfare.",
  },
  {
    title: "Renamed as Ministry of Social Justice & Empowerment",
    date: "May 1998",
    body: "Subsequently, the name of the Ministry was changed to the Ministry of Social Justice & Empowerment in May, 1998.",
  },
  {
    title: "Formation of the Ministry of Tribal Affairs",
    date: "October 1999",
    body: "Further, in October, 1999, the Tribal Development Division had moved out to form a separate Ministry of Tribal Affairs.",
  },
  {
    title: "Formation of Separate Ministries for Minorities and Women & Child Development",
    date: "January 2007",
    body: "In January, 2007, the Minorities Division along with Wakf Unit have been moved out of the Ministry and formed as a separate Ministry and the Child Development Division has gone to the Ministry of Women & Child Development.",
  },
  {
    title: "Government's Commitment to the Disability Sector",
    date: "1995 & 2005",
    body: "Though the subject of “Disability” figures in the State List in the Seventh Schedule of the Constitution, the Government of India has always been proactive in the disability sector, running National Institutes dealing with various types of disabilities and implementing welfare schemes for persons with disabilities. The Persons with Disabilities (Equal Opportunities, Protection of Rights and Full Participation) Act, 1995, and the National Policy for Persons with Disabilities, 2006, were landmark initiatives.",
  },
  {
    title: "Recognition of the Need for a Dedicated Disability Department",
    date: "11th Five Year Plan Period",
    body: "With a view to facilitate inclusion of persons with disabilities into the mainstream of society, an announcement was made regarding the creation of a separate Department of Disability Affairs to deliver comprehensive support and services.",
  },
  {
    title: "Decision to Create a Separate Department of Disability Affairs",
    date: "January 3, 2012",
    body: "The decision to create a separate Department of Disability Affairs was formally taken with the approval of the Union Cabinet on 3rd January 2012.",
  },
  {
    title: "Creation of Two Departments under the Ministry of Social Justice & Empowerment",
    date: "May 12, 2012",
    body: "Under the Ministry of Social Justice & Empowerment, two distinct departments were officially established vide notification: (1) Department of Social Justice & Empowerment (DoSJE) and (2) Department of Empowerment of Persons with Disabilities (DEPwD).",
  },
];

const MINISTERS = [
  {
    name: "Dr. Virendra Kumar",
    role: "Union Minister of Social Justice and Empowerment",
    image: "/website/images/Dr.-Virendra-Kumar.png",
  },
  {
    name: "Shri Ramdas Athawale",
    role: "Minister of State for Social Justice and Empowerment",
    image: "/website/images/Shri-Ramdas-Athawale.png",
  },
  {
    name: "Shri B. L. Verma",
    role: "Minister of State for Social Justice and Empowerment",
    image: "/website/images/sri-l-b-verma.png",
  },
];

const BUREAUS = [
  {
    title: "Shri Amit Yadav, IAS (Secretary)",
    items: [
      "Overall leadership and administration of the Department of Social Justice and Empowerment",
      "Coordination of national flagship missions: PM-AJAY, SMILE, NAMASTE, SHRESHTA, PM YASASVI",
      "Statutory oversight across 17 autonomous commissions, corporations, and national foundations",
      "Policy formulation and allocation of national budgetary funds for Scheduled Castes and Backward Classes",
    ],
  },
  {
    title: "Shri Surendra Singh, IAS (Additional Secretary)",
    items: [
      "Supervision of National Scheduled Castes Finance & Development Corporation (NSFDC)",
      "National Backward Classes Finance & Development Corporation (NBCFDC)",
      "Administration of National Action Plan for Drug Demand Reduction (NAPDDR)",
      "Venture Capital Fund for Scheduled Castes & OBCs",
    ],
  },
  {
    title: "Shri Rajiv Sharma, IAS (Joint Secretary - SCD)",
    items: [
      "Scheduled Castes Development (SCD) Division programmes and scholarships",
      "Pradhan Mantri Anusuchit Jaati Abhyuday Yojana (PM-AJAY)",
      "National Overseas Scholarship (NOS) for SC Candidates",
      "Pre-Matric and Post-Matric Scholarship schemes for Scheduled Castes",
    ],
  },
  {
    title: "Smt. Meenakshi Iyer, IAS (Joint Secretary - BC & DNT)",
    items: [
      "Backward Classes Welfare and DNT Commission administration",
      "PM YASASVI Scholarship Scheme execution across States/UTs",
      "Free Coaching Scheme for SC and OBC students",
      "Central Sector Scheme of Top Class Education for OBC & DNT students",
    ],
  },
  {
    title: "Shri Arun Kumar Mishra, IAS (Joint Secretary - Social Defence)",
    items: [
      "Social Defence Division policies and elderly welfare schemes (SAGE, SACRED, Elderline 14567)",
      "Nasha Mukt Bharat Abhiyaan (NMBA) campaign and treatment centre networks",
      "Transgender Persons (Protection of Rights) Act enforcement and SMILE Garima Greh homes",
      "Rehabilitation of Manual Scavengers and NAMASTE initiative",
    ],
  },
  {
    title: "Dr. Prabodh Seth, IRS (Joint Secretary & Financial Advisor)",
    items: [
      "Budgetary formulation, financial planning and audit compliance",
      "Grants-in-aid to NGOs and voluntary organisations via e-Anudaan portal",
      "Public Financial Management System (PFMS) monitoring",
    ],
  },
];

const SUBJECTS_ALLOCATED_LIST = [
  "The following subject which fall within List III - Concurrent List of the Seventh Schedule to the Constitution: Nomadic and Migratory Tribes.",
  "To act as the nodal Department for matters pertaining to the following groups, namely: (i) Scheduled Castes; (ii) Socially and Educationally Backward Classes; (iii) Denotified Tribes; (iv) Economically Backward Classes; and (v) Senior Citizens.",
  "Special schemes aimed at social, educational and economic empowerment of the groups mentioned at (i) to (iv) under entry 2 above, e.g. scholarships, hostels, residential schools, skill training, concession loans and subsidy for self-employment, etc.",
  "Monitoring of Schedule caste sub plan.",
  "Rehabilitation of Manual Scavengers in alternative occupations.",
  "Programmes of care and support to senior citizens.",
  "Prohibition.",
  "Rehabilitation of victims of alcoholism and substance abuse, and their families.",
  "Beggary.",
  "International Conventions and Agreements on matters dealt within the Department.",
  "Awareness generation, research, evaluation and training in regard to subjects allocated to the Department.",
  "Charitable and Religious Endowments and promotion and development of Voluntary Effort pertaining to subjects allocated to the Department.",
  "The Protection of Civil Rights Act, 1955 (22 of 1955).",
  "The Scheduled Castes and the Scheduled Tribes (Prevention of Atrocities) Act, 1989 (33 of 1989), (in so far as it relates to the Scheduled Castes, excluding administration of criminal justice in regard to offences under the Act).",
  "National Commission for Backward Classes Act, 1993 (27 of 1993).",
  "The Maintenance and Welfare of Parents and Senior Citizens Act, 2007 (56 of 2007).",
  "National Commission for Scheduled Castes.",
  "National Commission for Safai Karmacharis.",
  "National Commission for Backward Classes.",
  "National Scheduled Castes Finance and Development Corporation.",
  "National Safai Karamcharis Finance and Development Corporation.",
  "National Backward Classes Finance and Development Corporation.",
  "National Institute of Social Defence.",
  "Dr. Ambedkar Foundation.",
  "Babu Jagjivan Ram National Foundation.",
  "National Commission for Denotified and Semi-Nomadic Tribes.",
];

export default function AboutPage() {
  


  return (
    <PageLayout
      title="About Us"
      breadcrumb={[{ label: "Department" }, { label: "About Us" }]}
      description="Department of Social Justice and Empowerment is the nodal ministry for welfare, social justice, and empowerment of disadvantaged and marginalized sections of society."
      lastUpdated="13 Jun 2026"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-16">
        {/* Section 1: Overview */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
                Overview
              </h2>
              <div className="mt-2 h-1 w-16 bg-[#0373DF] rounded-full" />
            </div>

            <p className="text-base text-neutral-700 leading-relaxed">
              The Department of Social Justice &amp; Empowerment is entrusted with the empowerment
              of the disadvantaged and marginalized sections of society. The core target groups
              of the Ministry are:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {TARGET_GROUPS.map((group) => (
                <div
                  key={group}
                  className="flex items-center gap-2.5 p-2.5 rounded-lg bg-neutral-50 border border-neutral-200 text-sm font-medium text-neutral-800"
                >
                  <span className="h-2 w-2 rounded-full bg-[#0373DF]" />
                  {group}
                </div>
              ))}
            </div>

            <p className="text-sm text-neutral-600 leading-relaxed">
              The Ministry has been implementing various schemes for social, educational, and
              economic development of the target groups. The Department prioritizes affirmative action,
              skill enhancement, financial inclusion, and social defence across all Indian States &amp; UTs.
            </p>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-neutral-100">
              {/* Was `portal-banner-images.png` — a raster of the SAMAVESH banner
                  comp, with the headline and subline baked in. Cropped to 4:3 by
                  `object-cover` it rendered half-cut words ("…ed Advancement",
                  "…y. Dignity.") between two black bars, under alt text that
                  described none of it. This is the same photography with no text
                  in it, framed for this slot. */}
              <Image
                src="/website/images/samavesh-citizens-4x3.jpg"
                alt="Citizens of India at sunset — an elderly woman, students, a tribal youth, a man in a wheelchair and an elderly farmer, representing the groups the Department serves."
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 450px"
              />
            </div>
          </div>
        </section>

        {/* Section 2: Our History Timeline */}
        <section className="space-y-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
              Our History
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Evolution of the Department over time.
            </p>
            <div className="mt-2 h-1 w-16 bg-[#0373DF] rounded-full" />
          </div>

          <VerticalTimeline>
            {HISTORY_TIMELINE.map((item, index) => (
              <VerticalTimelineItem key={index} title={item.title} date={item.date}>
                {item.body}
              </VerticalTimelineItem>
            ))}
          </VerticalTimeline>
        </section>

        {/* Section 3: Subjects Allocated — the Department's statutory remit under the
            Allocation of Business Rules. Recovered from the pre-redesign page, which
            numbered its sections 1, 2, 4: this one was dropped in the rewrite. */}
        <section className="space-y-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
              Subjects Allocated
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              The subjects allocated to the Department under the Government of India
              (Allocation of Business) Rules.
            </p>
            <div className="mt-2 h-1 w-16 bg-primary rounded-full" />
          </div>

          <div className="rounded-r-xl border-l-4 border-primary bg-primary/5 p-5 text-sm leading-relaxed text-ink">
            <span className="font-bold text-ink">Note: </span>
            The Department of Social Justice and Empowerment shall be the nodal Department for
            the overall policy, planning and coordination of programmes for the development of
            the groups mentioned at (i) to (iv) below, and the welfare of the group at (v).
            Overall management and monitoring of the sectoral programmes in respect of these
            groups remains the responsibility of the concerned Central Ministries, State
            Governments and Union Territory Administrations; each discharges nodal
            responsibility concerning its own sector.
          </div>

          <ol className="space-y-3">
            {SUBJECTS_ALLOCATED_LIST.map((subject, index) => (
              <li key={index} className="flex items-start gap-3 text-sm sm:text-base leading-relaxed text-ink-muted">
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary-700"
                >
                  {index + 1}
                </span>
                <span>{subject}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Section 4: Organisational Set-Up */}
        <section className="space-y-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
              Organisational Set-Up
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Political leadership and senior administrative bureaus of the Department.
            </p>
            <div className="mt-2 h-1 w-16 bg-[#0373DF] rounded-full" />
          </div>

          {/* Political Leadership Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MINISTERS.map((m) => (
              <ProfileCard
                key={m.name}
                title={m.name}
                subtitle={m.role}
                tag="MoSJE GOI"
                image={
                  <Image
                    src={m.image}
                    alt={m.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    priority
                  />
                }
              />
            ))}
          </div>

          {/* Bureau Accordions */}
          <div className="space-y-3 pt-4">
            <h3 className="text-lg font-bold text-neutral-900">
              Senior Administration &amp; Bureaus
            </h3>
            <Accordion>
              {BUREAUS.map((bureau) => (
                <AccordionItem key={bureau.title} title={bureau.title}>
                  <ul className="space-y-3 pl-4 list-disc text-sm text-neutral-700 marker:text-[#0373DF]">
                    {bureau.items.map((item, i) => (
                      <li key={i} className="pl-2 leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

      </div>
    </PageLayout>
  );
}
