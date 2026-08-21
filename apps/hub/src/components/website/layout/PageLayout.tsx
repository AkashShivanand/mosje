import { Header } from "@/components/website/Header";
import { SamaveshBanner } from "@/components/website/SamaveshBanner";
import { SiteFooter } from "@/components/website/SiteFooter";
import { ImportantLinks } from "@/components/website/ImportantLinks";
import { PageHero, type PageHeroProps } from "./PageHero";

interface PageLayoutProps extends PageHeroProps {
  children: React.ReactNode;
  /** Show the site-wide SAMAVESH banner under the header (default true). */
  showBanner?: boolean;
}

/** Standard chrome for every inner page: header + banner + title band + content + footer + overlays. */
export function PageLayout({
  children,
  showBanner = true,
  ...hero
}: PageLayoutProps) {
  return (
    <>
      <Header />
      <main id="content" className="flex-1">
        {showBanner && <SamaveshBanner />}
        <PageHero {...hero} />
        {children}
      </main>
      {/* [DBIM 5.6] The footer's "Last Updated On" must be the respective page's date. */}
      <SiteFooter lastUpdated={hero.lastUpdated} />
      <ImportantLinks />
    </>
  );
}
