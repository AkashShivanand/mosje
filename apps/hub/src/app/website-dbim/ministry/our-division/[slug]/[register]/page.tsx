import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DbimPage } from "@/components/website-dbim/layout/DbimPage";
import { DbimFileList } from "@/components/website-dbim/documents/DbimFileList";
import { EnforcementTable } from "@/components/website-dbim/division/EnforcementTable";
import { DBIM_MENU } from "@/lib/website-dbim/nav";
import { DBIM_REGISTERS, divisionRegister } from "@/lib/website-dbim/division-registers";
import "@/components/website-dbim/division/division.css";

/** Every register is known at build time; anything else under a division is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return DBIM_REGISTERS.map((r) => ({ slug: r.division, register: r.slug }));
}

type Props = { params: Promise<{ slug: string; register: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, register } = await params;
  const r = divisionRegister(slug, register);
  return { title: `${r?.title ?? "Our Division"} | Department of Social Justice and Empowerment` };
}

/**
 * A division's register (a Related Link on its division page), drawn with the DBIM
 * document list — the same data the 2026 design's page reads (`lib/website-dbim/division-registers.ts`).
 */
export default async function DbimDivisionRegisterPage({ params }: Props) {
  const { slug, register } = await params;
  const r = divisionRegister(slug, register);
  if (!r) notFound();
  return (
    <DbimPage
      title={r.title}
      crumbs={[
        { label: "Ministry", path: "/ministry" },
        { label: "Our Division", path: "/ministry/our-division" },
        { label: r.divisionName, path: `/ministry/our-division/${r.division}`, active: false },
      ]}
      path="/ministry/our-division"
      activeTab="/ministry/our-division"
      tabs={DBIM_MENU[0]!.children}
    >
      <div className="db-register">
        {r.enforcement ? <EnforcementTable rows={r.enforcement} label={r.title} /> : null}
        {r.lists.map((list, i) =>
          list.heading ? (
            <section key={i} className="db-register__section" aria-labelledby={`register-${i}`}>
              <h2 id={`register-${i}`} className="db-register__h2">
                {list.heading}
              </h2>
              <DbimFileList rows={list.rows} label={list.heading} />
            </section>
          ) : (
            <DbimFileList key={i} rows={list.rows} label={r.title} />
          ),
        )}
      </div>
    </DbimPage>
  );
}
