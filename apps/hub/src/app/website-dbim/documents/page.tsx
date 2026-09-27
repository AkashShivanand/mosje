import type { Metadata } from "next";
import { DocumentsTab } from "@/components/website-dbim/documents/DocumentsTab";

export const metadata: Metadata = { title: "Reports | Department of Social Justice and Empowerment" };

export default function DbimReportsPage() {
  return <DocumentsTab tab="reports" />;
}
