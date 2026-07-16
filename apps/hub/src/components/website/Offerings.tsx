"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button, Card } from "@mosje/design-system";
import { cn } from "@/lib/website/utils";

type TabKey = "schemes" | "vacancies" | "tenders";

interface OfferingItem {
  title: string;
  href: string;
}

interface OfferingTab {
  key: TabKey;
  label: string;
  cardLink: string;
  viewAllLabel: string;
  viewAllHref: string;
  items: OfferingItem[];
}

const tabs: OfferingTab[] = [
  {
    key: "schemes",
    label: "Schemes",
    cardLink: "Know More",
    viewAllLabel: "View all Schemes",
    viewAllHref: "/website/schemes-services",
    items: [
      {
        title: "Pradhan Mantri Anusuchit Jaati Abhyuday Yojna (PM-AJAY)",
        href: "/website/schemes-services",
      },
      {
        title:
          "PM YOUNG ACHIEVERS SCHOLARSHIP AWARD SCHEME FOR VIBRANT INDIA (PM-YASASVI)",
        href: "/website/schemes-services",
      },
      {
        title:
          "Centrally Sponsored Scheme for implementation of the Protection of Civil Rights Act",
        href: "/website/schemes-services",
      },
      {
        title: "Top Class Education in College for OBC, EBC and DNT Students",
        href: "/website/schemes-services",
      },
      {
        title: "Pre-Matric Scholarships Scheme for Scheduled Castes & Others",
        href: "/website/schemes-services",
      },
      {
        title: "Post-Matric Scholarship for SC students",
        href: "/website/schemes-services",
      },
    ],
  },
  {
    key: "vacancies",
    label: "Vacancies",
    cardLink: "View Pdf",
    viewAllLabel: "View all Vacancies",
    viewAllHref: "/website/vacancies",
    items: [
      {
        title:
          "Date further Extended for submission of application for the post of Financial Advisor on Deputation Basis at DAIC",
        href: "/website/vacancies",
      },
      {
        title:
          "Extension of Application Submission Date for Financial Adviser (FA) Post at DAF and BJRNF",
        href: "/website/vacancies",
      },
      {
        title:
          "Recruitment Notification for Deputy General Manager (Finance) – E-5 Level",
        href: "/website/vacancies",
      },
      {
        title: "Sales Executives And Supervisors",
        href: "/website/vacancies",
      },
      {
        title: "Senior Relationship Manager",
        href: "/website/vacancies",
      },
      {
        title: "Telecalling Executive",
        href: "/website/vacancies",
      },
    ],
  },
  {
    key: "tenders",
    label: "Tenders",
    cardLink: "View Pdf",
    viewAllLabel: "View all Tenders",
    viewAllHref: "/website/tenders",
    items: [
      {
        title: "Hindi Pakhwada 14 September to 28 September 2024",
        href: "/website/tenders",
      },
      {
        title:
          "Tender for Security Guards for parking arrangement in Lok Nayak Bhawan, Khan Market, New Delhi",
        href: "/website/tenders",
      },
      {
        title:
          "Proposals are invited for Annual Personal Contract of IT Associates",
        href: "/website/tenders",
      },
    ],
  },
];

function OfferingCard({
  item,
  linkLabel,
}: {
  item: OfferingItem;
  linkLabel: string;
}) {
  return (
    <Card className="flex h-full flex-col justify-between p-5">
      <h3 className="line-clamp-3 text-[16px] font-medium leading-snug text-ink">
        {item.title}
      </h3>
      <Button
        href={item.href}
        appearance="text"
        size="sm"
        iconRight={<ArrowRight className="h-4 w-4" />}
        className="mt-4 self-start"
      >
        {linkLabel}
      </Button>
    </Card>
  );
}

export function Offerings() {
  const [activeTab, setActiveTab] = useState<TabKey>("schemes");

  const current = tabs.find((tab) => tab.key === activeTab) ?? tabs[0]!;

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1280px] px-4 py-12 md:py-16">
        <div className="text-center">
          <h2 className="text-[32px] font-semibold leading-tight text-gov-blue-dark">
            Our Offerings
          </h2>
          <p className="mt-3 text-[16px] text-ink-muted">
            Discover our schemes, careers, and partnerships.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Our Offerings"
          className="mt-8 flex flex-wrap justify-center gap-2"
        >
          {tabs.map((tab) => {
            const isActive = tab.key === activeTab;
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "rounded-full px-6 py-2.5 text-[15px] font-medium transition-colors",
                  isActive
                    ? "bg-gov-blue text-white shadow-sm"
                    : "bg-surface-muted text-ink-muted hover:bg-gov-blue/10 hover:text-gov-blue-dark"
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {activeTab === "schemes" && (
              <div className="hidden lg:col-span-4 lg:block">
                <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                  <Image
                    src="/website/images/schemes-768x768.jpg"
                    alt="Schemes and services of the Department of Social Justice & Empowerment"
                    width={768}
                    height={768}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            )}

            <div
              className={cn(
                activeTab === "schemes" ? "lg:col-span-8" : "lg:col-span-12"
              )}
            >
              <div
                key={activeTab}
                className="grid grid-cols-1 gap-5 transition-opacity duration-300 sm:grid-cols-2 xl:grid-cols-3"
              >
                {current.items.map((item) => (
                  <OfferingCard
                    key={item.title}
                    item={item}
                    linkLabel={current.cardLink}
                  />
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  href={current.viewAllHref}
                  appearance="outlined"
                  size="sm"
                  iconRight={<ArrowRight className="h-4 w-4" />}
                >
                  {current.viewAllLabel}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
