# India map geometry

`india-states.paths.ts` is **generated** — do not hand-edit it.

It contains the 36 Indian states/UTs as static SVG path data, pre-projected so
the `IndiaMap` component needs **no** `d3-geo` / `topojson-client` at runtime.

## Source

`apps/portals/smile-admin/public/india-states.topo.json` (quantised TopoJSON,
`objects.states`, keyed by `st_nm` / `st_code`).

## Projection

Matches the legacy SMILE map 1:1 so existing dashboards look identical:

```
geoMercator().center([82.5, 22]).scale(950).translate([400, 280])
viewBox "0 0 800 560"
```

## Regenerate

```bash
node packages/design-system/components/data-display/charts/geo/generate-india-paths.mjs \
  [path/to/india-states.topo.json]
```

The generator decodes the delta-encoded arcs, applies the topology transform,
projects each point with the Mercator parameters above, and writes
`india-states.paths.ts`. Pass a different TopoJSON path as the first argument to
swap the source (e.g. an updated boundary set).
