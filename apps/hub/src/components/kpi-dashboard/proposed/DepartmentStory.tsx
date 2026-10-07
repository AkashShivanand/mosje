"use client";

import { Button, Icon, OrgLogo } from "@mosje/design-system";
import { DEPARTMENT_DASHBOARD_AS_ON, DEPARTMENT_DASHBOARD_URL } from "@/lib/website-shared/dashboard";
import type { Audience } from "./audience";
import { EducationResults, EducationTrends } from "./Education";
import { StoryHeader } from "./StoryHeader";

/** The address of the Department's page in the dashboard: `?programme=department`. */
export const DEPARTMENT_PAGE = "department";
export const DEPARTMENT_NAME = "Department of Social Justice and Empowerment";

/**
 * THE DEPARTMENT'S DASHBOARD PAGE (design review, 7 Oct 2026). The landing page holds one card
 * per Department and portal; the Department's card opens this page, which carries the
 * Beneficiary Dashboard the Department publishes at dosje.gov.in/dashboard — its scholarships,
 * fellowships, hostels and top class education, and their years. It is the Department's own
 * dashboard, not a portal's, and not the Ministry's: the Ministry's other Department
 * (Empowerment of Persons with Disabilities) publishes none of these figures.
 *
 * Every figure, label and title is the live page's (`lib/website-shared/dashboard.ts`).
 *
 * DS Audit: StoryHeader (app) ✅ · OrgLogo ✅ · Button ✅ · EducationResults / EducationTrends (app) ✅.
 */
export function DepartmentStory({ sectionLevel, state, audiences }: { sectionLevel: 2 | 3; state?: string; audiences: Set<Audience> }) {
  // Its sections sit under the page head; the education movements take h2 or h3 only.
  const sub = 3 as const;
  return (
    <div className="pd-story">
      <StoryHeader
        tone="primary"
        // The Department's mark is the National Emblem: the registry falls back to it for an
        // organisation with no mark of its own.
        mark={<OrgLogo path={null} size="md" name="" />}
        title={DEPARTMENT_NAME}
        subtitle="Beneficiary Dashboard"
        summary="Scholarships, fellowships, hostels and top class education for students from Scheduled Castes, Other Backward Classes, Economically Backward Classes and Denotified Tribes."
        // The years are the sections' own badge; the head says when the figures were read.
        meta={`As on ${DEPARTMENT_DASHBOARD_AS_ON}`}
        action={
          /* linkAs-exempt(external-only): the Department's published page on dosje.gov.in */
          <Button appearance="outlined" tone="inverse" size="sm" href={DEPARTMENT_DASHBOARD_URL} iconRight={<Icon name="arrow_outward" size={16} />}>
            Open on dosje.gov.in
          </Button>
        }
        sectionLevel={sectionLevel}
      />
      <EducationResults sectionLevel={sub} state={state} audiences={audiences} />
      <EducationTrends sectionLevel={sub} state={state} audiences={audiences} />
    </div>
  );
}
