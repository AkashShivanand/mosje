"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon, buttonClasses } from "@mosje/design-system";
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

export default function AboutPage() {
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);

  const toggleAccordion = (idx: number) => {
    setOpenAccordion(openAccordion === idx ? null : idx);
  };

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
              <Image
                src="/website/images/portal-banner-images.png"
                alt="MoSJE Welfare and Social Justice Initiatives"
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

          <div className="relative pl-6 sm:pl-8 border-l-2 border-[#0373DF]/30 space-y-8">
            {HISTORY_TIMELINE.map((item) => (
              <div key={item.title} className="relative group">
                {/* Timeline Dot */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 h-4 w-4 rounded-full border-2 border-white bg-[#0373DF] shadow-md group-hover:scale-125 transition-transform" />

                <div className="bg-white rounded-xl p-5 border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <h3 className="text-base font-semibold text-neutral-900">
                      {item.title}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-[#0373DF] border border-blue-200">
                      {item.date}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Subjects Allocated */}
        <section className="bg-neutral-50 rounded-2xl p-6 sm:p-8 border border-neutral-200 space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
              Subjects Allocated
            </h2>
            <p className="mt-1 text-xs text-neutral-500 uppercase tracking-wider font-semibold">
              Allocation of Business Rules, 1961 (Samajik Nyaya Aur Adhikarita Vibhag)
            </p>
            <div className="mt-2 h-1 w-16 bg-[#0373DF] rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-neutral-700">
            <div className="space-y-3">
              <p className="flex items-start gap-2">
                <span className="font-bold text-[#0373DF]">1.</span>
                <span>Social Welfare: Overall policy, planning, and development for Scheduled Castes and Backward Classes.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="font-bold text-[#0373DF]">2.</span>
                <span>Implementation of the Protection of Civil Rights Act, 1955 and the SC/ST (Prevention of Atrocities) Act, 1989.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="font-bold text-[#0373DF]">3.</span>
                <span>Schemes for educational and economic upliftment of Scheduled Castes, OBCs, and EWS beneficiaries.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="font-bold text-[#0373DF]">4.</span>
                <span>Welfare of Senior Citizens and administration of Maintenance and Welfare of Parents and Senior Citizens Act, 2007.</span>
              </p>
            </div>
            <div className="space-y-3">
              <p className="flex items-start gap-2">
                <span className="font-bold text-[#0373DF]">5.</span>
                <span>National Action Plan for Drug Demand Reduction (NAPDDR) and prevention of alcoholism and substance abuse.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="font-bold text-[#0373DF]">6.</span>
                <span>Rehabilitation of Beggars and comprehensive measures for transgender welfare under SMILE scheme.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="font-bold text-[#0373DF]">7.</span>
                <span>Statutory administration of National Commissions (NCSC, NCBC, NCSK) and apex finance corporations (NSFDC, NSKFDC, NBCFDC).</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="font-bold text-[#0373DF]">8.</span>
                <span>Promotion of Babasaheb Dr. B.R. Ambedkar’s ideals via Dr. Ambedkar Foundation and Dr. Ambedkar International Centre.</span>
              </p>
            </div>
          </div>
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
              <div
                key={m.name}
                className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm text-center flex flex-col items-center space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-[#0373DF]/20 shadow-inner bg-neutral-100">
                  <Image
                    src={m.image}
                    alt={m.name}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-900">{m.name}</h3>
                  <p className="mt-1 text-xs font-medium text-[#0373DF] leading-tight">
                    {m.role}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Bureau Accordions */}
          <div className="space-y-3 pt-4">
            <h3 className="text-lg font-bold text-neutral-900">
              Senior Administration &amp; Bureaus
            </h3>
            {BUREAUS.map((bureau, idx) => {
              const isOpen = openAccordion === idx;
              return (
                <div
                  key={bureau.title}
                  className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-sm"
                >
                  <button
                    onClick={() => toggleAccordion(idx)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-semibold text-neutral-900 hover:bg-neutral-50 transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm sm:text-base">{bureau.title}</span>
                    <Icon
                      name={isOpen ? "expand_less" : "expand_more"}
                      size={20}
                      className="text-neutral-500 shrink-0"
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-sm text-neutral-600 border-t border-neutral-100 bg-neutral-50/50">
                      <ul className="space-y-2 list-disc list-inside">
                        {bureau.items.map((item, i) => (
                          <li key={i} className="leading-relaxed">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 5: Need Support Banner */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl font-bold text-neutral-900">Need Support?</h3>
            <p className="text-sm text-neutral-600">
              Reach out to our 24x7 citizen helpline or connect directly with our key officers.
            </p>
          </div>
          <Link
            href="/website/contact-us"
            className={`${buttonClasses("primary", "filled", "md")} whitespace-nowrap`}
          >
            Get in Touch
          </Link>
        </section>
      </div>
    </PageLayout>
  );
}
