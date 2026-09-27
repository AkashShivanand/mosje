import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DIVISIONS } from "@/data/website";
import { DbimPage } from "@/components/website-dbim/layout/DbimPage";
import { DbimDetailLayout } from "@/components/website-dbim/ministry/DetailLayout";
import { DbimLinkRow } from "@/components/website-dbim/ministry/DocRow";
import { DBIM_MENU } from "@/lib/website-dbim/nav";
import { divisionDetail } from "@/lib/website-dbim/ministry";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return DIVISIONS.map((d) => ({ slug: d.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const d = divisionDetail((await params).slug);
  return { title: `${d?.title ?? "Our Division"} | Department of Social Justice and Empowerment`, description: d?.summary };
}

/** A division, in the reference's article layout (spec §3). */
export default async function DbimDivisionPage({ params }: Props) {
  const d = divisionDetail((await params).slug);
  if (!d) notFound();
  return (
    <DbimPage
      title={d.title}
      crumbs={[
        { label: "Ministry", path: "/ministry" },
        { label: "Our Division", path: "/ministry/our-division" },
      ]}
      path="/ministry/our-division"
      activeTab="/ministry/our-division"
      tabs={DBIM_MENU[0]!.children}
    >
      <DbimDetailLayout summary={d.summary}>
        {/* A division whose every link leads to a page this design does not have shows none. */}
        {d.links.length > 0 ? (
          <section aria-labelledby="division-links">
            <h2 id="division-links">Related Links</h2>
            {d.links.map((l) => (
              <DbimLinkRow key={l.href} label={l.label} href={l.href} external={l.external} />
            ))}
          </section>
        ) : null}
      </DbimDetailLayout>
    </DbimPage>
  );
}
