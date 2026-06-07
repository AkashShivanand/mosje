import { PageLayout } from "@/components/layout/PageLayout";
import type { PageHeroProps } from "@/components/layout/PageHero";

interface ContentPageProps extends PageHeroProps {
  children: React.ReactNode;
  /** Optional right-rail (table of contents, related links, downloads). */
  sidebar?: React.ReactNode;
}

/**
 * T1 — Content / Inner page template.
 * Header + breadcrumb title band + a readable prose column (`.gov-prose`) with an optional sidebar.
 * Used by About, division pages, FAQs, guidelines, policy text, etc.
 */
export function ContentPage({ children, sidebar, ...hero }: ContentPageProps) {
  return (
    <PageLayout {...hero}>
      <section>
        <div
          className={`mx-auto grid max-w-[1280px] gap-10 px-4 py-10 md:py-12 ${
            sidebar ? "lg:grid-cols-[minmax(0,1fr)_300px]" : ""
          }`}
        >
          <article className="gov-prose min-w-0">{children}</article>
          {sidebar && <aside className="lg:pt-1">{sidebar}</aside>}
        </div>
      </section>
    </PageLayout>
  );
}
