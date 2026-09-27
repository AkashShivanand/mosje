import type { Metadata } from "next";
import { ArchiveTab } from "@/components/website-dbim/documents/ArchiveTab";

export const metadata: Metadata = { title: "Archives | Department of Social Justice and Empowerment" };

/** The Archives open on Tenders, as the reference's (/archives?page=tenders). */
export default function DbimArchivesPage() {
  return <ArchiveTab kind="tenders" />;
}
