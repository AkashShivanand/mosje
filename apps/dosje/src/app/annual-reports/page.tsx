import type { Metadata } from "next";
import { ListingPage } from "@/components/templates/ListingPage";
import { documentColumns } from "@/data/columns";

export const metadata: Metadata = {
  title: "Annual Reports | DoSJE",
  description:
    "Annual reports of the Department of Social Justice & Empowerment and the National Commission for Safai Karamcharis.",
};

const rows = [
  { title: "Annual Report 1994-1995", org: "NCSK", year: "1994-95", size: "3.03 MB", date: "31 Mar 1995", href: "#" },
  { title: "Annual Report 1995-1996", org: "NCSK", year: "1995-96", size: "4.70 MB", date: "31 Mar 1996", href: "#" },
  { title: "Annual Report 1996-1997 & 1997-1998 (Combined)", org: "NCSK", year: "NA", size: "4.51 MB", date: "31 Mar 1998", href: "#" },
  { title: "Annual Report 1998-1999 & 1999-2000 (Combined)", org: "NCSK", year: "NA", size: "2.33 MB", date: "31 Mar 2000", href: "#" },
  { title: "Annual Report 2005-2006 & 2006-2007 (Combined)", org: "NCSK", year: "NA", size: "20.64 MB", date: "31 Mar 2007", href: "#" },
  { title: "Annual Report 2006-2008", org: "NCSK", year: "2006-08", size: "20.64 MB", date: "31 Mar 2008", href: "#" },
  { title: "Annual Report 2007-2008 & 2008-2009 (Combined)", org: "NCSK", year: "NA", size: "159.48 MB", date: "31 Mar 2009", href: "#" },
  { title: "Annual Report 2025-26 (English)", org: "DoSJE", year: "2025-26", size: "12.40 MB", date: "01 Apr 2026", href: "#" },
  { title: "Annual Report 2025-26 (Hindi)", org: "DoSJE", year: "2025-26", size: "13.10 MB", date: "01 Apr 2026", href: "#" },
];

export default function Page() {
  return (
    <ListingPage
      title="Annual Reports"
      breadcrumb={[{ label: "Documents" }, { label: "Annual Reports" }]}
      lastUpdated="06 Jun 2026"
      description="Annual reports published by the Department of Social Justice & Empowerment and the National Commission for Safai Karamcharis."
      columns={documentColumns}
      rows={rows}
      searchKeys={["title", "org"]}
      searchPlaceholder="Search annual reports…"
    />
  );
}
