"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, Icon, buttonClasses } from "@mosje/design-system";
import { PageLayout } from "@/components/website/layout/PageLayout";
import type { Crumb } from "@/components/website/layout/Breadcrumb";
import { cn } from "@/lib/website/utils";

export interface SchemeItem {
  slug: string;
  title: string;
  category?: string;
  targetGroup?: string[];
  description?: string;
  sourceUrl?: string;
}

interface SchemesCatalogProps {
  title: string;
  description?: string;
  breadcrumb: Crumb[];
  schemes: SchemeItem[];
  lastUpdated?: string;
}

const CATEGORIES = [
  "All",
  "Scholarship",
  "Education",
  "Loan",
  "Skill Training",
  "Social Defence",
  "Business",
];

export function SchemesCatalog({
  title,
  description,
  breadcrumb,
  schemes,
  lastUpdated,
}: SchemesCatalogProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const filtered = useMemo(() => {
    return schemes.filter((s) => {
      const matchesCategory =
        activeCategory === "All" ||
        (s.category &&
          s.category.toLowerCase().includes(activeCategory.toLowerCase())) ||
        (s.targetGroup &&
          s.targetGroup.some((t) =>
            t.toLowerCase().includes(activeCategory.toLowerCase())
          ));

      const matchesSearch =
        search.trim() === "" ||
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        (s.category && s.category.toLowerCase().includes(search.toLowerCase())) ||
        (s.targetGroup &&
          s.targetGroup.some((t) =>
            t.toLowerCase().includes(search.toLowerCase())
          ));

      return matchesCategory && matchesSearch;
    });
  }, [schemes, search, activeCategory]);

  return (
    <PageLayout
      title={title}
      description={description}
      breadcrumb={breadcrumb}
      lastUpdated={lastUpdated}
    >
      <section className="py-10 md:py-14 bg-white">
        <div className="sa-container">
          {/* Filter Bar: Search + Category Pills + View Switch */}
          <div className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-surface-muted p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:max-w-md">
                <Icon
                  name="search"
                  size={20}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search schemes by name, keyword or category…"
                  className="w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-primary focus:outline-none shadow-xs"
                />
              </div>

              {/* View Switcher */}
              <div className="flex items-center rounded-lg bg-gray-200/80 p-1 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid view"
                  className={cn(
                    "rounded-md p-1.5 transition",
                    viewMode === "grid"
                      ? "bg-white text-primary shadow-xs"
                      : "text-ink-muted hover:text-ink"
                  )}
                >
                  <Icon name="grid_view" size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  aria-label="Table view"
                  className={cn(
                    "rounded-md p-1.5 transition",
                    viewMode === "table"
                      ? "bg-white text-primary shadow-xs"
                      : "text-ink-muted hover:text-ink"
                  )}
                >
                  <Icon name="table_rows" size={20} />
                </button>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-200/80">
              <span className="text-xs font-bold text-ink-muted uppercase mr-1">
                Filter:
              </span>
              {CATEGORIES.map((cat) => {
                const isActive = cat === activeCategory;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      "rounded-full px-4 py-1.5 text-xs font-semibold transition",
                      isActive
                        ? "bg-primary text-white shadow-xs"
                        : "bg-white border border-gray-200 text-ink-muted hover:border-primary/40 hover:text-primary"
                    )}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-6 flex items-center justify-between text-xs text-ink-muted px-1">
            <span>
              Showing <strong>{filtered.length}</strong> schemes
            </span>
          </div>

          {/* Render Mode: Grid or Table */}
          {viewMode === "grid" ? (
            <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((scheme) => (
                <Card
                  key={scheme.slug}
                  className="flex flex-col justify-between p-6 border border-gray-200 bg-white shadow-xs hover:shadow-md hover:border-primary/40 transition rounded-xl group"
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <span className="rounded bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary uppercase tracking-wide">
                        {scheme.category ?? "Welfare Scheme"}
                      </span>
                      {scheme.targetGroup && scheme.targetGroup.length > 0 && (
                        <span className="text-[11px] font-medium text-ink-muted">
                          {scheme.targetGroup[0]}
                        </span>
                      )}
                    </div>

                    <h3 className="text-[17px] font-bold leading-snug text-ink group-hover:text-primary transition-colors">
                      {scheme.title}
                    </h3>

                    {scheme.description && (
                      <p className="mt-2.5 text-xs leading-relaxed text-ink-muted line-clamp-3">
                        {scheme.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-150 flex items-center justify-between">
                    <Link
                      href={`/website/schemes-services/${scheme.slug}`}
                      className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                    >
                      Scheme Details
                      <Icon name="arrow_forward" size={16} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                    {scheme.sourceUrl && (
                      <a
                        href={scheme.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-semibold text-gray-500 hover:text-primary flex items-center gap-0.5"
                      >
                        Portal <Icon name="open_in_new" size={16} />
                      </a>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="mt-5 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-ink border-collapse">
                  <thead className="bg-gray-50 text-xs font-bold uppercase tracking-wider text-ink-muted border-b border-gray-200">
                    <tr>
                      <th className="py-3.5 px-4">Scheme Name</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Target Group</th>
                      <th className="py-3.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150 text-xs sm:text-sm">
                    {filtered.map((s) => (
                      <tr key={s.slug} className="hover:bg-gray-50/80 transition">
                        <td className="py-3.5 px-4 font-semibold text-ink">
                          {s.title}
                        </td>
                        <td className="py-3.5 px-4 text-ink-muted">
                          {s.category ?? "—"}
                        </td>
                        <td className="py-3.5 px-4 text-ink-muted">
                          {s.targetGroup && s.targetGroup.length > 0
                            ? s.targetGroup.join(", ")
                            : "—"}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Link
                            href={`/website/schemes-services/${s.slug}`}
                            className={buttonClasses("primary", "outlined", "sm", "text-xs px-3 py-1")}
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
