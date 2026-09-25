import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArchiveTab } from "@/components/website-dbim/documents/ArchiveTab";
import { DBIM_ARCHIVE_TABS, type DbimArchiveKind } from "@/lib/website-dbim/documents";

/* Tenders is /archives itself. */
const KINDS: DbimArchiveKind[] = DBIM_ARCHIVE_TABS.map((t) => t.key).filter((k) => k !== "tenders");

export const dynamicParams = false;

export function generateStaticParams() {
  return KINDS.map((kind) => ({ kind }));
}

type Props = { params: Promise<{ kind: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { kind } = await params;
  const tab = DBIM_ARCHIVE_TABS.find((t) => t.key === kind);
  return { title: `${tab ? `Archived ${tab.label}` : "Archives"} | Department of Social Justice and Empowerment` };
}

export default async function DbimArchiveKindPage({ params }: Props) {
  const { kind } = await params;
  if (!KINDS.includes(kind as DbimArchiveKind)) notFound();
  return <ArchiveTab kind={kind as DbimArchiveKind} />;
}
