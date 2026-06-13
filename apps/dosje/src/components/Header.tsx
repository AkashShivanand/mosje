"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Accessibility, Languages } from "lucide-react";
import { Badge, Search, ColorModeSwitcher, buttonClasses } from "@mosje/design-system";
import type { NavItem } from "@/types";

const NAV: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Department",
    href: "#",
    children: [
      { label: "About Us", href: "/about-us" },
      { label: "Who’s Who", href: "/whos-who" },
      { label: "Directory", href: "/mosje-directory" },
    ],
  },
  {
    label: "Associated Organisations",
    href: "#",
    children: [
      { label: "NCSC — National Commission for Scheduled Castes", href: "/organisation/national-commission-for-scheduled-castes" },
      { label: "NCSK — National Commission for Safai Karamcharis", href: "/organisation/national-commission-for-safai-karamcharis" },
      { label: "NCBC — National Commission for Backward Classes", href: "/organisation/national-commission-for-backward-classes-ncbc" },
      { label: "DAF — Dr. Ambedkar Foundation", href: "/organisation/dr-ambedkar-foundation" },
      { label: "NSFDC", href: "/organisation/national-scheduled-castes-finance-and-development-corporation" },
      { label: "NSKFDC", href: "/organisation/national-safai-karamcharis-finance-development-corporation" },
      { label: "NBCFDC", href: "/organisation/national-backward-classes-financeand-development-corporationnbcfdc" },
      { label: "NISD", href: "/organisation/national-institute-of-social-defence" },
    ],
  },
  {
    label: "Offerings",
    href: "#",
    children: [
      { label: "Schemes & Services", href: "/schemes-services" },
      { label: "Vacancies", href: "/vacancies" },
      { label: "Tenders", href: "/tenders" },
    ],
  },
  {
    label: "Documents",
    href: "#",
    children: [
      { label: "Annual Reports", href: "/annual-reports" },
      { label: "Acts & Rules", href: "/acts-rules" },
      { label: "Policies", href: "/policies" },
      { label: "Resources", href: "/resources" },
      { label: "Circulars & Notifications", href: "/circulars-notifications" },
      { label: "Forms & Templates", href: "/forms-templates" },
      { label: "Publications", href: "/publications" },
      { label: "Notices", href: "/notices" },
      { label: "RTI", href: "/rti" },
      { label: "MOU", href: "/mou" },
      { label: "Advices", href: "/advices" },
      { label: "Miscellaneous", href: "/miscellaneous" },
    ],
  },
  {
    label: "Events & Gallery",
    href: "#",
    children: [
      { label: "Events", href: "/events" },
      { label: "Gallery", href: "/gallery" },
    ],
  },
  {
    label: "Connect",
    href: "#",
    children: [
      { label: "CPIO", href: "/contact-us" },
      { label: "Directory", href: "/mosje-directory" },
      { label: "Contact Us", href: "/contact-us" },
    ],
  },
];

export function Header() {
  const [open, setOpen] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  return (
    <header className="relative z-50 w-full bg-white">
      {/* Government of India top bar */}
      <div className="bg-gov-blue text-white">
        <div className="mx-auto flex h-10 max-w-[1280px] items-center justify-between gap-4 px-4 text-[15px]">
          <a
            href="https://india.gov.in/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 font-medium hover:underline"
          >
            <Image src="/images/Indian-Flag.svg" alt="Indian Flag" width={22} height={15} className="h-[15px] w-auto" />
            <span>Government of India</span>
            <Image src="/images/open_in_new_icon.svg" alt="" width={12} height={12} className="h-3 w-3 brightness-0 invert" />
          </a>
          <div className="flex items-center gap-5">
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-gov-blue focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:outline-none"
            >
              Skip to Main Content
            </a>
            <ColorModeSwitcher compact hideLabel label="Colour mode" />
            <button aria-label="Accessibility options" className="grid h-7 w-7 place-items-center rounded-full hover:bg-white/15">
              <Accessibility className="h-[18px] w-[18px]" />
            </button>
            <button aria-label="Language" className="grid h-7 w-7 place-items-center rounded-full hover:bg-white/15">
              <Languages className="h-[18px] w-[18px]" />
            </button>
          </div>
        </div>
      </div>

      {/* Brand row */}
      <div className="border-b border-gray-100">
        <div className="mx-auto flex max-w-[1280px] items-center gap-6 px-4 py-3">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/images/National-Emblem-logo.svg" alt="National Emblem of India" width={48} height={62} className="h-[62px] w-auto" priority />
            <span className="flex flex-col leading-tight">
              <span className="flex items-center gap-2">
                <span className="text-[12px] text-ink-muted">Government of India</span>
                <Badge status="warning" size="sm" className="font-bold uppercase tracking-wide">Beta</Badge>
              </span>
              <span className="text-[12px] text-ink-muted">Ministry of Social Justice &amp; Empowerment</span>
              <span className="text-[19px] font-bold text-ink">Department of Social Justice &amp; Empowerment</span>
            </span>
          </Link>

          <form className="relative ml-auto hidden max-w-[420px] flex-1 lg:block" role="search" onSubmit={(e) => e.preventDefault()}>
            <Search
              size="lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch("")}
              placeholder="Search Schemes, Services, Documents"
              aria-label="Search Schemes, Services, Documents"
            />
          </form>

          <div className="flex items-center gap-4">
            <Image src="/images/digital-india-logo.svg" alt="Digital India — Power To Empower" width={92} height={44} className="hidden h-11 w-auto md:block" priority />
            <Link href="/admin" className={buttonClasses("primary", "filled", "sm", "whitespace-nowrap")}>
              Admin Login
            </Link>
          </div>
        </div>
      </div>

      {/* Mega navigation */}
      <nav className="border-b border-gray-100" aria-label="Primary">
        <ul className="mx-auto flex max-w-[1280px] items-stretch gap-1 px-4">
          {NAV.map((item) => {
            const hasChildren = !!item.children?.length;
            const isOpen = open === item.label;
            return (
              <li
                key={item.label}
                className="group static lg:relative"
                onMouseEnter={() => hasChildren && setOpen(item.label)}
                onMouseLeave={() => setOpen(null)}
              >
                <Link
                  href={item.href}
                  className={`flex items-center gap-1 border-b-2 px-3 py-3.5 text-[15px] font-medium transition-colors ${
                    item.label === "Home"
                      ? "border-gov-blue text-gov-blue"
                      : "border-transparent text-ink hover:text-gov-blue"
                  }`}
                  onClick={(e) => { if (hasChildren) { e.preventDefault(); setOpen(isOpen ? null : item.label); } }}
                  aria-expanded={hasChildren ? isOpen : undefined}
                  aria-haspopup={hasChildren ? true : undefined}
                  aria-controls={hasChildren ? `nav-drop-${item.label.toLowerCase().replace(/\s+/g, "-")}` : undefined}
                >
                  {item.label}
                  {hasChildren && <ChevronDown className="h-4 w-4 opacity-70" />}
                </Link>
                {hasChildren && isOpen && (
                  <div className="absolute left-0 right-0 top-full z-50 lg:left-auto lg:right-auto lg:min-w-[280px]">
                    <ul
                      id={`nav-drop-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                      className="mt-px rounded-b-lg border border-gray-100 bg-white py-2 shadow-lg"
                    >
                      {item.children!.map((c) => (
                        <li key={c.label}>
                          <Link
                            href={c.href}
                            className="block px-4 py-2 text-[14px] text-ink-muted hover:bg-surface-muted hover:text-gov-blue"
                            onClick={() => setOpen(null)}
                          >
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
