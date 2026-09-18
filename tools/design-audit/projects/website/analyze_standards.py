#!/usr/bin/env python3
"""Turn every live capture extraction into measured standards findings.

One rule per checkpoint, each emitting the element's real bounding box and a label carrying the
MEASURED value ("#E2E6EA on #0373DF = 3.70:1 at 14px · needs 4.5:1"), which is what the report's
mark annotation draws. Nothing here is a judgement call: a rule either measures a breach or is
silent. Judgement findings (right component? hierarchy? icon metaphor?) are authored separately.

  python3 analyze_standards.py            # writes out/findings-auto.json + out/standards-rollup.json
"""
import json, os, glob, re, collections

BASE = os.path.dirname(os.path.abspath(__file__))
LIVE = os.path.join(BASE, "captures", "live")
OUT = os.path.join(BASE, "out")
os.makedirs(OUT, exist_ok=True)

UX4G_SCALE = {12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 52, 60}
DBIM_ICON_SIZES = {24, 32, 48, 64}
# DBIM 5.6 mandates four footer sections; the prior audit (2026-09-10, Observation K) found none.
DBIM_FOOTER_SECTIONS = ["archives", "websitePolicies", "relatedLinks", "feedback"]
UX4G_VIOLET = {"#613af5", "#392095", "#faefff"}

# ---------------------------------------------------------------- colour maths


def _parse_colour(c):
    """'#rrggbb' / '#rrggbbaa' / 'rgb(a)(...)' -> (r, g, b, a) or None."""
    if not c:
        return None
    c = c.strip().lower()
    m = re.match(r"^#([0-9a-f]{6})([0-9a-f]{2})?$", c)
    if m:
        h = m.group(1)
        a = int(m.group(2), 16) / 255 if m.group(2) else 1.0
        return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), a)
    m = re.match(r"^rgba?\(([^)]+)\)$", c)
    if m:
        p = [x.strip() for x in m.group(1).replace("/", " ").split(",")]
        if len(p) >= 3:
            try:
                return (float(p[0]), float(p[1]), float(p[2]), float(p[3]) if len(p) > 3 else 1.0)
            except ValueError:
                return None
    return None


def _hex(c):
    p = _parse_colour(c)
    return "#%02X%02X%02X" % (int(p[0]), int(p[1]), int(p[2])) if p else (c or "?")


def _over(fg, bg):
    """Composite fg over bg by fg's alpha."""
    a = fg[3]
    return tuple(fg[i] * a + bg[i] * (1 - a) for i in range(3)) + (1.0,)


def _lum(c):
    def ch(v):
        v = v / 255
        return v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
    return 0.2126 * ch(c[0]) + 0.7152 * ch(c[1]) + 0.0722 * ch(c[2])


def contrast(fg, bg):
    f, b = _parse_colour(fg), _parse_colour(bg)
    if not f or not b:
        return None
    if b[3] < 1:
        b = _over(b, (255, 255, 255, 1.0))
    if f[3] < 1:
        f = _over(f, b)
    l1, l2 = _lum(f), _lum(b)
    hi, lo = max(l1, l2), min(l1, l2)
    return round((hi + 0.05) / (lo + 0.05), 2)


def _px(v):
    try:
        return float(str(v).replace("px", ""))
    except (TypeError, ValueError):
        return None


# The off-canvas cutoff is the viewport's own width: the accessibility widget parks its panel to
# the right of the page at 1970px on desktop and ~980px on a phone. Set per capture in analyse().
OFFCANVAS_X = 1440


def _box(b):
    if not b:
        return None
    x, y, w, h = b.get("x", 0), b.get("y", 0), b.get("w", 0), b.get("h", 0)
    if w <= 0 or h <= 0:
        return None
    if x >= OFFCANVAS_X:
        return None                 # off-canvas (closed widget panel) — audited in its open state
    return [round(x), round(y), round(x + w), round(y + h)]


def _short(t, n=44):
    t = re.sub(r"\s+", " ", (t or "")).strip()
    return (t[: n - 1] + "…") if len(t) > n else t


def dedupe(out, cap=3):
    """One finding per distinct measurement per page, worst first — repetition is carried by the
    Global grouping, not by 40 copies of the same row."""
    seen, keep = set(), []
    for f in sorted(out, key=lambda f: ["Blocker", "Major", "Minor", "Nit"].index(f["severity"])):
        k = f.get("key")
        if k in seen:
            continue
        seen.add(k)
        keep.append(f)
        if len(keep) >= cap:
            break
    return keep


# ---------------------------------------------------------------- the rules

RULES = {}


def rule(code, standard, clause, axis, severity, title):
    def deco(fn):
        RULES[code] = dict(code=code, standard=standard, clause=clause, axis=axis,
                           severity=severity, title=title, fn=fn)
        return fn
    return deco


def F(code, box, label, element, detail, severity=None, **kw):
    r = RULES[code]
    return dict(code=code, standard=r["standard"], clause=r["clause"], axis=r["axis"],
                severity=severity or r["severity"], title=r["title"], element=element,
                box=box, label=label, detail=detail, **kw)


@rule("A-CONTRAST", "GIGW/WCAG 2.2 AA", "1.4.3", "Color & Token", "Blocker",
      "Text contrast below AA")
def r_contrast(d):
    out = []
    for e in d.get("elements", []):
        if not (e.get("text") or "").strip():
            continue
        size = _px(e.get("fontSize")) or 0
        weight = int(str(e.get("fontWeight") or "400").replace("bold", "700") or 400) if str(
            e.get("fontWeight", "")).isdigit() else 400
        large = size >= 24 or (size >= 18.66 and weight >= 700)
        # A label that cannot physically fit its own box is not painted as text: the control shows
        # an icon and carries the words as its accessible name. WCAG judges that under 1.4.11
        # (3:1 for a UI component), not 1.4.3. Verified on the language toggle, 2026-09-18.
        bb = e.get("bbox") or {}
        est_w = len((e.get("text") or "")) * size * 0.5
        icon_like = bool(bb.get("w")) and est_w > bb["w"] * 1.6
        need = 3.0 if (large or icon_like) else 4.5
        if e.get("overImage"):
            continue           # background is an image: a CSS-only ratio would be a guess, not a measurement
        ratio = e.get("contrast")
        if ratio is None:
            ratio = contrast(e.get("color"), e.get("background"))
        if ratio is None or ratio >= need:
            continue
        b = _box(e.get("bbox"))
        if not b:
            continue
        code = "A-CONTRAST-NONTEXT" if icon_like else "A-CONTRAST"
        out.append(F(code, b,
                     f"{_hex(e.get('color'))} on {_hex(e.get('background'))} = {ratio}:1 at "
                     f"{int(size)}px · needs {need}:1 · FAIL" if not icon_like else
                     f"{_hex(e.get('color'))} on {_hex(e.get('background'))} = {ratio}:1 · icon "
                     f"control · needs {need}:1 · FAIL",
                     _short(e.get("text")) or e.get("tag", "text"),
                     f"Text “{_short(e.get('text'), 70)}” ({e.get('tag')}"
                     f"{'.' + e['cls'].split()[0] if e.get('cls') else ''}) renders "
                     f"{_hex(e.get('color'))} on {_hex(e.get('background'))} at {int(size)}px/"
                     f"{e.get('fontWeight')} — {ratio}:1 against the {need}:1 AA minimum."
                     + (" The label is not painted as text (it does not fit the control's box), so "
                        "this is judged as a non-text control under WCAG 1.4.11." if icon_like else ""),
                     severity="Blocker" if ratio < need * 0.7 else "Major",
                     key=f"{_hex(e.get('color'))}|{_hex(e.get('background'))}|{int(size)}",
                     cssFg=_hex(e.get("color")), cssBg=_hex(e.get("background"))))
    return dedupe(out, 4)


@rule("A-CONTRAST-NONTEXT", "GIGW/WCAG 2.2 AA", "1.4.11", "Color & Token", "Major",
      "Non-text control below 3:1")
def _r_contrast_nontext_placeholder(d):
    """Populated from r_contrast: a control whose label cannot physically render inside its box is
    an ICON with an accessible name, judged under 1.4.11 (3:1), not 1.4.3 (4.5:1)."""
    return []


@rule("A-ALT", "GIGW/WCAG 2.2 A", "1.1.1", "Content & Iconography", "Major",
      "Image carries no alt attribute")
def r_alt(d):
    out = []
    for im in d.get("images", []):
        if not im.get("visible"):
            continue
        if im.get("alt") is not None:
            continue
        b = _box(im.get("bbox"))
        if not b:
            continue
        src = (im.get("src") or "").split("/")[-1]
        out.append(F("A-ALT", b, f"No alt attribute · {src[:40]}", src,
                     f"“{src}” renders at {im.get('renderedWidth')}px wide with no alt attribute. "
                     f"A screen reader announces the file name instead of the content.",
                     key="alt"))
    return dedupe(out, 3)


# A-FOCUS lived here until 2026-09-18. It compared an element's outline / box-shadow / border /
# background / colour focused vs unfocused, and called "no change" a missing indicator — which was
# wrong on the first Tab stop of every page ("Open the accessibility option" is invisible until
# focused and then shows a 4px ring). Focus is now judged on PIXELS by verify_focus.mjs +
# verify_focus.py, and focus_findings.py turns those verdicts into findings.


@rule("A-TARGET", "UX4G 3.0 §6 / WCAG 2.5.8", "2.5.8", "Layout & Spacing", "Major",
      "Touch target below the minimum")
def r_target(d):
    out = []
    for t in (d.get("targets") or {}).get("under44", []):
        b = _box(t.get("bbox"))
        if not b:
            continue
        w, h = b[2] - b[0], b[3] - b[1]
        if t.get("inline"):
            continue
        label = (t.get("text") or "").strip()
        if t.get("tag") == "a" and len(label) > 28:
            continue          # a long text link in prose is exempt (WCAG 2.5.8 inline exception)
        wcag_fail = w < 24 or h < 24
        out.append(F("A-TARGET", b,
                     f"Target {w}×{h}px · UX4G needs 44×44"
                     + (" · WCAG 2.5.8 needs 24×24 · FAIL" if wcag_fail else ""),
                     _short(t.get("text")) or t.get("tag"),
                     f"“{_short(t.get('text'), 60) or t.get('tag')}” is {w}×{h}px. UX4G 3.0 §6 sets "
                     f"44×44px as the minimum interactive size"
                     + (f"; at {w}×{h} it is also below the WCAG 2.5.8 AA floor of 24×24."
                        if wcag_fail else "; WCAG 2.5.8's 24×24 floor is met."),
                     severity="Major" if wcag_fail else "Minor",
                     key=f"target-{w}x{h}-{_short(label, 20)}"))
    return dedupe(out, 4)


@rule("A-H1", "GIGW/WCAG 2.2 A", "1.3.1", "Content & Iconography", "Major",
      "Page has no <h1> / more than one")
def r_h1(d):
    h1 = [h for h in d.get("headings", []) if h.get("level") == 1 and h.get("visible")]
    if len(h1) == 1:
        return []
    first = next((h for h in d.get("headings", []) if h.get("visible")), None)
    b = _box((first or {}).get("bbox")) or [0, 0, 1440, 200]
    if not h1:
        return [F("A-H1", b, "No <h1> on this page · WCAG 1.3.1", "page title",
                  "The page renders no <h1>. The first visible heading is "
                  f"<h{(first or {}).get('level')}> “{_short((first or {}).get('text'), 60)}”.",
                  key="h1-missing")]
    return [F("A-H1", _box(h1[1]["bbox"]) or b, f"{len(h1)} <h1> elements on one page",
              _short(h1[1].get("text")),
              f"The page renders {len(h1)} <h1> elements: "
              + "; ".join('“%s”' % _short(h.get("text"), 40) for h in h1[:4]) + ".",
              key="h1-multiple")]


@rule("A-HEADING-ORDER", "GIGW/WCAG 2.2 A", "1.3.1", "Content & Iconography", "Major",
      "Heading levels skip")
def r_heading_order(d):
    hs = [h for h in d.get("headings", []) if h.get("visible")]
    out, prev = [], 0
    for h in hs:
        lvl = h.get("level") or 0
        if prev and lvl > prev + 1:
            b = _box(h.get("bbox"))
            if b:
                out.append(F("A-HEADING-ORDER", b,
                             f"<h{prev}> → <h{lvl}> · skips h{prev + 1}",
                             _short(h.get("text")),
                             f"“{_short(h.get('text'), 60)}” is an <h{lvl}> directly after an "
                             f"<h{prev}>, skipping h{prev + 1}. The outline cannot be navigated "
                             f"reliably by a screen reader.", key="heading-order"))
        prev = lvl or prev
    return out[:3]


@rule("A-LANG", "GIGW 3.0 / WCAG 3.1.1", "3.1.1", "Content & Iconography", "Minor",
      "Page language is not en-IN")
def r_lang(d):
    lang = d.get("htmlLang")
    if lang == "en-IN":
        return []
    return [F("A-LANG", None, f"<html lang=\"{lang}\"> · should be en-IN",
              "html lang",
              f"The document declares lang=\"{lang}\" on a Government of India property; "
              f"en-IN is the correct locale.", key="lang")]


@rule("A-AXE", "GIGW/WCAG 2.2", "axe-core", "Accessibility", "Major",
      "Automated accessibility violation")
def r_axe(d):
    out = []
    sev = {"critical": "Blocker", "serious": "Major", "moderate": "Minor", "minor": "Nit"}
    for v in (d.get("axe") or {}).get("violations", []):
        if v["id"] in ("color-contrast", "image-alt"):     # measured precisely by our own rules
            continue
        for n in v.get("nodes", [])[:2]:
            b = _box(n.get("bbox"))
            if not b:
                continue
            out.append(F("A-AXE", b, f"{v['id']} · {v.get('impact')} · {v['help']}"[:110],
                         v["id"],
                         f"{v['help']} — {n.get('html', '')[:160]} ({v['id']}, "
                         f"{', '.join(t for t in v.get('tags', []) if t.startswith('wcag'))}).",
                         severity=sev.get(v.get("impact"), "Minor"), key=v["id"]))
    return dedupe(out, 6)


@rule("U-TYPE-SCALE", "UX4G 3.0 §2.3", "2.3", "Typography", "Minor",
      "Font size outside the UX4G type scale")
def r_type_scale(d):
    off = collections.Counter()
    sample = {}
    for e in d.get("elements", []):
        if not (e.get("text") or "").strip():
            continue
        s = _px(e.get("fontSize"))
        if s is None or int(s) in UX4G_SCALE:
            continue
        off[int(s)] += 1
        sample.setdefault(int(s), e)
    out = []
    for size, n in off.most_common(3):
        e = sample[size]
        b = _box(e.get("bbox"))
        if not b:
            continue
        below = size < 12
        out.append(F("U-TYPE-SCALE", b,
                     f"{size}px · off the UX4G scale · {n} element{'s' if n > 1 else ''} on this page"
                     + (" · below the 12px minimum" if below else ""),
                     f"{size}px text",
                     f"{n} element(s) render at {size}px, which is not on the UX4G type scale "
                     f"(12/14/16/18/20/24/28/32/36/40/52/60)."
                     + (" It is also below Body/XS, the stated minimum usable size." if below else ""),
                     severity="Major" if below else "Minor", key=f"type-{size}"))
    return out


@rule("U-FONT", "UX4G 3.0 §2.2 / MoSJE", "2.2", "Typography", "Minor",
      "Typeface other than Noto Sans")
def r_font(d):
    bad = collections.Counter()
    sample = {}
    for e in d.get("elements", []):
        fam = (e.get("fontFamily") or "").replace('"', "").split(",")[0].strip()
        if not fam or fam.lower().startswith("noto sans"):
            continue
        bad[fam] += 1
        sample.setdefault(fam, e)
    out = []
    for fam, n in bad.most_common(2):
        b = _box(sample[fam].get("bbox"))
        if b:
            out.append(F("U-FONT", b, f"{fam} · {n} element(s) · Noto Sans is the standard", fam,
                         f"{n} element(s) render in {fam}. Noto Sans is the mandated typeface "
                         f"across Government of India properties.", key=f"font-{fam}"))
    return out


@rule("D-ICON-SIZE", "DBIM 3.0 §3.7", "3.7", "Content & Iconography", "Minor",
      "Icon size outside the DBIM set")
def r_icon_size(d):
    off = []
    for im in d.get("images", []):
        if not im.get("visible"):
            continue
        b = _box(im.get("bbox"))
        if not b:
            continue
        w, h = b[2] - b[0], b[3] - b[1]
        if w > 96 or h > 96 or w < 8:
            continue
        if abs(w - h) > 6:               # not square: an icon slot, not an icon
            continue
        if round(w) in DBIM_ICON_SIZES:
            continue
        off.append((b, w, h, (im.get("src") or "").split("/")[-1]))
    if not off:
        return []
    b, w, h, src = off[0]
    return [F("D-ICON-SIZE", b,
              f"Icon {w}×{h}px · DBIM allows 24/32/48/64 · {len(off)} off-scale on this page",
              src, f"{len(off)} icon(s) render at sizes outside DBIM 3.7's set "
                   f"(24/32/48/64 px) — the first is {src} at {w}×{h}px.", key="icon-size")]


@rule("D-UX4G-VIOLET", "DBIM 3.0 §2.1", "2.1", "Color & Token", "Major",
      "UX4G violet leaks into the brand palette")
def r_violet(d):
    hits = [e for e in d.get("elements", [])
            if (e.get("color") or "").lower()[:7] in UX4G_VIOLET
            or (e.get("background") or "").lower()[:7] in UX4G_VIOLET]
    if not hits:
        return []
    e = hits[0]
    b = _box(e.get("bbox"))
    if not b:
        return []
    return [F("D-UX4G-VIOLET", b,
              f"{_hex(e.get('color'))}/{_hex(e.get('background'))} · UX4G violet, not the DBIM palette",
              _short(e.get("text")) or e.get("tag"),
              f"{len(hits)} element(s) render UX4G's violet primary rather than the Department's "
              f"key colour. DBIM 2.1 allows one colour group from the primary palette.",
              key="violet")]


@rule("D-FOOTER-SECTIONS", "DBIM 3.0 §5.6", "5.6", "Content & Iconography", "Major",
      "Footer is missing a DBIM-mandated section")
def r_footer(d):
    foot = (d.get("dbim") or {}).get("footer") or {}
    missing = [k for k in DBIM_FOOTER_SECTIONS if not (foot.get(k) or {}).get("present")]
    if not missing:
        return []
    anchor = next((v for v in foot.values() if isinstance(v, dict) and v.get("bbox")), None)
    b = _box((anchor or {}).get("bbox")) or [0, max(0, (d.get("pageHeight") or 1200) - 320),
                                             1440, d.get("pageHeight") or 1200]
    names = {"archives": "Archives", "websitePolicies": "Website Policy",
             "relatedLinks": "Related Links", "feedback": "Feedback"}
    return [F("D-FOOTER-SECTIONS", b,
              "Footer missing: " + ", ".join(names[m] for m in missing) + " · DBIM 5.6",
              "footer",
              "DBIM 5.6 mandates four footer sections. This footer publishes "
              f"{4 - len(missing)} of them; missing: "
              + ", ".join(names[m] for m in missing) + ".", key="footer-sections")]


@rule("D-HEADER", "DBIM 3.0 §5.1", "5.1", "Components & States", "Blocker",
      "Mandatory header element absent")
def r_header(d):
    dbim = d.get("dbim") or {}
    out = []
    want = {"emblem": "National Emblem", "ministryLockup": "Ministry lockup",
            "languageToggle": "Language toggle", "search": "Search",
            "accessibilityControls": "Accessibility controls"}
    for k, name in want.items():
        v = dbim.get(k) or {}
        if v.get("present"):
            continue
        out.append(F("D-HEADER", None, f"{name} not found in the header · DBIM 5.1",
                     name, f"{name} is not present on this page's header.", key=f"header-{k}"))
    return out


@rule("R-OVERFLOW", "GIGW/WCAG 2.2 AA", "1.4.10", "Layout & Spacing", "Blocker",
      "Horizontal scrolling at this width")
def r_overflow(d):
    ho = d.get("horizontalOverflow") or {}
    if not ho.get("value"):
        return []
    c = (ho.get("culprits") or [{}])[0]
    b = _box(c.get("bbox")) or [0, 0, ho.get("clientWidth", 1440), 400]
    return [F("R-OVERFLOW", b,
              f"scrollWidth {ho.get('scrollWidth')}px > viewport {ho.get('clientWidth')}px · reflow FAIL",
              c.get("tag", "page"),
              f"The page scrolls horizontally at {ho.get('clientWidth')}px: content reaches "
              f"{ho.get('scrollWidth')}px. WCAG 1.4.10 requires reflow without a horizontal "
              f"scrollbar down to 320 CSS px.", key="overflow")]


@rule("C-TITLE", "GIGW 3.0", "2.4.2", "Content & Iconography", "Minor",
      "Page title or description missing")
def r_title(d):
    out = []
    if not (d.get("title") or "").strip():
        out.append(F("C-TITLE", None, "No <title> element", "title",
                     "The page has no title.", key="title"))
    if not (d.get("metaDescription") or "").strip():
        out.append(F("C-TITLE", None, "No meta description", "meta description",
                     "The page publishes no meta description.", key="metadesc"))
    return out


@rule("C-CONSOLE", "GIGW 3.0 §Quality", "quality", "Functional", "Minor",
      "JavaScript errors in the console")
def r_console(d):
    errs = d.get("consoleErrors") or []
    if len(errs) < 3:
        return []
    return [F("C-CONSOLE", None,
              f"{len(errs)} console errors on load · first: {_short(errs[0], 60)}",
              "console",
              f"The page logs {len(errs)} JavaScript errors on load. First: {errs[0][:180]}",
              key="console")]


# ---------------------------------------------------------------- run


def analyse():
    findings, rejected = [], []
    files = sorted(glob.glob(os.path.join(LIVE, "*.json")))
    pages = 0
    for path in files:
        name = os.path.basename(path)
        if name.startswith("_"):
            continue
        d = json.load(open(path))
        global OFFCANVAS_X
        OFFCANVAS_X = (d.get("viewportSize") or {}).get("width") or 1440
        slug, viewport = d.get("slug"), d.get("viewport")
        if not slug:
            continue
        # A capture the server refused (429/5xx) or one that yielded no elements is NOT evidence.
        # Rejecting it here is what keeps a rate-limited blank page out of the report.
        expected_404 = slug == "state--404" and d.get("status") == 404   # the 404 page IS the evidence
        if (d.get("status") != 200 and not expected_404) or not d.get("elementCount"):
            rejected.append({"slug": slug, "viewport": viewport, "status": d.get("status"),
                             "elements": d.get("elementCount"), "url": d.get("url")})
            continue
        pages += 1
        for code, r in RULES.items():
            try:
                for f in r["fn"](d) or []:
                    f.update(slug=slug, viewport=viewport, url=d.get("url"),
                             png=f"captures/live/{slug}.{viewport}.png",
                             pageHeight=d.get("pageHeight"), state=d.get("state"))
                    findings.append(f)
            except Exception as exc:                        # a rule must never lose a page
                findings.append(dict(code=code, slug=slug, viewport=viewport, error=str(exc),
                                     standard=r["standard"], severity="Nit", title=r["title"],
                                     box=[0, 0, 10, 10], label="rule error", element="", detail=str(exc)))
    # ---- scope: a breach on 3+ pages is one Global finding, shown on its worst page
    by_key = collections.defaultdict(list)
    for f in findings:
        by_key[(f["code"], f.get("key"))].append(f)
    for group in by_key.values():
        slugs = {f["slug"] for f in group}
        for f in group:
            f["pageCount"] = len(slugs)
            f["scope"] = "Global" if len(slugs) >= 3 else "Screen"
    json.dump(findings, open(os.path.join(OUT, "findings-auto.json"), "w"), indent=1)

    roll = collections.Counter((f["code"], f["severity"]) for f in findings)
    per_page = collections.Counter(f["slug"] for f in findings)
    json.dump(rejected, open(os.path.join(OUT, "rejected-captures.json"), "w"), indent=1)
    summary = {
        "capturesAnalysed": pages,
        "capturesRejected": len(rejected),
        "rejectedSlugs": sorted({r["slug"] for r in rejected}),
        "findings": len(findings),
        "byCode": {c: {"count": sum(v for (cc, s), v in roll.items() if cc == c),
                       "pages": len({f["slug"] for f in findings if f["code"] == c}),
                       "title": RULES[c]["title"], "standard": RULES[c]["standard"]}
                   for c in RULES},
        "bySeverity": dict(collections.Counter(f["severity"] for f in findings)),
        "globalGroups": len({(f["code"], f.get("key")) for f in findings if f.get("scope") == "Global"}),
        "worstPages": per_page.most_common(15),
    }
    json.dump(summary, open(os.path.join(OUT, "standards-rollup.json"), "w"), indent=1)
    print(json.dumps(summary, indent=1)[:2600])


if __name__ == "__main__":
    analyse()
