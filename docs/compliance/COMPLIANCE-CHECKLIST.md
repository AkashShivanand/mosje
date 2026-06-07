# MoSJE Master Compliance Checklist

The single enforceable checklist for every MoSJE page/portal, merging three standards:

| Standard | What it governs | Source |
|----------|-----------------|--------|
| **DBIM** — Digital Brand Identity Manual | Visual brand: colour, icons, typography, header/footer, logo, imagery, content | `Documents/MoSJE DBIM Audit.pdf` (NIC, May 2026) |
| **GIGW 3.0** — Guidelines for Indian Government Websites & Apps | Quality, Accessibility (WCAG 2.1 AA), Cybersecurity, Lifecycle + mandatory pages/certification | guidelines.india.gov.in |
| **UX4G** — User Experience for Government | Design system, components, accessibility widget, UX principles | ux4g.gov.in · doc.ux4g.gov.in |

Legend: each item is `[ ]` checkable. **Source tags:** `[DBIM n.n]`, `[GIGW]`, `[UX4G]`. Items the MoSJE audit flagged as **failing** are marked ⚠️ (fix these first).

---

## 1. Colour & brand `[DBIM A]`
- [ ] One **primary colour group** = 1 key colour + its variants, used consistently across all pages `[DBIM 2.1]` ⚠️
- [ ] Background/card/surface colours come from the **functional palette** `[DBIM 2.2]` ⚠️
- [ ] Icons use the **key colour (darkest shade)** or inclusive **white** only `[DBIM 3.7]` ⚠️
- [ ] **Footer background = darkest shade** of the key colour group `[DBIM 5.6]` ⚠️
- [ ] Colour never the sole information carrier `[GIGW · WCAG 1.4.1]`
- [ ] In code: use brand tokens (`gov-blue`, `saffron`, …) — **no raw hex in components**

## 2. Iconography `[DBIM B]`
- [ ] Consistent icon **style** sitewide `[DBIM 3.3]`
- [ ] Icons from the **DBIM toolkit** unless unavailable `[DBIM 3.5]`
- [ ] Icons in **PNG / SVG / WEBP** only `[DBIM 3.7]`
- [ ] Icon sizes ∈ **24×24 / 32×32 / 48×48 / 64×64 px** `[DBIM 3.7]` ⚠️
- [ ] Correct proportion — never stretched/compressed `[DBIM 3.7]`
- [ ] Sufficient contrast when an icon sits on an image/banner `[DBIM 3.7]`

## 3. Typography `[DBIM C]`
- [ ] Typeface is **Noto Sans** `[DBIM 4.1]` ✓ (also a `[UX4G]` token; supports Indic scripts)
- [ ] Body text **left-aligned**; tables = left text / right numbers / centre column headers `[DBIM 4.1.1]` ⚠️
- [ ] **No ALL-CAPS** for long sentences/paragraphs; no Hinglish `[DBIM 4.1.1]` ⚠️
- [ ] **Type scale** per DBIM `[DBIM 4.3.1]` ⚠️
- [ ] Text colour per DBIM with **optimal contrast** (≥4.5:1 body, ≥3:1 large) `[DBIM 4.4][GIGW·WCAG 1.4.3]` ⚠️
- [ ] Buttons: **uniform padding**, consistent sizes `[DBIM 4.5]`
- [ ] **Distinct button states**: enabled / hover / focus / disabled `[DBIM 4.5]` ⚠️
- [ ] Clickable items show a **noticeable hover change** `[DBIM 4.5]` ⚠️
- [ ] Text resizes to **200%**; reflow at 320px; adjustable spacing `[GIGW·WCAG 1.4.4/1.4.10/1.4.12]`

## 4. Header & footer `[DBIM D]`
- [ ] **State Emblem** from authorized source, correct ratio, not disproportionate `[DBIM 5.1][GIGW]`
- [ ] Website **named by org type** (Ministry/Department) `[DBIM 5.2]`
- [ ] Logo lockup: **black-on-white** or **white-on-dark** `[DBIM 5.3]`
- [ ] Generic header components chosen from DBIM for the org type; all subcomponents accessible `[DBIM 5.4]`
- [ ] **Footer shows key info + lineage** mandated by DBIM `[DBIM 5.6]` ⚠️
- [ ] Header carries: emblem + brand + **search** + skip-link; consistent across all pages `[GIGW]`
- [ ] Prominent **india.gov.in (National Portal)** link, opens new window `[GIGW]`

## 5. Logo `[DBIM E]`
- [ ] Correct/accurate logos, not scaled disproportionately `[DBIM 5.5]`
- [ ] Logos in **JPEG / PNG / SVG / WEBP** only, **< 100 KB** `[DBIM 5.5]` ⚠️

## 6. Imagery `[DBIM F]`
- [ ] Background & banner/header images **< 500 KB** `[DBIM 6.1.1]`
- [ ] **Thumbnails < 100 KB** `[DBIM 6.1.1]` ⚠️
- [ ] Hi-res images **< 5 MB**; provide thumbnail + view/download of hi-res `[DBIM 6.1.1]`
- [ ] Images in **JPEG / PNG / WEBP** only `[DBIM 6.1.1]`
- [ ] Licensed/permitted, **no third-party watermark** `[DBIM 6.1.3]`
- [ ] **Headshots** formatted as defined in DBIM `[DBIM 6.1.4]` ⚠️
- [ ] All meaningful images have descriptive **alt**; decorative = `alt=""` `[GIGW·WCAG 1.1.1]`

## 7. Content `[DBIM G + Ministry E/F]`
- [ ] All content **complete & up to date**; archival section with archival **date** `[DBIM A.5.6]`
- [ ] **No spelling/grammar errors** `[DBIM 7.1.3.3]` ⚠️
- [ ] **Date format: day before month** (DD MMM YYYY) `[DBIM A.5.6]`
- [ ] Titles **Dr./Shri/Smt./Mr./Ms.** used uniformly `[DBIM A.5.6]` ⚠️
- [ ] Documents/presentations/brochures uploaded as **accessible PDF** (no editable formats) `[DBIM A.5.6]`
- [ ] External links **HTTPS**, identifiable, periodically validated `[DBIM A.5.6][GIGW]`
- [ ] Objectives/functions shown **as a list** `[DBIM A.5.1.1]` ⚠️
- [ ] Correct **minister names + portfolios**; correct org hierarchy & names `[DBIM A.5.1.2/3]`
- [ ] Offering title ≤ **150 chars**; offering images **< 100 KB** `[DBIM A.5.2/A.5.2.1]`
- [ ] Document/resource titles ≤ **250 chars** `[DBIM A.5.3/A.5.4]`
- [ ] Periodic documents **versioned with release date** `[DBIM A.5.3]` ⚠️
- [ ] Videos **captioned + dated** `[DBIM A.5.4.2]` ⚠️
- [ ] **CIO / Web Information Manager / Appellate Authority / PIO** contact accurate; geotagging on Contact `[DBIM A.5.5]` ⚠️
- [ ] Ministerial images & officer listings ordered **by seniority** `[DBIM A.5.6]`

## 8. Personas `[DBIM Ministry B]`
- [ ] Relevant **personas on the homepage** (Beneficiary, Student, Researcher, Govt Official) `[DBIM A.2]` ✓
- [ ] **Persona-based navigation** surfaces content for the selected persona `[DBIM A.2]`
- [ ] Content **tagged** to personas `[DBIM A.3]`

## 9. Forms `[DBIM Ministry G]`
- [ ] **Instructions at the start** of the form `[DBIM B]`
- [ ] **Keyboard-friendly**; every field has a `<label>`; errors announced `[DBIM][GIGW·WCAG 3.3]`

## 10. Search & metadata `[DBIM H]`
- [ ] Search **works** and returns relevant results across **HTML + PDF + image metadata** `[DBIM 9]`
- [ ] Every page + file has complete **metadata** (title, lang, description, keywords) + persona tags `[DBIM A.5.6][GIGW]`

## 11. Privacy & consent `[DBIM G]`
- [ ] **Cookie consent banner at the bottom**, accept control `[DBIM 7.6.1]` ⚠️
- [ ] Consent for personalisation obtained in the **user's preferred language** `[DBIM 7.6.1]` ⚠️

## 12. Accessibility — WCAG 2.1 AA `[GIGW + UX4G]`
- [ ] `<html lang>` set; one `<h1>`; headings nest; landmarks (`header/nav/main/footer`) `[GIGW·WCAG 1.3.1/2.4]`
- [ ] **Skip to main content** link `[GIGW·WCAG 2.4.1]`
- [ ] Full **keyboard** operability, no trap, **visible focus** `[WCAG 2.1.1/2.4.7]`
- [ ] Custom widgets (tabs, carousel, modal, dropdown, accordion) have correct **ARIA roles/states**, Esc/arrow keys, focus trap+restore on modals `[WCAG 4.1.2]`
- [ ] Respect **`prefers-reduced-motion`** (autoplay carousel/ticker) `[WCAG 2.3/2.2]`
- [ ] Contrast ≥ **4.5:1** (≥3:1 large/UI) `[WCAG 1.4.3/1.4.11]`
- [ ] Integrate the **UX4G Accessibility Widget** (text resize, contrast/invert, dyslexia font, link highlight, dark mode) `[UX4G]`
- [ ] Publish an **Accessibility Statement** page `[GIGW]`

## 13. Mandatory pages & policies `[GIGW]`
- [ ] Home · Contact Us · **Feedback/Grievance** · Help · **Sitemap** · Search
- [ ] **Terms & Conditions** · **Privacy Policy** · **Copyright Policy** · **Hyperlinking Policy**
- [ ] **Accessibility Statement** · **Website Policies** hub
- [ ] **RTI** disclosure (public authority) · **"Last Updated" stamp** on pages
- [ ] Content Review Policy (quarterly), Content Management Policy, Security Policy, Backup/Recovery plan `[GIGW Lifecycle]`

## 14. Technology, security & performance `[GIGW + DBIM I]`
- [ ] **Responsive** across screen sizes (mobile-first) `[DBIM 10.2][GIGW]`
- [ ] **HTTPS + valid TLS** on all pages `[GIGW]`
- [ ] **VAPT / "Safe to Host"** from a CERT-In / STQC empanelled auditor `[GIGW Cybersecurity]`
- [ ] Aligned to ISO 27001 / OWASP ASVS / OWASP Top 10 / CIS `[GIGW]`
- [ ] Valid markup, no broken links, multi-browser (incl. Indic fonts) `[GIGW]`
- [ ] Hosted on **gov.in / nic.in** `[GIGW]`

## 15. Certification & governance `[GIGW]`
- [ ] **STQC CQW (Certified Quality Website)** certification before launch
- [ ] **GIGW compliance / accessibility statement** published
- [ ] Designated **Web Information Manager (WIM)**
- [ ] Multilingual / regional-language support via **Unicode** (Noto Sans) `[GIGW][UX4G]`
- [ ] Integrations where applicable: india.gov.in, DigiLocker, MyGov, MyScheme, Aadhaar/SSO `[GIGW]`

---

### How we apply this
- **By construction:** every template we build (see `docs/compliance/PAGE-CLONE-PLAN.md`) must satisfy §1–12 before it ships.
- **Audit:** the `gov-compliance` skill and the `accessibility-auditor` / `design-system-guardian` agents check pages against this list.
- **The ⚠️ items** are the gaps the original site's DBIM audit flagged — our clone should *fix* them, not reproduce them.

> The full per-checkpoint gap observations are in `Documents/MoSJE DBIM Audit.pdf` §4 (pages 13–30). Generic pass rate at audit: **56.52%**; Ministry: **55.88%** — clear room to exceed the original.
