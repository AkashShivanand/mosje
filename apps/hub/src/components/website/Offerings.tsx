import {
  OFFERINGS_SECTION,
  OFFERING_GROUPS,
  OFFERING_TENDERS,
  OFFERING_VACANCIES,
  type OfferingNotice,
  type OfferingScheme,
} from "@/lib/website-shared/offerings";
import { localiseDocumentUrl } from "@/lib/website/sample-documents";
import { LatestUpdates } from "./LatestUpdates";
import { OfferingsExplorer, type ExplorerGroup, type ExplorerNotice } from "./OfferingsExplorer";

/**
 * Our Offerings — the live home page's section, in this design's layout.
 *
 * EVERY WORD AND LINK IS SHARED with the other designs
 * (lib/website-shared/offerings.ts): the eleven groups with the schemes the
 * live site picks for each, and its five vacancies and four tenders. Until
 * 28 Sep 2026 this file typed in six schemes of its own, each illustrated with
 * a reused banner photograph, and vacancy and tender cards whose pictures had
 * nothing to do with them; the live cards carry no photographs, and nor do these.
 *
 * The rail is What's New, from the estate's one feed (`LatestUpdates`).
 *
 * This half runs on the server: it resolves every link, so only the rows
 * themselves cross to the browser, and the rail — which reads the content
 * library — is handed over already rendered.
 */
const schemeHref = (s: OfferingScheme) =>
  s.slug ? `/website/schemes-services/${s.slug}` : localiseDocumentUrl(s.file ?? "", s.title);

const notice = (n: OfferingNotice): ExplorerNotice => ({
  ...n,
  href: localiseDocumentUrl(n.file, n.title),
});

export function Offerings() {
  const groups: ExplorerGroup[] = OFFERING_GROUPS.map((g) => ({
    id: g.id,
    label: g.label,
    icon: g.icon,
    schemes: g.schemes.map((s) => ({
      tag: s.tag,
      title: s.title,
      description: s.description,
      href: schemeHref(s),
    })),
  }));

  return (
    <section className="bg-primary-50 py-12 md:py-16" aria-labelledby="offerings-title">
      <div className="sa-container">
        <h2 id="offerings-title" className="text-headline-2 text-primary-dark">
          {OFFERINGS_SECTION.title}
        </h2>
        <p className="mt-2 text-body-1 text-ink-muted">{OFFERINGS_SECTION.intro}</p>

        <OfferingsExplorer
          groups={groups}
          vacancies={OFFERING_VACANCIES.map(notice)}
          tenders={OFFERING_TENDERS.map(notice)}
          rail={<LatestUpdates />}
        />
      </div>
    </section>
  );
}
