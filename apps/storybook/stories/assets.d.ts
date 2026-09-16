/**
 * `?url` asset imports, for a story that needs one real file from the hub.
 *
 * Vite resolves `import src from "…/mark.svg?url"` to a hashed URL and bundles
 * only that file. The alternative — a `staticDirs` entry for the hub's
 * `public/website/images` — would copy 45 MB into the Storybook build, and the hub
 * then serves that build at /storybook, so every deploy would carry the website's
 * images twice. The SiteFooter stories need two marks of about 25 KB each.
 */
declare module "*.svg?url" {
  const src: string;
  export default src;
}
