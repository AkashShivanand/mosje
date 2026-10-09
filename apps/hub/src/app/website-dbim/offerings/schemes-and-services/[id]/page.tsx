import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DbimPage } from "@/components/website-dbim/layout/DbimPage";
import { DbimSchemeDetail } from "@/components/website-dbim/offerings/SchemeDetail";
import { dbimSchemeDetail, dbimSchemeIds } from "@/lib/website-dbim/offerings";
import "@/components/website-dbim/offerings/offerings.css";

type Params = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return dbimSchemeIds().map((id) => ({ id }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const d = dbimSchemeDetail(id);
  return {
    title: `${d?.name ?? "Scheme"} | Department of Social Justice and Empowerment`,
    description: d?.summary,
  };
}

/**
 * One scheme of the live Schemes & Services listing: at its scheme-master id where
 * the master holds it, else at its live address. The reference
 * draws this page without the Offerings sub-tab bar, and prints "Offerings" in
 * the breadcrumb unlinked.
 */
export default async function DbimSchemeDetailPage({ params }: Params) {
  const { id } = await params;
  const detail = dbimSchemeDetail(id);
  if (!detail) notFound();
  return (
    <DbimPage
      title={detail.name}
      crumbs={[{ label: "Offerings" }, { label: "Schemes and Services", path: "/offerings" }]}
      path={`/offerings/schemes-and-services/${detail.id}`}
    >
      <DbimSchemeDetail detail={detail} />
    </DbimPage>
  );
}
