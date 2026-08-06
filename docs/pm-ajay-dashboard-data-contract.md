# PM-AJAY Dashboard — Data Contract

**To:** Ranjan Mondal, Amit Nautiyal
**From:** Akash Kumar (Design)
**Date:** 27 July 2026
**Re:** KPI + data structure needed for the Ministry dashboard redesign (per today's call)

---

## What this is, and why it's a table and not a question

On the call I asked for the data structure rather than the data. This sheet is that request, made
concrete. **I do not need real values.** I need the *shape* — because the shape decides the chart, and
the chart decides the layout. A number that varies by year plots differently from one that varies by
district; a comparison of two series needs three axes, not two; a percentage without a stated
denominator cannot be drawn at all.

Fill the tables below with dummy values. If a field is unknown, write `UNKNOWN` — that is a useful
answer and I will design around it. Please do not leave cells blank.

**Design is not blocked on this.** I am building the wireframe on my own assumptions (listed in §5)
and will label every one of them in the prototype. What you return either confirms an assumption or
corrects it. Anything you correct is cheap now and expensive after the ministry demo.

---

## 1. The two fields that are always missed

Before the tables, the two columns that block layout more than any others:

**Denominator.** Every percentage on a dashboard is a percentage *of something*. "60% approved" — of
total proposals received this FY, or of total ever received, or of the sanctioned target? Three
different charts. If a metric is a percentage or is ever shown as one, name what it divides by.

**Lowest available level.** If a number exists at state level but not district level, the drill-down
must stop there and say so. Guessing this wrong produces a dead click in front of the Secretary.

---

## 2. Metric sheet — fill one row per metric, per component

Copy this table three times: once for **Grant-in-Aid (GIA)**, once for **Hostel**, once for
**Adarsh Gram (PMAGY)**.

| # | Metric name | Plain definition (one sentence, as a Secretary would read it) | Type | Denominator | Varies by | Lowest level available | Comparison axis | Source table / API |
|---|---|---|---|---|---|---|---|---|
| 1 | | | | | | | | |
| 2 | | | | | | | | |

**Column values to use:**

- **Type** — one of: `count` · `amount (₹)` · `percent` · `days` · `ratio` · `text`
- **Varies by** — all that apply: `geography` · `financial year` · `month` · `component` · `status` · `indicator` · `scheme` · `none`
- **Lowest level available** — one of: `national` · `state` · `district` · `block` · `village / GP` · `institution`
- **Comparison axis** — one of: `year-on-year` · `month-on-month` · `vs target` · `vs other states` · `none`

**Worked example** (Adarsh Gram, so the format is unambiguous):

| # | Metric name | Plain definition | Type | Denominator | Varies by | Lowest level | Comparison axis | Source |
|---|---|---|---|---|---|---|---|---|
| 1 | Eligible Villages | Villages meeting the PMAGY eligibility rule of SC population ≥ 50% and ≥ 500 persons. | count | — (this *is* the denominator for the lifecycle) | geography | village / GP | vs other states | `pmagy_village_master` |
| 2 | VDP Drafted | Eligible villages for which a Village Development Plan has been drafted and saved. | count | Eligible Villages | geography, FY | village / GP | year-on-year | `pmagy_vdp` |
| 3 | Released: State → District | Funds released by the State to district implementing agencies. | amount (₹) | Mother Sanction Issued | geography, FY | district | year-on-year | `pmagy_fund_release` |

---

## 3. Sample rows — three per component, in the real shape

For each component, three dummy rows of the actual record you'd return from the API. Column names as
they really are. This is the single most useful thing in this sheet.

```
Component: Adarsh Gram
state_code | state_name | district_code | district_name | fy      | eligible | vdp_drafted | dlcc_approved | declared
UP         | Uttar Pradesh | UP-LKO    | Lucknow       | 2025-26 | 1240     | 1010        | 780           | 520
...
```

---

## 4. Six questions that decide the layout

Short answers are fine.

1. **Geographic depth per component** — does GIA go below district? Does Hostel? Does Adarsh Gram go
   to individual village, or stop at Gram Panchayat?
2. **Time granularity** — is anything captured monthly, or is Financial Year the only time dimension?
   This decides whether trends are lines or year bars, and whether we ship trends in v1 at all.
3. **Monitorable indicators (Adarsh Gram)** — how many are there, are they grouped into domains, and
   can more than one be viewed at a time?
4. **Ageing** — for pending items, do we have a "pending since" date? If yes, pendency becomes an
   ageing chart instead of a flat count, which is far more actionable for the ministry.
5. **Targets** — is there a sanctioned target per state per FY for any of these? Without targets,
   nothing can be shown as "% of goal", only as "% of total".
6. **Anything the department has specifically asked to see** — if the department has named a metric
   it wants at the top of the ministry dashboard, tell me and it goes at the top. Otherwise I will
   prioritise the layout myself, as agreed on the call, and you review the result.

---

## 5. Assumptions I am building on right now

If any of these is wrong, correcting it here costs an hour. Correcting it after the demo costs the
demo.

**Adarsh Gram**

- Four-level geography: India → State → District → Village (GP).
- Lifecycle is four monotonically-decreasing village counts, all percentages against **Eligible
  Villages** as a fixed denominator: Eligible → VDP Drafted → DLCC-approved VDP → Declared Adarsh Gram.
- Eligibility rule is SC population ≥ 50% and ≥ 500 persons.
- Action items are **derived** as gaps between adjacent stages, so they cannot contradict the funnel:
  VDP Not Generated = Eligible − VDP Drafted; DLCC Approval Pending = VDP Drafted − DLCC-approved;
  Approved-Not-Declared = DLCC-approved − Declared.
- Monitorable indicators vary by indicator × geography × status (Identified / Completed / In Progress /
  Pending), plus identified cost in ₹ Cr and a beneficiary coverage pair.
- Financial cascade is four stages, each a percentage of the stage above: Mother Sanction Issued →
  Released State→District → Released District→GP → UC Submitted by State.

**GIA and Hostel**

- Status pipeline: Total → Pending / Returned / Rejected / Approved, with Total as denominator and
  approval rate = Approved ÷ Total.
- Hostel additionally has Legacy Proposals as a status, and a capacity dimension (sanctioned seats,
  occupancy) that GIA does not have.
- Both stop at block level; no village-level GIA or Hostel data.

**Cross-cutting**

- Financial Year is the only time dimension in v1.
- Percentages are always against a named denominator, never against a total that isn't on screen.

---

## 6. Four corrections needed in the current prototype

Independent of this sheet — these are in the prototype shown on the call and need fixing before it is
shown to the ministry, dummy data or not.

1. **"Eligible, Not Declared — 1,631 (11%)" is arithmetically impossible.** With Eligible 15,272,
   DLCC-approved 9,233 and Declared 6,310, the value is either 8,962 (59% of eligible) or 2,923 (19%
   of DLCC-approved). The other two action items derive correctly — 15,272 − 12,394 = 2,878 ✓ and
   12,394 − 9,233 = 3,161 ✓ — so this one reads as a transcription error. It is the first thing a
   scheme officer will check.
2. **"Block Spread — GIA projects across Lucknow"** lists Jagner, Saiyan, Pinahat, Shamsabad,
   Khandauli and Achhnera. Those are **Agra** blocks, not Lucknow. Anyone from UP catches this
   instantly.
3. **Three geographies on one screen.** The page header reads `All States — National`, Monitoring
   Indicator Progress reads `West Bengal`, and Financial Progress reads `Rajasthan`. One scope bar
   must govern the whole page; individual cards should not carry their own geography selector.
4. **Production says 47,333 villages covered; the prototype's funnel starts from 15,272 eligible.**
   Either "covered" and "eligible" are different measures — in which case say so — or the dummy data
   is off by roughly 3×. Needs a prominent illustrative-data statement, not the current small chip.

---

Please return §2, §3 and §4 in one document. Anything is more useful than nothing — even a partial
sheet lets me lock the parts it covers.
