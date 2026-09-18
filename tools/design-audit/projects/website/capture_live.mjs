#!/usr/bin/env node
// Live capture driver for https://www.dosje.gov.in/ — design QC + standards audit
// (DBIM 3.0, GIGW 3.0 / WCAG 2.2 AA, UX4G 3.0).
//
// Provenance: this file produced everything under captures/live/.
//
// Usage (absolute paths; cwd does not matter):
//   node capture_live.mjs pages   [--only slug,slug] [--force] [--viewport desktop|mobile]
//   node capture_live.mjs states  [--only name,name] [--force]
//   node capture_live.mjs links                 # internal href check → _link-check.json
//   node capture_live.mjs records [--per 100]   # attached-file check → _record-files-check.json
//   node capture_live.mjs index                 # rebuild _index.json from what is on disk
//
// Politeness: concurrency ≤3 for browser captures, 4 for HTTP checks, small delays.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const { chromium, devices } = await import("/Users/akashk/Documents/Projects/MoSJE/node_modules/playwright/index.mjs");

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, "captures", "live");
const RUNS = path.join(OUT, "_runs");
const BASE = "https://www.dosje.gov.in";
const AXE_URL = "https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js";
fs.mkdirSync(RUNS, { recursive: true });

const argv = process.argv.slice(2);
const mode = argv[0];
const flag = (n) => argv.includes(`--${n}`);
const opt = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 ? argv[i + 1] : d; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const VIEWPORTS = {
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
  mobile: {
    viewport: { width: 375, height: 812 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true,
    userAgent: devices["iPhone X"].userAgent,
  },
  mobile320: {
    viewport: { width: 320, height: 640 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true,
    userAgent: devices["iPhone X"].userAgent,
  },
};

let AXE_SRC = null;
async function axeSource() {
  if (!AXE_SRC) AXE_SRC = await (await fetch(AXE_URL)).text();
  return AXE_SRC;
}

// The site's UX4G accessibility widget offers Text-To-Speech and can start speaking while the
// keyboard (Tab) walk moves through its controls. Chrome's --mute-audio does not silence the Web
// Speech API (it goes to the OS voice), so speech synthesis is stubbed out in every page context.
// Nothing else changes: the focus walk still records whether a visible focus indicator appears.
const SILENCE_SPEECH = () => {
  try {
    const n = () => {};
    if (window.speechSynthesis) { try { window.speechSynthesis.cancel(); } catch {} window.speechSynthesis.speak = n; window.speechSynthesis.resume = n; window.speechSynthesis.pause = n; }
    window.SpeechSynthesisUtterance = function () {};
    if (window.responsiveVoice) { window.responsiveVoice.speak = n; window.responsiveVoice.enableWindowClickHook = n; }
  } catch {}
};

// The origin rate-limits bursts with HTTP 429. When one worker sees a 429 every worker waits.
let THROTTLE_UNTIL = 0;
const pauseAll = (ms) => { THROTTLE_UNTIL = Math.max(THROTTLE_UNTIL, Date.now() + ms); };
async function waitForThrottle() { while (Date.now() < THROTTLE_UNTIL) await sleep(2000); }

// ---------------------------------------------------------------- page prep
async function prepare(page) {
  await page.evaluate(SILENCE_SPEECH).catch(() => {});
  try { await page.waitForLoadState("networkidle", { timeout: 20000 }); } catch {}
  await sleep(2500);
  await page.evaluate(SILENCE_SPEECH).catch(() => {});
  await declineCookies(page);
  await stopMotion(page);
}

// Cookie / consent banner: least-permissive option ("Reject All" on the MCC banner).
async function declineCookies(page) {
  return page.evaluate(() => {
    const re = /reject|decline|deny|necessary only|only necessary|essential only|refuse/i;
    const direct = document.querySelector("#mcc-btn-reject-all");
    if (direct && direct.checkVisibility()) { direct.click(); return "declined:#mcc-btn-reject-all"; }
    const scopes = [...document.querySelectorAll('#mcc-banner,[class*=cookie i],[id*=cookie i],[class*=consent i],[id*=consent i],[class*=gdpr i],[id*=gdpr i]')];
    for (const s of scopes) {
      const btn = [...s.querySelectorAll("button,a,[role=button]")].find((b) => re.test(b.textContent || "") && b.checkVisibility());
      if (btn) { btn.click(); return "declined:" + (btn.id || btn.textContent.trim()); }
    }
    return null;
  }).catch(() => null);
}

async function stopMotion(page) {
  await page.evaluate(() => {
    document.querySelectorAll(".swiper, .swiper-container, .elementor-swiper, [class*=swiper]").forEach((s) => {
      try { s.swiper?.autoplay?.stop(); } catch {}
    });
    try { window.jQuery?.(".slick-slider").slick?.("slickPause"); } catch {}
    try { document.querySelectorAll(".owl-carousel").forEach((o) => window.jQuery?.(o).trigger("stop.owl.autoplay")); } catch {}
  }).catch(() => {});
}

async function lazyScroll(page) {
  const vh = page.viewportSize().height;
  let y = 0;
  for (let i = 0; i < 80; i++) {
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    if (y >= h) break;
    y += Math.round(vh * 0.8);
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await sleep(250);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  try { await page.waitForLoadState("networkidle", { timeout: 8000 }); } catch {}
  await sleep(1000);
  await stopMotion(page);
}

async function screenshot(page, file, { full = true } = {}) {
  const { width } = page.viewportSize();
  if (!full) {
    await page.screenshot({ path: file, animations: "disabled", timeout: 90000 });
    return;
  }
  const h = await page.evaluate(() => Math.max(document.documentElement.scrollHeight, document.body?.scrollHeight || 0));
  await page.screenshot({ path: file, fullPage: true, clip: { x: 0, y: 0, width, height: h }, animations: "disabled", timeout: 180000 });
}

// ---------------------------------------------------------------- DOM extraction (runs in page)
function extractInPage() {
  const vw = document.documentElement.clientWidth;
  const sx = window.scrollX, sy = window.scrollY;
  const box = (el) => { const r = el.getBoundingClientRect(); return { x: Math.round(r.left + sx), y: Math.round(r.top + sy), w: Math.round(r.width), h: Math.round(r.height) }; };
  const vis = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width <= 0 || r.height <= 0) return false;
    try { return el.checkVisibility({ opacityProperty: true, visibilityProperty: true, contentVisibilityAuto: true }); } catch { return true; }
  };
  const txt = (s, n = 120) => (s || "").replace(/\s+/g, " ").trim().slice(0, n);
  const parseRGB = (c) => {
    const m = /rgba?\(\s*([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)/.exec(c || "");
    if (!m) return null;
    let a = m[4] == null ? 1 : m[4].endsWith("%") ? parseFloat(m[4]) / 100 : parseFloat(m[4]);
    return [+m[1], +m[2], +m[3], a];
  };
  const hex = (c) => c ? "#" + c.slice(0, 3).map((v) => Math.round(v).toString(16).padStart(2, "0")).join("") + (c[3] < 1 ? Math.round(c[3] * 255).toString(16).padStart(2, "0") : "") : null;
  const lum = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
  const blend = (top, bot) => { const a = top[3]; return [top[0] * a + bot[0] * (1 - a), top[1] * a + bot[1] * (1 - a), top[2] * a + bot[2] * (1 - a), 1]; };
  const bgCache = new Map();
  const effBg = (el) => {
    const layers = []; let overImage = false; let e = el;
    while (e && e.nodeType === 1) {
      if (bgCache.has(e) && layers.length === 0) return bgCache.get(e);
      const cs = getComputedStyle(e);
      if (cs.backgroundImage && cs.backgroundImage !== "none") overImage = true;
      const c = parseRGB(cs.backgroundColor);
      if (c && c[3] > 0) { layers.push(c); if (c[3] >= 1) break; }
      e = e.parentElement;
    }
    let base = [255, 255, 255, 1];
    for (let i = layers.length - 1; i >= 0; i--) base = blend(layers[i], base);
    const res = { rgb: base, overImage };
    return res;
  };
  const contrast = (fg, bg) => { if (!fg) return null; const f = fg[3] < 1 ? blend(fg, bg) : fg; const L1 = lum(f), L2 = lum(bg); return Math.round(((Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)) * 100) / 100; };

  const INTERACTIVE = "a[href],button,input:not([type=hidden]),select,textarea,summary,[role=button],[role=link],[role=tab],[role=menuitem],[role=option],[role=checkbox],[role=switch],[tabindex]:not([tabindex='-1'])";
  const all = document.body.querySelectorAll("*");
  const elements = []; const colours = { text: {}, background: {} }; const fonts = {};
  const MAX = 10000; let truncated = false;
  for (const el of all) {
    const tag = el.tagName.toLowerCase();
    if (["script", "style", "noscript", "template", "path", "g", "defs", "use", "clippath", "lineargradient", "stop", "circle", "rect", "polygon", "line", "ellipse", "polyline", "symbol", "mask"].includes(tag)) continue;
    if (tag === "svg" && el.parentElement?.closest("svg")) continue;
    const ownText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    const isCtl = el.matches(INTERACTIVE) || ["img", "svg", "input", "select", "textarea", "button", "a", "video", "iframe"].includes(tag);
    if (!ownText && !isCtl) continue;
    if (!vis(el)) continue;
    if (elements.length >= MAX) { truncated = true; break; }
    const cs = getComputedStyle(el);
    const fg = parseRGB(cs.color);
    const bg = effBg(el);
    const ratio = ownText || tag === "input" || tag === "button" ? contrast(fg, bg.rgb) : null;
    const rec = {
      tag, role: el.getAttribute("role"), id: el.id || undefined, cls: (typeof el.className === "string" ? el.className : "").slice(0, 80) || undefined,
      text: txt(ownText ? el.innerText || el.textContent : el.getAttribute("aria-label") || el.getAttribute("alt") || el.getAttribute("title") || el.innerText || ""),
      bbox: box(el),
      fontFamily: cs.fontFamily, fontSize: cs.fontSize, fontWeight: cs.fontWeight, lineHeight: cs.lineHeight,
      color: hex(fg), background: hex(bg.rgb), overImage: bg.overImage || undefined, contrast: ratio,
      borderRadius: cs.borderRadius, padding: cs.padding, border: cs.borderTopWidth === "0px" && cs.borderBottomWidth === "0px" && cs.borderLeftWidth === "0px" && cs.borderRightWidth === "0px" ? "none" : `${cs.borderTopWidth} ${cs.borderTopStyle} ${hex(parseRGB(cs.borderTopColor))}`,
      interactive: el.matches(INTERACTIVE) || undefined,
      ownText: ownText || undefined,
    };
    elements.push(rec);
    if (ownText) {
      colours.text[rec.color] = (colours.text[rec.color] || 0) + 1;
      colours.background[rec.background] = (colours.background[rec.background] || 0) + 1;
      const fk = `${cs.fontFamily.split(",")[0].replace(/["']/g, "").trim()}|${cs.fontSize}|${cs.fontWeight}`;
      fonts[fk] = (fonts[fk] || 0) + 1;
    }
  }
  const sortObj = (o) => Object.fromEntries(Object.entries(o).sort((a, b) => b[1] - a[1]));

  const headings = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6,[role=heading]")].map((h) => ({
    level: h.getAttribute("aria-level") ? +h.getAttribute("aria-level") : +(h.tagName[1] || 0), text: txt(h.innerText || h.textContent, 200), bbox: box(h), visible: vis(h),
  }));

  const images = [...document.querySelectorAll("img")].map((i) => ({
    src: i.currentSrc || i.src, alt: i.hasAttribute("alt") ? i.getAttribute("alt") : null, bbox: box(i), visible: vis(i),
    naturalWidth: i.naturalWidth, naturalHeight: i.naturalHeight, renderedWidth: Math.round(i.getBoundingClientRect().width),
    decorative: i.getAttribute("alt") === "" || i.getAttribute("aria-hidden") === "true" || ["presentation", "none"].includes(i.getAttribute("role")),
    loading: i.getAttribute("loading"),
  }));

  const host = location.hostname.replace(/^www\./, "");
  const links = [...document.querySelectorAll("a[href]")].map((a) => {
    const label = txt(a.innerText || "") || a.getAttribute("aria-label") || a.querySelector("img[alt]")?.getAttribute("alt") || a.getAttribute("title") || "";
    let internal = false; try { const u = new URL(a.href); internal = u.hostname.replace(/^www\./, "") === host && /^https?:$/.test(u.protocol); } catch {}
    return { href: a.href, rawHref: a.getAttribute("href"), text: txt(a.innerText || a.textContent), bbox: box(a), visible: vis(a), newTab: a.target === "_blank", hasVisibleLabel: !!txt(a.innerText || ""), accessibleName: txt(label), internal };
  });
  const internalHrefs = [...new Set(links.filter((l) => l.internal).map((l) => l.href.split("#")[0]))];

  const targets = { under44: [], under24: [] };
  for (const el of document.querySelectorAll(INTERACTIVE)) {
    if (!vis(el)) continue;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    const inline = cs.display === "inline" && !!el.parentElement?.closest("p,li,td,dd,span");
    const item = { tag: el.tagName.toLowerCase(), text: txt(el.innerText || el.getAttribute("aria-label") || el.value || "", 60), bbox: box(el), inline };
    if (r.width < 44 || r.height < 44) targets.under44.push(item);
    if (r.width < 24 || r.height < 24) targets.under24.push(item);
  }

  const q = (s) => document.querySelector(s);
  const cookieBanner = (() => { const b = q("#mcc-banner"); return b ? { present: true, visible: vis(b), bbox: box(b) } : { present: false }; })();
  const landmarks = {
    header: !!q("header,[role=banner]"), nav: document.querySelectorAll("nav,[role=navigation]").length, main: !!q("main,[role=main]"),
    footer: !!q("footer,[role=contentinfo]"), mainCount: document.querySelectorAll("main,[role=main]").length,
    skipLink: [...document.querySelectorAll("a[href^='#'],button")].filter((a) => /skip/i.test(a.textContent)).map((a) => ({ text: txt(a.textContent), href: a.getAttribute("href"), target: a.getAttribute("href") && a.getAttribute("href").length > 1 ? !!document.getElementById(a.getAttribute("href").slice(1)) : null })),
  };

  // DBIM furniture
  const header = q("header,[data-elementor-type=header],[role=banner]") || document.body;
  const footer = [...document.querySelectorAll("footer,[data-elementor-type=footer],[role=contentinfo]")].sort((a, b) => (b.innerText || "").length - (a.innerText || "").length)[0] || document.body;
  const firstVis = (list) => list.find(vis) || list[0];
  const hit = (el, extra = {}) => el ? { present: true, visible: vis(el), bbox: box(el), text: txt(el.innerText || el.getAttribute("alt") || el.getAttribute("aria-label") || "", 80), href: el.getAttribute?.("href") || undefined, ...extra } : { present: false };
  const byText = (scope, re, sel = "a,button,span,p,div,li,h2,h3,h4,h5,h6,strong") => firstVis([...scope.querySelectorAll(sel)].filter((e) => re.test(e.innerText || e.textContent || "") && ![...e.children].some((c) => re.test(c.innerText || c.textContent || ""))));
  const byHref = (scope, re) => firstVis([...scope.querySelectorAll("a[href]")].filter((a) => re.test(a.href)));
  const dbim = {
    emblem: hit(firstVis([...header.querySelectorAll("img,svg")].filter((i) => /emblem|ashoka|satyamev|national-emblem/i.test((i.getAttribute("src") || "") + (i.getAttribute("alt") || "") + (i.getAttribute("class") || ""))))),
    ministryLockup: hit(byText(header, /Ministry of Social Justice/i)),
    languageToggle: hit(firstVis([...document.querySelectorAll(".bhashini-dropdown-btn,[aria-label*=language i],[class*=lang-switch],[class*=language]")].filter((e) => e.tagName !== "LI")) || byText(header, /हिन्दी|हिंदी|^Hindi$/i)),
    accessibilityControls: hit(firstVis([...document.querySelectorAll("#accessibilityButton,#uw-widget-custom-trigger,[aria-label*=accessib i]")])),
    fontSizeControls: hit(firstVis([...document.querySelectorAll("button,a")].filter((e) => /^A[+-]$|font size|bigger text/i.test(txt(e.textContent) + (e.getAttribute("aria-label") || ""))))),
    contrastControls: hit(firstVis([...document.querySelectorAll("button,a")].filter((e) => /contrast|light-dark|dark mode|invert/i.test(txt(e.textContent) + (e.getAttribute("aria-label") || ""))))),
    search: hit(firstVis([...header.querySelectorAll("input[type=search],input[name=s],.e-search-input,[role=search] input")])),
    footer: {
      websitePolicies: hit(byText(footer, /website polic/i) || byHref(footer, /website-polic/i)),
      copyrightPolicy: hit(byText(footer, /copyright policy/i)),
      hyperlinkingPolicy: hit(byText(footer, /hyperlinking/i)),
      privacyPolicy: hit(byText(footer, /privacy policy/i)),
      termsConditions: hit(byText(footer, /terms/i)),
      help: hit(byText(footer, /^help$/i, "a")),
      feedback: hit(byText(footer, /feedback/i, "a,button")),
      contactUs: hit(byText(footer, /contact us/i, "a")),
      sitemap: hit(byText(footer, /site ?map/i, "a")),
      lastUpdated: hit(byText(footer, /last (updated|reviewed)/i)),
      visitorCounter: hit(byText(footer, /visit(or|s)|hit counter/i)),
      copyright: hit(byText(footer, /©|copyright/i)),
      contentOwnedBy: hit(byText(footer, /owned|content provided/i)),
      designedDevelopedHostedBy: hit(byText(footer, /designed|developed|hosted|powered by/i)),
      accessibilityStatement: hit(byText(footer, /accessibility statement/i, "a")),
    },
    social: [...document.querySelectorAll("a[href]")].filter((a) => /facebook\.com|twitter\.com|x\.com\/|instagram\.com|youtube\.com|whatsapp|linkedin\.com|koo\.in|threads\.net/i.test(a.href)).map((a) => ({ href: a.href, label: a.getAttribute("aria-label") || txt(a.innerText), bbox: box(a), visible: vis(a), newTab: a.target === "_blank" })),
    govLinks: {
      indiaGovIn: [...document.querySelectorAll("a[href]")].filter((a) => /india\.gov\.in/i.test(a.href)).map((a) => ({ href: a.href, text: txt(a.innerText), bbox: box(a), visible: vis(a) })),
      myGov: [...document.querySelectorAll("a[href]")].filter((a) => /mygov\.in/i.test(a.href)).map((a) => ({ href: a.href, text: txt(a.innerText), bbox: box(a), visible: vis(a) })),
      pmIndia: [...document.querySelectorAll("a[href]")].filter((a) => /pmindia\.gov\.in/i.test(a.href)).map((a) => ({ href: a.href, text: txt(a.innerText), bbox: box(a), visible: vis(a) })),
      digitalIndia: [...document.querySelectorAll("a[href]")].filter((a) => /digitalindia\.gov\.in/i.test(a.href)).map((a) => ({ href: a.href, bbox: box(a), visible: vis(a) })),
    },
  };

  // Horizontal overflow
  const de = document.documentElement;
  const overflow = { value: de.scrollWidth > de.clientWidth, scrollWidth: de.scrollWidth, clientWidth: de.clientWidth, culprits: [] };
  if (overflow.value || true) {
    const out = [];
    for (const el of all) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (r.right <= vw + 1 && r.left >= -1) continue;
      const p = el.parentElement; if (p) { const pr = p.getBoundingClientRect(); if (pr.right > vw + 1 || pr.left < -1) continue; }
      let clipped = false; for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) { const o = getComputedStyle(a).overflowX; if (o !== "visible") { clipped = true; break; } }
      if (clipped) continue;
      if (!vis(el)) continue;
      out.push({ tag: el.tagName.toLowerCase(), id: el.id || undefined, cls: (typeof el.className === "string" ? el.className : "").slice(0, 80), bbox: box(el), right: Math.round(r.right) });
      if (out.length >= 40) break;
    }
    overflow.culprits = out;
  }

  const forms = [...document.querySelectorAll("form")].map((f) => ({ id: f.id, cls: f.className.slice(0, 60), action: f.getAttribute("action"), method: f.method, search: f.matches(".e-search-form,[role=search]") || !!f.closest("search"), fields: [...f.elements].filter((e) => e.type !== "hidden").map((e) => ({ tag: e.tagName.toLowerCase(), type: e.type, name: e.name, id: e.id, required: e.required, label: e.labels?.[0] ? txt(e.labels[0].innerText, 60) : e.getAttribute("aria-label") || e.getAttribute("placeholder") })), bbox: box(f), visible: vis(f) }));

  return {
    title: document.title, htmlLang: de.getAttribute("lang"), metaDescription: q("meta[name=description]")?.getAttribute("content") ?? null,
    canonical: q("link[rel=canonical]")?.href ?? null, viewportMeta: q("meta[name=viewport]")?.getAttribute("content") ?? null,
    pageHeight: de.scrollHeight, pageWidth: de.scrollWidth,
    h1: [...document.querySelectorAll("h1")].map((h) => txt(h.innerText || h.textContent, 200)), headings,
    elementCount: elements.length, elementsTruncated: truncated, elements, images, links, internalHrefs, targets, landmarks, dbim,
    colours: { text: sortObj(colours.text), background: sortObj(colours.background) }, fonts: sortObj(fonts),
    horizontalOverflow: overflow, forms, cookieBanner,
  };
}

async function runAxe(page) {
  try {
    const has = await page.evaluate(() => !!window.axe);
    if (!has) await page.addScriptTag({ content: await axeSource() });
    return await page.evaluate(async () => {
      const r = await window.axe.run(document, { resultTypes: ["violations"] });
      const sx = window.scrollX, sy = window.scrollY;
      return {
        version: window.axe.version, passesCount: r.passes?.length, incompleteCount: r.incomplete?.length,
        violations: r.violations.map((v) => ({
          id: v.id, impact: v.impact, help: v.help, helpUrl: v.helpUrl, tags: v.tags,
          nodes: v.nodes.map((n) => {
            let bbox = null;
            try { const sel = n.target.find((t) => typeof t === "string"); const el = sel && document.querySelector(sel); if (el) { const b = el.getBoundingClientRect(); bbox = { x: Math.round(b.left + sx), y: Math.round(b.top + sy), w: Math.round(b.width), h: Math.round(b.height) }; } } catch {}
            return { target: n.target, html: (n.html || "").slice(0, 200), bbox, failureSummary: (n.failureSummary || "").slice(0, 300) };
          }),
        })),
      };
    });
  } catch (e) { return { error: String(e).slice(0, 300) }; }
}

async function focusWalk(page, n = 25) {
  const out = [];
  try {
    await page.evaluate(() => { window.scrollTo(0, 0); document.activeElement?.blur?.(); document.body.focus?.(); });
    await page.mouse.click(1, 1).catch(() => {});
    await page.evaluate(() => document.activeElement?.blur?.());
    for (let i = 0; i < n; i++) {
      await page.keyboard.press("Tab");
      await sleep(150);
      const rec = await page.evaluate(async () => {
        const el = document.activeElement;
        if (!el || el === document.body) return { none: true };
        const pick = (e) => { const c = getComputedStyle(e); return { outline: `${c.outlineStyle} ${c.outlineWidth} ${c.outlineColor}`, outlineOffset: c.outlineOffset, boxShadow: c.boxShadow, border: `${c.borderTopWidth} ${c.borderTopStyle} ${c.borderTopColor}|${c.borderBottomWidth} ${c.borderBottomColor}`, background: c.backgroundColor, color: c.color, textDecoration: c.textDecorationLine }; };
        const focused = pick(el);
        const fv = el.matches(":focus-visible");
        const r = el.getBoundingClientRect();
        const inView = r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth;
        el.blur();
        await new Promise((res) => requestAnimationFrame(() => res()));
        const unfocused = pick(el);
        el.focus({ preventScroll: true });
        const changed = Object.keys(focused).filter((k) => focused[k] !== unfocused[k]);
        const outlineVisible = !/^none/.test(focused.outline) && !/ 0px /.test(focused.outline + " ") && !/rgba\(0, 0, 0, 0\)/.test(focused.outline);
        const indicator = changed.length > 0 && (changed.some((k) => ["outline", "boxShadow", "border", "background", "textDecoration", "color"].includes(k)));
        return {
          tag: el.tagName.toLowerCase(), id: el.id || undefined, text: (el.innerText || el.getAttribute("aria-label") || el.value || "").replace(/\s+/g, " ").trim().slice(0, 80),
          href: el.getAttribute("href") || undefined, bbox: { x: Math.round(r.left + scrollX), y: Math.round(r.top + scrollY), w: Math.round(r.width), h: Math.round(r.height) },
          inViewport: inView, zeroSize: r.width === 0 || r.height === 0, focusVisible: fv, visibleIndicator: indicator && (outlineVisible || changed.some((k) => k !== "outline")), changed, focused, unfocused,
        };
      });
      out.push({ index: i + 1, ...rec });
    }
  } catch (e) { out.push({ error: String(e).slice(0, 300) }); }
  return out;
}

// ---------------------------------------------------------------- one capture
// A PNG interrupted mid-write has no IEND chunk; such a capture must be redone.
function pngComplete(file) {
  try {
    const fd = fs.openSync(file, "r"); const st = fs.fstatSync(fd);
    if (st.size < 16) { fs.closeSync(fd); return false; }
    const buf = Buffer.alloc(8); fs.readSync(fd, buf, 0, 8, st.size - 8); fs.closeSync(fd);
    // The IEND chunk is 12 bytes: length(4) + "IEND"(4) + CRC(4). In the LAST EIGHT bytes the
    // marker therefore sits at 0..4, not 4..8 — reading the CRC instead reported every good
    // capture as truncated.
    return buf.slice(0, 4).toString("latin1") === "IEND";
  } catch { return false; }
}

async function newContext(browser, vpName) {
  const ctx = await browser.newContext({ ...VIEWPORTS[vpName], locale: "en-IN", ignoreHTTPSErrors: true });
  await ctx.addInitScript(SILENCE_SPEECH);
  return ctx;
}

async function capture(browser, { slug, url, vpName, vpLabel = vpName, action = null, full = true, lazy = true, prefix = "", expect404 = false }) {
  const name = `${prefix}${slug}.${vpLabel}`;
  const png = path.join(OUT, `${name}.png`), json = path.join(OUT, `${name}.json`);
  if (!flag("force") && fs.existsSync(json) && pngComplete(png)) {
    try {
      const j = JSON.parse(fs.readFileSync(json, "utf8"));
      if (!j.captureError && j.status === 200 && j.elementCount > 0 && j.throttledRequests === 0) return { slug: prefix + slug, viewport: vpLabel, skipped: true };
    } catch {}
  }
  let lastErr = null;
  // The origin rate-limits bursts with HTTP 429 (seen 2026-09-17 at concurrency 3). A throttled
  // document or sub-request is a transport failure, not the page's state: back off and retry.
  const MAX_ATTEMPTS = 6;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const ctx = await newContext(browser, vpName);
    const page = await ctx.newPage();
    const consoleErrors = [];
    page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text().slice(0, 300)); });
    page.on("pageerror", (e) => consoleErrors.push(`pageerror: ${String(e).slice(0, 300)}`));
    const throttled = [];
    page.on("response", (r) => { if (r.status() === 429 && /dosje\.gov\.in/.test(r.url())) throttled.push(r.url().slice(0, 200)); });
    try {
      await waitForThrottle();
      const t0 = Date.now();
      const resp = await page.goto(url, { waitUntil: "load", timeout: 90000 });
      const status = resp ? resp.status() : null;
      if (status === 429) { pauseAll(60000); throw new Error("THROTTLED 429 document"); }
      if (status && status >= 400 && !/404|this-page-does-not-exist/.test(url) && !expect404) throw new Error(`HTTP ${status}`);
      await prepare(page);
      if (lazy) await lazyScroll(page);
      let stateInfo = null;
      if (action) stateInfo = await action(page, ctx);
      await declineCookies(page);
      await stopMotion(page);
      await screenshot(page, png, { full: stateInfo?.full ?? full });
      if (throttled.length) { pauseAll(60000); if (attempt < MAX_ATTEMPTS) throw new Error(`THROTTLED ${throttled.length} sub-requests`); }
      const dom = await page.evaluate(extractInPage);
      if (!dom.elementCount && attempt < MAX_ATTEMPTS) throw new Error("EMPTY extraction (0 elements)");
      const axe = await runAxe(page);
      const focus = await focusWalk(page);
      const data = {
        slug: prefix + slug, viewport: vpLabel, viewportSize: page.viewportSize(), deviceScaleFactor: VIEWPORTS[vpName].deviceScaleFactor,
        url, finalUrl: page.url(), status, capturedAt: new Date().toISOString(), loadMs: Date.now() - t0, attempt,
        state: stateInfo, consoleErrors, throttledRequests: throttled.length, throttledUrls: throttled.slice(0, 10), ...dom, focus, axe, png: path.basename(png),
      };
      fs.writeFileSync(json, JSON.stringify(data));
      await ctx.close();
      return { slug: prefix + slug, viewport: vpLabel, status, ok: true };
    } catch (e) {
      lastErr = String(e).slice(0, 500);
      await ctx.close().catch(() => {});
      const BACKOFF = [30000, 90000, 240000, 300000, 300000];
      const wait = /THROTTLED|HTTP 4|HTTP 5|EMPTY/.test(lastErr) ? BACKOFF[Math.min(attempt - 1, BACKOFF.length - 1)] : 5000 * attempt;
      console.log(`  retry ${name} in ${wait / 1000}s (attempt ${attempt}: ${lastErr.slice(0, 80)})`);
      await sleep(wait);
    }
  }
  fs.writeFileSync(json, JSON.stringify({ slug: prefix + slug, viewport: vpLabel, url, captureError: lastErr, attempts: MAX_ATTEMPTS, capturedAt: new Date().toISOString() }));
  return { slug: prefix + slug, viewport: vpLabel, ok: false, error: lastErr };
}

async function pool(items, n, fn) {
  const results = []; let i = 0;
  await Promise.all(Array.from({ length: n }, async () => {
    while (i < items.length) { const k = i++; results[k] = await fn(items[k], k); }
  }));
  return results;
}

// ---------------------------------------------------------------- modes
async function modePages() {
  const pages = JSON.parse(fs.readFileSync(path.join(HERE, "inputs", "pages.json"), "utf8"));
  const only = opt("only") ? new Set(opt("only").split(",")) : null;
  const vps = opt("viewport") ? [opt("viewport")] : ["desktop", "mobile"];
  const jobs = [];
  for (const p of pages) { if (only && !only.has(p.slug)) continue; for (const v of vps) jobs.push({ ...p, vpName: v }); }
  const browser = await chromium.launch();
  let done = 0;
  const res = await pool(jobs, +opt("concurrency", 2), async (j) => {
    const r = await capture(browser, { slug: j.slug, url: BASE + j.path, vpName: j.vpName });
    done++; console.log(`[${done}/${jobs.length}] ${j.slug}.${j.vpName} ${r.skipped ? "skip" : r.ok ? r.status : "FAIL " + r.error}`);
    await sleep(r.skipped ? 0 : 2000);
    return r;
  });
  await browser.close();
  fs.writeFileSync(path.join(RUNS, `pages-${Date.now()}.json`), JSON.stringify(res, null, 1));
}

// State actions ---------------------------------------------------------
const clickFirstVisible = async (page, selector) => {
  const loc = page.locator(selector);
  const n = await loc.count();
  for (let i = 0; i < n; i++) { const l = loc.nth(i); if (await l.isVisible()) { await l.click(); return true; } }
  return false;
};

function megaMenuAction(label) {
  return async (page) => {
    await page.evaluate(() => window.scrollTo(0, 0));
    const title = page.locator(".e-n-menu-title", { hasText: label });
    const n = await title.count(); let target = null;
    for (let i = 0; i < n; i++) if (await title.nth(i).isVisible()) { target = title.nth(i); break; }
    if (!target) throw new Error(`menu ${label} not visible`);
    await target.hover(); await sleep(1200);
    let open = await page.evaluate((lab) => [...document.querySelectorAll(".e-n-menu-content > *")].some((c) => c.getBoundingClientRect().height > 20 && c.checkVisibility()), label);
    let method = "hover";
    if (!open) {
      const icon = target.locator(".e-n-menu-dropdown-icon");
      if (await icon.count()) { await icon.first().click(); method = "click-icon"; } else { await target.click(); method = "click"; }
      await sleep(1200);
      open = await page.evaluate(() => [...document.querySelectorAll(".e-n-menu-content > *")].some((c) => c.getBoundingClientRect().height > 20 && c.checkVisibility()));
    }
    return { label, method, open, full: false };
  };
}

async function modeStates() {
  const only = opt("only") ? new Set(opt("only").split(",")) : null;
  const states = [];
  for (const label of ["Department", "Associated Organisations", "Offerings", "Documents", "Events & Gallery", "Connect"]) {
    const slug = "mega-menu-" + label.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-");
    states.push({ slug, url: BASE + "/", vpName: "desktop", lazy: false, action: megaMenuAction(label) });
  }
  states.push({ slug: "mobile-menu-open", url: BASE + "/", vpName: "mobile", lazy: false, action: async (page) => {
    const ok = await clickFirstVisible(page, ".e-n-menu-toggle"); await sleep(1500);
    const expanded = await page.evaluate(() => [...document.querySelectorAll(".e-n-menu-toggle")].map((b) => b.getAttribute("aria-expanded")));
    return { clicked: ok, expanded, full: false };
  } });
  states.push({ slug: "search-scholarship", url: BASE + "/?s=scholarship", vpName: "desktop" });
  states.push({ slug: "search-no-results", url: BASE + "/?s=zzqxv", vpName: "desktop" });
  states.push({ slug: "search-live-dropdown", url: BASE + "/", vpName: "desktop", lazy: false, action: async (page) => {
    const inputs = page.locator(".e-search-input"); let used = false;
    for (let i = 0; i < await inputs.count(); i++) if (await inputs.nth(i).isVisible()) { await inputs.nth(i).click(); await inputs.nth(i).type("scholarship", { delay: 60 }); used = true; break; }
    await sleep(4000);
    return { typed: used, query: "scholarship", full: false };
  } });
  states.push({ slug: "404", url: BASE + "/this-page-does-not-exist-qc/", vpName: "desktop", expect404: true });
  states.push({ slug: "accessibility-panel-open", url: BASE + "/", vpName: "desktop", lazy: false, action: async (page) => {
    let ok = await clickFirstVisible(page, "#accessibilityButton");
    await sleep(1500);
    let open = await page.evaluate(() => { const m = document.querySelector("#uw-main"); return m ? m.getBoundingClientRect().width > 50 && m.checkVisibility() && m.getBoundingClientRect().right > 0 && m.getBoundingClientRect().left < innerWidth : false; });
    if (!open) { ok = await clickFirstVisible(page, "#uw-widget-custom-trigger"); await sleep(1500); open = await page.evaluate(() => !!document.querySelector("#uw-main")?.checkVisibility()); }
    return { clicked: ok, open, full: false };
  } });
  states.push({ slug: "high-contrast-dark", url: BASE + "/", vpName: "desktop", lazy: false, action: async (page) => {
    await clickFirstVisible(page, "#accessibilityButton"); await sleep(1500);
    const ok = await clickFirstVisible(page, "#dark-btn"); await sleep(1500);
    await page.evaluate(() => document.querySelector(".uwaw-close")?.click()); await sleep(800);
    return { option: "UX4G widget 'Light-Dark' (#dark-btn); no dedicated high-contrast toggle offered", clicked: ok, htmlClass: await page.evaluate(() => document.documentElement.className + " | " + document.body.className), full: true };
  } });
  states.push({ slug: "high-contrast-invert", url: BASE + "/", vpName: "desktop", lazy: false, action: async (page) => {
    await clickFirstVisible(page, "#accessibilityButton"); await sleep(1500);
    const ok = await clickFirstVisible(page, "#btn-invert"); await sleep(1500);
    await page.evaluate(() => document.querySelector(".uwaw-close")?.click()); await sleep(800);
    return { option: "UX4G widget 'Invert Colors' (#btn-invert)", clicked: ok, full: true };
  } });
  states.push({ slug: "home-hindi", url: BASE + "/", vpName: "desktop", lazy: false, action: async (page) => {
    await clickFirstVisible(page, ".bhashini-dropdown-btn"); await sleep(1000);
    const ok = await clickFirstVisible(page, "#bhashini-translation .language-option[data-value=hi], .language-option[data-value=hi]");
    for (let i = 0; i < 15; i++) { await sleep(2000); const hasDeva = await page.evaluate(() => (document.querySelector("main,#content")?.innerText.match(/[ऀ-ॿ]/g) || []).length); if (hasDeva > 200) break; }
    try { await page.waitForLoadState("networkidle", { timeout: 15000 }); } catch {}
    await sleep(2000);
    await lazyScroll(page);
    await sleep(4000);
    const devanagariChars = await page.evaluate(() => (document.body.innerText.match(/[ऀ-ॿ]/g) || []).length);
    return { clicked: ok, language: "hi (Bhashini)", devanagariChars, full: true };
  } });
  states.push({ slug: "annual-reports-filtered", url: BASE + "/annual-reports/", vpName: "desktop", lazy: false, action: async (page) => {
    const opts = await page.evaluate(() => [...(document.querySelector("#yearFilter")?.options || [])].map((o) => o.value).filter(Boolean));
    const year = opts.includes("2024") ? "2024" : opts[1] || opts[0];
    await page.locator("#yearFilter").first().selectOption(year).catch(() => {});
    await sleep(1000);
    try { await page.waitForLoadState("networkidle", { timeout: 15000 }); } catch {}
    await sleep(2000);
    return { filter: "yearFilter", value: year, url: page.url(), full: true };
  } });
  states.push({ slug: "tenders-page-2", url: BASE + "/tenders/", vpName: "desktop", lazy: false, action: async (page) => {
    const before = await page.evaluate(() => document.querySelector("main,#content")?.innerText.slice(0, 400));
    const pg = page.locator("a,button", { hasText: /^\s*2\s*$/ });
    let ok = false;
    for (let i = 0; i < await pg.count(); i++) if (await pg.nth(i).isVisible()) { await pg.nth(i).scrollIntoViewIfNeeded(); await pg.nth(i).click(); ok = true; break; }
    await sleep(1500); try { await page.waitForLoadState("networkidle", { timeout: 15000 }); } catch {}
    await sleep(1500);
    const after = await page.evaluate(() => document.querySelector("main,#content")?.innerText.slice(0, 400));
    await page.evaluate(() => window.scrollTo(0, 0));
    return { clicked: ok, contentChanged: before !== after, url: page.url(), full: true };
  } });
  // The Gallery listing is tabbed (Photos 861 / Videos 140 / News 60) and its photo cards link to
  // /events/… pages, not to the /gallery/<slug>/ album pages the sitemap publishes. Capture what a
  // citizen actually reaches: each tab, and the page a card opens.
  // The Gallery listing was rebuilt on the live site during this audit (18 Sep): the Photos /
  // Videos / News tabs became category pills, and the cards are not links. Capture what a citizen
  // reaches now: a category filter, and whatever a card click opens.
  states.push({ slug: "gallery-category-filter", url: BASE + "/gallery/", vpName: "desktop", lazy: false, action: async (page) => {
    const picked = await page.evaluate(() => {
      const pills = [...document.querySelectorAll(".gallery-cat-pill, [class*=cat-pill], button")].filter((b) => b.checkVisibility?.() && /\d/.test(b.innerText) && !/all\s*\d/i.test(b.innerText));
      const p = pills.find((b) => !/\b0\b\s*$/.test(b.innerText.trim())) || pills[0];
      if (!p) return null; p.click(); return p.innerText.trim().slice(0, 40);
    });
    await sleep(2500);
    return { pill: picked, full: true };
  } });
  states.push({ slug: "gallery-card-opens", url: BASE + "/gallery/", vpName: "desktop", lazy: true, action: async (page) => {
    const before = page.url();
    const info = await page.evaluate(() => {
      const cards = [...document.querySelectorAll("[class*=gallery-card], [class*=card]")].filter((e) => e.checkVisibility?.() && e.getBoundingClientRect().width > 180 && e.getBoundingClientRect().height > 140);
      const c = cards[0];
      if (!c) return null;
      const a = c.closest("a") || c.querySelector("a");
      const r = c.getBoundingClientRect();
      c.scrollIntoView({ block: "center" });
      return { tag: c.tagName, cls: c.className.toString().slice(0, 60), isLink: !!a, href: a?.href || null,
               tabindex: c.getAttribute("tabindex"), role: c.getAttribute("role"),
               x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) };
    });
    if (!info) throw new Error("no gallery card found");
    await sleep(600);
    try { await page.mouse.click(info.x, Math.max(40, Math.min(860, info.y))); } catch {}
    await sleep(2500);
    return { card: info, urlBefore: before, urlAfter: page.url(), keyboardReachable: info.isLink || info.tabindex != null, full: true };
  } });
  states.push({ slug: "gallery-lightbox", url: BASE + "/gallery/", vpName: "desktop", lazy: false, action: async (page) => {
    const ok = await clickFirstVisible(page, ".gallery-zoom-trigger, [data-fancybox]");
    await sleep(3000);
    const open = await page.evaluate(() => !!document.querySelector(".fancybox__container"));
    return { clicked: ok, open, full: false };
  } });
  states.push({ slug: "events-listing", url: BASE + "/events/", vpName: "desktop" });
  states.push({ slug: "event-detail", url: BASE + "/events/", vpName: "desktop", lazy: false, action: async (page) => {
    const href = await page.evaluate(() => [...document.querySelectorAll("a[href*='/events/']")].map((a) => a.href).find((h) => /\/events\/[^/?#]+\/?$/.test(h) && !/\/events\/?$/.test(h)));
    if (!href) throw new Error("no event link found");
    await page.goto(href, { waitUntil: "load", timeout: 90000 });
    await prepare(page); await lazyScroll(page);
    return { event: href, full: true };
  } });
  states.push({ slug: "important-links-modal", url: BASE + "/", vpName: "desktop", lazy: false, action: async (page) => {
    const ok = await clickFirstVisible(page, ".important-link-btn"); await sleep(1500);
    const open = await page.evaluate(() => !!document.querySelector("#exampleModal.show"));
    return { note: "No 'Latest Updates' side sheet exists; the right-wall 'Important Links' modal is the closest sheet. What's New is an inline ticker (see whats-new-ticker-paused).", clicked: ok, open, full: false };
  } });
  states.push({ slug: "whats-new-ticker-paused", url: BASE + "/", vpName: "desktop", lazy: false, action: async (page) => {
    const loc = page.locator(".mosje-whats-new").first(); await loc.scrollIntoViewIfNeeded();
    const ok = await clickFirstVisible(page, ".wn-toggle"); await sleep(800);
    const pressed = await page.evaluate(() => document.querySelector(".wn-toggle")?.getAttribute("aria-pressed"));
    return { clicked: ok, ariaPressed: pressed, full: false };
  } });
  states.push({ slug: "form-empty-submit-validation", url: BASE + "/contact-us/", vpName: "desktop", lazy: false, action: async (page) => {
    // Only a form whose empty submit is blocked client-side is exercised. Search/filter forms are not feedback forms.
    const info = await page.evaluate(() => {
      const f = [...document.querySelectorAll("form")].find((f) => !f.matches(".e-search-form") && !f.closest("search") && (f.method === "post" || f.querySelector("textarea,input[type=email],input[type=tel]")));
      if (!f) return { found: false };
      return { found: true, blocksEmpty: !f.noValidate && !f.checkValidity(), id: f.id };
    });
    if (info.found && info.blocksEmpty) {
      await page.evaluate(() => { const f = [...document.querySelectorAll("form")].find((f) => !f.matches(".e-search-form") && (f.method === "post" || f.querySelector("textarea,input[type=email],input[type=tel]"))); f.querySelector("[type=submit],button:not([type])")?.click(); });
      await sleep(1500);
    }
    return { ...info, skipped: !(info.found && info.blocksEmpty), reason: !info.found ? "No feedback/contact form on /contact-us/ (contact details only); no departmental feedback form found on the site. Bhashini feedback widget is a third-party service and was not exercised." : undefined, full: true };
  } });
  states.push({ slug: "home-320", url: BASE + "/", vpName: "mobile320", vpLabel: "mobile320" });

  const jobs = states.filter((s) => !only || only.has(s.slug));
  const browser = await chromium.launch();
  let done = 0;
  const res = await pool(jobs, +opt("concurrency", 1), async (s) => {
    const r = await capture(browser, { ...s, vpLabel: s.vpLabel || s.vpName, prefix: "state--" });
    done++; console.log(`[${done}/${jobs.length}] state--${s.slug} ${r.skipped ? "skip" : r.ok ? r.status : "FAIL " + r.error}`);
    await sleep(800);
    return r;
  });
  await browser.close();
  fs.writeFileSync(path.join(RUNS, `states-${Date.now()}.json`), JSON.stringify(res, null, 1));
}

async function httpCheck(url, opts = {}) {
  for (let a = 1; a <= 6; a++) {
    const r = await httpCheckOnce(url, opts);
    if (r.status !== 429) return { ...r, attempts: a };
    await sleep(30000 * a);
  }
  return { status: 429, error: "rate limited after 6 attempts" };
}

async function httpCheckOnce(url, { method = "HEAD" } = {}) {
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 30000);
  try {
    let r = await fetch(url, { method, redirect: "follow", signal: ctl.signal, headers: { "user-agent": "Mozilla/5.0 (MoSJE design QC link check)" } });
    if (method === "HEAD" && (r.status === 405 || r.status === 403 || r.status === 400 || r.status >= 500)) {
      r = await fetch(url, { method: "GET", redirect: "follow", signal: ctl.signal, headers: { "user-agent": "Mozilla/5.0 (MoSJE design QC link check)", range: "bytes=0-1023" } });
      try { await r.body?.cancel(); } catch {}
    }
    return { status: r.status, finalUrl: r.url, redirected: r.redirected, contentType: r.headers.get("content-type"), contentLength: r.headers.get("content-length") };
  } catch (e) { return { status: null, error: String(e.cause?.code || e.name || e).slice(0, 120) }; }
  finally { clearTimeout(t); }
}

async function modeLinks() {
  const map = new Map();
  for (const f of fs.readdirSync(OUT)) {
    if (!f.endsWith(".json") || f.startsWith("_")) continue;
    let j; try { j = JSON.parse(fs.readFileSync(path.join(OUT, f), "utf8")); } catch { continue; }
    for (const h of j.internalHrefs || []) {
      if (!/^https?:/.test(h)) continue;
      if (!map.has(h)) map.set(h, new Set());
      map.get(h).add(j.slug);
    }
  }
  const urls = [...map.keys()].sort();
  console.log(`checking ${urls.length} internal URLs`);
  let n = 0;
  const results = await pool(urls, +opt("concurrency", 2), async (u) => {
    let r = await httpCheck(u);
    if (r.status == null || r.status >= 500) { await sleep(2000); r = await httpCheck(u); }
    if (++n % 50 === 0) console.log(n);
    await sleep(600);
    return { url: u, ...r, linkedFrom: [...map.get(u)].sort() };
  });
  const summary = { total: results.length, ok2xx: 0, redirects: 0, c4xx: 0, c5xx: 0, errors: 0 };
  for (const r of results) { if (r.status == null) summary.errors++; else if (r.status >= 500) summary.c5xx++; else if (r.status >= 400) summary.c4xx++; else summary.ok2xx++; if (r.redirected) summary.redirects++; }
  fs.writeFileSync(path.join(OUT, "_link-check.json"), JSON.stringify({ checkedAt: new Date().toISOString(), method: "HEAD, falling back to ranged GET on 400/403/405/5xx; redirects followed; fragments stripped", summary, broken: results.filter((r) => r.status == null || r.status >= 400), results }, null, 1));
  console.log(summary);
}

async function modeRecords() {
  const per = +opt("per", 100);
  const rows = fs.readFileSync(path.join(HERE, "inputs", "live-sitemap.tsv"), "utf8").trim().split("\n").map((l) => l.split("\t")).filter((r) => r[0] && r[1] && r[0] !== "page");
  const byType = {};
  for (const [t, u] of rows) (byType[t] ||= []).push(u);
  // Deterministic seeded sample so the check is reproducible.
  let seed = 20260917; const rnd = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
  const sample = [];
  for (const [t, list] of Object.entries(byType)) {
    const copy = [...list]; for (let i = copy.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]]; }
    for (const u of copy.slice(0, per)) sample.push({ type: t, url: u });
  }
  console.log(`records sampled: ${sample.length}`);
  const FILE_RE = /\.(pdf|docx?|xlsx?|pptx?|zip|rar|odt|ods|csv|txt|mp4|jpe?g|png)(\?[^"']*)?$/i;
  let n = 0;
  const results = await pool(sample, +opt("concurrency", 2), async (s) => {
    const rec = { ...s };
    try {
      const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 400000);
      let r;
      for (let a = 1; a <= 6; a++) {
        r = await fetch(s.url, { redirect: "follow", signal: ctl.signal, headers: { "user-agent": "Mozilla/5.0 (MoSJE design QC record check)" } });
        if (r.status !== 429) break;
        await sleep(30000 * a);
      }
      clearTimeout(t);
      rec.pageStatus = r.status; rec.finalUrl = r.url;
      let html = await r.text();
      html = html.replace(/<header[\s\S]*?<\/header>/gi, "").replace(/<footer[\s\S]*?<\/footer>/gi, "").replace(/<script[\s\S]*?<\/script>/gi, "");
      const hrefs = [...html.matchAll(/(?:href|src|data-src|data)\s*=\s*["']([^"']+)["']/gi)].map((m) => m[1].replace(/&amp;/g, "&"));
      const abs = [...new Set(hrefs.map((h) => { try { return new URL(h, s.url).href; } catch { return null; } }).filter(Boolean))];
      const docs = abs.filter((h) => /\.(pdf|docx?|xlsx?|pptx?|zip|rar|odt|ods|csv)(\?|$)/i.test(h));
      const media = abs.filter((h) => FILE_RE.test(h) && !docs.includes(h) && /cloudfront|wp-content\/uploads|\/events\/|\/gallery\//i.test(h) && !/logo|emblem|icon|flag|favicon/i.test(h));
      const files = docs.length ? docs.slice(0, 5) : media.slice(0, 3);
      rec.fileKind = docs.length ? "document" : media.length ? "media" : "none";
      rec.fileCount = docs.length || media.length;
      rec.files = [];
      for (const f of files) rec.files.push({ url: f, ...(await httpCheck(f)) });
      rec.allFilesResolve = rec.files.length ? rec.files.every((f) => f.status && f.status < 400) : null;
    } catch (e) { rec.error = String(e.cause?.code || e.name || e).slice(0, 160); }
    if (++n % 50 === 0) console.log(n);
    await sleep(600);
    return rec;
  });
  const summary = {};
  for (const r of results) {
    const s = (summary[r.type] ||= { sampled: 0, pageErrors: 0, noFileLink: 0, withFiles: 0, filesChecked: 0, files4xx: 0, files5xx: 0, fileErrors: 0 });
    s.sampled++;
    if (r.error || !r.pageStatus || r.pageStatus >= 400) s.pageErrors++;
    if (r.fileKind === "none") s.noFileLink++; else if (r.fileKind) s.withFiles++;
    for (const f of r.files || []) { s.filesChecked++; if (f.status == null) s.fileErrors++; else if (f.status >= 500) s.files5xx++; else if (f.status >= 400) s.files4xx++; }
  }
  fs.writeFileSync(path.join(OUT, "_record-files-check.json"), JSON.stringify({ checkedAt: new Date().toISOString(), perType: per, seed: 20260917, method: "GET detail page (static HTML, header/footer stripped); document links (pdf/doc/xls/ppt/zip/csv) checked with HEAD→ranged GET; where none, up to 3 body media files", summary, failures: results.filter((r) => r.error || (r.pageStatus >= 400) || r.allFilesResolve === false), results }, null, 1));
  console.log(summary);
}

function modeIndex() {
  const entries = [];
  for (const f of fs.readdirSync(OUT).sort()) {
    if (!f.endsWith(".json") || f.startsWith("_")) continue;
    let j; try { j = JSON.parse(fs.readFileSync(path.join(OUT, f), "utf8")); } catch (e) { entries.push({ json: f, errors: ["unreadable json"] }); continue; }
    const png = f.replace(/\.json$/, ".png");
    const errors = [];
    if (j.captureError) errors.push(j.captureError);
    if (j.status && j.status >= 400) errors.push(`HTTP ${j.status}`);
    if (!fs.existsSync(path.join(OUT, png))) errors.push("png missing");
    if (j.axe?.error) errors.push(`axe: ${j.axe.error}`);
    if (j.elementCount === 0) errors.push("empty extraction (0 elements)");
    if (j.throttledRequests > 0) errors.push(`${j.throttledRequests} rate-limited sub-requests`);
    if (!j.captureError && !pngComplete(path.join(OUT, png))) errors.push("png incomplete");
    entries.push({
      slug: j.slug, viewport: j.viewport, kind: j.slug?.startsWith("state--") ? "state" : "page", url: j.url, finalUrl: j.finalUrl, status: j.status ?? null,
      png: fs.existsSync(path.join(OUT, png)) ? png : null, json: f, pageHeight: j.pageHeight, consoleErrors: j.consoleErrors?.length ?? null,
      axeViolations: j.axe?.violations?.length ?? null, elementCount: j.elementCount ?? null, throttledRequests: j.throttledRequests ?? null, state: j.state ?? undefined, errors,
    });
  }
  const summary = {
    total: entries.length,
    pagesDesktop: entries.filter((e) => e.kind === "page" && e.viewport === "desktop" && !e.errors.some((x) => !/^HTTP/.test(x))).length,
    pagesMobile: entries.filter((e) => e.kind === "page" && e.viewport === "mobile" && !e.errors.some((x) => !/^HTTP/.test(x))).length,
    states: entries.filter((e) => e.kind === "state").length,
    failures: entries.filter((e) => e.errors.length).map((e) => ({ slug: e.slug, viewport: e.viewport, errors: e.errors })),
  };
  fs.writeFileSync(path.join(OUT, "_index.json"), JSON.stringify({ generatedAt: new Date().toISOString(), base: BASE, driver: "capture_live.mjs", summary, captures: entries }, null, 1));
  console.log(JSON.stringify(summary, null, 1));
}

const MODES = { pages: modePages, states: modeStates, links: modeLinks, records: modeRecords, index: modeIndex };
if (!MODES[mode]) { console.error(`mode must be one of ${Object.keys(MODES).join(", ")}`); process.exit(2); }
await MODES[mode]();
