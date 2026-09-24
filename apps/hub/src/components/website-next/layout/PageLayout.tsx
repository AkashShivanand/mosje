import { Masthead } from "@/components/website-next/chrome/Masthead";
import { WebsiteFooter } from "@/components/website-next/chrome/Footer";
import { WebsitePageHeader, type PageHeaderProps } from "./PageHeader";

export type PageHeroProps = PageHeaderProps;

interface PageLayoutProps extends PageHeaderProps {
  children: React.ReactNode;
  /** Accepted for the page files' existing props; the redesign has no banner strip. */
  showBanner?: boolean;
}

/**
 * The chrome for every inner page of the redesign: masthead, page header, the
 * page's content, footer.
 *
 * `<main id="content" tabIndex={-1}>` on EVERY template is what makes the skip
 * link land (issue ACC-02: on the classic site it pointed at an id most templates
 * did not have). `tabIndex={-1}` lets the link move focus, not just scroll.
 */
export function PageLayout(props: PageLayoutProps) {
  const { children, ...rest } = props;
  const { showBanner, ...header } = rest;
  void showBanner;
  return (
    <>
      <Masthead />
      <main id="content" tabIndex={-1} className="wn-main">
        <WebsitePageHeader {...header} />
        {children}
      </main>
      <WebsiteFooter lastUpdated={header.lastUpdated} />
    </>
  );
}
