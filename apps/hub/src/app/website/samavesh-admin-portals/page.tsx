import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState, Icon, liveEntries } from "@mosje/design-system";
import { PageLayout } from "@/components/website-next/layout/PageLayout";
import { PortalDirectory } from "@/components/website-next/media/PortalDirectory";
import { resolvePortals } from "@/lib/registry/resolve";
import "@/components/website-next/templates/media.css";

const TITLE = "Administrative Portals";
const DESCRIPTION =
  "Portals used by officers of the Department, its organisations and implementing agencies to manage and monitor schemes. Sign-in is for authorised users.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
};

/**
 * Which registry entries are administrative consoles.
 *
 * The estate registry has no audience field, so this cannot be derived — it is
 * the four entries whose OWN registry description names them a management,
 * monitoring or MIS console:
 *   /portals/eutthan-admin  "Scheme management & monitoring"
 *   /portals/smile-admin    "Rehabilitation admin portal …"
 *   /portals/pm-ajay        "MIS dashboard — …"
 *   /portals/e-anudaan      "Grant-in-Aid Management — …"
 * They are still read through the resolved registry, so one switched off at
 * `/admin/portals` disappears here too.
 *
 * WHAT THIS REPLACED: six invented consoles, every one linking to "#".
 */
const ADMIN_PATHS = new Set(["/portals/eutthan-admin", "/portals/smile-admin", "/portals/pm-ajay", "/portals/e-anudaan"]);

export default async function AdminPortalsPage() {
  const portals = liveEntries(await resolvePortals()).filter((p) => ADMIN_PATHS.has(p.path));
  return (
    <PageLayout title={TITLE} breadcrumb={[{ label: "Schemes & Services" }, { label: TITLE }]} description={DESCRIPTION}>
      <div className="wn-section">
        <div className="sa-container">
          {portals.length === 0 ? (
            <EmptyState
              icon={<Icon name="admin_panel_settings" size={40} />}
              title="No Administrative Portals Available"
              description="No administrative portal is open at present."
              action={<Link href="/website/samavesh-citizen-portals" className="wn-filters__clear">View Citizen Portals</Link>}
            />
          ) : (
            <PortalDirectory portals={portals} />
          )}
        </div>
      </div>
    </PageLayout>
  );
}
