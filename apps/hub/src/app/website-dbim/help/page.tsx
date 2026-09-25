import type { Metadata } from "next";
import Link from "next/link";
import { DbimPage } from "@/components/website-dbim/layout/DbimPage";
import { DbimHelpTable } from "@/components/website-dbim/utility/HelpTable";
import { DBIM_HEROES, dbimHref } from "@/lib/website-dbim/nav";
import { DBIM_HELP_MORE } from "@/lib/website-dbim/utility";
import "@/components/website-dbim/utility/utility.css";

export const metadata: Metadata = {
  title: "Help | Department of Social Justice and Empowerment",
  description: "How to open the file formats in which documents on this website are published.",
};

/** The Department's Help page (app/website/help) in the reference's Help layout. */
export default function Page() {
  return (
    <DbimPage spacing="flush" title="Help" crumbs={[{ label: "Help" }]} path="/help" hero={DBIM_HEROES.help}>
      <div className="db-u-flush">
        <DbimHelpTable />
        <div className="db-u-prose">
          <h3 className="db-u-help__sub">Accessibility and Other Help</h3>
          <ul>
            {DBIM_HELP_MORE.map((m) => (
              <li key={m.path}>
                <Link href={dbimHref(m.path)}>{m.label}</Link>: {m.note}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DbimPage>
  );
}
