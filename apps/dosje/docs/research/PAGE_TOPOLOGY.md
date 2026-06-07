# Page Topology — dosje.gov.in (Homepage)

**Platform:** WordPress + Elementor (page builder). Assets served from CloudFront (`durwo6bhtjtqt.cloudfront.net/wp-content/...`).
**Fonts:** Noto Sans (Google) + Font Awesome 6.5.1 (icons).
**Lang:** en-US. **Total page height:** ~5900px. **Main content height:** 5172px.

## Layout shell
- `header.elementor-260` — 192px tall, static at top (gov bar + brand + search + nav)
- `main#content` — 5172px (11 stacked Elementor sections)
- `footer.elementor-370` — 528px
- **Fixed overlays:**
  - `.important-link-btn` (z:1002) — vertical "Important Links" tab pinned to right edge
  - `#exampleModal.modal` (z:1055) — Important Links modal (opens from side tab)
  - SAMVAAD chatbot floating button (bottom-right)

## Header sub-structure (top → bottom)
1. **Gov-of-India top bar** (blue) — flag + "Government of India" (external link), right side: Skip to Main Content, accessibility icon, language/font-size icon
2. **Brand row** (white) — national emblem + "Government of India / Ministry of Social Justice & Empowerment / **Department of Social Justice & Empowerment**" + BETA tag; center: search box ("Search Schemes, Services, Documents"); right: Digital India logo + **Admin Login** button (blue)
3. **Mega-nav** (white) — Home · Department ▾ · Associated Organisations ▾ · Offerings ▾ · Documents ▾ · Events & Gallery ▾ · Connect ▾

## Main content sections (top → bottom)
| # | id | top | h | Name | Notes |
|---|------|-----|-----|------|-------|
| 0 | 6d82195 | 192 | 76 | **SAMAVESH banner** | orange bar, logo + tagline "Single Access Mechanism for All Verticals of Empowerment & Social Harmony" + Explore button. INTERACTION: static |
| 1 | c8bef04 | 268 | 504 | **Hero carousel** | 7 imgs = slides (Ambedkar statue + Chintan Shivir group photos). prev/next arrows + dots. INTERACTION: time-driven autoplay + click |
| 2 | bc101c6 | 772 | 72 | **Latest Updates ticker** | "Latest Updates" label + scrolling Documents headlines, 26 links, prev/next + View All Updates. INTERACTION: time-driven marquee |
| 3 | 2519d3e | 844 | 674 | **About Us** | intro text about DoSJE + 3 imgs (minister/stats?). 13 links |
| 4 | 0522fbf | 1518 | 724 | **Our Offerings** | "Discover our schemes, careers, and partners" — 6 imgs, 45 links. Likely tabbed/card grid |
| 5 | 2107a0f | 2243 | 507 | **Our Organisations** | "Explore our schemes, career opportunities" — 16 links, logo/card grid |
| 6 | 94ff14c | 2750 | 456 | **Section 6 (unnamed)** | 2 imgs, 2 links — banner/CTA or minister profiles (confirm) |
| 7 | 2f6ca59 | 3206 | 572 | **Recent Documents** | Annual Report 2025-26 etc., 4 imgs, 12 links |
| 8 | 09fabf3 | 3778 | 590 | **Activity Corner** | Events / affiliated bodies tabs, 4 imgs, 15 links |
| 9 | dc0dd9d | 4368 | 812 | **Social Media Platforms** | Facebook / X / etc. — likely iframe embeds (0 imgs/links in DOM) |
| 10 | 8cda8c6 | 5180 | 184 | **Logo strip / gallery** | 12 imgs — partner/ministry logos or associated org logos |

## Footer
- `footer.elementor-370` (528px) — to be detailed during extraction.

## Open questions to resolve during extraction
- Section 6 content (2 imgs/2 links) — what is it?
- Section 9 social embeds — real iframes vs static cards?
- Nav dropdown contents (Department, Associated Organisations, Offerings, Documents, Events & Gallery, Connect)
