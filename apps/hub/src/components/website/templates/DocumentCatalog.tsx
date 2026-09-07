"use client";

import { useMemo, useRef, useState } from "react";
import { Button, Icon, Pagination } from "@mosje/design-system";
import { PageLayout } from "@/components/website/layout/PageLayout";
import type { Crumb } from "@/components/website/layout/page-trail";

export interface DocumentRecord {
  title: string;
  category?: string;
  date?: string;
  sourceUrl?: string;
  slug?: string;
  fileSize?: string;
  language?: string;
}

interface DocumentCatalogProps {
  title: string;
  description?: string;
  breadcrumb: Crumb[];
  documents: DocumentRecord[];
  categories?: string[];
  lastUpdated?: string;
}

export function DocumentCatalog({
  title,
  description,
  breadcrumb,
  documents,
  categories = [],
  lastUpdated,
}: DocumentCatalogProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(() => {
    return documents
      .filter((doc) => {
        const matchesCategory =
          selectedCategory === "All" || doc.category === selectedCategory;
        const matchesSearch =
          search.trim() === "" ||
          doc.title.toLowerCase().includes(search.toLowerCase()) ||
          (doc.category && doc.category.toLowerCase().includes(search.toLowerCase()));
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
      });
  }, [documents, search, selectedCategory, sortOrder]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const rangeStart = filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const rangeEnd = Math.min(safePage * pageSize, filtered.length);

  /**
   * The list is the thing that changed, so the reader is put at the top of it.
   *
   * `Pagination` renders the page you are on as a `<span>`, not a button, so the
   * control that was just clicked leaves the DOM and focus falls to `<body>` —
   * a keyboard reader would be returned to the masthead, and a screen-reader
   * reader would be told nothing at all. Moving focus to the list answers both:
   * it keeps focus inside the region that changed and re-announces the results
   * heading. The container is never in the tab order; it is a target for this
   * move only, which is why it carries no focus ring.
   */
  const resultsRef = useRef<HTMLDivElement>(null);

  const changePage = (next: number) => {
    setCurrentPage(next);
    const el = resultsRef.current;
    if (!el) return;
    el.focus({ preventScroll: true });
    el.scrollIntoView({ block: "start" });
  };

  return (
    <PageLayout
      title={title}
      description={description}
      breadcrumb={breadcrumb}
      lastUpdated={lastUpdated}
    >
      <section className="py-10 md:py-14 bg-white">
        <div className="sa-container">
          {/* Controls Bar: Search + Category Filter + Sort */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-xl border border-gray-200 bg-surface-muted p-4 shadow-xs">
            <div className="relative flex-1">
              <Icon
                name="search"
                size={20}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search documents by title or keyword…"
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-body-2 focus:border-primary focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {categories.length > 0 && (
                <div className="flex items-center gap-2">
                  <label htmlFor="category-select" className="text-label-2 text-ink-muted">
                    Category:
                  </label>
                  <select
                    id="category-select"
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-label-2 focus:border-primary focus:outline-none"
                  >
                    <option value="All">All Categories</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex items-center gap-2">
                <label htmlFor="sort-select" className="text-label-2 text-ink-muted">
                  Sort:
                </label>
                <select
                  id="sort-select"
                  value={sortOrder}
                  onChange={(e) =>
                    setSortOrder(e.target.value as "newest" | "oldest")
                  }
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-label-2 focus:border-primary focus:outline-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Summary — the range on screen, not the size of the whole
              filter result. "Showing 981 documents" over a list of ten was the
              count of the query presented as the count of the page. */}
          <div className="mt-4 text-body-3 text-ink-muted px-1">
            {filtered.length === 0 ? (
              <span>No documents match the current filters</span>
            ) : (
              <span>
                Showing <strong>{rangeStart.toLocaleString("en-IN")}–{rangeEnd.toLocaleString("en-IN")}</strong>{" "}
                of <strong>{filtered.length.toLocaleString("en-IN")}</strong> documents
              </span>
            )}
          </div>

          {/* Document List */}
          <div
            ref={resultsRef}
            tabIndex={-1}
            className="mt-4 divide-y divide-gray-150 rounded-xl border border-gray-200 bg-white shadow-xs overflow-hidden outline-none">
            {paginated.length === 0 ? (
              <div className="p-12 text-center text-ink-muted">
                <Icon name="folder_off" size={40} className="mx-auto mb-2 text-gray-300" />
                <p className="text-title-2 text-ink">No documents found</p>
                <p className="mt-1 text-body-3">Try adjusting your search terms or filters.</p>
              </div>
            ) : (
              paginated.map((doc, idx) => (
                <div
                  key={doc.slug ?? `${doc.title}-${idx}`}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 hover:bg-gray-50/80 transition"
                >
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 mt-0.5">
                      <Icon name="picture_as_pdf" size={20} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        {doc.category && (
                          <span className="rounded bg-gray-100 px-2 py-0.5 text-label-3 uppercase text-gray-700">
                            {doc.category}
                          </span>
                        )}
                        {doc.language && (
                          <span className="rounded bg-blue-50 px-2 py-0.5 text-label-2 text-primary">
                            {doc.language}
                          </span>
                        )}
                      </div>
                      <h3 className="text-title-2 text-ink">
                        {doc.title}
                      </h3>
                      <div className="mt-1.5 flex flex-wrap items-center gap-3 text-body-3 text-ink-muted">
                        {doc.date && (
                          <span className="flex items-center gap-1">
                            <Icon name="event" size={16} className="text-gray-400" />
                            {doc.date}
                          </span>
                        )}
                        {doc.fileSize && (
                          <span className="flex items-center gap-1">
                            <Icon name="attachment" size={16} className="text-gray-400" />
                            {doc.fileSize}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <Button
                      href={doc.sourceUrl ?? "#"}
                      external
                      variant="primary"
                      appearance="outlined"
                      size="sm"
                      className="text-label-2 px-4 py-1.5 whitespace-nowrap"
                    >
                      View Online
                    </Button>
                    <Button
                      href={doc.sourceUrl ?? "#"}
                      target="_blank"
                      download
                      variant="primary"
                      appearance="filled"
                      size="sm"
                      className="text-label-2 px-4 py-1.5 whitespace-nowrap"
                    >
                      Download PDF
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* The department's system pager, not a local one.

              What was here rendered `Array.from({ length: Math.min(5, totalPages) })`
              and numbered it `i + 1` — the literal list 1,2,3,4,5, whatever the
              total. On Statutory Advices that is 5 of 99 pages, with no button
              highlighted past the fifth, so the control stopped saying where the
              reader was. It was also a bare `<div>`: no landmark, no name, no
              `aria-current`. `Pagination` windows the numbers around the current
              page, keeps the first and last one click away, and renders nothing
              at all below two pages. */}
          <div className="mt-8">
            <Pagination
              page={safePage}
              totalPages={totalPages}
              onPageChange={changePage}
              label={`${title} pages`}
            />
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
