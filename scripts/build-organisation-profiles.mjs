#!/usr/bin/env node
/**
 * Mirrors each organisation's page on dosje.gov.in into one dated snapshot,
 * `apps/hub/src/lib/website-shared/organisation-profiles.json`.
 *
 *   node scripts/build-organisation-profiles.mjs            # fetch the live pages
 *   node scripts/build-organisation-profiles.mjs --from DIR # read <id>.html saved earlier
 *
 * WHY A SNAPSHOT. The live organisation pages (redesigned on dosje.gov.in in
 * 2025–26) carry far more than `content/website/organisation.json` — the scrape
 * the other designs read — ever held: headline figures, the leadership with
 * photographs, scheme cards, dated reports with file sizes, tabbed updates,
 * a gallery, social handles and a contact block. They are built with one page
 * builder from one template, so one reader can take them all, and the output
 * is committed so the site never depends on the live site answering.
 *
 * WHAT IT DOES NOT DO. It never rewrites a word. Text is taken as published,
 * whitespace collapsed; e-mail addresses stay in the `[at]`/`[dot]` notation the
 * Department publishes. A section the reader cannot classify is kept as prose
 * rather than dropped, and its kind is printed so it can be looked at.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "node-html-parser";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "apps/hub/src/lib/website-shared/organisation-profiles.json");
const LIVE = "https://www.dosje.gov.in/organisation/";

/** The bodies under Ministry › Our Organisation — the registry's non-scheme entries. */
const IDS = [
  "national-commission-for-scheduled-castes",
  "national-commission-for-safai-karamcharis",
  "national-commission-for-backward-classes-ncbc",
  "dr-ambedkar-foundation",
  "dr-ambedkar-international-centre",
  "babu-jagjivan-ram-national-foundation-jrf",
  "national-scheduled-castes-finance-and-development-corporation",
  "national-safai-karamcharis-finance-development-corporation",
  "national-backward-classes-financeand-development-corporationnbcfdc",
  "development-and-welfare-board-for-de-notified-nomadic-and-semi-nomadic",
  "national-institute-of-social-defence",
];

const args = process.argv.slice(2);
const fromDir = args.includes("--from") ? args[args.indexOf("--from") + 1] : null;

const clean = (s) =>
  (s ?? "")
    .replace(/&nbsp;| /g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#8217;|&rsquo;/g, "’")
    .replace(/&#8216;|&lsquo;/g, "‘")
    .replace(/&#8211;|&ndash;/g, "–")
    .replace(/&#8212;|&mdash;/g, "—")
    .replace(/&#8230;|&hellip;/g, "…")
    .replace(/&#039;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
/** Ingested markup, without the page builder's classes, styles and whitespace. */
const tidy = (html) =>
  (html ?? "")
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\s(?:class|style|id|data-[\w-]+|decoding|loading|srcset|sizes|width|height)="[^"]*"/gi, "")
    .replace(/<\/?(?:div|span)>/gi, "")
    .replace(/&nbsp;|\u00a0/g, " ")
    .replace(/\s*\n\s*/g, " ")
    .replace(/>\s+</g, "><")
    .replace(/\s{2,}/g, " ")
    .trim();
const text = (n) => clean(n?.structuredText ?? n?.text ?? "");
const flat = (n) => clean(n?.text ?? "");
const href = (a) => a?.getAttribute("href")?.trim() || undefined;
const src = (img) => img?.getAttribute("data-src") || img?.getAttribute("src") || undefined;
/** "Know More", "View All" and friends are the section's own link, not content. */
const MORE = /^(know more|view all|visit gallery|read more|view details\s*→?|view profile)$/i;

async function load(id) {
  if (fromDir) {
    const f = path.join(fromDir, `${id}.html`);
    return fs.existsSync(f) ? fs.readFileSync(f, "utf8") : null;
  }
  const res = await fetch(`${LIVE}${id}/`, { headers: { "user-agent": "Mozilla/5.0 (MoSJE mirror)" } });
  return res.ok ? res.text() : null;
}

/** The hero: mark, name, the line under it, the lead, the banner, its buttons, the figures. */
function hero(main) {
  const headings = main.querySelectorAll("h1").map(flat).filter(Boolean);
  const heroBox = main.querySelector("h1")?.closest(".e-con-boxed") ?? main;
  const lead = flat(main.querySelector(".inner-banner-info"));
  const imgs = heroBox.querySelectorAll("img");
  const logo = src(imgs[0]);
  const banner = heroBox.querySelector(".banner-image-with-effect img, .banner-image-with-effect-outer img");
  const actions = heroBox
    .querySelectorAll("a.elementor-button")
    .map((a) => ({ label: flat(a), href: href(a) }))
    .filter((a) => a.label && a.href && !MORE.test(a.label));
  const facts = main
    .querySelectorAll(".organization-icon")
    .map((icon) => {
      const box = icon.parentNode;
      return { value: flat(box.querySelector("h4, h3, h2")), label: flat(box.querySelector("p")) };
    })
    .filter((f) => f.value && f.label);
  return {
    title: headings[0],
    subtitle: headings[1] ? clean(main.querySelectorAll("h1")[1].innerHTML.replace(/<br\s*\/?>/gi, " · ").replace(/<[^>]+>/g, "")) : undefined,
    lead: lead || undefined,
    logo,
    banner: banner ? { src: src(banner), alt: banner.getAttribute("alt") || "" } : undefined,
    actions,
    facts,
  };
}

/** The left index: its groups and the pages it links OFF this page (Awards, RTI, FAQs…). */
function index(main) {
  const groups = [];
  for (const li of main.querySelectorAll(".page-left-menu li.e-n-menu-item")) {
    const a = li.querySelector("a");
    const label = flat(li);
    if (!label) continue;
    if (!a) {
      groups.push({ label, links: [] });
      continue;
    }
    const h = href(a);
    if (!groups.length) groups.push({ label: "", links: [] });
    if (h && !h.startsWith("#")) groups.at(-1).links.push({ label, href: h });
  }
  return groups.filter((g) => g.links.length);
}

function docCard(card) {
  const meta = flat(card.querySelector(".label-2"));
  const m = meta.match(/Type:\s*(.+?)\s*•\s*File:\s*(\w+)\s*\(([^)]+)\)/);
  const a = card.querySelector("a[href]");
  return {
    title: flat(card.querySelector("h6, h5")),
    date: flat(card.querySelector("span.body-2, .text-hint")) || undefined,
    type: m?.[1],
    format: m?.[2],
    size: m?.[3],
    href: href(a),
  };
}

function eventCard(card) {
  const day = flat(card.querySelector(".display-5"));
  const month = flat(card.querySelector(".card-date-box .body-2"));
  const a = [...card.querySelectorAll("a[href]")].at(-1);
  return { title: flat(card.querySelector("h6, h5")), date: [day, month].filter(Boolean).join(" ") || undefined, href: href(a) };
}

/** Reads one content column into typed blocks, in reading order. */
/**
 * The Contact column: a heading (h5 or h6, per page) and every text widget under
 * it until the next heading. A button in it ("View Directory") is kept as a link.
 */
function contactBlocks(col) {
  const items = [];
  const links = [];
  for (const w of col.querySelectorAll(".elementor-widget")) {
    const cls = w.getAttribute("class") ?? "";
    if (cls.includes("widget-heading")) items.push({ label: flat(w), values: [] });
    else if (cls.includes("widget-text-editor")) {
      const lis = w.querySelectorAll("li").map(flat).filter(Boolean);
      const paras = w.querySelectorAll("p").map(flat).filter(Boolean);
      // DWBDNC's address carries its map widget's labels ("Office Address Office Address
      // Google Map") ahead of the address; they are the widget's, not the address.
      const values = (lis.length ? lis : paras.length ? paras : [flat(w)].filter(Boolean)).map((v) => v.replace(/^(?:Office Address\s*)+Google Map\s*/i, ""));
      if (!items.length) items.push({ label: "", values: [] });
      items.at(-1).values.push(...values);
    } else if (cls.includes("widget-button")) {
      const a = w.querySelector("a");
      if (flat(a) && !MORE.test(flat(a))) links.push({ label: flat(a), href: href(a) });
    }
  }
  const out = [{ kind: "contact", items: items.filter((i) => i.values.length) }];
  if (links.length) out.push({ kind: "links", items: links });
  return out;
}

function blocks(col, contact = false) {
  if (contact) return contactBlocks(col);
  const out = [];
  const push = (b) => {
    const prev = out.at(-1);
    if (prev && prev.kind === b.kind && b.kind !== "prose" && b.kind !== "contact") prev.items.push(...b.items);
    else out.push(b);
  };
  for (const w of col.querySelectorAll(".elementor-widget, .org-page-gallery-section, .elementor-loop-container, .social-widgets-row")) {
    // Only the outermost widget of each kind is read; nested ones are read by it.
    if (w.parentNode?.closest(".elementor-widget, .org-page-gallery-section, .elementor-loop-container, .social-widgets-row")) continue;
    const cls = w.getAttribute("class") ?? "";

    if (cls.includes("org-page-gallery-section")) {
      const items = [];
      for (const img of w.querySelectorAll("img")) {
        const cap = img.closest(".elementor-widget")?.nextElementSibling;
        items.push({ src: src(img), full: href(img.closest("a")), caption: flat(cap?.querySelector("h6, h5, p")) });
      }
      push({ kind: "gallery", items });
      continue;
    }
    const social = cls.includes("social-widgets-row") ? w : w.querySelector(".social-widgets-row");
    if (social) {
      const items = social.querySelectorAll(".social-widget-col").map((c) => {
        const a = c.querySelector("a[class*=follow-btn]");
        return {
          platform: flat(c.querySelector(".social-card-header")),
          // "@profile.php" and "@p" are what the live card prints when it derives a
          // handle from a URL that has none; they are not handles, so none is kept.
          handle: /^@[\w.]{3,}$/.test(flat(c.querySelector("[class*=profile-handle]"))) && !/\.php$/.test(flat(c.querySelector("[class*=profile-handle]")))
            ? flat(c.querySelector("[class*=profile-handle]"))
            : undefined,
          href: href(a),
        };
      });
      // instagram.com/p/ with no post id opens nothing; it is left out, not linked.
      push({ kind: "social", items: items.filter((i) => i.href && !/instagram\.com\/p\/?$/.test(i.href)) });
      continue;
    }
    if (cls.includes("elementor-loop-container") || cls.includes("elementor-widget-loop-grid")) {
      const items = w.querySelectorAll("a.elementor-button").map((a) => ({ label: flat(a), href: href(a) }));
      push({ kind: "links", items });
      continue;
    }
    if (cls.includes("elementor-widget-n-tabs")) {
      const titles = w.querySelectorAll(".e-n-tab-title").map(flat);
      const panels = w.querySelectorAll(".e-n-tabs-content > div");
      const tabs = titles.map((label, i) => {
        const p = panels[i];
        const more = p?.querySelectorAll("a.elementor-button").find((a) => /view all/i.test(flat(a)));
        const docs = p?.querySelectorAll(".card").filter((c) => c.querySelector(".label-2")).map(docCard) ?? [];
        const events = p?.querySelectorAll(".card").filter((c) => c.querySelector(".card-date-box")).map(eventCard) ?? [];
        const news = p?.querySelectorAll(".card").filter((c) => !c.querySelector(".label-2, .card-date-box") && c.querySelector("h5, h6, .card-title"))
          .map((c) => ({ title: flat(c.querySelector("h5, h6, .card-title")), href: href([...c.querySelectorAll("a[href]")].at(-1)) })) ?? [];
        const empty = p ? flat(p).match(/No [a-z ]+ found\./i)?.[0] : undefined;
        return { label, viewAll: href(more), documents: docs, events, news, empty };
      });
      push({ kind: "tabs", items: tabs });
      continue;
    }
    if (cls.includes("elementor-widget-html")) {
      const cards = w.querySelectorAll(".card");
      const people = cards.filter((c) => c.querySelector("img") && c.querySelector(".card-title"));
      const schemes = cards.filter((c) => c.querySelector(".label-3") || c.querySelector("a.title-2"));
      const docs = cards.filter((c) => c.querySelector(".label-2"));
      const events = cards.filter((c) => c.querySelector(".card-date-box"));
      if (people.length) {
        push({
          kind: "people",
          items: people.map((c) => {
            const col = c.parentNode;
            const tenure = flat(col.querySelector(".tenure, .badge, [class*=tenure]")) || flat(c.querySelector(".position-relative > span, .position-relative > div:not(.ratio)"));
            return {
              name: flat(c.querySelector(".card-title")),
              designation: flat(c.querySelector(".text-hint")),
              photo: src(c.querySelector("img")),
              profile: href(c.querySelector("a[href]")),
              tenure: tenure || undefined,
            };
          }),
        });
      } else if (schemes.length) {
        push({
          kind: "cards",
          items: schemes.map((c) => ({
            category: flat(c.querySelector(".label-3")) || undefined,
            title: flat(c.querySelector("a.title-2, .title-2, h5, h6")),
            description: flat(c.querySelector(".body-2")) || undefined,
            href: href(c.querySelector("a.title-2") ?? c.querySelector("a[href]")),
          })),
        });
      } else if (docs.length) {
        push({ kind: "documents", items: docs.map(docCard) });
      } else if (events.length) {
        push({ kind: "events", items: events.map(eventCard) });
      } else if (flat(w)) {
        push({ kind: "prose", html: tidy(w.innerHTML) });
      }
      continue;
    }
    if (cls.includes("elementor-widget-image")) {
      // An image followed by a caption heading and a button is an activity tile.
      const img = w.querySelector("img");
      const cap = w.nextElementSibling;
      const btn = cap?.nextElementSibling;
      if (img && cap?.getAttribute("class")?.includes("widget-heading") && btn?.getAttribute("class")?.includes("widget-button")) {
        push({ kind: "tiles", items: [{ title: flat(cap), image: src(img), href: href(btn.querySelector("a")) }] });
      }
      continue;
    }
    if (cls.includes("elementor-widget-heading")) {
      const h = w.querySelector("h1, h2, h3, h4, h5, h6, p");
      const tag = h?.tagName?.toLowerCase();
      // Tile captions are read with their image; contact labels with their values.
      if (w.previousElementSibling?.getAttribute("class")?.includes("widget-image")) continue;
      if (contact && tag === "h5") {
        const body = w.nextElementSibling;
        const lines = body?.querySelectorAll("li").map(flat).filter(Boolean) ?? [];
        const values = lines.length ? lines : [flat(body)].filter(Boolean);
        out.push({ kind: "contact", items: [{ label: flat(h), values }] });
        const prev = out.at(-2);
        if (prev?.kind === "contact") {
          prev.items.push(...out.pop().items);
        }
        continue;
      }
      if (flat(h)) push({ kind: "prose", html: `<h4>${flat(h)}</h4>` });
      continue;
    }
    if (cls.includes("elementor-widget-button")) {
      const a = w.querySelector("a");
      const label = flat(a);
      if (!label || MORE.test(label)) continue;
      if (w.previousElementSibling?.getAttribute("class")?.includes("widget-heading") && w.previousElementSibling?.previousElementSibling?.getAttribute("class")?.includes("widget-image")) continue;
      push({ kind: "links", items: [{ label, href: href(a) }] });
      continue;
    }
    if (cls.includes("elementor-widget-text-editor")) {
      if (contact && w.previousElementSibling?.querySelector?.("h5")) continue;
      if (flat(w)) push({ kind: "prose", html: tidy(w.innerHTML) });
      continue;
    }
  }
  // Adjacent prose widgets are one passage.
  return out.reduce((acc, b) => {
    const prev = acc.at(-1);
    if (prev?.kind === "prose" && b.kind === "prose") prev.html += b.html;
    else acc.push(b);
    return acc;
  }, []);
}

/** Every titled section of the page body, in order. */
function sections(main) {
  const body = main.querySelector("#sectioWithLeftMenu") ?? main;
  const seen = new Set();
  const out = [];
  for (const h3 of body.querySelectorAll("h3.elementor-heading-title")) {
    if (h3.closest(".page-left-menu")) continue;
    const box = h3.closest(".e-con-boxed");
    if (!box || seen.has(box)) continue;
    seen.add(box);
    const heads = box.querySelectorAll(".content-right");
    const head = heads[0];
    const more = head?.querySelectorAll("a.elementor-button").find((a) => MORE.test(flat(a)));
    const intro = head?.querySelector(".elementor-widget-text-editor");
    const content = heads.slice(1);
    const bl = content.flatMap((c) => blocks(c, /contact/i.test(flat(h3))));
    out.push({
      id: box.id || undefined,
      heading: flat(h3),
      intro: intro ? tidy(intro.innerHTML) : undefined,
      more: more ? { label: flat(more), href: href(more) } : undefined,
      blocks: bl,
    });
  }
  return out;
}

const profiles = {};
for (const id of IDS) {
  const html = await load(id);
  const main = html && parse(html).querySelector("main");
  if (!main || !main.querySelector("#sectioWithLeftMenu")) {
    console.warn(`skip ${id}: no organisation page at ${LIVE}${id}/`);
    continue;
  }
  const p = { source: `${LIVE}${id}/`, ...hero(main), index: index(main), sections: sections(main) };
  profiles[id] = p;
  console.log(`${id}: ${p.facts.length} figures · ${p.sections.map((s) => `${s.heading}[${s.blocks.map((b) => b.kind).join(",")}]`).join(" · ")}`);
}

/*
 * A body's own pages that the older scrape does not hold (DAF's Ambedkar National
 * Memorial). The profiles link to them, and the DBIM design opens every such link
 * locally, so each is mirrored here: its title and its text, nothing else.
 */
const scraped = new Set(
  JSON.parse(fs.readFileSync(path.join(ROOT, "apps/hub/src/content/website/organisation.json"), "utf8")).map((o) => o.slug),
);
const wanted = new Set();
JSON.stringify(profiles, (k, v) => {
  const m = typeof v === "string" && v.match(/^https?:\/\/(?:www\.)?dosje\.gov\.in\/organisation\/([^?#]+?)\/?(?:[?#].*)?$/);
  if (m && m[1].includes("/") && !scraped.has(m[1])) wanted.add(m[1]);
  return v;
});
const pages = {};
for (const slug of [...wanted].sort()) {
  const html = fromDir ? (fs.existsSync(path.join(fromDir, "pages", `${slug.replace(/\//g, "__")}.html`)) ? fs.readFileSync(path.join(fromDir, "pages", `${slug.replace(/\//g, "__")}.html`), "utf8") : null) : await fetch(`${LIVE}${slug}/`, { headers: { "user-agent": "Mozilla/5.0 (MoSJE mirror)" } }).then((r) => (r.ok ? r.text() : null));
  const main = html && parse(html).querySelector("main");
  if (!main) {
    console.warn(`skip page ${slug}: not on the live site`);
    continue;
  }
  const title = flat(main.querySelector("h1")) || slug.split("/").pop();
  const body = main
    .querySelectorAll(".elementor-widget-text-editor, .elementor-widget-heading h2, .elementor-widget-heading h3, .elementor-widget-heading h4")
    .filter((w) => !w.closest(".page-left-menu") && flat(w) && flat(w) !== title)
    .map((w) => (w.tagName?.match(/^H\d$/) ? `<h3>${flat(w)}</h3>` : tidy(w.innerHTML)))
    .join("");
  if (body) pages[slug] = { source: `${LIVE}${slug}/`, title, html: body };
  console.log(`page ${slug}: ${body.length} characters`);
}

const asOn = new Date().toISOString().slice(0, 10);
fs.writeFileSync(OUT, JSON.stringify({ asOn, profiles, pages }, null, 2) + "\n");
console.log(`wrote ${path.relative(ROOT, OUT)} (${Object.keys(profiles).length} organisations, ${Object.keys(pages).length} extra pages, read ${asOn})`);
