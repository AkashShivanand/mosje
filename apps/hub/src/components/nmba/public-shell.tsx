"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SiteHeader,
  Icon,
  buttonClasses,
  OrgLogo,
  PortalPage,
  type PortalNavGroup,
} from "@mosje/design-system";

const BASE = "/portals/nmba";

/**
 * NMBA's public navigation.
 *
 * `roles` is left off every item on purpose: this shell serves the citizen-facing
 * half of the portal and every destination in it is public. The administrator's
 * rail is a different set behind `admin-shell`.
 */
const NAV: PortalNavGroup[] = [
  {
    items: [
      { label: "Dashboard", href: BASE, icon: "grid_view" },
      { label: "Activity Snapshot", href: `${BASE}/activities`, icon: "monitoring" },
      { label: "E-Pledge", href: `${BASE}/epledge`, icon: "volunteer_activism" },
      { label: "Nasha Mukti Mitr", href: `${BASE}/register-mitr`, icon: "person_add" },
      { label: "Facilities", href: `${BASE}/facilities`, icon: "location_on" },
      { label: "Helpline", href: `${BASE}/helpline`, icon: "call" },
    ],
  },
];

/**
 * NMBA's public shell — now a thin wrapper around `PortalPage`.
 *
 * It used to hand-assemble the shell: a flex column, `SiteHeader`, `SidebarNav`
 * and its own `<main>`. That is one of the sixteen hand-rolled shells the
 * template layer replaced, and rebuilding it here bought two things the old one
 * did not have.
 *
 * **Navigation on a phone.** The rail carried `hidden md:flex`, and the header's
 * toggle drove the same `collapsed` state the desktop rail used — so below the
 * tablet anchor a citizen had a menu button that collapsed a rail they could not
 * see, and no way to reach any other page. `PortalPage` opens a drawer instead,
 * and closes it when the route changes.
 *
 * **`data-portal`**, which the palette re-bind reads. The old shell never set it.
 *
 * What stays here is what is genuinely NMBA's: the masthead's branding, its
 * language toggle, and the two actions in its top-right — the admin link and the
 * helpline, whose saffron is `saffron-600` rather than the key colour because
 * white on the key colour measures 3.15:1 and fails WCAG 1.4.3 at this size.
 */
export function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [lang, setLang] = React.useState("English");

  return (
    <PortalPage
      portal="nmba"
      role="public"
      pathname={pathname}
      nav={NAV}
      /* `main-content`, not the default `main`: the masthead below points its
         skip link at `#main-content`, and the two must agree or the skip link
         resolves to nothing — invisible in review, and broken only for the
         keyboard user it exists to serve. */
      mainId="main-content"
      identity={{
        name: "NMBA",
        expansion: "Nasha Mukt Bharat Abhiyaan",
        mark: <OrgLogo path="/portals/nmba" tile={false} />,
        href: BASE,
      }}
      /* A function, so the masthead drives the rail: above the tablet anchor its
         button collapses the column, below it opens the drawer. PortalPage owns
         that decision so no portal has to make it again. */
      header={(nav) => (
        <SiteHeader
          onToggleNav={nav.toggle}
          navExpanded={nav.open}
          homeHref={BASE}
          variant="portal"
          sticky
          emblemSrc={`${BASE}/brand/national-emblem.svg`}
          brandLines={{
            org: "Government of India",
            ministry: "Ministry of Social Justice & Empowerment",
            department: "Department of Social Justice & Empowerment",
          }}
          beta
          skipTo="#main-content"
          govLink={{ href: "https://india.gov.in", label: "Government of India" }}
          language={{
            label: lang,
            lang: lang === "English" ? "en" : "hi",
            onClick: () => setLang((l) => (l === "English" ? "हिंदी" : "English")),
          }}
          actions={
            <div className="flex items-center gap-3">
              <Link
                href={`${BASE}/admin/login`}
                className={buttonClasses("primary", "outlined", "sm")}
                aria-label="Admin Login"
              >
                <span className="ds-btn__icon" aria-hidden="true">
                  <Icon name="login" size={16} />
                </span>
                <span className="hidden sm:inline">Admin Login</span>
              </Link>
              <a
                href="tel:14446"
                // saffron-600, not the bare `saffron` (#ec6a1f): white on that is 3.15:1 and
                // fails WCAG 1.4.3 for this 14px label. saffron-600 #b8500f is 5.01:1.
                className="flex items-center gap-2 rounded-lg bg-saffron-600 px-3 py-1.5 text-label-1 font-semibold text-white hover:bg-saffron-dark"
                aria-label="Call National De-addiction Helpline 14446"
              >
                <Icon name="call" size={16} />
                <span className="hidden sm:inline">Helpline 14446</span>
              </a>
            </div>
          }
        />
      )}
    >
      {children}
    </PortalPage>
  );
}
