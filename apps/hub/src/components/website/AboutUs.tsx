import Image from "next/image";
import Link from "next/link";
import { Icon, buttonClasses } from "@mosje/design-system";

interface Minister {
  img: string;
  name: string;
  designation: string;
  primary?: boolean;
}

interface Stat {
  label: string;
  value: string;
}

const ministers: Minister[] = [
  {
    img: "/website/images/Dr.-Virendra-Kumar.png",
    name: "Dr. Virendra Kumar",
    designation: "Union Minister of Social Justice and Empowerment",
    primary: true,
  },
  {
    img: "/website/images/Shri-Ramdas-Athawale.png",
    name: "Shri Ramdas Athawale",
    designation: "Minister of State of Social Justice and Empowerment",
  },
  {
    img: "/website/images/sri-l-b-verma.png",
    name: "Shri B. L. Verma",
    designation: "Minister of State of Social Justice and Empowerment",
  },
];

const stats: Stat[] = [
  { label: "Cumulative Disbursement", value: "₹67,977 Crore" },
  { label: "Beneficiary Coverage", value: "19.82 Crore" },
  { label: "Financial Assistance", value: "₹8,731 Crore" },
];

export function AboutUs() {
  return (
    <section className="bg-white">
      <div className="sa-container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-[32px] font-semibold leading-tight text-primary-dark">
              About Us
            </h2>
            <p className="mt-5 text-[16px] leading-relaxed text-ink-muted">
              The Department of Social Justice &amp; Empowerment (DoSJE) is
              mandated to ensure the empowerment and welfare of India&apos;s most
              vulnerable groups, including Scheduled Castes, OBCs, Senior
              Citizens, Transgender Persons, and victims of substance abuse. We
              implement various targeted schemes for their social, educational,
              and economic development, ensuring their inclusion despite
              challenges like the lack of updated demographic data.
            </p>
            <blockquote className="mt-6 border-l-4 border-saffron bg-saffron/10 p-4 rounded-r-lg italic text-[15px] leading-relaxed text-ink">
              “The Ministry of Social Justice &amp; Empowerment works to uplift India&apos;s most vulnerable communities through targeted initiatives, inclusive growth, and compassionate governance.”
            </blockquote>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/website/about-us"
                className={buttonClasses("primary", "outlined", "sm")}
              >
                Read More
                <span className="ds-btn__icon" aria-hidden="true"><Icon name="arrow_forward" size={16} /></span>
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Link
                href="/website/whos-who"
                className="flex items-center justify-between rounded-lg border border-border bg-surface p-3 text-sm font-semibold text-ink transition hover:border-primary hover:text-primary"
              >
                <span>Our Team</span>
                <Icon name="chevron_right" size={16} />
              </Link>
              <Link
                href="/website/about-us"
                className="flex items-center justify-between rounded-lg border border-border bg-surface p-3 text-sm font-semibold text-ink transition hover:border-primary hover:text-primary"
              >
                <span>Our Ministry</span>
                <Icon name="chevron_right" size={16} />
              </Link>
              <Link
                href="/website/annual-reports"
                className="flex items-center justify-between rounded-lg border border-border bg-surface p-3 text-sm font-semibold text-ink transition hover:border-primary hover:text-primary"
              >
                <span>Our Reports</span>
                <Icon name="chevron_right" size={16} />
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {ministers[0] && (
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:flex sm:items-center sm:gap-5">
              <Image
                src={ministers[0].img}
                alt={ministers[0].name}
                width={140}
                height={140}
                className="mx-auto h-[140px] w-[140px] flex-shrink-0 rounded-lg object-cover sm:mx-0"
              />
              <div className="mt-4 text-center sm:mt-0 sm:text-left">
                <h3 className="text-[22px] font-medium text-ink">
                  {ministers[0].name}
                </h3>
                <p className="mt-1 text-[15px] leading-snug text-ink-muted">
                  {ministers[0].designation}
                </p>
              </div>
            </div>
            )}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {ministers.slice(1).map((minister) => (
                <div
                  key={minister.name}
                  className="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-5 text-center shadow-sm transition hover:shadow-md"
                >
                  <Image
                    src={minister.img}
                    alt={minister.name}
                    width={140}
                    height={140}
                    className="h-[140px] w-[140px] rounded-lg object-cover"
                  />
                  <h3 className="mt-4 text-[18px] font-medium text-ink">
                    {minister.name}
                  </h3>
                  <p className="mt-1 text-[14px] leading-snug text-ink-muted">
                    {minister.designation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Link
          href="/website/dashboard"
          className="group mt-12 block overflow-hidden rounded-xl bg-gradient-to-r from-primary-dark to-primary transition-opacity hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <dl className="grid grid-cols-1 divide-y divide-white/15 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="px-6 py-8 text-center sm:py-10"
              >
                <dd className="text-[40px] font-bold leading-none text-white">
                  {stat.value}
                </dd>
                <dt className="mt-3 text-[14px] font-medium uppercase tracking-wide text-white/80 transition-colors group-hover:text-white">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </Link>
      </div>
    </section>
  );
}
