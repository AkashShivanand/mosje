"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Icon, ListGroup, ListRow, PageHeader } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { activeKey, listDrafts, type DraftListing } from "@/lib/e-anudaan/drafts";
import { upcomingInstalments } from "@/lib/e-anudaan/instalments";
import { formatDate } from "@/lib/e-anudaan/format";
import { NGO_SCHEMES } from "@/components/e-anudaan/ngo-schemes";

/** Every entry in this browser's localStorage, for the draft listing. */
function storageEntries(): [string, string | null][] {
  try {
    const ls = window.localStorage;
    return Array.from({ length: ls.length }, (_, i) => ls.key(i)).filter((k): k is string => k != null).map((k) => [k, ls.getItem(k)]);
  } catch {
    return [];
  }
}

/**
 * "Apply for Grant" — the live portal offers FOUR schemes here, while every officer nav on the
 * admin side only ever exposed SHRESHTA_M2 (user INVENTORY §4).
 *
 * DS Audit: PageHeader ✅ existing · ListGroup / ListRow ✅ · Button ✅ · Link ✅ · Icon ✅ — nothing new.
 *
 * Design-director audit, 16 Sep 2026 (N-07, X-07):
 *  • The page was a set of radio cards and a "Continue" button at y=935 — below the fold at 900 —
 *    that stayed disabled until a card was chosen. Choosing a scheme IS the step, so each scheme is
 *    a row that opens its form. (A radio that navigated on selection would move a keyboard user
 *    the moment they arrowed through the list, so the radios went rather than gaining that.)
 *  • A returning applicant was not told a scheme already had a saved draft or an instalment open
 *    to claim, and started a duplicate. Each row says so, and a draft is continued from its row.
 *  • One naming pattern, "Acronym — Full name" (`ngo-schemes.ts`), so the card chosen here matches
 *    the row it produces on the dashboard and in My Applications.
 */
export default function SelectSchemePage() {
  const router = useRouter();
  const { state } = useEAnudaan();
  const ngo = state.ngos[0];
  /** The scheme's own description and target group, as the live picker words them (INVENTORY §4). */
  const published = (code: string) => state.schemes.find((x) => x.code === code);
  // The portal shell renders nothing until the store has hydrated, so storage is read on the client only.
  const [drafts] = React.useState<DraftListing[]>(() => (typeof window === "undefined" ? [] : listDrafts(storageEntries(), ngo?.id)));
  const claimable = React.useMemo(() => (ngo ? upcomingInstalments(state, ngo.id).filter((n) => n.href) : []), [state, ngo]);

  const continueDraft = (d: DraftListing) => {
    // The applicant has chosen to resume, so the form carries the draft on rather than offering it.
    window.sessionStorage.setItem(activeKey(d.code), "1");
    router.push(d.route);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Apply for Grant"
        meta="Choose the scheme you are applying under. Each has its own application form and document checklist."
      />

      <ListGroup bordered divided aria-label="Schemes open for application">
          {Object.entries(NGO_SCHEMES).map(([code, s]) => {
            const href = `/portals/e-anudaan/apply-grant/scheme/${code}/step-1`;
            const draft = drafts.find((d) => d.code === code);
            const open = claimable.filter((n) => n.plan.scheme === code).length;
            const status = (
              <>
                {draft ? (
                  <span className="block text-ink">
                    Draft saved{draft.savedAt ? ` ${formatDate(draft.savedAt)}` : ""} · Step {draft.step.index + 1} of {draft.step.total}: {draft.step.title}
                  </span>
                ) : null}
                {open > 0 ? (
                  <span className="block text-ink">
                    {open} {open === 1 ? "instalment" : "instalments"} ready to claim from My Applications
                  </span>
                ) : null}
              </>
            );
            return draft ? (
              <ListRow
                key={code}
                title={s.title}
                description={
                  <>
                    <span className="block">{published(code)?.description ?? s.subtitle}</span>
                    {published(code)?.target ? <span className="block">Target: {published(code)!.target}</span> : null}
                    {status}
                  </>
                }
                trailing={
                  <span className="flex flex-wrap items-center justify-end gap-2">
                    <Button appearance="outlined" size="sm" nowrap onClick={() => continueDraft(draft)} aria-label={`Continue the ${s.short} draft`}>
                      Continue Draft
                    </Button>
                    <Button appearance="text" size="sm" nowrap onClick={() => router.push(href)} aria-label={`Start a new ${s.short} application`}>
                      Start New
                    </Button>
                  </span>
                }
              />
            ) : (
              <ListRow
                key={code}
                linkAs={Link}
                href={href}
                title={s.title}
                description={
                  <>
                    <span className="block">{published(code)?.description ?? s.subtitle}</span>
                    {published(code)?.target ? <span className="block">Target: {published(code)!.target}</span> : null}
                    {status}
                  </>
                }
                trailing={<Icon name="chevron_right" size={20} aria-hidden />}
              />
            );
          })}
      </ListGroup>
    </div>
  );
}
