import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DbimPage } from "@/components/website-dbim/layout/DbimPage";
import { DbimPersonaGrid } from "@/components/website-dbim/utility/PersonaGrid";
import { DBIM_HEROES } from "@/lib/website-dbim/nav";
import { DBIM_PERSONAS, dbimPersona } from "@/lib/website-dbim/utility";
import "@/components/website-dbim/utility/utility.css";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return DBIM_PERSONAS.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const persona = dbimPersona((await params).slug);
  return persona ? { title: `${persona.title} | Department of Social Justice and Empowerment`, description: persona.description } : {};
}

export default async function Page({ params }: Props) {
  const persona = dbimPersona((await params).slug);
  if (!persona) notFound();
  return (
    <DbimPage spacing="flush" title={persona.title} crumbs={[{ label: persona.title }]} path={`/persona/${persona.slug}`} hero={DBIM_HEROES.default}>
      <div className="db-u-flush">
        <DbimPersonaGrid persona={persona} />
      </div>
    </DbimPage>
  );
}
