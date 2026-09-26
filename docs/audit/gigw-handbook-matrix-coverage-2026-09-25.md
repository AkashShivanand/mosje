# GIGW 3.0 Conformity Matrix vs. the Website QC Tracker — 25 Sep 2026

**Question.** Are the 88 checkpoints in GIGW's conformity matrix covered by the consolidated
website tracker? Where they are not, audit www.dosje.gov.in and add the results to the tracker.

## 1. The matrix is GIGW's own — verified against the PDFs

| Check | Result |
|---|---|
| Is the matrix in the main GIGW document? | **Yes.** GIGW 3.0 **Annexure II, "Matrix to check conformity"** (`GIGW_3.0.pdf` pp. 100–115). NIC's *Compliance & Certification Handbook* (Dec 2023) §6.1 reprints it. |
| Handbook matrix vs. Annexure II | Word-level diff of the two PDFs: **same 88 checkpoints, same order, same wording.** Differences are formatting only (S/No vs S.No., (a)/(b) list letters, synchronised/synchronized, organisation/organization) plus handbook typos ("thehomepage", "exceptwhen", "htt", a second "14"). |
| Annexure II vs. the GIGW body (§5) | Each of the 88 has its own clause with a *Statement*: 5.1.1–5.1.25, 5.2.1–5.2.50, 5.3.1–5.3.3, 5.4.1–5.4.10. **Nothing extra and nothing missing.** |
| Numbering | Annexure II lists Quality items 21–24 as API → consistent UX → social media → domain. The body numbers them **5.1.21 domain, 5.1.22 API, 5.1.23 consistent UX, 5.1.24 social media**. The tracker cites the body numbers, which is correct. |
| Tracker's GIGW links | The Standards tab links `…/uploads/2026/07/2026072438.pdf#page=N`. All 7 existing page anchors match our `GIGW_3.0.pdf`, so it is the same edition. |

The checkpoint wording in the tracker is **quoted from the GIGW 3.0 PDF clause statements**, not
paraphrased and not taken from the handbook.

## 2. Result: every checkpoint is answered inside the tracker's existing tabs

| Area | Fails — tracked | Passes | Not applicable | Waiting on the Department |
|---|---|---|---|---|
| Quality | 17 | 6 | 0 | 2 |
| Accessibility | 34 | 10 | 6 | 0 |
| Security | 3 | 0 | 0 | 0 |
| Lifecycle Management | 9 | 0 | 0 | 1 |
| **Total** | **63** | **16** | **6** | **3** |

Audited on the live site on 25 Sep 2026 (Chromium, Firefox, WebKit; 16 representative pages;
read-only — every non-GET request was blocked, so no form reached the server). There is **no
separate GIGW tab**: each result sits where that kind of entry already lives in the tracker.

| Kind of result | Tab | Shape |
|---|---|---|
| Fails | **Issues** (+ Affected Pages) | one row per defect, cited in *Standards failed* |
| Passes / not applicable | **Resolved & Withdrawn** | `Resolved · GIGW 5.x.y — … · Passes: … / Not applicable: … · 25 Sep`, the same form as the NIC checklist rows already there |
| Needs the Department | **Dependencies** | DEP-11, DEP-12 |
| Clause → issues index | **Standards** | one row per clause, linked to its GIGW page |

## 3. What changed in the tracker

Drive → `Design QC/MoSJE-Website-QC-Tracker.xlsx`. Backups in `_backup-2026-09-25/`. The
developers' columns (Status, Assignee, Target date, Notes, Comment) were not touched: 0 cells.

| Where | Change |
|---|---|
| Issues — new | **MAN-12** six of the ten GIGW 5.4.3 policies not published (also 5.3.3) · **SEC-07** the only security audit certificate is NISD's, with dates shown as "NA" (5.3.1) · **CON-27** seven pages reproduce Acts and notifications with no source named (5.1.3) · **ACC-29** "Saturation" button named "Saturate Colors" (5.2.36) · **ACC-30** the Organisation filter reloads the page when changed (5.2.41) |
| Issues — merged, not duplicated | The missing transcript and audio description for the 28 NISD videos were added to the existing **ACC-P043** (+5.2.4, 5.2.6) instead of a separate row |
| Issues — re-categorised | **20 rows cited 5.2.3 "Captions (Prerecorded)" where "caption" means a label on a photo or figure.** That citation was removed. 12 kept their other standards. The other 8 now carry the citation the tracker already uses for the same kind of finding: CON-P331 → 5.1.25 + DBIM 7.1.3.3 · CON-P271, P677, P716, P787 → 5.1.18 · BRD-P020 → DBIM 6.1 · CON-P128 → DPDP Act · CON-P397 → Nielsen. Only ACC-P043 still cites 5.2.3. |
| Affected Pages | Rows for the new issues (CON-27 lists all 7 pages) |
| Resolved & Withdrawn | 14 rows for the checkpoints that pass or do not apply. The earlier NIC M20 "Not applicable" is now a **Withdrawn** entry, because 28 videos are published. |
| Dependencies | **DEP-11** which government platforms to integrate with (5.1.22). **DEP-12** copyright permissions, audit clearance, website address on stationery (5.1.4, 5.3.1, 5.4.2). The policy approvals belong with the existing **DEP-04**, which now also lists MAN-12. |
| Standards | Clause rows kept in sort order, each linked to its page in the GIGW PDF. 5.2.3 and WCAG 1.2.2 now list only ACC-P043. |
| Screenshots | `MAN-12`, `SEC-07`, `CON-27`, `ACC-29`, `ACC-30` (.jpg). The files replaced by the renumbering are in `_backup-2026-09-25/superseded-screenshots/`. |
| Summary | Header issue count is a formula. |

## 4. Checked and withdrawn before logging

- A single-key test first seemed to show "b" moving focus into the chatbot. It did not reproduce in
  3 retries: the chatbot had simply finished loading.
- In the first run, Tenders looked empty and threw script errors in all three browsers. The cause was
  the audit's own POST block, which also stopped the listing's data request. With that request
  allowed, all three show 277 tenders and no errors.

## 5. Still open

- Send DEP-11 and DEP-12 to the Ministry.
- SEC-07: the certificate PDF was not opened. If it does cover www.dosje.gov.in, the fix is to
  correct its Organisation and dates.

## 6. All 88 checkpoints

| Clause | S/N | Result | Where | Tracker issues / note |
|---|---|---|---|---|
| 5.1.1 | 1 | Passes | Resolved & Withdrawn | Passes: the masthead emblem renders at 32×52 px, the file's own proportions, monochrome on white. Its missing alt text is ACC-04. |
| 5.1.2 | 2 | Fails — tracked | Issues | MAN-10 |
| 5.1.3 | 3 | Fails — tracked | Issues | CON-27 |
| 5.1.4 | 4 | Waiting on the Department | Dependencies | DEP-12 |
| 5.1.5 | 5 | Fails — tracked | Issues | MAN-05 |
| 5.1.6 | 6 | Fails — tracked | Issues | DOC-02, DOC-03 + 21 page-level |
| 5.1.7 | 7 | Fails — tracked | Issues | CON-18, CON-19 |
| 5.1.8 | 8 | Fails — tracked | Issues | MAN-06 |
| 5.1.9 | 9 | Fails — tracked | Issues | CON-12 |
| 5.1.10 | 10 | Fails — tracked | Issues | CON-08, CON-09, CON-23, CON-24, CON-26, MAN-07 + 230 page-level |
| 5.1.11 | 11 | Fails — tracked | Issues | MAN-03 |
| 5.1.12 | 12 | Passes | Resolved & Withdrawn | Withdrawn row “National Portal link missing”: the top-bar link opens india.gov.in in a new window. |
| 5.1.13 | 13 | Passes | Resolved & Withdrawn | Passes: Home and Tenders are identical in Chromium, Firefox and WebKit — same layout, 277 tenders listed in each, no script errors; the Devanagari language list |
| 5.1.14 | 14 | Passes | Resolved & Withdrawn | Passes: a Help link is on all 16 pages sampled. Faults on the Help page itself are CON-T112–T116, MOB-T032–T034, LAY-T074–T077, TYP-T035. |
| 5.1.15 | 15 | Fails — tracked | Issues | PRF-01 |
| 5.1.16 | 16 | Passes | Resolved & Withdrawn | Passes: with every style sheet removed, Home and Tenders read top to bottom in a logical order with headings intact. |
| 5.1.17 | 17 | Fails — tracked | Issues | ACC-03, DUP-03, DUP-04, LNG-03, SEO-01, SEO-02, SEO-05, SEO-06 + 121 page-level |
| 5.1.18 | 18 | Fails — tracked | Issues | CON-06, CON-07, CON-13, CON-14, CON-15, DUP-01, DUP-02, MAN-08 + 654 page-level |
| 5.1.19 | 19 | Fails — tracked | Issues | ACC-16, NAV-14 + 194 page-level |
| 5.1.20 | 20 | Fails — tracked | Issues | LAY-04 |
| 5.1.21 | 24 | Passes | Resolved & Withdrawn | Passes: www.dosje.gov.in. |
| 5.1.22 | 21 | Waiting on the Department | Dependencies | DEP-11 |
| 5.1.23 | 22 | Fails — tracked | Issues | BRD-10, BRD-18, BRD-20, LAY-07, LAY-08, LAY-14, NAV-07 + 62 page-level |
| 5.1.24 | 23 | Fails — tracked | Issues | BRD-12 |
| 5.1.25 | 25 | Fails — tracked | Issues | CON-01, CON-03, CON-10, CON-11, CON-22, CON-23, CON-25 + 91 page-level |
| 5.2.1 (1.1.1) | 1 | Fails — tracked | Issues | ACC-04, ACC-22, DOC-01, MAN-01, MAN-02 + 1 page-level |
| 5.2.2 (1.2.1) | 2 | Not applicable | Resolved & Withdrawn | Not applicable: no audio-only, video-only or live media on the 16 pages sampled; the NISD videos have sound (see ACC-P043). |
| 5.2.3 (1.2.2) | 3 | Fails — tracked | Issues | + 1 page-level |
| 5.2.4 (1.2.3) | 4 | Fails — tracked | Issues | + 1 page-level |
| 5.2.5 (1.2.4) | 5 | Not applicable | Resolved & Withdrawn | Not applicable: no audio-only, video-only or live media on the 16 pages sampled; the NISD videos have sound (see ACC-P043). |
| 5.2.6 (1.2.5) | 6 | Fails — tracked | Issues | + 1 page-level |
| 5.2.7 (1.3.1) | 7 | Fails — tracked | Issues | ACC-02, ACC-03, ACC-16, ACC-20, ACC-23, COD-01, TYP-08 + 471 page-level |
| 5.2.8 (1.3.2) | 8 | Fails — tracked | Issues | ACC-20 |
| 5.2.9 (1.3.3) | 9 | Passes | Resolved & Withdrawn | Passes: no instruction relies on shape, colour, size or position on the 16 pages sampled; in landscape on a phone (812×375) nothing is locked to one orientation |
| 5.2.10 (1.3.4) | 10 | Passes | Resolved & Withdrawn | Passes: no instruction relies on shape, colour, size or position on the 16 pages sampled; in landscape on a phone (812×375) nothing is locked to one orientation |
| 5.2.11 (1.3.5) | 11 | Not applicable | Resolved & Withdrawn | Not applicable: the only text inputs are search boxes, which collect nothing about the user. |
| 5.2.12 (1.4.1) | 12 | Fails — tracked | Issues | ACC-18 |
| 5.2.13 (1.4.2) | 13 | Passes | Resolved & Withdrawn | Passes: nothing plays sound on load (the 28 NISD videos do not autoplay); no looping animation faster than 400 ms. |
| 5.2.14 (1.4.3) | 14 | Fails — tracked | Issues | ACC-06, ACC-07, BRD-03, DES-A-01, DES-A-02, DES-A-03, DES-A-04, DES-A-05, DES-A-06 + 14 page-level |
| 5.2.15 (1.4.4) | 15 | Fails — tracked | Issues | ACC-09, TYP-02 |
| 5.2.16 (1.4.5) | 16 | Fails — tracked | Issues | ACC-22 |
| 5.2.17 (1.4.10) | 17 | Fails — tracked | Issues | ACC-09, MOB-02, MOB-03 + 66 page-level |
| 5.2.18 (1.4.11) | 18 | Fails — tracked | Issues | ACC-06, ACC-08, ACC-14, ACC-26 |
| 5.2.19 (1.4.12) | 19 | Fails — tracked | Issues | ACC-24 |
| 5.2.20 (1.4.13) | 20 | Fails — tracked | Issues | ACC-01 |
| 5.2.21 (2.1.1) | 21 | Fails — tracked | Issues | ACC-01, ACC-13, NAV-13 |
| 5.2.22 (2.1.2) | 22 | Fails — tracked | Issues | ACC-01 |
| 5.2.23 (2.1.4) | 23 | Passes | Resolved & Withdrawn | Passes: 36 single keys pressed on the home page trigger nothing; the accessibility panel uses Ctrl+F2. |
| 5.2.24 (2.2.1) | 24 | Not applicable | Resolved & Withdrawn | Not applicable: no time limits or sign-in session, no device-motion controls, and no legal, financial or test submission on the website. |
| 5.2.25 (2.2.2) | 25 | Fails — tracked | Issues | ACC-11 |
| 5.2.26 (2.3.1) | 26 | Passes | Resolved & Withdrawn | Passes: nothing plays sound on load (the 28 NISD videos do not autoplay); no looping animation faster than 400 ms. |
| 5.2.27 (2.4.1) | 27 | Fails — tracked | Issues | ACC-02, ACC-19 |
| 5.2.28 (2.4.2) | 28 | Fails — tracked | Issues | CON-02, CON-15, DUP-03, SEO-06 + 121 page-level |
| 5.2.29 (2.4.3) | 29 | Fails — tracked | Issues | ACC-10, ACC-12, ACC-13 |
| 5.2.30 (2.4.4) | 30 | Fails — tracked | Issues | ACC-05, ACC-27, LAY-07, LNK-01, NAV-02 + 26 page-level |
| 5.2.31 (2.4.5) | 31 | Passes | Resolved & Withdrawn | Passes: a search box and a Sitemap link are on all 16 pages sampled. Pages missing from the sitemap are SEO-05. |
| 5.2.32 (2.4.6) | 32 | Fails — tracked | Issues | ACC-03, CON-14 + 235 page-level |
| 5.2.33 (2.4.7) | 33 | Fails — tracked | Issues | ACC-08, ACC-12 + 1 page-level |
| 5.2.34 (2.5.1) | 34 | Passes | Resolved & Withdrawn | Passes: every carousel checked (three on Home, one on Garima Greh) has previous/next buttons; pressing any of 30 controls on Home and sliding off before release |
| 5.2.35 (2.5.2) | 35 | Passes | Resolved & Withdrawn | Passes: every carousel checked (three on Home, one on Garima Greh) has previous/next buttons; pressing any of 30 controls on Home and sliding off before release |
| 5.2.36 (2.5.3) | 36 | Fails — tracked | Issues | ACC-29 |
| 5.2.37 (2.5.4) | 37 | Not applicable | Resolved & Withdrawn | Not applicable: no time limits or sign-in session, no device-motion controls, and no legal, financial or test submission on the website. |
| 5.2.38 (3.1.1) | 38 | Fails — tracked | Issues | LNG-03 |
| 5.2.39 (3.1.2) | 39 | Fails — tracked | Issues | LNG-03 |
| 5.2.40 (3.2.1) | 40 | Fails — tracked | Issues | ACC-01 |
| 5.2.41 (3.2.2) | 41 | Fails — tracked | Issues | ACC-30 |
| 5.2.42 (3.2.3) | 42 | Fails — tracked | Issues | NAV-07 |
| 5.2.43 (3.2.4) | 43 | Fails — tracked | Issues | CON-21, NAV-07 |
| 5.2.44 (3.3.1) | 44 | Passes | Resolved & Withdrawn | Passes: the site's own forms are search boxes with nothing to validate; the translation-feedback panel, submitted empty, shows “Please provide rating” in an ann |
| 5.2.45 (3.3.2) | 45 | Fails — tracked | Issues | ACC-23 |
| 5.2.46 (3.3.3) | 46 | Passes | Resolved & Withdrawn | Passes: the site's own forms are search boxes with nothing to validate; the translation-feedback panel, submitted empty, shows “Please provide rating” in an ann |
| 5.2.47 (3.3.4) | 47 | Not applicable | Resolved & Withdrawn | Not applicable: no time limits or sign-in session, no device-motion controls, and no legal, financial or test submission on the website. |
| 5.2.48 (4.1.1) | 48 | Fails — tracked | Issues | COD-04 |
| 5.2.49 (4.1.2) | 49 | Fails — tracked | Issues | ACC-05, ACC-12, ACC-13, ACC-16, ACC-19 |
| 5.2.50 (4.1.3) | 50 | Fails — tracked | Issues | ACC-21 |
| 5.3.1 | 1 | Fails — tracked | Issues | SEC-07 |
| 5.3.2 | 2 | Fails — tracked | Issues | SEC-04, SEC-05 |
| 5.3.3 | 3 | Fails — tracked | Issues | MAN-12, SEC-01, SEC-02 |
| 5.4.1 | 1 | Fails — tracked | Issues | MAN-07 |
| 5.4.2 | 2 | Waiting on the Department | Dependencies | DEP-12 |
| 5.4.3 | 3 | Fails — tracked | Issues | MAN-04, MAN-12 |
| 5.4.4 | 4 | Fails — tracked | Issues | ACC-17, LNK-02, NAV-02 |
| 5.4.5 | 5 | Fails — tracked | Issues | CON-01 |
| 5.4.6 | 6 | Fails — tracked | Issues | LNG-01 |
| 5.4.7 | 7 | Fails — tracked | Issues | LNK-01, LNK-02, LNK-03, MAN-11 + 22 page-level |
| 5.4.8 | 8 | Fails — tracked | Issues | CON-02, CON-05 |
| 5.4.9 | 9 | Fails — tracked | Issues | DOC-01 + 10 page-level |
| 5.4.10 | 10 | Fails — tracked | Issues | LNG-01, LNG-02 |