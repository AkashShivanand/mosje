import { Header } from "@/components/website/Header";
import { SamaveshBanner } from "@/components/website/SamaveshBanner";
import { HeroCarousel } from "@/components/website/HeroCarousel";
import { AboutUs } from "@/components/website/AboutUs";
import { Offerings } from "@/components/website/Offerings";
import { Organisations } from "@/components/website/Organisations";
import { NmbaHomeCompact } from "@/components/website/nmba/NmbaHomeCompact";
import { SamaveshJusticeBanner } from "@/components/website/SamaveshJusticeBanner";
import { RecentDocuments } from "@/components/website/RecentDocuments";
import { DeaddictionMapSection } from "@/components/website/DeaddictionMapSection";
import { ActivityCorner } from "@/components/website/ActivityCorner";
import { SocialMedia } from "@/components/website/SocialMedia";
import { SupportSection } from "@/components/website/SupportSection";
import { LogoStrip } from "@/components/website/LogoStrip";
import { SiteFooter } from "@/components/website/SiteFooter";
import { ImportantLinks } from "@/components/website/ImportantLinks";
import { WebsiteCookieNotice } from "@/components/website/cookie-notice";
import { resolveCookieBannerEnabled } from "@/lib/cookie-banner/resolve";

export default async function Home() {
  // Cache-tagged, so awaiting it here does not make the website home page
  // render per request.
  const cookieBanner = await resolveCookieBannerEnabled();

  return (
    <>
      <Header />
      {/* Site-wide chrome, so it sits BETWEEN the header and <main>. Inside <main>
          its drawer heading is an <h2> that lands above the page's own <h1>. */}
      <SamaveshBanner />
      <main id="main-content" className="flex-1">
        <HeroCarousel />
        <AboutUs />
        <Offerings />
        <Organisations />
        <NmbaHomeCompact />
        <SamaveshJusticeBanner />
        <RecentDocuments />
        <DeaddictionMapSection />
        <ActivityCorner />
        <SocialMedia />
        <SupportSection />
        <LogoStrip />
      </main>
      <SiteFooter />
      <ImportantLinks />
      {/* Switched off from /admin/portals while the banner is redesigned. */}
      {cookieBanner && <WebsiteCookieNotice />}
    </>
  );
}
