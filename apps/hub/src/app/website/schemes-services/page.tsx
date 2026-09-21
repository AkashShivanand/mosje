import type { Metadata } from "next";
import { Suspense } from "react";
import { Icon, SectionTitle } from "@mosje/design-system";
import { PageLayout } from "@/components/website-next/layout/PageLayout";
import { SchemesCatalog, SchemesCatalogStatic } from "@/components/website-next/templates/SchemesCatalog";
import { ROUTES } from "@/lib/website-next/schemes";
import { MASTER_DATE } from "@/lib/website-next/scheme-view";
import { socialCard } from "@/lib/seo/social";

const DESCRIPTION =
  "Schemes of the Department of Social Justice & Empowerment, by who they are for and what they provide, with where to apply for each.";

/**
 * The title and description are WRITTEN OUT AS LITERALS here, not hoisted, and
 * must stay that way: `scripts/build-search-index.mjs` reads both straight out
 * of this object with a regex. The constant is kept only for the social block.
 */
export const metadata: Metadata = {
  title: "Find a Scheme | DoSJE",
  description:
    "Schemes of the Department of Social Justice & Empowerment, by who they are for and what they provide, with where to apply for each.",
  ...socialCard({
    title: "Find a Scheme | DoSJE",
    description: DESCRIPTION,
    url: "/website/schemes-services",
  }),
};

/** Portals and helplines with a confirmed address (routes whose href is null are left out). */
const PLACES = Object.entries(ROUTES)
  .filter(([, r]) => r.href)
  .map(([id, r]) => ({
    id,
    // "the NOS portal" → "NOS portal"; "Helpline 14446, or the nearest centre" → "Helpline 14446".
    label: r.label
      .split(",")[0]!
      .replace(/^the /, "")
      .replace(/^(?!e-)\w/, (c) => c.toUpperCase()),
    href: r.href as string,
    tel: r.href!.startsWith("tel:"),
  }))
  .sort((a, b) => Number(a.tel) - Number(b.tel));

export default function SchemesPage() {
  return (
    <PageLayout
      title="Find a Scheme"
      breadcrumb={[{ label: "Schemes & Services" }, { label: "Find a Scheme" }]}
      description="Schemes of the Department, by who they are for and what they provide."
      lastUpdated={MASTER_DATE}
    >
      <div className="wn-section">
        <div className="sa-container">
          <Suspense fallback={<SchemesCatalogStatic />}>
            <SchemesCatalog />
          </Suspense>
        </div>
      </div>

      <section className="wn-section wn-section--muted" aria-labelledby="where-to-apply">
        <div className="sa-container">
          <SectionTitle
            headingId="where-to-apply"
            title="Where to Apply"
            description="Portals and helplines through which the Department's schemes are applied for."
          />
          <ul className="wn-routes">
            {PLACES.map((p) => (
              <li key={p.id}>
                <a
                  href={p.href}
                  className="wn-route"
                  {...(p.tel ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                >
                  <span className="wn-route__icon" aria-hidden>
                    <Icon name={p.tel ? "call" : "language"} size={24} />
                  </span>
                  <span className="wn-route__label">{p.label}</span>
                  {!p.tel && (
                    <>
                      <span className="wn-route__ext" aria-hidden>
                        <Icon name="open_in_new" size={16} />
                      </span>
                      <span className="sr-only">(opens in a new window)</span>
                    </>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PageLayout>
  );
}
