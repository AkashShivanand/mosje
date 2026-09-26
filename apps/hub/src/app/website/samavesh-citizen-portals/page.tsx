import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState, Icon, liveEntries } from "@mosje/design-system";
import { PageLayout } from "@/components/website-next/layout/PageLayout";
import { PortalDirectory } from "@/components/website-next/media/PortalDirectory";
import { resolvePortals } from "@/lib/registry/resolve";
import "@/components/website-next/templates/media.css";

const TITLE = "Citizen Portals";
const DESCRIPTION =
  "Online portals of the Department and its organisations for applying to schemes, tracking applications and registering grievances.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
};

/**
 * Every live SAMAVESH portal, as a directory inside the website's own shell.
 *
 * It used to redirect to `/portals`, the estate gateway, which has no website
 * masthead or footer — a citizen who followed "Apply and Track" from the
 * website left the website. The list is the same one `/portals` reads
 * (`resolvePortals` → `liveEntries`), so the two cannot drift: an entry hidden
 * or marked planned at `/admin/portals` is absent from both.
 *
 * STATES: populated, and empty (every portal switched off) — the registry is
 * read on the server and degrades to its code defaults, so there is no error
 * state to draw.
 */
export default async function CitizenPortalsPage() {
  const portals = liveEntries(await resolvePortals());
  return (
    <PageLayout title={TITLE} breadcrumb={[{ label: "Schemes & Services" }, { label: TITLE }]} description={DESCRIPTION}>
      <div className="wn-section">
        <div className="sa-container">
          {portals.length === 0 ? (
            <EmptyState
              icon={<Icon name="apps" size={40} />}
              title="No Portals Available"
              description="No portal is open at present. Contact the Department for help with an application."
              action={<Link href="/website/contact-us" className="wn-filters__clear">Contact Us</Link>}
            />
          ) : (
            <PortalDirectory portals={portals} />
          )}
        </div>
      </div>
    </PageLayout>
  );
}
