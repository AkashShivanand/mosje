"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, Icon } from "@mosje/design-system";
import { cn } from "@/lib/website/utils";

type CategoryKey = "all" | "commissions" | "corporations" | "foundations" | "training";

interface Organisation {
  abbr: string;
  name: string;
  category: CategoryKey;
  href: string;
  iconSrc?: string;
}

const CATEGORIES: { key: CategoryKey; label: string; count: number }[] = [
  { key: "all", label: "All", count: 17 },
  { key: "commissions", label: "Commissions", count: 3 },
  { key: "corporations", label: "Corporations", count: 3 },
  { key: "foundations", label: "Foundations & Autonomous Bodies", count: 3 },
  { key: "training", label: "Training & Capacity Building", count: 1 },
];

const ORGANISATIONS: Organisation[] = [
  {
    abbr: "NCSC",
    name: "National Commission for Scheduled Castes",
    category: "commissions",
    href: "/website/organisation/national-commission-for-scheduled-castes",
    iconSrc: "/website/images/org-logos/ncsc.png",
  },
  {
    abbr: "NCSK",
    name: "National Commission for Safai Karamcharis",
    category: "commissions",
    href: "/website/organisation/national-commission-for-safai-karamcharis",
    iconSrc: "/website/images/org-logos/ncsk.png",
  },
  {
    abbr: "NCBC",
    name: "National Commission for Backward Classes",
    category: "commissions",
    href: "/website/organisation/national-commission-for-backward-classes-ncbc",
    iconSrc: "/website/images/org-logos/ncbc.png",
  },
  {
    abbr: "DAF",
    name: "Dr. Ambedkar Foundation",
    category: "foundations",
    href: "/website/organisation/dr-ambedkar-foundation",
    iconSrc: "/website/images/org-logos/daf.png",
  },
  {
    abbr: "DAIC",
    name: "Dr Ambedkar International Centre",
    category: "foundations",
    href: "/website/organisation/dr-ambedkar-international-centre",
    iconSrc: "/website/images/org-logos/daic.png",
  },
  {
    abbr: "BJRNF",
    name: "Babu Jagjivan Ram National Foundation",
    category: "foundations",
    href: "/website/organisation/babu-jagjivan-ram-national-foundation-jrf",
    iconSrc: "/website/images/org-logos/jrf.png",
  },
  {
    abbr: "NSFDC",
    name: "National Scheduled Castes Finance and Development Corporation",
    category: "corporations",
    href: "/website/organisation/national-scheduled-castes-finance-and-development-corporation",
    iconSrc: "/website/images/org-logos/nsfdc.png",
  },
  {
    abbr: "NSKFDC",
    name: "National Safai Karamcharis Finance and Development Corporation",
    category: "corporations",
    href: "/website/organisation/national-safai-karamcharis-finance-development-corporation",
    iconSrc: "/website/images/org-logos/nskfdc.png",
  },
  {
    abbr: "NBCFDC",
    name: "National Backward Classes Finance and Development Corporation",
    category: "corporations",
    href: "/website/organisation/national-backward-classes-financeand-development-corporationnbcfdc",
    iconSrc: "/website/images/org-logos/nbcfdc.png",
  },
  {
    abbr: "NISD",
    name: "National Institute of Social Defence",
    category: "training",
    href: "/website/organisation/national-institute-of-social-defence",
    iconSrc: "/website/images/org-logos/nisd.png",
  },
  {
    abbr: "DWBDNC",
    name: "Development and Welfare Board for De-notified, Nomadic, and Semi-Nomadic Communities",
    category: "foundations",
    href: "/website/organisation/development-and-welfare-board-for-de-notified-nomadic-and-semi-nomadic",
    iconSrc: "/website/images/org-logos/dwbdnc.png",
  },
  {
    abbr: "SCW",
    name: "Senior Citizens Welfare",
    category: "all",
    href: "/website/organisation/senior-citizens-welfarescw",
    iconSrc: "/website/images/org-logos/scw.png",
  },
  {
    abbr: "PM-AJAY",
    name: "Pradhan Mantri Anusuchit Jaati Abhyuday Yojna",
    category: "all",
    href: "/website/organisation/pradhan-mantri-anusuchit-jaati-abhyuday-yojnapm-ajay",
    iconSrc: "/website/images/org-logos/pm-ajay.png",
  },
  {
    abbr: "SMILE",
    name: "National Portal for Transgender Persons",
    category: "all",
    href: "/website/organisation/national-portal-for-transgender-persons",
    iconSrc: "/website/images/org-logos/smile.png",
  },
  {
    abbr: "NOS",
    name: "National Overseas Scholarship",
    category: "all",
    href: "/website/organisation/national-overseas-scholarship",
    iconSrc: "/website/images/org-logos/nos.png",
  },
  {
    abbr: "NMBA",
    name: "Nasha Mukt Bharat Abhiyaan",
    category: "all",
    href: "/website/organisation/nasha-mukt-bharat-abhiyaan",
    iconSrc: "/website/images/org-logos/nmba.png",
  },
  {
    abbr: "NHAA",
    name: "National Helpline Against Atrocities",
    category: "all",
    href: "/website/organisation/national-helpline-against-atrocities",
    iconSrc: "/website/images/National-Emblem-logo.svg",
  },
];

export function Organisations() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("all");

  const filtered =
    activeCategory === "all"
      ? ORGANISATIONS
      : ORGANISATIONS.filter((org) => org.category === activeCategory);

  return (
    <section className="bg-surface-muted">
      <div className="sa-container py-12 md:py-16">
        <div className="text-center">
          <h2 className="text-[32px] font-semibold leading-tight text-primary-dark">
            Our Organisations
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-[16px] text-ink-muted">
            The Ministry of Social Justice and Empowerment works through key
            organisations that drive social inclusion, economic empowerment, and
            equal opportunity across India.
          </p>
        </div>

        {/* Category Pills */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat) => {
            const isActive = cat.key === activeCategory;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={cn(
                  "rounded-full px-5 py-2 text-[14px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                  isActive
                    ? "bg-primary text-white shadow-sm"
                    : "bg-white border border-gray-200 text-ink-muted hover:border-primary/40 hover:text-primary"
                )}
              >
                {cat.label} ({cat.count})
              </button>
            );
          })}
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((org) => (
            <li key={org.abbr + org.name}>
              <Link href={org.href} className="group block h-full">
                <Card className="flex h-full flex-col justify-between p-5 transition hover:shadow-md hover:border-primary/40">
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="inline-block rounded bg-primary px-2 py-0.5 text-[11px] font-bold text-white uppercase">
                        {org.abbr}
                      </span>
                      {org.iconSrc && (
                        <Image
                          src={org.iconSrc}
                          alt={org.abbr}
                          width={32}
                          height={32}
                          className="h-8 w-8 object-contain"
                        />
                      )}
                    </div>
                    <h3 className="mt-4 text-[15px] font-medium leading-snug text-ink group-hover:text-primary transition-colors">
                      {org.name}
                    </h3>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Icon name="arrow_outward" size={16} className="text-gray-400 transition-colors group-hover:text-primary" />
                  </div>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
