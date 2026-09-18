import type { Metadata } from "next";
import { OfficialsDirectory } from "@/components/website/templates/OfficialsDirectory";
import { getContentSyncedDate, getOfficials } from "@/lib/website/content";
import { socialCard } from "@/lib/seo/social";

const TITLE = "Staff Directory";
const DESCRIPTION =
  "Officers of the Department of Social Justice & Empowerment and of every commission, corporation and autonomous body under it, with intercom and contact details.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
  ...socialCard({ title: TITLE, description: DESCRIPTION, url: "/website/directory" }),
};

/**
 * The estate-wide directory — every body's officers in one register.
 *
 * ── WHY `?org=` IS READ HERE ─────────────────────────────────────────────────
 * Every organisation page links its own officers with
 * `/website/directory?org=<organisation-slug>`. That link existed and did
 * nothing: the page ignored the query and opened on the whole register, so a
 * reader who clicked "Officers" on the NCSK page landed on 452 rows starting
 * with the Ministry's.
 *
 * The slug is resolved against the register's own `organisationUrl` — the
 * department's link to that body — rather than against a table of slugs kept
 * here, so a body renamed upstream keeps working with nothing to update.
 */
function organisationForSlug(slug: string | undefined): string | undefined {
  if (!slug) return undefined;
  const match = getOfficials().find((o) =>
    o.organisationUrl?.includes(`/organisation/${slug}/`),
  );
  return match?.organisation;
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ org?: string }>;
}) {
  const { org } = await searchParams;

  return (
    <OfficialsDirectory
      title={TITLE}
      breadcrumb={[{ label: "Connect" }, { label: TITLE }]}
      description={DESCRIPTION}
      lastUpdated={getContentSyncedDate()}
      officials={getOfficials()}
      showOrganisation
      initialOrganisation={organisationForSlug(org)}
    />
  );
}
