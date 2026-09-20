"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Button,
  EmptyState,
  Icon,
  Pagination,
  Search,
  Select,
} from "@mosje/design-system";
import { PageLayout } from "@/components/website/layout/PageLayout";
import type { GalleryRecord } from "@/types/website/content";
import "@/components/website/templates/record-library.css";
import "@/components/website/templates/record-detail.css";
import "./gallery.css";

/**
 * The department's gallery — 590 records, not a dozen hand-picked pictures.
 *
 * ── WHAT THIS REPLACED ───────────────────────────────────────────────────────
 * A hard-coded list of thirteen local images with captions written here. The
 * register publishes 434 photo sets, 94 videos and 60 news items, each with its
 * own page, organisation and date, and the ingest carries all of them.
 *
 * ── STATES ───────────────────────────────────────────────────────────────────
 * Populated, empty, filtered-to-nothing (worded differently, with the reset),
 * and too-much — paged at twenty-four, never scrolled inside a card. Loading and
 * error cannot occur: the register is imported JSON resolved on the server.
 *
 * ── 59 RECORDS CARRY NO COVER IMAGE ──────────────────────────────────────────
 * They are still listed. A record with no picture gets the collection's icon
 * rather than a broken frame or a gap, because the record is what the
 * department published and its own page still holds the rest.
 */

const PAGE_SIZE = 24;

const TYPE_ICON: Record<string, string> = {
  Photos: "photo_library",
  Videos: "smart_display",
  News: "newspaper",
};

export function GalleryClient({ items }: { items: GalleryRecord[] }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");
  const [organisation, setOrganisation] = useState("All");
  const [page, setPage] = useState(1);

  const types = useMemo(() => {
    const seen = new Set<string>();
    for (const g of items) if (g.type) seen.add(g.type);
    return [...seen].sort();
  }, [items]);

  const organisations = useMemo(() => {
    const seen = new Set<string>();
    for (const g of items) if (g.organisation) seen.add(g.organisation);
    return [...seen].sort();
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((g) => {
      if (type !== "All" && g.type !== type) return false;
      if (organisation !== "All" && g.organisation !== organisation) return false;
      if (q && !g.title.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [items, query, type, organisation]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const shown = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const filterActive = query.trim() !== "" || type !== "All" || organisation !== "All";
  const reset = () => {
    setQuery("");
    setType("All");
    setOrganisation("All");
    setPage(1);
  };

  return (
    <PageLayout
      title="Gallery"
      breadcrumb={[{ label: "Events & Gallery" }, { label: "Gallery" }]}
      description="Photographs, videos and news coverage of the programmes of the Department of Social Justice & Empowerment and its associated organisations."
    >
      <section className="sa-record-library">
        <div className="sa-container">
          <div className="sa-record-library__filters">
            <div className="sa-record-library__search">
              <Search
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                onClear={() => { setQuery(""); setPage(1); }}
                size="sm"
                placeholder="Search the gallery by title"
                aria-label="Search the gallery by title"
              />
            </div>

            {types.length > 1 && (
              <label className="sa-record-library__filter">
                <span className="sa-record-library__filter-label">Media</span>
                <Select
                  appearance="filter"
                  value={type}
                  onChange={(e) => { setType(e.target.value); setPage(1); }}
                  options={[
                    { label: "All media", value: "All" },
                    ...types.map((t) => ({ label: t, value: t })),
                  ]}
                />
              </label>
            )}

            {organisations.length > 1 && (
              <label className="sa-record-library__filter">
                <span className="sa-record-library__filter-label">Organisation</span>
                <Select
                  appearance="filter"
                  value={organisation}
                  onChange={(e) => { setOrganisation(e.target.value); setPage(1); }}
                  options={[
                    { label: "All organisations", value: "All" },
                    ...organisations.map((o) => ({ label: o, value: o })),
                  ]}
                />
              </label>
            )}

            {filterActive && (
              <Button variant="neutral" appearance="text" size="sm" onClick={reset}>
                Reset Filters
              </Button>
            )}
          </div>

          <p className="sa-record-library__count" role="status">
            {filtered.length.toLocaleString("en-IN")}{" "}
            {filtered.length === 1 ? "item" : "items"}
            {filterActive && ` of ${items.length.toLocaleString("en-IN")}`}
          </p>

          {items.length === 0 ? (
            <EmptyState
              icon={<Icon name="photo_library" size={40} />}
              title="No Gallery Items Published"
              description="The Department has not published any photographs, videos or news coverage."
            />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<Icon name="search_off" size={40} />}
              title="No Gallery Items Match These Filters"
              description={`All ${items.length.toLocaleString("en-IN")} items in the gallery were excluded by the filters above. Clear them to see everything the Department has published.`}
              action={
                <Button variant="primary" appearance="outlined" size="sm" onClick={reset}>
                  Reset Filters
                </Button>
              }
            />
          ) : (
            <>
              <ul className="sa-gallery-grid">
                {shown.map((g) => {
                  /* Five items carry a PDF or an MP4 in the cover slot, eight the generic Ashoka emblem; those get the type glyph. */
                  const coverUrl = g.thumbnailUrl ?? g.imageUrl;
                  const cover = coverUrl && /\.(jpe?g|png|webp|gif|avif|svg)(\?|$)/i.test(coverUrl) && !/\/Ashoka\.png$/i.test(coverUrl)
                      ? coverUrl
                      : undefined;
                  return (
                    <li key={g.slug} className="sa-gallery-card">
                      <Link href={`/website/gallery/${g.slug}`} className="sa-gallery-card__link">
                        <span className="sa-gallery-card__frame">
                          {cover ? (
                            <Image
                              src={cover}
                              alt=""
                              fill
                              className="sa-gallery-card__image"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            />
                          ) : (
                            <Icon
                              name={TYPE_ICON[g.type ?? ""] ?? "image"}
                              size={40}
                              className="sa-gallery-card__placeholder"
                            />
                          )}
                          {g.type && <span className="sa-gallery-card__type">{g.type}</span>}
                        </span>
                        <span className="sa-gallery-card__title">{g.title}</span>
                      </Link>
                      {g.organisation && (
                        <span className="sa-gallery-card__meta">{g.organisation}</span>
                      )}
                    </li>
                  );
                })}
              </ul>

              <div className="sa-gallery-pager">
                <Pagination
                  page={current}
                  totalPages={totalPages}
                  onPageChange={setPage}
                  label="Gallery pages"
                />
              </div>
            </>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
