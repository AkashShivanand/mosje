import { Header } from "@/components/Header";
import { SamaveshBanner } from "@/components/SamaveshBanner";
import { HeroCarousel } from "@/components/HeroCarousel";
import { LatestUpdates } from "@/components/LatestUpdates";
import { AboutUs } from "@/components/AboutUs";
import { Offerings } from "@/components/Offerings";
import { Organisations } from "@/components/Organisations";
import { PortalBanner } from "@/components/PortalBanner";
import { RecentDocuments } from "@/components/RecentDocuments";
import { ActivityCorner } from "@/components/ActivityCorner";
import { SocialMedia } from "@/components/SocialMedia";
import { LogoStrip } from "@/components/LogoStrip";
import { SiteFooter } from "@/components/SiteFooter";
import { ImportantLinks } from "@/components/ImportantLinks";

export default function Home() {
  return (
    <>
      <Header />
      <main id="content" className="flex-1">
        <SamaveshBanner />
        <HeroCarousel />
        <LatestUpdates />
        <AboutUs />
        <Offerings />
        <Organisations />
        <PortalBanner />
        <RecentDocuments />
        <ActivityCorner />
        <SocialMedia />
        <LogoStrip />
      </main>
      <SiteFooter />
      <ImportantLinks />
    </>
  );
}
