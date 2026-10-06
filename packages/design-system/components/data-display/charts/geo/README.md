# India map geometry

`india-states.paths.ts` is **generated** — do not hand-edit it.

It holds the 36 States/UTs as static SVG path data, pre-projected so `IndiaMap`,
`IndiaBubbleMap` and `IndiaPointMap` need **no** `d3-geo` / `topojson-client` at runtime.

## Source

**Bharat Maps (NIC)** — the Government of India's own map service: the State layer of
`BharatMapService/Admin_Boundary_District` on `mapservice.gov.in`, simplified from 1:50,000
Survey of India topographic data and coded with Census 2011 codes. It is current to the 36
States/UTs (Ladakh separate; Dadra and Nagar Haveli and Daman and Diu one UT).

The download is committed as `source/bharat-maps-states.geojson` (~180 KB, never shipped to
the browser), so a bake is reproducible offline and a boundary change is a reviewable diff.
Until 6 Oct 2026 the paths came from a TopoJSON inherited from the SMILE portal, of unknown
provenance.

## Projection

Unchanged, and shared with `india-projection.ts`, which places points on the same map:

```
geoMercator().center([82.5, 22]).scale(950).translate([400, 280])
```

The viewBox is the land plus a margin, computed from the baked paths.

## Regenerate

```bash
node packages/design-system/components/data-display/charts/geo/generate-india-paths.mjs --fetch
```

`--fetch` re-downloads the source (through `curl`, because the service omits its intermediate
certificate and Node's `fetch` will not recover it); without it the bake reads the committed
source. Weight is a design decision: the baked file is ~29 KB gzipped.

## Islands and enclaves — nothing is lost

At dashboard sizes 1 km is a fifth of a pixel, so a plain simplification deletes Lakshadweep
and most of the Andaman and Nicobar Islands. As official small-scale maps do:

- **every island of at least 0.01 km² is kept at its true position**, and one too small to see
  is drawn at a minimum mark (a hexagon 2.4 units across) — enlarged, never moved. The bake **fails** if
  any island or mainland piece in the source does not reach the output.
- **an enclave** (a piece of one State/UT inside another's land — Yanam in Andhra Pradesh,
  Sunel in Madhya Pradesh) of at least 5 km² is kept at the minimum mark; a smaller one is drawn
  true to size, which at national scale is invisible, as on those maps.

`IndiaMap` then draws a thin neutral coastline beneath the regions, so small islands read on
the page, gives Chandigarh, Delhi, Puducherry and Dadra and Nagar Haveli and Daman and Diu a
hollow locator ring, and makes Lakshadweep's island cluster itself the clickable target.
