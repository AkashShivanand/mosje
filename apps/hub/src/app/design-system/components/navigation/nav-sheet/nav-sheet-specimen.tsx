"use client";

import * as React from "react";
import { orgLogoSrc, type OrgSlug, Button, NavSheet, type NavItem } from "@mosje/design-system";

const EMBLEM = "/design-system/national-emblem.svg";
// The registry resolves a mark; a template string beside it is the second copy the
// registry exists to prevent — and it silently assumes every mark is a .png.
const LOGO = (key: string) => orgLogoSrc(key as OrgSlug);

const BRAND_LINES = {
  org: "Government of India",
  ministry: "Ministry of Social Justice & Empowerment",
  department: "Department of Social Justice & Empowerment",
};

/**
 * The same shape the masthead renders — a plain link, a simple dropdown, and a
 * mega-menu — so the sheet's three states can all be reached from one specimen.
 */
const NAV: NavItem[] = [
  { label: "Home", href: "#", active: true },
  {
    label: "Department",
    href: "#",
    children: [
      { label: "About Us", href: "#" },
      { label: "Who’s Who", href: "#" },
      { label: "Directory", href: "#" },
    ],
  },
  {
    label: "Associated Organisations",
    href: "#",
    columns: [
      {
        heading: "Commissions",
        items: [
          { abbr: "NCSC", name: "National Commission for Scheduled Castes", href: "#", iconSrc: LOGO("ncsc") },
          { abbr: "NCSK", name: "National Commission for Safai Karamchari", href: "#", iconSrc: LOGO("ncsk") },
        ],
      },
      {
        heading: "Corporations",
        items: [
          {
            abbr: "NSFDC",
            name: "National Scheduled Castes Finance and Development Corporation",
            href: "#",
            iconSrc: LOGO("nsfdc"),
          },
        ],
      },
    ],
  },
];

/**
 * The sheet is a modal that covers the viewport, so it cannot be rendered open
 * inside the page. The trigger is the specimen: open it, expand a row, expand
 * the mega-menu row, and press Escape to confirm focus comes back here.
 */
export function NavSheetSpecimen(): React.JSX.Element {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open the navigation sheet</Button>
      <NavSheet
        open={open}
        onClose={() => setOpen(false)}
        nav={NAV}
        emblemSrc={EMBLEM}
        brandLines={BRAND_LINES}
        homeHref="#"
        search={{ placeholder: "Search schemes and services", onSearch: () => {} }}
        searchValue={query}
        onSearchValueChange={setQuery}
        language={{ label: "English" }}
      />
    </>
  );
}
