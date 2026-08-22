import Image from "next/image";
import { Breadcrumb, type Crumb } from "./Breadcrumb";

export interface PageHeroProps {
  title: string;
  breadcrumb: Crumb[];
  badge?: string;
  logoSrc?: string;
  description?: string;
  lastUpdated?: string;
  actions?: React.ReactNode;
}

/** Title band for inner pages: breadcrumb + optional badge/logo + H1 + optional intro + "Last Updated" stamp (GIGW / DBIM). */
export function PageHero({
  title,
  breadcrumb,
  badge,
  logoSrc,
  description,
  lastUpdated,
  actions,
}: PageHeroProps) {
  return (
    <section className="border-b border-gray-200 bg-surface-muted">
      <div className="sa-container py-6 md:py-8">
        <Breadcrumb items={breadcrumb} />

        <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="max-w-3xl">
            {badge && (
              <span className="inline-block rounded bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary uppercase tracking-wide mb-2">
                {badge}
              </span>
            )}
            <h1 className="text-[26px] sm:text-[32px] font-bold leading-tight text-primary-dark">
              {title}
            </h1>
            {description && (
              <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">
                {description}
              </p>
            )}
            {lastUpdated && (
              <p className="mt-3 text-[12px] text-ink-muted/70">
                Last Updated: <time>{lastUpdated}</time>
              </p>
            )}
          </div>

          <div className="flex items-center gap-4 self-start md:self-center">
            {logoSrc && (
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white p-2 border border-gray-200 shadow-xs">
                <Image
                  src={logoSrc}
                  alt={title}
                  width={48}
                  height={48}
                  className="h-full w-full object-contain"
                />
              </div>
            )}
            {actions && <div>{actions}</div>}
          </div>
        </div>
      </div>
    </section>
  );
}
