// Registry of collections to ingest. Phase 0 ships `organisation`.
// Later phases add entries here; the pipeline is otherwise generic.
export const COLLECTIONS = [
  {
    name: "organisation",        // output file: src/content/organisation.json
    restBase: "organisation",    // /wp-json/wp/v2/organisation
    sitemapType: "organisation", // wp-sitemap-posts-organisation-N.xml
    basePath: "organisation",    // derive unique path-based slugs under /organisation/
    taxonomies: {},              // { fieldKey: "taxonomy-rest-base" }
    fields: ["id", "slug", "title", "link", "content", "featured_media"],
  },
  {
    name: "schemes",
    restBase: "schemes-and-services",
    sitemapType: "schemes-and-services",
    basePath: "schemes-and-services",
    taxonomies: { category: "scheme-category", targetGroup: "target-group" },
    // "scheme-category"/"target-group" are WP REST field names returning term-ID arrays (resolved to names via the `taxonomies` map).
    fields: ["id", "slug", "title", "link", "content", "scheme-category", "target-group"],
  },
  {
    name: "tenders",
    restBase: "tender",
    sitemapType: "tender",
    kind: "file",
    taxonomies: { category: "tender-category" },
    fields: ["id", "slug", "title", "link", "date", "content", "tender-category"],
  },
  {
    name: "vacancies",
    restBase: "vacancies",
    sitemapType: "vacancies",
    kind: "file",
    taxonomies: { category: "vacancy-category" },
    fields: ["id", "slug", "title", "link", "date", "content", "vacancy-category"],
  },
  // ── Rich collections (kind ∈ kinds.mjs) ──────────────────────────────────
  // REST gives title/date/terms; the file URL, size, venue, images etc. are only
  // on each record's public page, so these also read that page (cached on disk).
  // `terms` are taxonomy REST bases, each also the REST field holding the IDs.
  // Field inventory and live counts: COLLECTIONS.md.
  {
    name: "documents",
    restBase: "documents",
    sitemapType: "documents",
    kind: "document",
    detail: "listing", // the library listing renders the same row, 10 per request
    terms: ["documents-type", "organisation_cat", "commission", "states", "component_status", "serial-number", "tags"],
    // A record can carry several documents-type terms; prefer a listing-page type as
    // its `category` so a record ALSO carrying another type lands on the right page.
    // Every term is kept in `types`.
    preferCategories: [
      "Annual Reports", "Acts & Rules", "Circulars & Notifications",
      "Forms & Templates", "Publications", "Notice", "MOU", "POLICY",
      "Resources", "Advices",
    ],
    // The Central List of OBCs is 2,667 of the 5,964 records — a self-contained
    // state-wise series, and the reason documents.json would otherwise ship a
    // single ~5 MB module into the server bundle.
    splitByCategory: { "Central List of OBC's": "documents-central-list-of-obcs" },
    fields: ["id", "slug", "title", "link", "date", "modified_gmt", "documents-type", "organisation_cat", "commission", "states", "component_status", "serial-number", "tags"],
  },
  {
    name: "scheme-documents",
    restBase: "scheme-documents",
    sitemapType: "scheme-documents",
    kind: "document",
    terms: ["organisation_cat", "component_status", "tags"],
    fields: ["id", "slug", "title", "link", "date", "modified_gmt", "organisation_cat", "component_status", "tags"],
  },
  {
    name: "suo-moto-disclosure",
    restBase: "suo-moto-disclosure",
    sitemapType: "suo-moto-disclosure",
    kind: "document",
    terms: ["organisation_cat", "tags"],
    fields: ["id", "slug", "title", "link", "date", "modified_gmt", "organisation_cat", "tags"],
  },
  {
    name: "events",
    restBase: "events",
    sitemapType: "events",
    kind: "event",
    terms: ["event-category", "gallery-category", "organisation_cat"],
    fields: ["id", "slug", "title", "link", "date", "modified_gmt", "featured_media", "event-category", "gallery-category", "organisation_cat"],
  },
  {
    name: "gallery",
    restBase: "gallery",
    sitemapType: "gallery",
    kind: "gallery",
    terms: ["gallery-type", "gallery-category", "organisation_cat"],
    fields: ["id", "slug", "title", "link", "date", "modified_gmt", "featured_media", "gallery-type", "gallery-category", "organisation_cat"],
  },
  {
    name: "official",
    restBase: "official",
    sitemapType: "official",
    kind: "official",
    terms: ["officials-type", "organisation_cat", "designation", "group-type", "commission"],
    fields: ["id", "slug", "title", "link", "date", "modified_gmt", "featured_media", "menu_order", "officials-type", "organisation_cat", "designation", "group-type", "commission"],
  },
  {
    name: "cpio",
    restBase: "cpio",
    sitemapType: "cpio",
    kind: "cpio",
    terms: ["organisation_cat"],
    fields: ["id", "slug", "title", "link", "date", "modified_gmt", "organisation_cat"],
  },
  {
    name: "booking",
    restBase: "booking",
    sitemapType: "booking",
    kind: "booking",
    terms: ["booking-category"],
    fields: ["id", "slug", "title", "link", "date", "modified_gmt", "content", "featured_media", "acf", "booking-category"],
  },
  {
    name: "updates",
    restBase: "updates",
    sitemapType: "updates",
    kind: "update",
    terms: ["organisation_cat", "component_status"],
    fields: ["id", "slug", "title", "link", "date", "modified_gmt", "content", "organisation_cat", "component_status"],
  },
  {
    // Not in any sitemap, but publicly listed by district at /sewer-death-detail/<district>/
    // (linked from the NCSK pages), so it is a public record set.
    name: "sewer-death-cases",
    restBase: "sewer-death-case",
    sitemapType: null,
    kind: "sewer-case",
    terms: ["sewer_state", "sewer_district"],
    fields: ["id", "slug", "title", "link", "date", "modified_gmt", "sewer_state", "sewer_district"],
  },
];
