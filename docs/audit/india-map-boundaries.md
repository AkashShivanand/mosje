# The map of India — boundary source and political check

**Date:** 6 Oct 2026 · **Applies to:** `IndiaMap`, `IndiaBubbleMap`, `IndiaPointMap`
(`packages/design-system/components/data-display/charts/geo/`) and the SAMAVESH Figma
`IndiaMap` component.

## Source

Bharat Maps (NIC) — the State layer of `BharatMapService/Admin_Boundary_District` on
`mapservice.gov.in`, simplified from 1:50,000 Survey of India topographic data, Census 2011
codes. 36 States/UTs: Ladakh separate, Dadra and Nagar Haveli and Daman and Diu one UT.
Committed as `geo/source/bharat-maps-states.geojson`; re-fetched with
`generate-india-paths.mjs --fetch`. (The service's description still says "updated till
October 2017"; its data carries the 2019 and 2020 reorganisations.)

Replaced: `apps/hub/public/portals/smile-admin/india-states.topo.json`, inherited from the
SMILE portal, provenance unknown, no longer used — removed.

## What the bake now guarantees (it fails otherwise)

| Check | Result, 6 Oct 2026 |
|---|---|
| 36 States/UTs, estate names | ✓ |
| Every island ≥ 0.01 km² drawn (enlarged to a visible mark when too small, never moved) | ✓ Lakshadweep 21, Andaman and Nicobar 270 |
| India's four extreme points kept through simplification | ✓ 37.09°N (Ladakh), 6.75°N (Indira Point), 68.18°E (Kutch), 97.41°E (Arunachal Pradesh) — the northern, southern and western tips were being shaved before this check existed |
| 34 places land in the right State/UT, in the source AND as drawn | ✓ |

The places: **inside, in this State/UT** — Gilgit, Skardu, Hunza, Shaksgam Valley, Siachen
Glacier, Aksai Chin, Demchok (Ladakh); Muzaffarabad, Mirpur, Srinagar (Jammu and Kashmir);
Kalapani (Uttarakhand); Tawang, Kibithu (Arunachal Pradesh); Great Nicobar, Barren Island,
Port Blair (Andaman and Nicobar Islands); Kavaratti, Minicoy (Lakshadweep); Kanyakumari;
Diu; Yanam (Puducherry). **Outside India** — Lahore, Islamabad, Peshawar, Kathmandu, Thimphu,
Dhaka, Lhasa, Kashgar, Yangon, Colombo, Kachchativu (ceded to Sri Lanka, 1974), Malé, the
Coco Islands (Myanmar).

Checked by eye at 8× on the same date: Jammu and Kashmir and Ladakh whole; Kalapani and the
Lipulekh tip in Uttarakhand; Sir Creek as India draws it; Arunachal Pradesh whole; Mahe and
Yanam shown as Puducherry; the enclaves of 5 km² and more (Sunel, the Uttar Pradesh pieces
in Madhya Pradesh, Dadra and Nagar Haveli's pieces in Gujarat) kept.

## What drawing choices were made, and why they do not alter a boundary

- **Islands too small to see** are drawn as a 2.4-unit hexagon at their true position, as
  official small-scale maps exaggerate them. Nothing is moved.
- **Enclaves under 5 km²** are drawn true to size (invisible at national scale), not
  enlarged — enlarging them would paint a blob inside the neighbouring State.
- **Chandigarh, Delhi, Puducherry, Dadra and Nagar Haveli and Daman and Diu** carry a hollow
  locator ring for focus and click; the boundary inside it is the true one.
- **Lakshadweep** is its island cluster; the click target is an invisible box around it.
- **No neighbouring country is drawn**, and no line beyond India's boundary.

## For the Department

1. Approve the map before it is published, and word the credit line under it — suggested:
   "Boundaries: Bharat Maps (NIC), from Survey of India data."
2. Confirm whether any Survey of India statement is required under a map on the estate,
   and its exact wording — to be taken from the Department or Survey of India, not
   composed here.
