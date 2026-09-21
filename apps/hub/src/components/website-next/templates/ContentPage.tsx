import { PageLayout } from "@/components/website-next/layout/PageLayout";
import type { PageHeaderProps } from "@/components/website-next/layout/PageHeader";

interface ContentPageProps extends PageHeaderProps {
  children: React.ReactNode;
  /** Optional side panels: related links, downloads, contacts. */
  sidebar?: React.ReactNode;
}

/**
 * T1 — Content page. Department text at a readable measure, with an optional
 * side column that sticks while the text scrolls on a wide screen.
 */
export function ContentPage({ children, sidebar, ...header }: ContentPageProps) {
  return (
    <PageLayout {...header}>
      <div className="wn-section">
        <div className={`sa-container${sidebar ? " wn-split" : ""}`}>
          <article className="wn-prose min-w-0" aria-labelledby="page-title">
            {children}
          </article>
          {sidebar && <aside className="wn-aside wn-aside--sticky" aria-label="Related">{sidebar}</aside>}
        </div>
      </div>
    </PageLayout>
  );
}
