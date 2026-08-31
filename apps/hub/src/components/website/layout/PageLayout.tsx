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
      {/* OUTSIDE <main>, deliberately. This is site-wide chrome like the header,
          and its drawer carries an <h2> — rendered inside <main> that <h2> sits
          above the page's own <h1>, which reverses the heading order on every
          inner page the moment a reader opens the drawer. */}
      {showBanner && <SamaveshBanner />}
      <main id="content" className="flex-1">
        <PageHero {...hero} />
        {children}
      </main>
      {/* [DBIM 5.6] The footer's "Last Updated On" must be the respective page's date. */}
      <SiteFooter lastUpdated={hero.lastUpdated} />
      <ImportantLinks />
    </>
  );
}
