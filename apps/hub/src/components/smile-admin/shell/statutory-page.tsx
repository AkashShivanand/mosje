"use client";

import { Icon, RecordScreen } from "@mosje/design-system";

/**
 * A statutory page — Terms & Conditions, Privacy Policy.
 *
 * `RecordScreen`, per docs/design-system/screen-templates.md §2: one record,
 * read-only. A policy IS one record, and this is the honest fit even though the
 * template's usual shape is a person or an application — the first version
 * assembled the page by hand on the argument that prose is not data, and the
 * adoption gate was right to refuse it. Assembling by hand is how a screen ends
 * up with no error state, prose or not.
 *
 * The text is transcribed from the live portal and NOT rewritten. The estate's
 * copy rule prefers the department's own words, and legal text is the clearest
 * case of it — including the live portal's own closing admission that the copy
 * is provisional, which is a fact about the portal rather than a shortcoming of
 * the clone.
 */
export function StatutoryPage({
  title,
  section,
  issuedFor,
  paragraphs,
  provisional,
}: {
  title: string;
  section: string;
  /** Who the policy is issued by — printed as the record's first fact. */
  issuedFor: string;
  paragraphs: string[];
  /** The live portal's note that the ministry's final copy is still to come. */
  provisional?: string;
}) {
  return (
    <RecordScreen
      breadcrumb={[{ label: "Other" }, { label: title }]}
      eyebrow={section}
      title={title}
      meta={issuedFor}
      facts={[
        { label: "Issued by", value: "Department of Social Justice & Empowerment" },
        { label: "Applies to", value: "Every user of this portal" },
        { label: "Status", value: provisional ? "Provisional" : "In force" },
      ]}
      tabs={[
        {
          id: "text",
          label: title,
          render: () => (
            <article className="max-w-[80ch] space-y-md">
              {paragraphs.map((p) => (
                <p key={p.slice(0, 40)} className="text-body-1 text-ink">
                  {p}
                </p>
              ))}
              {provisional ? (
                <p className="flex items-start gap-sm rounded-md bg-warning-50 p-md text-body-2 text-warning-600">
                  <Icon name="info" size={16} aria-hidden className="mt-0.5 shrink-0" />
                  {provisional}
                </p>
              ) : null}
            </article>
          ),
        },
      ]}
      copy={{
        idleTitle: "Opening This Policy",
        loadingLabel: `Loading the ${title.toLowerCase()}`,
        errorTitle: "This Page Could Not Be Loaded",
        errorDescription: "The text did not load. Please try again.",
        retryLabel: "Try again",
        emptyTitle: "Nothing Published Yet",
        emptyDescription: "The department has not published this text yet.",
        filteredTitle: "Nothing Matches",
        clearFiltersLabel: "Clear filters",
      }}
    />
  );
}
