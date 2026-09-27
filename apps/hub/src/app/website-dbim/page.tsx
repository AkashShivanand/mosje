import type { Metadata } from "next";

import { DbimBanner } from "@/components/website-dbim/home/Banner";
import { DbimPmQuote } from "@/components/website-dbim/home/PmQuote";
import { DbimAboutUs } from "@/components/website-dbim/home/AboutUs";
import { DbimOfferingsAndNews } from "@/components/website-dbim/home/OfferingsAndNews";
import { DbimDocumentsRow } from "@/components/website-dbim/home/DocumentsRow";
import { DbimSocialMedia } from "@/components/website-dbim/home/SocialMedia";
import { DbimCampaigns } from "@/components/website-dbim/home/Campaigns";
import { DbimPartners } from "@/components/website-dbim/home/Partners";

/* The reference's own tab title for its home page. `absolute`, so a title template
   added to the layout later cannot double it. */
export const metadata: Metadata = {
  title: { absolute: "Home | Department of Social Justice and Empowerment" },
};

/**
 * The DBIM design's home page, in the reference's section order. The home page has
 * no banner heading of its own, so the page's one h1 is visually hidden and every
 * section below carries an h2.
 */
export default function DbimHome() {
  return (
    <div className="db-home">
      <h1 className="sr-only">Department of Social Justice and Empowerment</h1>
      <DbimBanner />
      <DbimPmQuote />
      <DbimAboutUs />
      <DbimOfferingsAndNews />
      <DbimDocumentsRow />
      <DbimSocialMedia />
      <DbimCampaigns />
      <DbimPartners />
    </div>
  );
}
