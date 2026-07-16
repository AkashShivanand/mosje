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
  {
    name: "documents",
    restBase: "documents",
    sitemapType: "documents",
    kind: "file",
    partial: true, // intentional subset: only the 10 types with listing pages
    query: "documents-type=28,29,30,31,32,138,141,145,158,217",
    taxonomies: { category: "documents-type" },
    // A record can carry several documents-type terms; prefer the wanted one as its
    // category so records that ALSO have a non-listed type aren't mis-bucketed.
    preferCategories: [
      "Annual Reports", "Acts & Rules", "Circulars & Notifications",
      "Forms & Templates", "Publications", "Notice", "MOU", "POLICY",
      "Resources", "Advices",
    ],
    fields: ["id", "slug", "title", "link", "date", "content", "documents-type"],
  },
];
