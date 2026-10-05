# KPI Dashboard — Proforma Gaps and Open Questions

**Source read:** `SAMAVESH_KPI_Data_Collection_Proforma` (Google Sheet
`1vAfUspPKxsqJSY1n6O-R3XqUP05g74ix5pjYdk7RhlM`), all six tabs, 5 Oct 2026.
**Built from it:** the KPI register (`apps/hub/src/lib/kpi/register.ts`) and the website
Dashboard in all three designs (`/website/dashboard`, `/website/dashboard/<portal>`). The
officer roles are views of the same pages, chosen in the demo rail's View As tab — the
Dashboard is not connected to any portal's login (decided 5 Oct 2026).

This file is where the things the dashboard deliberately does **not** say on screen are
written down (`.claude/rules/ui-restraint-and-copy.md`).

## 1. Collection status (tracker tab)

| Received | Portal | Rows | Notes |
|---|---|---|---|
| ✅ 24.09.2026 | SMILE – Beggary | 43 (42 unique) | Row 44 duplicated; no row 35. 6 KPIs not yet on the portal (Column J = No). |
| ✅ 24.09.2026 | NMBA | 6 | **Names only.** No type, category, definition, unit, source, frequency or formula. The sheet's API links point at `localhost:7004`; the same endpoints are public at `https://nashamukt-api-user.mosje.in/api/v1/user/` and the dashboard now reads them live (§4). |
| ✅ 18.09.2026 | e-Utthaan (DAPSC) | 5 | All public; no officer KPIs. |
| ✅ OM 30.09.2026 | SHRESHTA (e-Anudaan) | 5 | See §3. Tracker also lists NAPDDR, SMILE and AVYAY under e-Anudaan with no tab for them. |
| ⏳ | 17 others | — | DoSJE, DAF, BJRNF, SCW, NISD, NCSK, NCBC, NBCFDC, NSFDC, NSKFDC, DAIC, NCSC, DWBDNC, NOS, Transgender, NHAPOA, PM-AJAY. |

Tracker housekeeping: SCW appears in both phases; "NSDFC" should read NSFDC; the
proforma's "Total KPIs entered" counter reads 0; the SMILE tab's dropdowns are `#REF!`.

## 2. Columns the proforma should gain

The dashboard needed each of these and had to supply them itself:

| Column | Why | What the build assumed |
|---|---|---|
| **Breakdown / dimensions** (state, district, FY, gender, category) | Without it there is no "by area" view and no officer scope | SMILE: state → district; NMBA: state; DAPSC and SHRESHTA: national only |
| **Lowest level visible** (national / state / district) | Decides what a State or District officer may see | `levels` per KPI in the register |
| **Period type** (cumulative vs period, FY to date) | "Identified" is cumulative; "Fund Released" is per period — the card cannot say which | One period line per portal |
| **Target / benchmark** | A utilisation % or a DAPSC allocation means little without the mandate | DAPSC mandate modelled per Ministry |
| **API endpoint and owner** | Needed to replace the model with live data | None — every portal is illustrative |
| **Privacy class** (aggregate only / suppress small counts) | The SMILE CNCP row already asks for it in a remark | Aggregates only everywhere |
| **One fixed vocabulary** for KPI Type and Category | The tabs spell KPI Type four ways and use 11 categories against a 5-item dropdown | Normalised in `lib/kpi/categories.ts` |

## 3. Rows to confirm with the portals

- **SHRESHTA #3 and #5** match the proforma's grey *illustrative example* rows word for word. Confirm they are SHRESHTA's own.
- **SHRESHTA #4** "No. of Applications Sanctioned" is defined as "Funds released to the NGOs" (an amount) with unit Number and a COUNT formula.
- **e-Utthaan #2** "Expenditure (B.E. and R.E.)" — expenditure has no B.E./R.E.; source PFMS vs e-Utthaan.
- **SMILE – Beggary** remarks still marked "confirm": treatment of Cancelled records (#1), stage-wise vs cumulative Mobilised (#2), "pilot cities" wording (#6), source of utilisation (#10), whether Under Rehabilitation counts as rehabilitated (#11), the 50-record cap for the State role (#44).

## 4. Illustrative figures — where each comes from

| Portal | Real (snapshot) | Modelled from |
|---|---|---|
| Beneficiary Dashboard | **All of it** — dosje.gov.in/dashboard, cards and chart data, 05.10.2026 | — |
| SMILE – Beggary | — | The SMILE Admin prototype's own illustrative All India overview (`lib/smile-admin/mock-data.ts`) and its state split |
| NMBA | **LIVE**, hourly, from the portal's public API: people, women and youth reached, pledges and Nasha Mukti Mitras, national and for every State/UT (`lib/kpi/feeds/nmba.ts`). The 19.06.2026 mirror is the fallback when the API does not answer. | Helpline calls on 14446 only — the API does not carry them — at two per 1,000 people reached, scaled to the live total |
| DAPSC | — | Allocation of the order of Statement 10A; per-Ministry mandate illustrative |
| SHRESHTA | — | Illustrative |

Known inconsistency: the SMILE Admin prototype's state rows sum to 21,904 against its All
India 19,810. The dashboard keeps All India at 19,810 and scales the state shape to it, so
its Maharashtra (3,898) differs from the SMILE Admin prototype's Maharashtra (4,120).

## 5. A wording question for the live Beneficiary Dashboard

The website's Beneficiary Dashboard is a replica of the live page and keeps its words
verbatim. One of them is worth raising with the Department: the Top Class Education card
labels "SCHOOLS 45,228" and "COLLEGES 37,937", and the live page's own Year on Year chart
shows these are **students placed** (1,275 + 3,177 + 13,769 + 27,007 = 45,228), not schools.

## 6. Connecting the other portals

NMBA shows the pattern every portal follows (`lib/kpi/feeds/`, `lib/kpi/live.ts`): a server
fetch with a short timeout and an hourly revalidate that never throws; the register's KPI
ids as the keys; per-KPI live-over-model in the Live + illustrative mode; and a comparison
(the state map) taken whole from one source or the other, never mixed. For each portal the
Department needs: the endpoint, whether it needs a key, and a sample response.

## 7. Where the replica departs from the live Beneficiary Dashboard, and why

The replica (`components/kpi-dashboard/DepartmentOverview.tsx`) is built only from
design-system parts. The local stylesheet holds the section grids alone. These are the places
it deliberately differs from dosje.gov.in/dashboard (read 5 Oct 2026). Each one is a
design-system rule taking precedence over a pixel match (`standards-precedence.md`).

| Live | Replica | Reason |
|---|---|---|
| Amber band `#c87d17`-ish under white text | Warning band 700→600 | White on the live amber is about 3.1:1, below AA for 16–17px text. Info (teal) also steps one rung darker for the same reason. |
| Violet header on the Year on Year hostel card | Primary (blue) band | The design system has no violet tone. Its only violet is a chart slot, which is reserved for data series. |
| Green figures on the Hostel and Dr. Ambedkar cards | Blue (the hostel card's tone) and ink | A figure takes its card's tone. A danger-toned card keeps ink, because a red figure reads as a breach. |
| Ring colours: navy, two greens, ochre, lavender… | Categorical slots 1–9 | Colour-blind separation (`check:chart-palette`). |
| SC/OBC lines blue/green, then orange/brown | Slot 1 / slot 4 in both views | One series keeps one colour across views. Series never wear a status scale. |
| Navy bars | Slot 1 blue | As above. Slot 10 (navy) is outside the gated 1–9. |
| Section headings 28px | `SectionTitle size="display"` (32px at desktop) | The DS heading. A local size override fought it. |
| Figures 700 weight, dashed rules | Headline 600, hairline rules | The type-linkage gate (headline = 600) and `DescriptionList divided`. |
| "Fund Released: ₹117 Cr" on one line | Term above value | `DescriptionList` stacked layout. |
| No "View as Table" | Every chart offers it | The charts' accessible table. |
