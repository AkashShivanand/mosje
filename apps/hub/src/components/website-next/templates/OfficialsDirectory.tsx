import { PageLayout } from "@/components/website-next/layout/PageLayout";
import type { Crumb } from "@/components/website-next/layout/PageHeader";
import type { OfficialRecord } from "@/types/website/content";
import { DirectoryBrowser, type DirectoryRow } from "./DirectoryBrowser";
import { titleCase, tidyAddress } from "./people-format";
import "./people.css";

/**
 * T3 — a body's telephone directory.
 *
 * Props are the classic template's, unchanged, so the sixteen directory pages move
 * over by changing one import.
 *
 * ── WHAT THE PAGE DOES WITH THE REGISTER ─────────────────────────────────────
 * The Department groups a directory under section headings ("UNION CABINET
 * MINISTER", "SECTION OFFICERS") and prints every row on one page: 162 rows and
 * 17,813px for the Ministry, and on a phone the estate-wide directory ran to
 * 60,000px (issue MOB-03). Here the grouping is kept — each section is a heading
 * inside the results, in order of seniority (see SENIORITY) — and the rows are paged
 * at twenty-five. A reader finds a person by name or post (NAV-17) and narrows by
 * section, and on a phone each officer is a stacked entry rather than a seven-column
 * table scrolled sideways.
 *
 * ── WHAT IS LEFT OUT ─────────────────────────────────────────────────────────
 * - A free-mail address (gmail, yahoo …) is never printed as an official contact
 *   (CON-09). `people-format.tsx` filters it; the omission is in the audit, not
 *   on the page.
 * - A record the Department's CMS left behind as a test entry (`test(Copy)` under
 *   NSFDC, designation "Chief Manager abc") is not an officer and is not listed.
 *
 * ── STATES ───────────────────────────────────────────────────────────────────
 * Populated, empty (the body publishes no directory), filtered-to-nothing (names
 * the filter and offers to clear it) and too-much (paged). Loading and error
 * cannot occur: the register is imported JSON resolved on the server.
 */
export interface OfficialsDirectoryProps {
  title: string;
  description?: string;
  breadcrumb: Crumb[];
  lastUpdated?: string;
  officials: OfficialRecord[];
  /** Said on screen when the body publishes no directory at all. */
  emptyMessage?: string;
  /** Offer an Organisation filter — for the estate-wide directory only. */
  showOrganisation?: boolean;
  /** The organisation the page opens on, as the register abbreviates it. */
  initialOrganisation?: string;
}

const UNGROUPED = "Other Officers";

/**
 * The order sections are read in. The register carries no `menuOrder` (0 of 452
 * records) and lists its sections in the order the CMS created them, which put
 * "Pay and Accounts Office" above the Union Minister. Sections are ranked here by
 * the Government of India's order of seniority — Ministers, Secretary, Additional,
 * Joint, Adviser, Director, Deputy Secretary, Deputy Director, Under Secretary,
 * Assistant Director, Section Officer — then offices and units, A to Z.
 */
const SENIORITY: RegExp[] = [
  /union cabinet minister|^minister(?! of state)|chairperson|chairman/i,
  /minister of state|vice.?chair/i,
  /^secretary|member secretary/i,
  /additional secretary/i,
  /joint secretary/i,
  /adviser|advisor|director general/i,
  /^director/i,
  /deputy secretar/i,
  /deputy director/i,
  /under secretar/i,
  /assistant director/i,
  /section officer/i,
];
/**
 * A section heading names its post anywhere ("Economic Adviser / …"); inside a
 * section a designation is matched only at its start, so "PS to Chairperson" is
 * not ranked with the Chairperson.
 */
function sectionRank(text: string, anchored = false): number {
  const i = SENIORITY.findIndex((re) => {
    const m = re.exec(text);
    return m != null && (!anchored || m.index === 0);
  });
  return i === -1 ? SENIORITY.length : i;
}

/** A CMS test entry, not an officer. */
function isTestRecord(o: OfficialRecord): boolean {
  return /^test\b/i.test(o.title.trim()) || /\babc$/i.test((o.designation ?? "").trim());
}

export function OfficialsDirectory({
  title,
  description,
  breadcrumb,
  lastUpdated,
  officials,
  emptyMessage,
  showOrganisation = false,
  initialOrganisation,
}: OfficialsDirectoryProps) {
  /*
   * Sections in order of seniority, then the register's `menuOrder` should it ever
   * carry one, then the name. The rows are reduced to what the page prints before they cross to the client — the
   * estate-wide directory holds 452 officers, and the work-allocation HTML some
   * records carry is not shown here.
   */
  const sectionOf = (o: OfficialRecord) => (o.group?.trim() ? titleCase(o.group.trim()) : UNGROUPED);
  const rows: DirectoryRow[] = officials
    .filter((o) => !isTestRecord(o))
    .sort((a, b) => {
      const sa = sectionOf(a);
      const sb = sectionOf(b);
      return (
        (showOrganisation ? (a.organisationName ?? "").localeCompare(b.organisationName ?? "", "en-IN") : 0) ||
        sectionRank(sa) - sectionRank(sb) ||
        (sa === UNGROUPED ? 1 : 0) - (sb === UNGROUPED ? 1 : 0) ||
        sa.localeCompare(sb, "en-IN") ||
        (a.menuOrder ?? 0) - (b.menuOrder ?? 0) ||
        sectionRank(a.designation ?? "", true) - sectionRank(b.designation ?? "", true) ||
        a.title.localeCompare(b.title, "en-IN")
      );
    })
    .map((o) => {
      const phone = o.phoneOffice ?? o.phoneResidence;
      return {
        slug: o.slug,
        name: o.title.replace(/\s+/g, " ").replace(/\s+,/g, ",").trim(),
        designation: o.designation?.replace(/\s+/g, " ").replace(/\s+,/g, ",").trim(),
        section: sectionOf(o),
        organisation: o.organisation,
        organisationName: o.organisationName ?? o.organisation,
        intercom: o.intercom,
        phone,
        email: o.email,
        address: tidyAddress(o.address, phone),
      };
    });

  return (
    <PageLayout title={title} description={description} breadcrumb={breadcrumb} lastUpdated={lastUpdated}>
      <div className="wn-section wn-section--tight">
        <div className="sa-container">
          <DirectoryBrowser
            title={title}
            rows={rows}
            emptyMessage={emptyMessage}
            showOrganisation={showOrganisation}
            initialOrganisation={initialOrganisation}
          />
        </div>
      </div>
    </PageLayout>
  );
}
