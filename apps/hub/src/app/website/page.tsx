import type { Metadata } from "next";
import { T } from "@/components/i18n/translation-provider";
import { Masthead } from "@/components/website-next/chrome/Masthead";
import { SamaveshBand } from "@/components/website-next/chrome/SamaveshBand";
import { WebsiteFooter } from "@/components/website-next/chrome/Footer";
import { Banner } from "@/components/website-next/home/Banner";
import { WhatsNew } from "@/components/website-next/home/WhatsNew";
import { Audiences } from "@/components/website-next/home/Audiences";
import { Offerings } from "@/components/website-next/home/Offerings";
import { Documents } from "@/components/website-next/home/Documents";
import { Activity } from "@/components/website-next/home/Activity";
import { Organisations } from "@/components/website-next/home/Organisations";
import { SchemePortals } from "@/components/website-next/home/SchemePortals";
import { Leadership } from "@/components/website-next/home/Leadership";
import { PmQuote } from "@/components/website-next/home/PmQuote";
import { Centres } from "@/components/website-next/home/Centres";
import { Pledges } from "@/components/website-next/home/Pledges";
/* The marquee is shared with the classic home page rather than copied: one list of
   marks, one set of links, one pause control. It moves into website-next when the
   classic tree is retired. */
import { LogoStrip } from "@/components/website/LogoStrip";
/* Shared with the classic page for the same reason as the marquee: one banner,
   one set of words, one image pair. It moves into website-next with the rest. */
import { SamaveshJusticeBanner } from "@/components/website/SamaveshJusticeBanner";
import { Social } from "@/components/website-next/home/Social";
import { Helplines } from "@/components/website-next/home/Helplines";
import "@/components/website-next/home/home.css";

export const metadata: Metadata = {
  // The tab title starts with the page h1 (issue SEO-06, GIGW).
  title:
    "Department of Social Justice & Empowerment | Schemes, Services and Support",
  description:
    "Schemes, services and support from the Department of Social Justice & Empowerment for Scheduled Castes, Other Backward Classes, senior citizens, transgender persons and other groups.",
};

/* Structured data for the home page (issue SEO-04): who publishes the site.
   No SearchAction yet: the search address differs between this prototype and
   dosje.gov.in, and a search box pointing at neither would be a broken promise. */
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "GovernmentOrganization",
      name: "Department of Social Justice & Empowerment",
      parentOrganization: {
        "@type": "GovernmentOrganization",
        name: "Ministry of Social Justice & Empowerment, Government of India",
      },
      url: "https://dosje.gov.in/",
      address: {
        "@type": "PostalAddress",
        streetAddress: "8th Floor, GPOA-3, Netaji Nagar",
        addressLocality: "New Delhi",
        postalCode: "110023",
        addressCountry: "IN",
      },
      sameAs: [
        "https://www.facebook.com/goimsje",
        "https://x.com/msjegoi",
        "https://www.instagram.com/msjegoi",
        "https://www.youtube.com/@ministryofsocialjustice511",
      ],
    },
    {
      "@type": "WebSite",
      name: "Department of Social Justice & Empowerment",
      url: "https://dosje.gov.in/",
    },
  ],
};

/**
 * The home page, in the live dosje.gov.in order: banner carousel, About with
 * the Ministers and the statistics strip, Offerings with What's New, the
 * Organisations, the pledges, Recent Documents, the personas, the
 * Activity Corner, social media, and Need Support with the helplines.
 * NOTHING HERE IS OURS. On 24 Sep 2026 the three sections this page carried
 * that the Figma reference does not — the announcements ticker, the task band
 * under it, and the Nasha Mukt Bharat Abhiyaan band — were removed on the
 * instruction that the page match the design. Two of them were added for a
 * reason, and the reasons are recorded rather than lost: the ticker answered
 * DBIM 3.0 §A.4.1 iii, which asks a departmental home page for an
 * announcements ticker, and the task band answered issue NAV-01, that the live
 * page offers a citizen no starting task. Both divergences are written up in
 * docs/website-redesign/home-audit-2026-09-22.md. The page's h1 came with the
 * task band, so it is now a screen-reader heading above the carousel.
 */
export default async function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <Masthead />
      {/* Site-wide chrome, so it sits between the masthead and <main>. */}
      <SamaveshBand />
      <main id="content" tabIndex={-1} className="wn-main">
        {/* The page's heading, for a screen reader and for search: the design
            opens on the banner carousel and carries no page headline, and a
            page without an h1 is a GIGW and WCAG failure whatever it looks
            like. It names what this page is — the Department — rather than
            describing the first section under it. */}
        <h1 className="sr-only">
          <T>Department of Social Justice &amp; Empowerment</T>
        </h1>
        <Banner />
        {/* DBIM 3.0 §7.3(iv): after the banner, before the Ministry section. */}
        <PmQuote />
        <Leadership />
        {/* The design's order from here: the portals and the figures, then the
            pledges, then Our Offerings. */}
        <SchemePortals />
        {/* The pledges and volunteering of every campaign, gathered as Figma's
            own section does, in the design's own place for it — fourth, under
            the figures. The NMBA band that used to stand above this was removed
            on 24 Sep 2026: once the pledges and the centre finder each became a
            section, it was a third door to the same campaign, carrying one link
            and a helpline the helplines section already lists. Figma switched
            its own copy of that band off for the same reason. */}
        <Pledges />
        <Offerings />
        {/* The eleven groups sit with the offerings, as the design's own
            audience chips do; they move INSIDE that section when it gains its
            tabs and filtered list. */}
        <Audiences />
        <WhatsNew />
        <Organisations />
        {/* The live page and Figma both place it here: after the pledges, before
            Recent Documents. */}
        <SamaveshJusticeBanner />
        {/* Recent Documents carries the four roles beside it, as one section. */}
        <Documents />
        {/* The live page and Figma both carry the locator here, after the
            personas and before the Activity Corner. */}
        <Centres />
        <Activity />
        <Social />
        <Helplines />
        {/* Last band before the footer, as on the live page and in Figma. */}
        <LogoStrip />
      </main>
      <WebsiteFooter />
    </>
  );
}
