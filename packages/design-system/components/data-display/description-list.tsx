import * as React from "react";
import { cn } from "../../utils/cn";
import "./description-list.css";

export interface DescriptionItem {
  /** The field's name, as the department words it on the form. */
  term: string;
  /**
   * The recorded value. `null`, `undefined` and an empty string are all treated
   * as "nothing was recorded" and render the placeholder rather than a blank —
   * see `emptyText`.
   */
  value: React.ReactNode;
  /**
   * Take the full width of the grid regardless of `columns`. For an address, a
   * list of documents, or anything whose value wraps.
   */
  wide?: boolean;
  /** One line under the value — a unit, a source, or when it was recorded. */
  hint?: string;
}

export interface DescriptionListProps
  extends Omit<React.HTMLAttributes<HTMLDListElement>, "children"> {
  items: DescriptionItem[];
  /**
   * Columns at the widest breakpoint. The grid steps down to one column below
   * the estate's 768 breakpoint whatever this says, because two columns of
   * label-and-value on a narrow screen puts four words on each line.
   * @default 2
   */
  columns?: 1 | 2 | 3;
  /**
   * `stacked` puts the term above the value — the default, and the right choice
   * for a grid of many short fields. `inline` puts the term in a fixed leading
   * column, which reads better for a short single-column list.
   * @default "stacked"
   */
  layout?: "stacked" | "inline";
  /** @default "md" */
  size?: "md" | "sm";
  /** Draw a hairline under every row. Use it for a long single-column list. */
  divided?: boolean;
  /**
   * What to show where nothing was recorded. It is real text, not a dash alone:
   * a screen reader announces "—" as nothing at all, so a blank field and an
   * unanswered one become indistinguishable.
   * @default "Not recorded"
   */
  emptyText?: string;
}

/** Nothing recorded: null, undefined, or a string that is empty once trimmed. */
function isEmpty(value: React.ReactNode): boolean {
  if (value === null || value === undefined || value === false) return true;
  return typeof value === "string" && value.trim() === "";
}

/**
 * MoSJE / SAMAVESH Description List.
 *
 * A set of recorded facts about one thing — the label-and-value grid that every
 * *Application Detail*, *Beneficiary View* and *Review & Submit* screen in the
 * estate is mostly made of.
 *
 * It renders a real `<dl>` with `<dt>` and `<dd>`, which is what makes each
 * value announced together with the field it belongs to. The same grid built
 * from `<div>`s reads to a screen reader as an undifferentiated run of text —
 * "Date of birth 12 March 1994 District Bankura Status Pending" — with nothing
 * to say where one fact ends and the next begins.
 *
 * **An unrecorded value is a designed state, not a blank.** A field with nothing
 * in it renders `emptyText`, so the reader learns the department has no answer
 * rather than wondering whether the page failed to load. A field that should not
 * appear at all when there is no value is left OUT of `items` by the caller;
 * that is a different decision and it belongs to the page, not to this
 * component.
 */
export function DescriptionList({
  items,
  columns = 2,
  layout = "stacked",
  size = "md",
  divided = false,
  emptyText = "Not recorded",
  className,
  ...rest
}: DescriptionListProps): React.JSX.Element {
  return (
    <dl
      className={cn(
        "ds-dl",
        `ds-dl--${layout}`,
        `ds-dl--${size}`,
        `ds-dl--cols-${columns}`,
        divided && "ds-dl--divided",
        className,
      )}
      {...rest}
    >
      {items.map((item) => {
        const empty = isEmpty(item.value);
        return (
          <div
            key={item.term}
            className={cn("ds-dl__row", item.wide && "ds-dl__row--wide")}
          >
            <dt className="ds-dl__term">{item.term}</dt>
            <dd className={cn("ds-dl__value", empty && "ds-dl__value--empty")}>
              {empty ? emptyText : item.value}
              {item.hint ? <span className="ds-dl__hint">{item.hint}</span> : null}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
