"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, Icon } from "@mosje/design-system";
import { cn } from "@/lib/website/utils";

type TabKey = "schemes" | "vacancies" | "tenders";

interface OfferingItem {
  title: string;
  href: string;
  image?: string;
  tag?: string;
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
        image: "/website/images/Banner-7.png",
        tag: "Scholarship & Livelihood",
      },
      {
        title: "PM YOUNG ACHIEVERS SCHOLARSHIP AWARD SCHEME FOR VIBRANT INDIA (PM-YASASVI)",
        href: "/website/schemes-services",
        image: "/website/images/Banner-8.png",
        tag: "Education",
      },
      {
        title: "Centrally Sponsored Scheme for implementation of the Protection of Civil Rights Act",
        href: "/website/schemes-services",
        image: "/website/images/Banner-9.png",
        tag: "Social Justice",
      },
      {
        title: "Top Class Education in College for OBC, EBC and DNT Students",
        href: "/website/schemes-services",
        image: "/website/images/3-300x251.jpg",
        tag: "Higher Education",
      },
      {
        title: "Pre-Matric Scholarships Scheme for Scheduled Castes & Others",
        href: "/website/schemes-services",
        image: "/website/images/4-1-300x133.jpg",
        tag: "School Education",
      },
      {
        title: "Post-Matric Scholarship for SC students",
        href: "/website/schemes-services",
        image: "/website/images/5-234x300.jpg",
        tag: "Higher Education",
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
        title: "Date further Extended for submission of application for the post of Financial Advisor on Deputation Basis at DAIC",
        href: "/website/vacancies",
        image: "/website/images/DAIC-LOGO-.png",
      },
      {
        title: "Extension of Application Submission Date for Financial Adviser (FA) Post at DAF and BJRNF",
        href: "/website/vacancies",
        image: "/website/images/Banner-10.png",
      },
      {
        title: "Recruitment Notification for Deputy General Manager (Finance) – E-5 Level",
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
        title: "Tender for Security Guards for parking arrangement in Lok Nayak Bhawan, Khan Market, New Delhi",
        href: "/website/tenders",
        image: "/website/images/Banner-7.png",
      },
      {
        title: "Proposals are invited for Annual Personal Contract of IT Associates",
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
    <section className="bg-white py-12 md:py-16">
      <div className="sa-container">
        <div className="text-center">
          <h2 className="text-[28px] sm:text-[32px] font-semibold leading-tight text-primary-dark">
            Our Offerings
          </h2>
          <p className="mt-2 text-[15px] sm:text-[16px] text-ink-muted">
            Discover our schemes, careers, and partnerships.
          </p>
        </div>

        {/* Tab Header with Tabs and View All Link */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div
            role="tablist"
            aria-label="Our Offerings"
            className="flex flex-wrap items-center gap-2"
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
                    "rounded-full px-5 py-2 text-[14px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                    isActive
                      ? "bg-primary text-white shadow-xs"
                      : "bg-surface-muted text-ink-muted hover:bg-gray-200 hover:text-ink"
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <Link
            href={current.viewAllHref}
            className="text-xs sm:text-sm font-semibold text-primary hover:underline flex items-center gap-1 self-end sm:self-auto"
          >
            {current.viewAllLabel} <Icon name="arrow_forward" size={16} />
          </Link>
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
              <Card
                key={item.title}
                className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs transition hover:shadow-md hover:border-primary/40 group"
              >
                {/* Thumbnail Image */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100 border-b border-gray-150">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary/5 text-primary">
                      <Icon name="school" size={36} />
                    </div>
                  )}
                  {item.tag && (
                    <span className="absolute top-2.5 left-2.5 rounded bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-xs">
                      {item.tag}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col justify-between p-5">
                  <h3 className="text-[15px] font-semibold leading-snug text-ink line-clamp-3 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary flex items-center gap-1 group-hover:underline">
                      {current.cardLink}
                      <Icon name="arrow_forward" size={14} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
