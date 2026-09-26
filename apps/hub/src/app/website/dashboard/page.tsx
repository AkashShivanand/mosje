import type { Metadata } from "next";
import { SectionTitle } from "@mosje/design-system";
import { PageLayout } from "@/components/website-next/layout/PageLayout";
import { DashboardGlance } from "@/components/website-next/media/DashboardGlance";
import { AdarshGramDashboard } from "@/components/website/AdarshGramDashboard";
import { GiaDashboard } from "@/components/website/GiaDashboard";
import { HostelDashboard } from "@/components/website/HostelDashboard";
import { getAdarshGramCounts } from "@/lib/website/adarsh-gram-api";
import { getGiaData, getGiaGender, getHostelData } from "@/lib/website/pmajay-api";
import { socialCard } from "@/lib/seo/social";
import "@/components/website-next/templates/media.css";

const TITLE = "Dashboard";
const DESCRIPTION =
  "Progress of the Pradhan Mantri Anusuchit Jaati Abhyuday Yojana (PM-AJAY), as reported by the scheme's Management Information System.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
  ...socialCard({ title: TITLE, description: DESCRIPTION, url: "/website/dashboard" }),
};

/**
 * The website's dashboard (issue LAY-11).
 *
 * WHAT THIS REPLACED: four headline figures and two bar charts typed into this
 * file — "₹67,977 Cr disbursed", "19.82 Cr beneficiaries", "33+ schemes" and a
 * scheme-wise disbursement — with no source, no period and a footnote calling
 * them illustrative. None of them is published anywhere this estate can read,
 * so none of them is here (`live-data-fallback.md`: a metric neither source
 * publishes is left off the design).
 *
 * WHAT IS HERE: the only departmental figures the estate has a feed for — the
 * three PM-AJAY components' public report endpoints, live where they answer and
 * from the committed, dated snapshot where they do not. The strip at the top
 * gives four of them the same four parts (label, number, period, source), and
 * each "View Details" jumps to the dashboard that draws it in full.
 *
 * The three section dashboards are the CLASSIC components the PM-AJAY
 * organisation pages already use (`components/website/*Dashboard.tsx`), kept
 * because they carry the merge, the provenance chips, the per-card states and
 * the retry — rebuilding them is its own piece of work. They are wrapped in the
 * redesign's section pattern, one per section, on the page ground (their sticky headers are white).
 *
 * Fetched on the server, each with a short timeout and an hourly revalidate;
 * a feed that is down degrades to its snapshot, never to an error boundary.
 */
export default async function DashboardPage() {
  const [adarshGram, gia, hostel] = await Promise.all([getAdarshGramCounts(), getGiaData(), getHostelData()]);
  // The same total the PM-AJAY Grants-in-Aid page passes, so the illustrative
  // gender split is scaled to the figure on screen.
  const giaGender = await getGiaGender(gia.years.reduce((t, y) => t + (y.approvals.total ?? y.mock.totalApproved), 0));

  return (
    <PageLayout title={TITLE} breadcrumb={[{ label: "Schemes & Services" }, { label: TITLE }]} description={DESCRIPTION}>
      <section className="wn-section" aria-labelledby="glance-title">
        <div className="sa-container">
          <SectionTitle
            as={2}
            headingId="glance-title"
            title="At a Glance"
          />
          <DashboardGlance adarshGram={adarshGram} gia={gia} hostel={hostel} />
        </div>
      </section>

      <div className="wn-section">
        <div className="sa-container">
          <AdarshGramDashboard feed={adarshGram} />
        </div>
      </div>

      <div className="wn-section">
        <div className="sa-container">
          <GiaDashboard data={gia} gender={giaGender} />
        </div>
      </div>

      <div className="wn-section">
        <div className="sa-container">
          <HostelDashboard data={hostel} />
        </div>
      </div>
    </PageLayout>
  );
}
