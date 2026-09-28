/**
 * The file name a demo screenshot is saved under.
 *
 * Named for what is IN it — the page, the website design and colour mode showing, whether it
 * is the visible area or the whole page, and when — so that a folder of comparison shots
 * sorts and reads on its own, without anyone renaming "screenshot (14).png" afterwards.
 */

export type CaptureScope = "viewport" | "page";

export interface CaptureNameParts {
  pathname: string;
  scope: CaptureScope;
  /** The website design's label, on a website address only. */
  design?: string | null;
  /** The colour mode, when it is not the default. */
  colour?: string | null;
  date: Date;
}

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const pad = (n: number) => String(n).padStart(2, "0");

export function captureFileName({ pathname, scope, design, colour, date }: CaptureNameParts): string {
  const page = slug(pathname) || "home";
  const stamp =
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
  const parts = [
    page,
    design ? slug(design) : null,
    colour ? `${slug(colour)}-colour` : null,
    scope === "page" ? "full-page" : "visible-area",
    stamp,
  ];
  return `${parts.filter(Boolean).join("_")}.png`;
}
