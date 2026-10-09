import { DashboardGlance } from "@/components/website-next/media/DashboardGlance";
import { AdarshGramDashboard } from "@/components/website/AdarshGramDashboard";
import { GiaDashboard } from "@/components/website/GiaDashboard";
import { HostelDashboard } from "@/components/website/HostelDashboard";
import { getAdarshGramCounts } from "@/lib/website/adarsh-gram-api";
import { getGiaData, getGiaGender, getHostelData } from "@/lib/website/pmajay-api";
import "./dashboard.css";

/**
 * The PM-AJAY dashboard, on the PM-AJAY page under Ministry › Our Scheme Portals.
 *
 * WHERE IT LIVES (the Department's instruction, 29 Sep 2026). It is the scheme's
 * dashboard, so it belongs on the scheme's own page, as the 2026 design keeps its
 * PM-AJAY dashboards on the organisation's pages. Ministry › Our Performance holds the
 * Department's dashboards — the Beneficiary Dashboard (dosje.gov.in/dashboard) and
 * Social Audit — and until 29 Sep 2026 wrongly carried this one as a tile too.
 *
 * SAME DATA, SAME COMPONENTS as the 2026 design (`app/website/dashboard/page.tsx`):
 * the three PM-AJAY feeds, live where they answer and from the committed, dated
 * snapshot where they do not, drawn by the components that carry the merge, the
 * provenance chips, the per-card states and the retry. Each feed is fetched on the
 * server with a short timeout and an hourly revalidate; a feed that is down degrades
 * to its snapshot, never to an error boundary.
 */
export async function DbimPmajayDashboard() {
  const [adarshGram, gia, hostel] = await Promise.all([getAdarshGramCounts(), getGiaData(), getHostelData()]);
  // The same total the 2026 design passes, so the illustrative gender split is scaled to the figure on screen.
  const giaGender = await getGiaGender(gia.years.reduce((t, y) => t + (y.approvals.total ?? y.mock.totalApproved), 0));

  return (
    <section className="db-dash" aria-labelledby="pmajay-dashboard">
      <h2 id="pmajay-dashboard" className="sd-dash__title">
        PM-AJAY Dashboard
      </h2>
      <section className="db-dash__section" aria-labelledby="db-dash-glance">
        {/* The section dashboards' own heading style, so the headings on the page read as one set. */}
        <h2 id="db-dash-glance" className="sd-dash__title">
          At a Glance
        </h2>
        <DashboardGlance adarshGram={adarshGram} gia={gia} hostel={hostel} />
      </section>
      <div className="db-dash__section">
        <AdarshGramDashboard feed={adarshGram} />
      </div>
      <div className="db-dash__section">
        <GiaDashboard data={gia} gender={giaGender} />
      </div>
      <div className="db-dash__section">
        <HostelDashboard data={hostel} />
      </div>
    </section>
  );
}
