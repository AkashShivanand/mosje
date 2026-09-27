import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DbimPage } from "@/components/website-dbim/layout/DbimPage";
import { DbimFileList } from "@/components/website-dbim/documents/DbimFileList";
import { allSeriesParams, docTab, seriesDocuments } from "@/lib/website-dbim/documents";

/** Every series of every Documents tab is known at build time. */
export const dynamicParams = false;

export function generateStaticParams() {
  return allSeriesParams();
}

type Props = { params: Promise<{ category: string; series: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, series } = await params;
  const found = seriesDocuments(category, series);
  return { title: `${found?.series.title ?? "Documents"} | Department of Social Justice and Empowerment` };
}

/** A series: its files, newest first — the reference's series page has no sub-tabs. */
export default async function DbimSeriesPage({ params }: Props) {
  const { category, series } = await params;
  const found = seriesDocuments(category, series);
  const tab = docTab(category);
  if (!found || !tab) notFound();
  return (
    <DbimPage
      title={found.series.title}
      crumbs={[
        { label: "Documents", path: "/documents" },
        { label: tab.label, path: tab.path, active: false },
      ]}
      path={`/documents/${category}/${series}`}
    >
      <DbimFileList rows={found.rows} label={found.series.title} />
    </DbimPage>
  );
}
