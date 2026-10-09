/**
 * WHERE A LINK TO THE LIVE WEBSITE GOES IN THE DBIM DESIGN.
 *
 * The organisation pages are read from dosje.gov.in, so every link on them names a
 * dosje.gov.in address. The estate holds that content itself — the ingested
 * organisation pages, officials, schemes, events, documents and gallery — so a DBIM
 * page never sends a reader to the live site for something it can show. The
 * Department's instruction, 29 Sep 2026.
 *
 * Resolution, first match wins:
 *
 *   /organisation/<id>/                 → that body's page here (or its scheme portal page)
 *   /organisation/<id>/<page>/          → /ministry/our-organisation/<id>/<page>
 *   /official/<slug>/                   → the official's profile under their body's directory
 *   /<body>-directory/                  → /ministry/our-organisation/<id>/directory
 *   /<register>/?org=<body>             → /ministry/our-organisation/<id>/documents/<register>
 *   /events/?org=<body>, /gallery/?org= → that body's events or gallery here
 *   /events/<slug>/                     → /connect/events/<slug>
 *   /schemes-and-services/<slug>/       → the scheme's page, at its master id
 *   /gallery/<album>/                   → /media/photos/<album>
 *   /vacancies/, /tenders/              → Offerings › Vacancies / Tenders (the registers
 *                                          carry no body, so they cannot be filtered)
 *   nashamukt*.dosje.gov.in             → the estate's NMBA portal
 *   pmajay.dosje.gov.in                 → the estate's PM-AJAY portal
 *
 * A link back to the page the reader is on ("Know More" under Contact, which opens the
 * live Contact Us for the same body) resolves to `null`: the section IS the content.
 *
 * What stays external, on purpose: another organisation's own website (ncsk.nic.in),
 * a government service (jeevanpramaan.gov.in), social media, and the Department's
 * portals the estate has not built (DWBDNC's SEED, NISD's TAPAS, PM-SURAJ, PM-DAKSH,
 * NAMASTE, the coaching portal) — applications, not pages.
 *
 * Checked by `node tools/dbim-live-links/crawl.mjs` against a running hub: it follows
 * every link two levels out from the organisation pages and lists any that fail or
 * still name a dosje.gov.in page. 29 Sep 2026: 291 pages, none failing.
 */
import { ORGANISATIONS } from "@/data/website";
import { getEvent, getOfficial, getOrganisation } from "@/lib/website/content";
import { LEGACY_TO_MASTER } from "@/lib/website-next/legacy-scheme-map.generated";
import { getOrganisationPage } from "@/lib/website-shared/organisation-profiles";
import { getDbimAlbum } from "./media";
import { dbimHref } from "./nav";

/** The live site's `?org=` codes and the registry's `organisation` codes → the body's id. */
export const ORG_CODES: Record<string, string> = {
  daf: "dr-ambedkar-foundation",
  daic: "dr-ambedkar-international-centre",
  ncsc: "national-commission-for-scheduled-castes",
  ncsk: "national-commission-for-safai-karamcharis",
  ncbc: "national-commission-for-backward-classes-ncbc",
  nisd: "national-institute-of-social-defence",
  nsfdc: "national-scheduled-castes-finance-and-development-corporation",
  nskfdc: "national-safai-karamcharis-finance-development-corporation",
  nbcfdc: "national-backward-classes-financeand-development-corporationnbcfdc",
  dwbdnc: "development-and-welfare-board-for-de-notified-nomadic-and-semi-nomadic",
  bjrnf: "babu-jagjivan-ram-national-foundation-jrf",
};

/** The code a body's records carry (`DAF`), from its id. */
export function orgCode(id: string): string | undefined {
  return Object.entries(ORG_CODES).find(([, v]) => v === id)?.[0].toUpperCase();
}

export function orgIdForCode(code: string | undefined): string | undefined {
  return code ? ORG_CODES[code.toLowerCase()] : undefined;
}

/**
 * The live site's registers that can be filtered by body, and the document categories
 * each one lists (`content/website/documents.json`'s `category`). The key is the live
 * path and becomes the DBIM path segment.
 */
export const ORG_REGISTERS: Record<string, { title: string; categories: string[] }> = {
  "annual-reports": { title: "Annual Reports", categories: ["Annual Reports"] },
  notices: { title: "Notices", categories: ["Notice", "Announcement"] },
  resources: { title: "Resources", categories: ["Resources"] },
  publications: { title: "Publications", categories: ["Publications"] },
  "circulars-notifications": { title: "Circulars & Notifications", categories: ["Circulars & Notifications"] },
  "acts-rules": { title: "Acts & Rules", categories: ["Acts & Rules"] },
  advices: { title: "Advices", categories: ["Advices"] },
  "supreme-court-judgement": { title: "Supreme Court Judgement", categories: ["Supreme Court Judgement"] },
  // NISD's "Miscellaneous" lists what its other registers do not: announcements and advertisements.
  miscellaneous: { title: "Miscellaneous", categories: ["Advertisement", "Announcement"] },
};

/** Pages of one body that the live site links as a separate address but the estate holds as another body. */
const SAME_AS: Record<string, string> = {
  "dr-ambedkar-foundation/dr-ambedkar-international-center": "/organisation/dr-ambedkar-international-centre/",
};

export interface DbimResolvedLink {
  /** A complete href: a DBIM or estate path, or an absolute URL. */
  href: string;
  external: boolean;
}

const internal = (path: string): DbimResolvedLink => ({ href: dbimHref(path), external: false });
const LIVE_HOST = /^(?:www\.)?dosje\.gov\.in$/i;

/** The body's own page, or its page under Our Scheme Portals. */
function bodyPath(id: string): string | undefined {
  const entry = ORGANISATIONS.find((o) => o.id === id);
  if (!entry) return undefined;
  return entry.category === "schemes" ? `/ministry/our-scheme-portals/${id}` : `/ministry/our-organisation/${id}`;
}

/**
 * Resolves one href found on a live organisation page. `here` is the id of the body
 * whose page the link sits on. Returns `null` for a link to the page the reader is on.
 */
export function resolveLiveLink(raw: string, here?: string): DbimResolvedLink | null {
  let url: URL;
  try {
    url = new URL(raw, "https://www.dosje.gov.in");
  } catch {
    return { href: raw, external: true };
  }
  if (!/^https?:$/.test(url.protocol)) return { href: raw, external: false }; // tel:, mailto:
  if (/^nashamukt(-admin)?\.dosje\.gov\.in$/i.test(url.hostname)) return { href: "/portals/nmba", external: false };
  if (/^pmajay\.dosje\.gov\.in$/i.test(url.hostname)) return { href: "/portals/pm-ajay", external: false };
  if (!LIVE_HOST.test(url.hostname)) return { href: raw, external: true };

  const path = url.pathname.replace(/\/+$/, "") || "/";
  const segs = path.split("/").filter(Boolean);
  const org = orgIdForCode(url.searchParams.get("org") ?? undefined) ?? here;
  const self = (id: string | undefined) => (id && id === here ? null : undefined);

  if (path === "/") return internal("/");

  // /organisation/<id>/… — a body's page, or one of its own pages.
  if (segs[0] === "organisation" && segs[1]) {
    const rest = segs.slice(1).join("/");
    if (SAME_AS[rest]) return resolveLiveLink(SAME_AS[rest]!, here);
    if (segs.length === 2) {
      if (self(segs[1]) === null) return null;
      const p = bodyPath(segs[1]);
      if (p) return internal(p);
      // A page the live site files beside the bodies (NSKFDC's list-of-channelizing-agencies)
      // opens under the body whose page links it.
      if (getOrganisation(rest) && here) return internal(`/ministry/our-organisation/${here}/${rest}`);
    } else if (getOrganisation(rest) || getOrganisationPage(rest)) {
      return internal(`/ministry/our-organisation/${rest}`);
    }
  }

  // /official/<slug>/ — a profile under its body's directory; a profile the register
  // lacks opens the directory of the body the link was on.
  if (segs[0] === "official" && segs[1]) {
    const rec = getOfficial(segs[1]);
    const id = orgIdForCode(rec?.organisation) ?? here;
    if (rec && id) return internal(`/ministry/our-organisation/${id}/directory/${segs[1]}`);
    if (id) return internal(`/ministry/our-organisation/${id}/directory`);
  }

  // /<code>-directory/
  const dir = segs.length === 1 ? segs[0]!.match(/^([a-z]+)-directory$/) : null;
  if (dir && orgIdForCode(dir[1])) return internal(`/ministry/our-organisation/${orgIdForCode(dir[1])}/directory`);
  if (segs[0] === "chairpersons-office" && here) return internal(`/ministry/our-organisation/${here}/directory`);

  if (segs.length === 1 && ORG_REGISTERS[segs[0]!] && org) return internal(`/ministry/our-organisation/${org}/documents/${segs[0]}`);

  if (segs[0] === "events") {
    if (segs[1] && getEvent(segs[1])) return internal(`/connect/events/${segs[1]}`);
    if (!segs[1]) return org ? internal(`/ministry/our-organisation/${org}/events`) : internal("/connect/events");
  }

  if (segs[0] === "gallery") {
    if (segs[1] && getDbimAlbum(segs[1])) return internal(`/media/photos/${segs[1]}`);
    return org ? internal(`/ministry/our-organisation/${org}/gallery`) : internal("/media");
  }

  if (segs[0] === "schemes-and-services" && segs[1]) {
    const master = (LEGACY_TO_MASTER as Record<string, string>)[segs[1]];
    return internal(master ? `/offerings/schemes-and-services/${master}` : "/offerings");
  }

  // The body's own sections, on its own page: Contact Us and its scheme list.
  if (segs[0] === "contact-us" || segs[0] === "schemes-services") {
    const id = orgIdForCode(url.searchParams.get("org") ?? undefined);
    if (!id || id === here) return null;
    return internal(bodyPath(id) ?? "/ministry/our-organisation");
  }

  if (segs[0] === "vacancies") return internal("/offerings/vacancies");
  if (segs[0] === "tenders") return internal("/offerings/tenders");
  if (segs[0] === "lok-sabha-question-answer") return internal("/connect/parliament-questions");
  if (segs[0] === "documents") return internal("/documents");

  return { href: url.toString(), external: true };
}

/**
 * Rewrites the dosje.gov.in links inside ingested prose. Runs BEFORE `cleanHtml()`,
 * which marks every remaining absolute link as opening in a new window. A link to the
 * page itself loses its anchor and keeps its words.
 */
export function localiseLiveLinks(html: string, here?: string): string {
  return html.replace(/<a\b([^>]*?)\shref="([^"]+)"([^>]*)>([\s\S]*?)<\/a>/gi, (m, pre: string, href: string, post: string, inner: string) => {
    if (!/^(https?:)?\/\/[^/]*dosje\.gov\.in/i.test(href) || /\.(pdf|docx?|xlsx?|pptx?|zip|jpe?g|png)(\?|$)/i.test(href)) return m;
    const r = resolveLiveLink(href, here);
    if (!r) return inner;
    const attrs = `${pre}${post}`.replace(/\s(?:target|rel)="[^"]*"/gi, "");
    return r.external ? m : `<a${attrs} href="${r.href}">${inner}</a>`;
  });
}
