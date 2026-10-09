// url=<SAMAVESH>?node-id=58896-924
// source=packages/design-system/components/dashboard/dashboard-header.tsx
// component=DashboardHeader
import figma from "figma";

const instance = figma.selectedInstance;

const title = instance.getString("Title");
const subtitle = instance.getString("Subtitle");
const showSubtitle = instance.getBoolean("Show subtitle");
const summary = instance.getString("Summary");
const showSummary = instance.getBoolean("Show summary");
const meta = instance.getString("Meta");
const showMeta = instance.getBoolean("Show meta");
const showMark = instance.getBoolean("Show mark");
const showAction = instance.getBoolean("Show action");
const tone = instance.getEnum("Tone", {
  Primary: "primary",
  Secondary: "secondary",
  Info: "info",
  Success: "success",
  Warning: "warning",
  Danger: "danger",
});

export default {
  example: figma.code`
    <DashboardHeader
      tone="${tone}"
      title="${title}"
      ${showSubtitle ? figma.code`subtitle="${subtitle}"` : ""}
      ${showMark ? figma.code`mark={<OrgLogo path="/portals/nmba" size="md" name="" />}` : ""}
      ${showSummary ? figma.code`summary="${summary}"` : ""}
      ${showMeta ? figma.code`meta="${meta}"` : ""}
      ${showAction ? figma.code`action={<Button appearance="outlined" tone="inverse" size="sm" href="/portals/nmba" linkAs={Link}>Open Portal</Button>}` : ""}
      headingLevel={2}
    />
  `,
  imports: ['import { Button, DashboardHeader, OrgLogo } from "@mosje/design-system"', 'import Link from "next/link"'],
  id: "dashboard-header",
  metadata: { nestable: false },
};
