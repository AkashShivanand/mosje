import { Header } from "@/components/website/Header";
import { WebsiteSamaveshBanner } from "@/components/website/website-samavesh-banner";
import { WebsiteSiteFooter } from "@/components/website/SiteFooter";
import { ImportantLinks } from "@/components/website/ImportantLinks";
import { PageHero, type PageHeroProps } from "./PageHero";

interface PageLayoutProps extends PageHeroProps {
  children: React.ReactNode;
  /** Show the site-wide SAMAVESH banner under the header (default true). */
  showBanner?: boolean;
  /**
   * Rendered inside `<main>` ABOVE the page hero.
   *
   * For a call to action the source page puts above its own title — NMBA opens
   * with a green "Join Nasha Mukt Bharat Abhiyaan" band carrying the volunteer
   * invitation and the de-addiction helpline, and it sits above the heading,
   * not below it. Folding it into the hero moved the campaign's own front door
   * below the fold of the page it fronts.
   */
  beforeHero?: React.ReactNode;
}

/** Standard chrome for every inner page: header + banner + title band + content + footer + overlays. */
export function PageLayout({
  children,
  showBanner = true,
  beforeHero,
  ...hero
}: PageLayoutProps) {
  return (
    <>
      <Header />
      {/* OUTSIDE <main>, deliberately. This is site-wide chrome like the header,
          and its drawer carries an <h2> — rendered inside <main> that <h2> sits
          above the page's own <h1>, which reverses the heading order on every
          inner page the moment a reader opens the drawer. */}
      {showBanner && <WebsiteSamaveshBanner />}
      <main id="content" className="flex-1">
        {beforeHero}
        <PageHero {...hero} />
        {children}
      </main>
      {/* [DBIM 5.6] The footer's "Last Updated On" must be the respective page's date. */}
      <WebsiteSiteFooter lastUpdated={hero.lastUpdated} />
      <ImportantLinks />
    </>
  );
}
