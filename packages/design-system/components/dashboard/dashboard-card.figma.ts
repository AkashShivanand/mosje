// url=<SAMAVESH>?node-id=58895-952
// source=packages/design-system/components/dashboard/dashboard-card.tsx
// component=DashboardCard
import figma from "figma";

const instance = figma.selectedInstance;

const title = instance.getString("Title");
const subtitle = instance.getString("Subtitle");
const showSubtitle = instance.getBoolean("Show subtitle");
const showMark = instance.getBoolean("Show mark");
const note = instance.getString("Note");
const showNote = instance.getBoolean("Show note");
const showFacts = instance.getBoolean("Show facts");
const tone = instance.getEnum("Tone", {
  Primary: "primary",
  Secondary: "secondary",
  Info: "info",
  Success: "success",
  Warning: "warning",
  Danger: "danger",
});

/**
 * Link=Yes is the code's `href` (with `linkLabel` and the app's `linkAs`): the whole card
 * becomes the link. Link=No is a summary card with no footer — no href at all.
 */
const link = instance.getEnum("Link", { Yes: true, No: false });

export default {
  example: figma.code`
    <DashboardCard
      tone="${tone}"
      title="${title}"
      ${showSubtitle ? figma.code`subtitle="${subtitle}"` : ""}
      ${showMark ? figma.code`mark={<OrgLogo path="/portals/nmba" size="md" />}` : ""}
      ${showNote ? figma.code`note="${note}"` : ""}
      figure={<HeadlineFigure size="md" value="34.83 Cr" label="Total Outreach" />}
      ${link ? figma.code`href="?programme=nmba" linkLabel="View the ${title} Dashboard" linkAs={Link}` : ""}
    >
      ${showFacts ? figma.code`<DescriptionList size="figure" columns={2} items={facts} />` : ""}
    </DashboardCard>
  `,
  imports: ['import { DashboardCard, DescriptionList, HeadlineFigure, OrgLogo } from "@mosje/design-system"', 'import Link from "next/link"'],
  id: "dashboard-card",
  metadata: { nestable: false },
};
