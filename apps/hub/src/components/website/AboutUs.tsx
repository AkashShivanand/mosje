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
  /** The line under the figure that says what it is measured against. */
  caption: string;
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

/**
 * The design sets each cell as label -> figure -> sub-caption, in that order.
 * The build dropped the sub-caption and put the label UNDER the figure, which
 * left three large numbers with no statement of what they measured until after
 * you had read them [WEB-A-05]. "Financial Assistance" was also the wrong
 * label for the third: the design names it as the FY 2025-26 release.
 */
const stats: Stat[] = [
  {
    label: "Cumulative Disbursement",
    value: "₹67,977 Crore",
    caption: "Scholarships for Scheduled Castes",
  },
  {
    label: "Beneficiary Coverage",
    value: "19.82 Crore",
    caption: "Cumulative across all schemes",
  },
  {
    label: "Release of Funds, FY 2025–26",
    value: "₹8,731 Crore",
    caption: "Provisional · 14.3% above previous year",
  },
];

export function AboutUs() {
  return (
    <section className="bg-primary-50">
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
                /* Fourth instance of one DS defect: gov-blue is 4.19:1 on this
                   section's primary-50 ground, under AA. The DS outlined button
                   is correct on white and short of it on every tint. */
                className={buttonClasses(
                  "primary",
                  "outlined",
                  "sm",
                  "border-primary-dark text-primary-dark",
                )}
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
            {/* The lead card is tinted in the design — it is what separates the
                Union Minister from the two Ministers of State beneath, which a
                plain white card on a tinted section could not do [WEB-A-02].
                saffron-50 is the token nearest the frame's cream. */}
            {ministers[0] && (
            <div className="rounded-lg border border-saffron-500/25 bg-saffron-50 p-5 shadow-sm transition hover:shadow-md sm:flex sm:items-center sm:gap-5">
              <Image
                src={ministers[0].img}
                alt={ministers[0].name}
                width={140}
                height={140}
                className="mx-auto h-[140px] w-[140px] flex-shrink-0 rounded-full border-4 border-white bg-white object-cover shadow-sm sm:mx-0"
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

        <div className="mt-12 overflow-hidden rounded-xl bg-gradient-to-r from-primary-dark to-primary p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <dl className="grid flex-1 grid-cols-1 divide-y divide-white/15 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {stats.map((stat) => (
                <div key={stat.label} className="px-4 py-4 sm:px-6 sm:py-2">
                  <dt className="text-[11px] font-semibold uppercase tracking-wide text-white/75">
                    {stat.label}
                  </dt>
                  <dd className="mt-1.5 text-[30px] font-bold leading-none text-white sm:text-[36px]">
                    {stat.value}
                  </dd>
                  <dd className="mt-1.5 text-[12px] leading-snug text-white/70">
                    {stat.caption}
                  </dd>
                </div>
              ))}
            </dl>
            <Link
              href="/website/dashboard"
              className={buttonClasses("primary", "filled", "md", "bg-white text-primary hover:bg-white/90 whitespace-nowrap self-center shrink-0")}
            >
              View Dashboard
              <span className="ds-btn__icon" aria-hidden="true">
                <Icon name="arrow_forward" size={16} />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
