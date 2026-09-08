// url=<SAMAVESH>?node-id=522-216228
// source=packages/design-system/components/navigation/pagination.tsx
// component=Pagination
//
// Code Connect template for the SAMAVESH `Pagination` set. This file IS what the
// Figma MCP server hands an agent in Dev Mode, so it carries the usage rules as
// well as the snippet. See .claude/rules/component-authoring.md §12.
//
// PROPERTY COVERAGE — all 3 Figma properties are accounted for:
//   Size           (variant) -> size
//   Selected       (variant) -> NOT a prop. See below.
//   item control   (variant) -> NOT a prop. See below.
//
// `Selected` draws WHERE IN THE SET the reader is: First, middle, last. The
// component derives that from `page` against `totalPages`; a position pinned
// from outside could contradict what the reader has just done, so it maps to
// nothing. (This property was published as `Selceted` until 8 September 2026;
// the rename migrated all four instances with their values intact.)
//
// `item control` draws a page-size control and a results summary that the React
// component DOES NOT HAVE. It is Figma-ahead-of-code, recorded as an open item
// on the Component record. Do not invent props for it — compose the summary
// beside the pager until the component grows one.
import figma from "figma";

const instance = figma.selectedInstance;

const size = instance.getEnum("Size", {
  sm: "sm",
  md: "md",
});

export default {
  example: figma.code`
    {/* PREFER THE LINK FORM — the page number belongs in the URL wherever it can. */}
    <Pagination
      page={page}
      totalPages={totalPages}
      hrefFor={(p) => \`?page=\${p}\`}
      ${size === "sm" ? figma.code`size="sm"` : ""}
      label="Search results"
    />
  `,
  imports: ['import { Pagination } from "@mosje/design-system"'],
  id: "pagination",
  metadata: { nestable: false },
};
