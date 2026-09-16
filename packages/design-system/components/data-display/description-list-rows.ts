/**
 * Where each item of a `DescriptionList` lands in the grid.
 *
 * `divided` needs this because CSS cannot name "the last row of a grid" when the
 * item count is variable: with two columns, six items put the rule-bearing pair
 * at positions 5 and 6, five items put it at position 5 alone, and a `wide` item
 * takes a whole row of its own. No `:nth-last-child()` is right for all three.
 * Placement is cheap to simulate and exact, so it is simulated.
 *
 * It lives in its own module rather than beside the component because the
 * component imports JSX and a stylesheet, and the estate's tests run under
 * `node --test`, which can read neither.
 */
export interface RowPlacementItem {
  /** Take the whole grid row regardless of the column count. */
  wide?: boolean;
}

export function rowOfEachItem(items: readonly RowPlacementItem[], columns: number): number[] {
  const rows: number[] = [];
  let row = 0;
  let col = 0;
  for (const item of items) {
    const span = item.wide ? columns : 1;
    if (col > 0 && col + span > columns) {
      row += 1;
      col = 0;
    }
    rows.push(row);
    col += span;
    if (col >= columns) {
      row += 1;
      col = 0;
    }
  }
  return rows;
}
