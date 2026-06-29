# DataTable v2 — Robust, Accessible, Responsive Shared Table

**Date:** 2026-06-25
**Component:** `@mosje/design-system` → `components/data-display/`
**Status:** Design approved; spec for review before implementation planning.
**Blast radius:** Shared component re-exported by every portal (NMBA, SCW, SMILE, PM-AJAY, …). All changes MUST be backward compatible.

---

## 1. Problem

The current `DataTable` paginates a fully in-memory dataset and renders semantic `<table>` markup with `scope="col"` and a `<caption>`. It lacks: sorting, sticky header/column, a responsive (mobile) view, row selection, column visibility/density controls, loading states, and a server-side data path. For government MIS screens that can hold large datasets and must work on phones under GIGW, these are required.

## 2. Goals

- A single shared table that scales from a 3-row master list to a server-paginated 100k-row register.
- Conformance to WCAG 2.1 AA / GIGW 3.0 and DBIM (semantic markup, `aria-sort`, accessible selection, visible focus, AA contrast, finger-sized targets, mobile-usable).
- **Purely additive API** — every existing call site keeps working with zero changes.

## 3. Non-goals (explicit YAGNI)

Row virtualization; column-level filters; column resize/reorder; CSV export (stays in `TCListPage`); global free-text search (stays in the page wrapper).

## 4. Data model

Two modes, selected by props:

- **Uncontrolled / client-side (default, current behaviour):** parent passes all `data` + `total`; the component sorts, selects, and paginates internally. Only one page of rows is ever in the DOM.
- **Controlled / server-side (opt-in):** parent passes the current page's `data` + the server `total`, sets `manualPagination` (and optionally `manualSorting`), and handles `onPageChange` / `onPageSizeChange` / `onSortChange`. The browser never holds the full dataset.

```tsx
// existing — unchanged
<DataTable columns={cols} data={rows} total={rows.length} />

// new — server mode
<DataTable
  columns={cols}
  data={pageRows}
  total={serverTotal}
  manualPagination
  page={page}
  onPageChange={setPage}
  pageSize={size}
  onPageSizeChange={setSize}
  manualSorting
  sortBy={sortBy}
  sortDir={sortDir}
  onSortChange={setSort}
  loading={isFetching}
/>
```

## 5. File structure (`components/data-display/`)

- `data-table.tsx` — composition + markup (desktop `<table>` + mobile card list).
- `use-data-table.ts` — headless state hook (sort, selection, pagination, density, column visibility). Controlled props win; otherwise internal state. Single source of truth for derived rows.
- `data-table-toolbar.tsx` — column show/hide menu, density toggle, and the bulk-action bar.
- `data-table.css` — extend existing `.ds-table*` token-driven styles (sticky, density, responsive, skeleton, selection).

Rationale: the component is growing past one-purpose; isolating state (hook), chrome (toolbar), and markup keeps each unit understandable and testable.

## 6. API additions (all optional)

### Column (`DataTableColumn<T>`)
| Prop | Type | Purpose |
| --- | --- | --- |
| `sortable` | `boolean` | Enable sorting on this column |
| `sortAccessor` | `(row) => string \| number` | Custom sort value (default `row[key]`) |
| `align` | `'left' \| 'right' \| 'center'` | Cell + header alignment (replaces ad-hoc `className`) |
| `sticky` | `boolean` | Marks the sticky first column (first one wins) |
| `hideable` | `boolean` | Eligible for the column-visibility menu |
| `defaultHidden` | `boolean` | Start hidden (user can re-enable) |
| `mobileLabel` | `string` | Label in the stacked card (default `header`) |
| `mobilePrimary` | `boolean` | This column's value is the card heading |

Existing column props (`key`, `header`, `render`, `className`, `exportValue`, `noExport`) are unchanged.

### Table (`DataTableProps<T>`)
| Prop | Type | Purpose |
| --- | --- | --- |
| `loading` | `boolean` | Render skeleton rows preserving column widths |
| `sortBy` / `sortDir` | `string` / `'asc'\|'desc'` | Controlled sort state |
| `defaultSortBy` / `defaultSortDir` | same | Uncontrolled initial sort |
| `onSortChange` | `(by, dir) => void` | Sort callback |
| `manualSorting` | `boolean` | Parent performs the sort (server mode) |
| `manualPagination` | `boolean` | Parent performs pagination (server mode) |
| `page` / `onPageChange` | `number` / `(p) => void` | Controlled pagination |
| `pageSize` / `onPageSizeChange` | `number` / `(n) => void` | Controlled page size |
| `selectable` | `boolean` | Enable the checkbox column |
| `getRowId` | `(row) => string` | Stable id for selection (default `id`/`registrationNumber`/`sno`) |
| `selectedIds` / `onSelectionChange` | `Set<string>` / `(ids) => void` | Controlled selection |
| `bulkActions` | `(ids) => React.ReactNode` | Bulk-action bar content when rows selected |
| `enableColumnVisibility` | `boolean` | Show the column show/hide menu |
| `density` / `enableDensityToggle` | `'comfortable'\|'compact'` / `boolean` | Row density + toggle |
| `responsive` | `'cards' \| 'scroll'` | Mobile layout (default `cards`) |

Existing table props (`columns`, `data`, `total`, `pageSizes`, `caption`, `emptyLabel`, `className`) are unchanged.

## 7. Behaviour & accessibility

- **Sorting:** sortable headers render `<th aria-sort="ascending|descending|none">` wrapping a real `<button>` (keyboard-operable). Click/Enter/Space cycles asc → desc → none. The sort-direction glyph is `aria-hidden`. A visually-hidden `role="status"` region announces "Sorted by {column}, ascending". In `manualSorting`, the component only reflects state and fires `onSortChange`.
- **Selection:** a leading checkbox column. The header checkbox is "Select all on this page" with a correct **indeterminate** state. Each row checkbox is labelled by the row's `mobilePrimary`/name value. Selection count is announced via a `role="status"` region. The bulk-action bar renders above the table only when `selectedIds` is non-empty.
- **Sticky:** CSS `position: sticky` for the header (`top: 0`, solid background, raised `z-index`) and, when a column has `sticky`, for the first column (`left: 0`). No JS.
- **Column visibility / density:** a toolbar menu lists `hideable` columns as checkboxes (accessible menu pattern: `aria-haspopup`, focus management, Escape). Density toggle uses `aria-pressed`; `compact` reduces row padding via a `data-density` attribute on the root.
- **Responsive (`cards`):** under the breakpoint each row renders as a card; each cell shows `mobileLabel: value` via a `data-label` attribute, and `mobilePrimary` becomes the card heading. Desktop `<table>` and mobile card list are both authored from the same column defs; the inactive layout uses `display:none` (removed from the a11y tree — no double read). `scroll` mode keeps the table and pins the sticky first column.
- **Loading:** `loading` renders shimmer skeleton rows that preserve column widths to avoid layout shift; honours `prefers-reduced-motion`.
- **Preserved:** `scope="col"`, `<caption>`, accessible pagination (`aria-label`, `aria-current`), AA contrast, visible ≥3:1 focus rings.

## 8. Phasing

- **Phase 1:** sorting, sticky header + first column, responsive cards, loading skeletons, controlled pagination/sorting (server mode), the `use-data-table` hook split. Adopt on **Peer Educators** as the reference (enable sorting + mobile).
- **Phase 2:** row selection + bulk-action bar, column visibility + density toolbar. Adopt selection on Peer Educators.

Each phase is independently shippable and backward compatible.

## 9. Rollout

1. Build in DS; the NMBA `@/components/data-table` re-export picks it up automatically.
2. Reference adoption on Peer Educators; other portals opt in later, no forced migration.

## 10. Design-system sync obligations (per `.claude/rules/design-system.md`)

- Update `packages/design-system/design.md` (DataTable entry + behaviours) and `AGENTS.md` (inventory), bump `Last reviewed`.
- Update `apps/docs` DataTable page and `apps/docs/src/lib/nav.ts` (keeps `llms.txt` correct).
- Run `npm run build -w @mosje/tokens` && `npm test -w @mosje/tokens` (no token changes expected — assert contract intact).
- `design-system-guardian` review pass before merge.

## 11. Verification

- `tsc` + `eslint` clean across DS and NMBA.
- Existing call sites compile and render unchanged (backward-compat check).
- Live checks in the NMBA preview: sort toggles + `aria-sort`, sticky header on scroll, selection + indeterminate header checkbox + bulk bar, column-visibility menu, density toggle, mobile card layout at a narrow viewport, loading skeleton, keyboard operability of all controls, focus-ring contrast.
- Accessibility re-audit via the `accessibility-auditor` agent on the final component.

## 12. Backward compatibility

No prop is removed or repurposed. Defaults reproduce today's behaviour exactly: `responsive` defaults to `cards` (visual-only below the breakpoint; desktop unchanged), sorting/selection/toolbar are off unless enabled, pagination stays uncontrolled unless `manualPagination` is set.
