import { Header } from "@/components/website/Header";
import { SamaveshBanner } from "@/components/website/SamaveshBanner";
import { HeroCarousel } from "@/components/website/HeroCarousel";
import { LatestUpdates } from "@/components/website/LatestUpdates";
import { AboutUs } from "@/components/website/AboutUs";
import { Offerings } from "@/components/website/Offerings";
import { Organisations } from "@/components/website/Organisations";
import { PortalBanner } from "@/components/website/PortalBanner";
import { RecentDocuments } from "@/components/website/RecentDocuments";
import { ActivityCorner } from "@/components/website/ActivityCorner";
import { SocialMedia } from "@/components/website/SocialMedia";
import { SupportSection } from "@/components/website/SupportSection";
import { LogoStrip } from "@/components/website/LogoStrip";
import { SiteFooter } from "@/components/website/SiteFooter";
import { ImportantLinks } from "@/components/website/ImportantLinks";
import { NmbaHomeCompact } from "@/components/website/nmba/NmbaHomeCompact";
import { CookieConsent } from "@/components/website/CookieConsent";
import { resolveCookieBannerEnabled } from "@/lib/cookie-banner/resolve";

export default async function Home() {
  // Cache-tagged, so awaiting it here does not make the website home page
  // render per request.
  const cookieBanner = await resolveCookieBannerEnabled();

  return (
    <>
      <Header />
      <main id="main-content" className="flex-1">
        <SamaveshBanner />
        <HeroCarousel />
        <LatestUpdates />
        <NmbaHomeCompact />
        <AboutUs />
        <Offerings />
        <Organisations />
        <PortalBanner />
        <RecentDocuments />
        <ActivityCorner />
        <SocialMedia />
        <SupportSection />
        <LogoStrip />
      </main>
      <SiteFooter />
      <ImportantLinks />
      {/* Switched off from /admin/portals while the banner is redesigned. */}
      {cookieBanner && <CookieConsent />}
    </>
  );
}
