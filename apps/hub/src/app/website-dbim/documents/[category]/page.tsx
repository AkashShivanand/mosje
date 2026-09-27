import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocumentsTab } from "@/components/website-dbim/documents/DocumentsTab";
import { docTab, type DbimDocTab } from "@/lib/website-dbim/documents";

/* Reports is the Documents landing page itself (/documents); these are the other two tabs. */
const TABS: DbimDocTab[] = ["orders-and-notices", "publications"];

export const dynamicParams = false;

export function generateStaticParams() {
  return TABS.map((category) => ({ category }));
}

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  return { title: `${docTab(category)?.label ?? "Documents"} | Department of Social Justice and Empowerment` };
}

export default async function DbimDocumentsTabPage({ params }: Props) {
  const { category } = await params;
  if (!TABS.includes(category as DbimDocTab)) notFound();
  return <DocumentsTab tab={category as DbimDocTab} />;
}
