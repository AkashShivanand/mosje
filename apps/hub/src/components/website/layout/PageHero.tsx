import { Breadcrumb, type Crumb } from "./Breadcrumb";

export interface PageHeroProps {
  title: string;
  breadcrumb: Crumb[];
  description?: string;
  lastUpdated?: string;
}

/** Title band for inner pages: breadcrumb + H1 + optional intro + "Last Updated" stamp (GIGW). */
export function PageHero({ title, breadcrumb, description, lastUpdated }: PageHeroProps) {
  return (
    <section className="border-b border-gray-200 bg-surface-muted">
      <div className="mx-auto max-w-[1280px] px-4 py-6 md:py-8">
        <Breadcrumb items={breadcrumb} />
        <h1 className="mt-3 text-[28px] font-bold leading-tight text-gov-blue-dark md:text-[32px]">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-ink-muted">{description}</p>
        )}
        {lastUpdated && (
          <p className="mt-3 text-[12px] text-gray-500">
            Last Updated: <time>{lastUpdated}</time>
          </p>
        )}
      </div>
    </section>
  );
}
