/* Adarsh Gram — District: All Reports.
   Rebuilt from pm-ajay.dosje.gov.in/adarsh-gram-district/reports.

   DS Audit: PageHeader ✅ · SectionTitle ✅ · Grid ✅ · GridItem ✅ · Link ✅ · Icon ✅.
   Nothing added. No local state, so no "use client" (`.claude/rules/…` — a page with no
   interaction is a server component).

   CatalogueScreen. This page was first assembled by hand from SectionTitle + Grid, on the
   reading that a catalogue is "a single ranked or dated list" and this one is grouped. That
   is not the distinction the decision table draws: a catalogue is many records the reader
   BROWSES, and ranking is what separates it from SearchScreen
   (`docs/design-system/screen-templates.md` §2, §2a). Grouping is a presentation of the same
   data, so the subject travels with each report as its meta line instead of as a heading —
   and the screen gains the loading, empty and error states `check:template-adoption` exists
   to stop every page re-deciding.

   The live page groups 32 report links under eight subject headings. Of those, 22 point to
   a register this role actually has a screen for — Village Level Data, Household, VDP,
   Works, Beneficiary formats, the district Dashboard, and the format-specific progress and
   declaration screens. The other 10 are report-only views this rebuild has no register or
   screen behind (verification/target-village lists, a duplicate-name check, a beneficiary
   cross-check, a raw download endpoint, a cross-format completion roll-up, a scheme-wise
   works split). Per the brief, they are left off rather than pointed at an invented route:

     Village Verification Status · Target-Villages · Selected villages in 2021-2022 ·
     Completion status of all formats · Deleted Households · Scheme-Wise ·
     Duplicate name in 3A · Beneficiary difference in 3A & 3B ·
     Beneficiary name count verify · Download beneficiary list with progress

   One correction: the live "VILLAGE DEVELOPEMENT PLAN" heading misspells "Development" —
   fixed here, since a misspelling on a government page is a defect to carry forward, not a
   department wording choice to preserve (`.claude/rules/ui-restraint-and-copy.md`). */

import { CatalogueScreen } from "@mosje/design-system";
import { DISTRICT_BASE } from "@/lib/pm-ajay/district/nav";

interface ReportLink {
  title: string;
  href: string;
}

interface ReportGroup {
  id: string;
  title: string;
  items: ReportLink[];
}

const at = (path: string) => `${DISTRICT_BASE}${path}`;

const REPORT_GROUPS: ReportGroup[] = [
  {
    id: "misc",
    title: "Miscellaneous",
    items: [{ title: "Covered Villages", href: at("/format-1") }],
  },
  {
    id: "survey",
    title: "Survey",
    items: [
      { title: "Need Assessment Format-I", href: at("/format-1") },
      { title: "Completion of Format II", href: at("/format-2") },
      { title: "Completion of Format-3A (View Survey Data)", href: at("/format-3a/survey-edit") },
      { title: "Indicator Wise Format-3A Assessment", href: at("/format-3a/household") },
      { title: "Completion of Format IV", href: at("/format-4") },
      { title: "Score Card with Indicator Status", href: at("/format-6") },
      { title: "All Villages Score (Format-6)", href: at("/format-6") },
    ],
  },
  {
    id: "household",
    title: "Household",
    items: [
      { title: "Households Survey Status", href: at("/format-3a/household") },
      { title: "Households Details", href: at("/format-3a/household") },
    ],
  },
  {
    id: "vdp",
    title: "Village Development Plan",
    items: [
      { title: "Interim VDP", href: at("/manage-vdp/generate-complete-vdp") },
      { title: "Complete VDP", href: at("/manage-vdp/generate-complete-vdp") },
    ],
  },
  {
    id: "work",
    title: "Work",
    items: [
      { title: "Works under Gap Filling Funds", href: at("/dashboard") },
      { title: "Works in Progress", href: at("/submit-progress/format-4") },
      { title: "Infrastructure Abstract (MI Wise)", href: at("/format-4") },
      { title: "Works Identified for Execution", href: at("/format-4") },
    ],
  },
  {
    id: "beneficiary",
    title: "Beneficiary",
    items: [
      { title: "Beneficiary List of 3A", href: at("/format-3a/household") },
      { title: "Beneficiary List of 3B", href: at("/format-3b/list") },
      { title: "Beneficiary Progress (Format-V)", href: at("/submit-progress/format-5") },
    ],
  },
  {
    id: "financial",
    title: "Financial",
    items: [{ title: "Financial Report", href: at("/dashboard") }],
  },
  {
    id: "other",
    title: "Other",
    items: [
      { title: "Format VII", href: at("/submit-progress/format-7") },
      { title: "Adarsh Gram Status", href: at("/manage-adarsh-gram/declare") },
    ],
  },
];

export default function ReportsPage() {
  /* The subject a report belongs to travels with it, so the grouping the live page shows as
     headings is still readable row by row. Ids stay stable per group and position. */
  const items = REPORT_GROUPS.flatMap((group) =>
    group.items.map((item, index) => ({
      id: `${group.id}-${index}`,
      title: item.title,
      meta: group.title,
      href: item.href,
    })),
  );

  return (
    <CatalogueScreen
      eyebrow="Adarsh Gram District"
      title="All Reports"
      meta="Reports on villages, works, households and beneficiaries under the scheme, drawn from the district's own registers."
      items={items}
      layout="rows"
      noun="report"
      pluralNoun="reports"
    />
  );
}
