import { Header } from "@/components/Header";
import { SamaveshBanner } from "@/components/SamaveshBanner";
import { SiteFooter } from "@/components/SiteFooter";
import { ImportantLinks } from "@/components/ImportantLinks";
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
      <SiteFooter />
      <ImportantLinks />
    </>
  );
}
