import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RecordDetail } from "@/components/website-next/templates/RecordDetail";
import { getContentSyncedDate, getCpio, getCpios } from "@/lib/website/content";
import { facts } from "@/lib/website/record-facts";
import { socialCard } from "@/lib/seo/social";

/** 13 officers — every one is prerendered. */
export function generateStaticParams() {
  return getCpios().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const officer = getCpio(slug);
  if (!officer) return { title: "Officer Not Found | Department of Social Justice & Empowerment" };
  const description = `Central Public Information Officer, ${officer.organisation ?? "Department of Social Justice & Empowerment"}.`;
  return {
    title: `${officer.title} | Department of Social Justice & Empowerment`,
    description,
    ...socialCard({ title: officer.title, description, url: `/website/cpio/${officer.slug}` }),
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const officer = getCpio(slug);
  if (!officer) notFound();

  /*
   * THE EMAIL IS PRINTED AS THE DEPARTMENT PRINTS IT.
   *
   * Several rows carry the obfuscated form — `dysecy[at]ncbc[dot]nic[dot]in` —
   * and several carry a plain address. Both are left exactly as published: the
   * obfuscation is the department's own decision about its officers' addresses,
   * and un-obfuscating it here would publish something they chose not to.
   */
  return (
    <RecordDetail
      title={officer.name ?? officer.title}
      badge="Central Public Information Officer"
      breadcrumb={[
        { label: "Contact" },
        { label: "CPIO", href: "/website/cpio" },
        { label: officer.name ?? officer.title },
      ]}
      backHref="/website/cpio"
      backLabel="Back to CPIOs"
      lastUpdated={getContentSyncedDate()}
      facts={facts([
        { term: "Designation", value: officer.designation },
        { term: "Organisation", value: officer.organisation },
        { term: "Email", value: officer.email },
        { term: "Office / Division", value: officer.office, wide: true },
      ])}
      sourceUrl={officer.sourceUrl}
    />
  );
}
