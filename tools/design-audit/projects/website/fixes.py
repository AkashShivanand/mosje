#!/usr/bin/env python3
"""The FIX column: one instruction a developer can act on without reading anything else.

Every fix is computed from the finding's own measurement — the colour to use and the ratio it
reaches, the padding that reaches 44px, the scale step to move to, the tag to change, the markup to
add. A generic "darken the text until it passes" leaves the developer to redo the audit; this does
the arithmetic for them.
"""
import re

UX4G_SCALE = [12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 52, 60]
SCALE_NAME = {12: "Body/XS", 14: "Body/S", 16: "Body/M", 18: "Body/L", 20: "Heading/S",
              24: "Heading/M", 28: "Heading/L", 32: "Heading/XL", 36: "Display/XS", 40: "Heading/XXL",
              52: "Display/M", 60: "Display/L"}
# Colours the LIVE site already uses as text (measured across every desktop capture, 18 Sep). A fix
# points at one of these first, so the answer stays inside the site's own palette rather than
# introducing a new hex. The site is WordPress, not SAMAVESH — token names would mean nothing there.
TOKENS = {"#FFFFFF": "the site's white", "#1F2937": "the site's body text colour",
          "#212121": "the site's heading colour", "#374151": "the site's secondary text colour",
          "#014B92": "the site's dark blue (footer strip)", "#0373DF": "the site's primary blue"}


def _rgb(h):
    h = (h or "").lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4)) if len(h) >= 6 else None


def _lum(c):
    def ch(v):
        v = v / 255
        return v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
    return 0.2126 * ch(c[0]) + 0.7152 * ch(c[1]) + 0.0722 * ch(c[2])


def ratio(a, b):
    l1, l2 = _lum(a), _lum(b)
    return round((max(l1, l2) + 0.05) / (min(l1, l2) + 0.05), 2)


def _hex(c):
    return "#%02X%02X%02X" % tuple(int(round(v)) for v in c)


def nearest_passing(fg, bg, need):
    """The estate token nearest in luminance to the current text colour that passes on this ground;
    failing that, the current colour shaded toward black or white until it passes."""
    f, b = _rgb(fg), _rgb(bg)
    if not f or not b:
        return None
    ok = [(abs(_lum(_rgb(h)) - _lum(f)), h, name) for h, name in TOKENS.items()
          if ratio(_rgb(h), b) >= need]
    if ok:
        _, h, name = min(ok)
        return h, name, ratio(_rgb(h), b)
    target = (0, 0, 0) if _lum(b) > 0.18 else (255, 255, 255)
    for t in range(1, 101):
        c = tuple(f[i] + (target[i] - f[i]) * t / 100 for i in range(3))
        if ratio(c, b) >= need:
            return _hex(c), None, ratio(c, b)
    return None


def ground_alternative(fg, bg, need):
    """Keep the text colour; shade the background away from it until the pair passes."""
    f, b = _rgb(fg), _rgb(bg)
    if not f or not b:
        return None
    target = (0, 0, 0) if _lum(f) > _lum(b) else (255, 255, 255)
    if target == (255, 255, 255) and _lum(f) > 0.4:
        return None
    for t in range(1, 101):
        c = tuple(b[i] + (target[i] - b[i]) * t / 100 for i in range(3))
        if ratio(f, c) >= need:
            return _hex(c), ratio(f, c)
    return None


def shade_verb(old, new):
    """'darken' or 'lighten', from the actual change in luminance."""
    return "darken" if _lum(_rgb(new)) < _lum(_rgb(old)) else "lighten"


def _pair(label):
    m = re.search(r"(#[0-9A-F]{6}) on (#[0-9A-F]{6}) = ([\d.]+):1", label or "")
    n = re.search(r"needs ([\d.]+):1", label or "")
    return (m.group(1), m.group(2), float(m.group(3)), float(n.group(1)) if n else 4.5) if m else None


AXE = {
    "aria-command-name": "Give the accessibility button a name: on `<a id=\"accessibilityButton\" role=\"button\">` "
                         "add `aria-label=\"Accessibility options\"`.",
    "link-name": "Give every image-only link a name: on each `<a>` that wraps only an `<img>` (the Digital "
                 "India, India.gov.in and partner logos in the footer and logo row), set the image's `alt` to "
                 "the destination — e.g. `alt=\"Digital India (opens in a new tab)\"`.",
    "landmark-contentinfo-is-top-level": "Remove `role=\"contentinfo\"` from the visitor counter "
                                         "(`<div class=\"mosje-visitor-counter\">`); the page footer is already "
                                         "the contentinfo landmark.",
    "landmark-no-duplicate-contentinfo": "Keep exactly one contentinfo landmark: the same fix — drop "
                                         "`role=\"contentinfo\"` from the visitor counter inside the footer.",
    "heading-order": "Change the “Need Support?” heading from `<h6>` to `<h2>` (Elementor: Heading widget → "
                     "HTML Tag → H2) and keep its current look with the widget's typography settings.",
    "region": "Move the skip link and the floating widgets inside a landmark, or give their wrapper "
              "`role=\"region\"` with an `aria-label`; all visible content must sit in header/nav/main/footer.",
    "aria-valid-attr-value": "The sortable column headers carry `aria-controls=\"dataTable1\"`, but the "
                             "`<table>` has no id (verified 18 Sep). Add `id=\"dataTable1\"` to the `<table>` that "
                             "DataTables initialises.",
    "frame-title": "Add a `title` to the embedded Google Map: `<iframe title=\"Map: Shastri Bhawan, New "
                   "Delhi\" …>`.",
    "skip-link": "This page template has no `<main>` element, so “Skip to content” points at `#content`, which "
                 "does not exist. Wrap the page content in `<main id=\"content\">` — as the About Us template "
                 "already does (verified on /policies/ and /newsletter/, 18 Sep).",
    "link-in-text-block": "Underline links inside running text (`text-decoration: underline`), so they are not "
                          "told apart from the sentence by colour alone.",
    "landmark-unique": "Give each navigation a different name: e.g. `aria-label=\"Main menu\"` on the header "
                       "nav and `aria-label=\"Footer menu\"` on the footer nav.",
    "aria-required-children": "The card grid has `role=\"list\"` but its cards are not `role=\"listitem\"`. "
                              "Either add `role=\"listitem\"` to each card or remove `role=\"list\"`.",
    "scrollable-region-focusable": "Make the scrolling table wrapper reachable by keyboard: add "
                                   "`tabindex=\"0\"`, `role=\"region\"` and `aria-label=\"<table name>\"` to "
                                   "`<div class=\"table-responsive\">`.",
    "svg-img-alt": "Name the search icon: on `<svg role=\"img\">` add `<title>Search</title>` as its first "
                   "child, or set `aria-hidden=\"true\"` if the button already has a label.",
    "select-name": "Label the mobile tab selector: add `aria-label=\"Choose a section\"` to "
                   "`<select id=\"mobileTabSelect\">`.",
    "nested-interactive": "In the accessibility widget, the Light/Dark button sits inside another control. "
                          "Make the outer element a plain container (no role/tabindex).",
    "tabindex": "Remove `tabindex=\"1\"` from the widget's Close button (use `tabindex=\"0\"` or none) so "
                "Tab order follows the page.",
    "aria-dialog-name": "On the Important Links dialog `<div id=\"exampleModal\">`, change "
                        "`aria-labelledby=\"exampleModalLabel\"` to `aria-labelledby=\"exampleModalPopoversLabel\"` "
                        "— the id its “Important Links” heading actually has.",
}


def fix_for(f):
    """One actionable instruction for this finding."""
    code, label, detail = f["code"], f.get("label", ""), f.get("detail", "")
    el = (f.get("element") or "").strip()

    if code in ("A-CONTRAST", "A-CONTRAST-NONTEXT"):
        p = _pair(label)
        if p:
            fg, bg, r, need = p
            best = nearest_passing(fg, bg, need)
            what = "icon" if code == "A-CONTRAST-NONTEXT" else "text colour"
            if best:
                h, name, r2 = best
                tok = f" ({name})" if name else ""
                alt = ""
                g = ground_alternative(fg, bg, need)
                if g:
                    alt = f" Or keep {fg} and {shade_verb(bg, g[0])} the background from {bg} to {g[0]} ({g[1]}:1)."
                return (f"Change the {what} of “{el}” from {fg} to {h}{tok} — {r2}:1 on {bg}, which passes "
                        f"the {need}:1 minimum.{alt} Change it where the colour is set (the shared class or "
                        f"theme setting), so every page using this pair is fixed at once.")
        return "Change the colour pair so it reaches the stated ratio."

    if code == "A-TARGET":
        m = re.search(r"Target (\d+)×(\d+)px", label)
        if m:
            w, h = int(m.group(1)), int(m.group(2))
            pv = max(0, (44 - h + 1) // 2)
            ph = max(0, (44 - w + 1) // 2)
            parts = []
            if pv:
                parts.append(f"{pv}px padding top and bottom")
            if ph:
                parts.append(f"{ph}px left and right")
            return (f"Make “{el}” at least 44×44px: it is {w}×{h}px. Add {' and '.join(parts) or 'no padding'} "
                    f"(or set `min-height: 44px; min-width: 44px`), keeping 8px clear of the next control.")

    if code == "U-TYPE-SCALE":
        m = re.search(r"(\d+)px", label)
        if m:
            s = int(m.group(1))
            to = min(UX4G_SCALE, key=lambda x: (abs(x - s), -x)) if s >= 12 else 12
            return (f"Change the {s}px text to {to}px ({SCALE_NAME[to]} on the UX4G scale)"
                    + ("; nothing on a page may be smaller than 12px." if s < 12 else "."))

    if code == "U-FONT":
        return f"Set “{el}” to Noto Sans (`font-family: \"Noto Sans\", sans-serif`)."

    if code == "A-HEADING-ORDER":
        m = re.search(r"<h(\d)> → <h(\d)>", label)
        if m:
            prev, cur = int(m.group(1)), int(m.group(2))
            return (f"Change “{el}” from `<h{cur}>` to `<h{prev + 1}>` and keep its size with CSS, so the "
                    f"outline steps down one level at a time.")

    if code == "A-H1":
        if f.get("key") == "h1-missing":
            return (f"Make “{el}” the page's `<h1>` (Elementor: select the heading → HTML Tag → H1). "
                    f"Keep its current look; only the tag changes." if el and el != "page title" else
                    "Add one `<h1>` carrying the page's title (Elementor: Heading widget → HTML Tag → H1).")
        return "Keep one `<h1>` — the page title — and change the others to `<h2>`."

    if code == "A-LANG":
        return ("Set the site language to English (India): WordPress → Settings → General → Site Language → "
                "English (India), which renders `<html lang=\"en-IN\">`.")

    if code == "A-AXE" and f.get("key") == "frame-title":
        m = re.search(r'src="https?://(?:www\.)?([^/"]+)', detail)
        host = m.group(1) if m else "the embedded page"
        what = ("Facebook feed" if "facebook" in host else "Map: Shastri Bhawan, New Delhi" if "google" in host
                else f"Embedded content from {host}")
        return (f"Give the embedded frame from {host} a title that says what it shows: "
                f"`<iframe title=\"{what}\" …>`.")
    if code == "A-AXE":
        return AXE.get(f.get("key"), "Correct the markup named in the finding.")

    if code == "A-FOCUS":
        sel = ("the pagination links (`.pagination a`, `.page-link`)" if "Pagination" in el
               else "the hero banner link (`.swiper-slide a`)" if "banner" in el.lower() else f"“{el}”")
        extra = ("; the current page needs a different style from the focused one, so a keyboard user can "
                 "tell them apart" if "Pagination" in el else "")
        banner = (" Give the banner link a name too: `aria-label` with the slide's message."
                  if "banner" in el.lower() else "")
        return (f"Add a visible focus style to {sel}: `:focus-visible {{ outline: 2px solid #0373DF; "
                f"outline-offset: 2px; }}` — and remove any `outline: none` that overrides it{extra}.{banner}")

    if code == "D-UX4G-VIOLET":
        return ("Override the UX4G variables after `ux4g-min.css` loads: `:root { --bs-primary: #0373DF; "
                "--bs-link-color: #0373DF; --bs-blue: #0373DF; }`, and restyle the accessibility widget's "
                "controls to the same blue.")

    if code == "D-FOOTER-SECTIONS":
        m = re.search(r"Footer missing: (.+?) ·", label)
        missing = m.group(1) if m else "the missing sections"
        return (f"Add to the footer: {missing}. Website Policy → one page linking the Copyright, "
                f"Hyperlinking, Privacy and Terms policies; Related Links → the Important Links list; Feedback "
                f"→ the existing contact form; Archives → a page listing superseded documents. This needs the "
                f"Ministry's decision on T10 / T32 first.")

    if code == "D-HEADER":
        return f"Add the {el} to the masthead on this template, as on the home page."

    if code == "D-ICON-SIZE":
        return f"Export “{el}” at 24px (or 32 / 48 / 64) and render it at that size, keeping its proportion."

    if code == "R-OVERFLOW":
        m = re.search(r"scrollWidth (\d+)px > viewport (\d+)px", label)
        if m:
            w = re.search(r"The widest element is (.+?)\. The page", detail)
            who = w.group(1) if w else "the widest element"
            return (f"At {m.group(2)}px the page is {m.group(1)}px wide; the cause is {who}. For a long link "
                    f"or word add `overflow-wrap: anywhere` to its paragraph; for a table, wrap it in a "
                    f"container with `overflow-x: auto`. The page itself must never scroll sideways.")

    if code == "C-TITLE":
        if "meta description" in label:
            return ("Add a meta description of 120–160 characters saying what the page offers (Yoast/Rank Math → "
                    "the page's SEO box).")
        return "Add a page title in the form “<Page name> | Department of Social Justice & Empowerment”."

    if code == "C-CONSOLE":
        m = re.search(r"first: (.+)$", label)
        return (f"Fix the first error on load{': ' + m.group(1) if m else ''} — later errors often follow "
                f"from it. Check again with the browser console open.")

    if code == "A-ALT":
        return f"Add an `alt` to “{el}”: describe it if it carries meaning, `alt=\"\"` if it is decoration."

    if code == "DVB-SPEC":
        parts = []
        for m in re.finditer(r"Built ([^·]+?) · design ([^·]+?)(?= ·|$)", label):
            parts.append(f"change {m.group(1).strip()} to {m.group(2).strip()}")
        return (f"On “{el}”, " + "; ".join(parts) + " — as in the Figma frame (link on this board). Make "
                f"the change in the shared style for this element, so every page using it follows.") if parts else \
            f"Match “{el}” to the Figma frame."

    if code == "DVB-MISSING" and f.get("missingTexts"):
        items = "; ".join(f"“{t}”" for t in f["missingTexts"])
        return (f"Add this copy where the Figma frame places it (each piece is outlined on the design "
                f"panel): {items}. Where a piece was dropped on purpose, tell the design team so the frame "
                f"is updated instead.")
    if code == "DVB-MISSING":
        m = re.search(r"carries “(.+?)”", detail)
        text = m.group(1) if m else el
        return (f"Add the text “{text}” where the Figma frame places it (open the frame from the link on this "
                f"board) — or, if it was dropped on purpose, tell the design team so the frame is updated.")

    return f.get("fix") or ""
