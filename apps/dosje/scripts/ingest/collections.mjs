// Registry of collections to ingest. Phase 0 ships `organisation`.
// Later phases add entries here; the pipeline is otherwise generic.
export const COLLECTIONS = [
  {
    name: "organisation",        // output file: src/content/organisation.json
    restBase: "organisation",    // /wp-json/wp/v2/organisation
    sitemapType: "organisation", // wp-sitemap-posts-organisation-N.xml
    taxonomies: {},              // { fieldKey: "taxonomy-rest-base" }
    fields: ["id", "slug", "title", "link", "content", "featured_media"],
  },
];
