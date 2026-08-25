"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button, Card, Icon } from "@mosje/design-system";
import { cn } from "@/lib/website/utils";

type TabKey = "schemes" | "vacancies" | "tenders";

interface OfferingItem {
  title: string;
  href: string;
  image?: string;
  tag?: string;
  /**
   * One-sentence summary shown under the title [WEB-O-02]. Written from the
   * scheme's own text in `content/website/schemes.json`, not composed here.
   * Optional: vacancies and tenders are notices and carry no summary.
   */
  description?: string;
}

interface OfferingTab {
  key: TabKey;
  label: string;
  /** Material Symbol shown in the tab, per the design's tab group [WEB-O-03]. */
  icon: string;
  cardLink: string;
  viewAllLabel: string;
  viewAllHref: string;
  items: OfferingItem[];
}

const tabs: OfferingTab[] = [
  {
    key: "schemes",
    icon: "menu_book",
    label: "Schemes",
    cardLink: "Know More",
    viewAllLabel: "View all Schemes",
    viewAllHref: "/website/schemes-services",
    items: [
      {
        title: "Pradhan Mantri Anusuchit Jaati Abhyuday Yojna (PM-AJAY)",
        description:
          "Reduces poverty in Scheduled Caste communities through skill development, income-generating schemes and infrastructure in SC-majority villages.",
        href: "/website/schemes-services",
        image: "/website/images/Banner-7.png",
        tag: "Scholarship & Livelihood",
      },
      {
        title:
          "PM YOUNG ACHIEVERS SCHOLARSHIP AWARD SCHEME FOR VIBRANT INDIA (PM-YASASVI)",
        description:
          "An umbrella scheme for OBC, EBC and DNT students, bringing the existing scholarship and hostel schemes together into five sub-schemes.",
        href: "/website/schemes-services",
        image: "/website/images/Banner-8.png",
        tag: "Education",
      },
      {
        title:
          "Centrally Sponsored Scheme for implementation of the Protection of Civil Rights Act",
        description:
          "Supports States and UTs in enforcing the Protection of Civil Rights Act 1955 and the SC/ST (Prevention of Atrocities) Act 1989.",
        href: "/website/schemes-services",
        image: "/website/images/Banner-9.png",
        tag: "Social Justice",
      },
      {
        title: "Top Class Education in College for OBC, EBC and DNT Students",
        description:
          "Financial support for OBC, EBC and DNT students pursuing courses at notified premier institutions.",
        href: "/website/schemes-services",
        image: "/website/images/3-300x251.jpg",
        tag: "Higher Education",
      },
      {
        title: "Pre-Matric Scholarships Scheme for Scheduled Castes & Others",
        description:
          "A centrally sponsored scheme run through State Governments and UT administrations for Scheduled Caste students before matriculation.",
        href: "/website/schemes-services",
        image: "/website/images/4-1-300x133.jpg",
        tag: "School Education",
      },
      {
        title: "Post-Matric Scholarship for SC students",
        description:
          "Raises the gross enrolment ratio of Scheduled Caste students in higher education, with a focus on the poorest households.",
        href: "/website/schemes-services",
        image: "/website/images/5-234x300.jpg",
        tag: "Higher Education",
      },
    ],
  },
  {
    key: "vacancies",
    icon: "group",
    label: "Vacancies",
    cardLink: "View Pdf",
    viewAllLabel: "View all Vacancies",
    viewAllHref: "/website/vacancies",
    items: [
      {
        title:
          "Date further Extended for submission of application for the post of Financial Advisor on Deputation Basis at DAIC",
        href: "/website/vacancies",
        image: "/website/images/DAIC-LOGO-.png",
      },
      {
        title:
          "Extension of Application Submission Date for Financial Adviser (FA) Post at DAF and BJRNF",
        href: "/website/vacancies",
        image: "/website/images/Banner-10.png",
      },
      {
        title:
          "Recruitment Notification for Deputy General Manager (Finance) – E-5 Level",
        href: "/website/vacancies",
        image: "/website/images/nsfdc-1.png",
      },
      {
        title: "Sales Executives And Supervisors",
        href: "/website/vacancies",
        image: "/website/images/Banner-7.png",
      },
      {
        title: "Senior Relationship Manager",
        href: "/website/vacancies",
        image: "/website/images/Banner-8.png",
      },
      {
        title: "Telecalling Executive",
        href: "/website/vacancies",
        image: "/website/images/Banner-9.png",
      },
    ],
  },
  {
    key: "tenders",
    icon: "business_center",
    label: "Tenders",
    cardLink: "View Pdf",
    viewAllLabel: "View all Tenders",
    viewAllHref: "/website/tenders",
    items: [
      {
        title: "Hindi Pakhwada 14 September to 28 September 2024",
        href: "/website/tenders",
        image: "/website/images/Banner-6.png",
      },
      {
        title:
          "Tender for Security Guards for parking arrangement in Lok Nayak Bhawan, Khan Market, New Delhi",
        href: "/website/tenders",
        image: "/website/images/Banner-7.png",
      },
      {
        title:
          "Proposals are invited for Annual Personal Contract of IT Associates",
        href: "/website/tenders",
        image: "/website/images/Banner-8.png",
      },
    ],
  },
];

export function Offerings() {
  const [activeTab, setActiveTab] = useState<TabKey>("schemes");
  const current = tabs.find((tab) => tab.key === activeTab) ?? tabs[0]!;

  return (
    <section className="bg-primary-50 py-12 md:py-16">
      <div className="sa-container">
        <div>
          <h2 className="text-[28px] sm:text-[32px] font-semibold leading-tight text-primary-dark">
            Our Offerings
          </h2>
          <p className="mt-2 text-[15px] sm:text-[16px] text-ink-muted">
            Discover our schemes, careers, and partnerships.
          </p>
        </div>

        {/* Tab Header with Tabs and View All Link */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* The design groups the tabs inside one tinted container rather than
              floating them as loose pills, and each carries an icon [WEB-O-03]. */}
          <div
            role="tablist"
            aria-label="Our Offerings"
            className="inline-flex flex-wrap items-center gap-1 self-start rounded-xl bg-white/70 p-1"
          >
            {tabs.map((tab) => {
              const isActive = tab.key === activeTab;
              return (
                <button
                  key={tab.key}
                  id={`tab-${tab.key}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`tabpanel-${tab.key}`}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-4 py-2 text-[14px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                    isActive
                      ? "bg-primary text-white shadow-xs"
                      : "text-ink-muted hover:bg-primary-50 hover:text-ink",
                  )}
                >
                  <Icon name={tab.icon} size={20} aria-hidden />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* An outlined button, not a bare text link — the design's secondary
              CTA, and it clears the 24x24 target minimum [WEB-G-05, WCAG 2.5.8]. */}
          <Button
            appearance="outlined"
            size="sm"
            href={current.viewAllHref}
            iconRight={<Icon name="arrow_forward" size={16} aria-hidden />}
            /* gov-blue is 4.19:1 on this section's primary-50 ground — under AA
               for 14px text. primary-dark is 7.75:1. The DS button's own colour
               is correct on white; this overrides it only where the ground is
               tinted, and wins without !important because component CSS sits in
               @layer components and utilities come after it. */
            className="self-start border-primary-dark text-primary-dark sm:self-auto"
          >
            {current.viewAllLabel}
          </Button>
        </div>

        {/* Offerings Grid */}
        <div
          id={`tabpanel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
          className="mt-8"
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {current.items.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group block h-full"
              >
                <Card className="flex h-full flex-row gap-4 overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-xs transition hover:border-primary/40 hover:shadow-md">
                  {/* Square thumbnail on the LEFT. The design's card is horizontal;
                    the build had a full-bleed 16:9 image stacked on top [WEB-O-01]. */}
                  <div className="relative h-[104px] w-[104px] shrink-0 overflow-hidden rounded-lg border border-gray-150 bg-gray-100">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        sizes="104px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-primary/5 text-primary">
                        <Icon name="school" size={32} aria-hidden />
                      </div>
                    )}
                  </div>

                  {/* Content column */}
                  <div className="flex min-w-0 flex-1 flex-col">
                    {item.tag && (
                      <span className="mb-1 text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                        {item.tag}
                      </span>
                    )}
                    <h3 className="text-[15px] font-semibold leading-snug text-ink transition-colors line-clamp-3 group-hover:text-primary">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="mt-1.5 text-[13px] leading-snug text-ink-muted line-clamp-4">
                        {item.description}
                      </p>
                    )}

                    <span className="mt-auto flex items-center justify-end gap-1 pt-3 text-xs font-semibold text-primary group-hover:underline">
                      {current.cardLink}
                      <Icon
                        name="arrow_forward"
                        size={16}
                        aria-hidden
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
