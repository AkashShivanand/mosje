"use client";

import * as React from "react";

import { cn } from "../../utils/cn";
import { Button } from "../actions/button";
import { Skeleton } from "../feedback/skeleton";
import { Icon } from "../utilities/icon";
import { Chip } from "./chip";
import { FormField, type FormFieldControlProps } from "./form-field";
import { resolveFieldStatus, type FieldSize } from "./field-types";
import "./combobox.css";

export interface ComboboxOption {
  value: string;
  label: string;
  /** Shown after the label, quietly — a district's state, a scheme's code. */
  hint?: string;
  /**
   * A heading the option is listed under — a district's state. Options sharing
   * a group are drawn together under one heading, in the order each group
   * first appears in `options`.
   */
  group?: string;
  disabled?: boolean;
}

interface ComboboxBaseProps {
  /** Always visible. */
  label: string;
  options: ComboboxOption[];
  placeholder?: string;
  /** Wording for "your search matched nothing", which is not "there is nothing". */
  noMatchLabel?: string;
  /** Wording for a list with nothing in it at all, before anything is typed. */
  emptyLabel?: string;
  hint?: string;
  /** Error message. Blocks submission. Wins over `warning` and `success`. */
  error?: string;
  /** Warning message. Does not block. Wins over `success`. */
  warning?: string;
  /** Success message — a real check passed. */
  success?: string;
  /** Extra explanation, revealed by a button beside the label. */
  labelHelp?: React.ReactNode;
  /** Hide the label visually, keeping it for assistive technology. */
  labelHidden?: boolean;
  /**
   * Sets the error state without supplying a message. It exists so that
   * spreading `FormField`'s render-prop object onto this component degrades
   * rather than breaks. A message is still better — prefer `error`.
   */
  invalid?: boolean;
  required?: boolean;
  /** Rendered only when the form's policy is `optional`. */
  optional?: boolean;
  disabled?: boolean;
  /** Shows the answer; cannot be changed. No list, no remove buttons. */
  readOnly?: boolean;
  /** The same four steps as every other field. @default "md" */
  size?: FieldSize;
  /**
   * Submitted with a native `<form>`. The single mode posts one value; the
   * multiple mode posts one entry per chosen value under the same name.
   */
  name?: string;
  /**
   * Called with every keystroke's query — the hook for a SERVER search. Pair it
   * with `filterOptions={false}`, `loading` and `loadError`, and pass the
   * results back as `options`. Debouncing is the caller's.
   */
  onQueryChange?: (query: string) => void;
  /**
   * Filter `options` against the query here. Turn off when the options already
   * are the server's answer to the query. @default true
   */
  filterOptions?: boolean;
  /**
   * Show nothing until this many characters are typed — the "not asked yet"
   * state, for a list too long to draw whole or a search too costly to run on
   * one letter. @default 0
   */
  minQueryLength?: number;
  /** The options are being fetched. Draws a skeleton in the list's shape. */
  loading?: boolean;
  /** The options could not be fetched. Said in the list, with `onRetry`. */
  loadError?: string;
  /** Offered beside `loadError` as "Try again". */
  onRetry?: () => void;
  /**
   * The most rows drawn at once. Beyond it the list asks the reader to type
   * more — a popup of nineteen thousand villages helps nobody. @default 100
   */
  maxResults?: number;
  /** Merged into the input's `aria-describedby`. */
  describedBy?: string;
  id?: string;
  className?: string;
}

export interface ComboboxSingleProps extends ComboboxBaseProps {
  /** Omit, or `false`, for one answer. */
  multiple?: false;
  /** The selected option's `value`, or "" when nothing is chosen. */
  value: string;
  onChange: (value: string) => void;
}

export interface ComboboxMultipleProps extends ComboboxBaseProps {
  /**
   * Several answers from one long list. Chosen options sit in the field as
   * removable chips and the list stays open after each choice.
   */
  multiple: true;
  /** The chosen options' `value`s, in the order they were chosen. `[]` for none. */
  value: string[];
  onChange: (value: string[]) => void;
  /**
   * The most options that may be chosen. At the limit the rest of the list is
   * disabled and the list says why.
   */
  maxSelected?: number;
  /**
   * Chips drawn before the rest fold into a "+N more" button, so a long answer
   * cannot push the form down the page. `Infinity` never folds. @default 5
   */
  maxVisibleChips?: number;
}

/**
 * One component, two answers. `multiple` decides the shape of `value` and
 * `onChange`, so TypeScript refuses a `string[]` on a single field and a
 * `string` on a multiple one — the mistake is caught where it is written.
 */
export type ComboboxProps = ComboboxSingleProps | ComboboxMultipleProps;

type Resolved = {
  placeholder: string;
  noMatchLabel: string;
  emptyLabel: string;
  filterOptions: boolean;
  minQueryLength: number;
  maxResults: number;
};

type ControlProps<P> = P & Resolved & { control: FormFieldControlProps };

/** Case- and diacritic-insensitive contains. */
function matches(option: ComboboxOption, query: string): boolean {
  if (!query) return true;
  const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  return norm(option.label).includes(norm(query)) || norm(option.hint ?? "").includes(norm(query));
}

/**
 * SAMAVESH Combobox — type to narrow a long list, then choose.
 *
 * **Reach for this when the list is longer than a person will scroll.** Seven
 * hundred and odd districts, every scheme in the estate, a beneficiary by name.
 * Below roughly twenty options a `Select` is better: it needs no typing and
 * every assistive technology already knows it.
 *
 * ── IT IS A FORM FIELD, BUILT FROM THE FIELD PARTS ─────────────────────────
 *
 * The label, hint, help, messages, required marker, sizes and states are
 * `FormField`'s own, and the box is the `.ds-input-shell` every adorned `Input`
 * draws. It used to draw its own — a 12px label, a 4px gap, a 38px box with a
 * 4px corner, a 12px hint and an error with no glyph — and sat visibly out of
 * line in any row of fields (audit, 2026-09-18). Do not give it its own again.
 *
 * ── HOW IT DIFFERS FROM `FilterSelect`, WHICH LOOKS THE SAME ────────────────
 *
 * `FilterSelect` is a BUTTON that opens a listbox: focus moves to the list and
 * the button shows the current value. This is a real TEXT INPUT that filters —
 * focus never leaves it, and `aria-activedescendant` points at the highlighted
 * row. That is WAI-ARIA's combobox pattern, and the distinction is not cosmetic:
 * a screen reader announces a combobox as editable and tells the user how many
 * options remain after each keystroke, which is the entire point of typing.
 *
 * ── THE KEYBOARD MODEL ──────────────────────────────────────────────────────
 *
 *   type          filter; the list opens on the first character
 *   Down / Up     move the highlighted option (wrapping), opening if closed
 *   Home / End    first / last choosable match
 *   Enter         choose the highlighted option (multiple: add or remove it)
 *   Escape        close, keeping what is typed; again clears the field
 *   Tab           close and move on — a field that traps is worse than one that closes
 *
 * Enter and the arrows are ignored while an input method is composing, so a
 * reader typing in Hindi confirms the word, not an option.
 *
 * ── WHAT IT REFUSES TO DO ───────────────────────────────────────────────────
 *
 * **It never silently accepts unmatched text.** On blur, a query matching no
 * option reverts to the last chosen value. A combobox that keeps "Bankuraa" in
 * the box and "" in the form is how a district goes missing between the screen
 * and the database.
 *
 * ── `multiple` ──────────────────────────────────────────────────────────────
 *
 * Several answers from one long list — the districts an NGO works in, the
 * schemes an officer covers. Chosen options become chips inside the field; the
 * text box only ever holds the query. The list stays open after a choice.
 *
 *   Enter         add the highlighted option, or remove it if already chosen
 *   Backspace     in an empty box, remove the last chosen option
 *   Escape        close; again clears the query — NEVER the chosen options,
 *                 which would discard several decisions with one keystroke
 *
 * Past `maxVisibleChips` the chips fold into "+N more", so a long answer cannot
 * push the form down the page. Below roughly twenty options, a `CheckboxGroup`
 * (or a row of `Chip`s) is better: every option is visible, nothing is typed.
 */
export function Combobox(props: ComboboxProps): React.JSX.Element {
  const {
    label,
    hint,
    error,
    warning,
    success,
    labelHelp,
    labelHidden = false,
    required = false,
    optional = false,
    disabled = false,
    readOnly = false,
    size = "md",
    describedBy,
    id,
    className,
    placeholder = "Start typing to search",
    noMatchLabel = "No match. Check the spelling, or clear the box to see everything.",
    emptyLabel = "There is nothing to choose from yet.",
    filterOptions = true,
    minQueryLength = 0,
    maxResults = 100,
    multiple = false,
  } = props;
  const resolved: Resolved = { placeholder, noMatchLabel, emptyLabel, filterOptions, minQueryLength, maxResults };
  return (
    <FormField
      label={label}
      id={id}
      hint={hint}
      error={error}
      warning={warning}
      success={success}
      labelHelp={labelHelp}
      labelHidden={labelHidden}
      required={required}
      optional={optional}
      disabled={disabled}
      readOnly={readOnly}
      size={size}
      describedBy={describedBy}
      className={cn("ds-combobox-field", className)}
    >
      {(control) =>
        // Two implementations rather than one with branches through it: the
        // modes disagree about what the text box holds (the chosen label, or
        // only the query), when the list closes, and what Backspace and Escape
        // do. Hooks cannot be conditional, so the mode picks a component.
        multiple ? (
          <MultiCombobox {...(props as ComboboxMultipleProps)} {...resolved} control={control} />
        ) : (
          <SingleCombobox {...(props as ComboboxSingleProps)} {...resolved} control={control} />
        )
      }
    </FormField>
  );
}

/* ── Shared machinery ─────────────────────────────────────────────────────── */

/**
 * Every option this field has ever been shown, by value. A server search
 * replaces `options` on each keystroke, and a chosen value must keep its label
 * after the results that contained it have gone.
 */
function useOptionMemory(options: ComboboxOption[]) {
  const [memory, setMemory] = React.useState(() => new Map(options.map((o) => [o.value, o] as const)));
  // Updated DURING RENDER (React's adjust-state-on-prop-change pattern), and
  // compared by CONTENT, not identity: a caller mapping its options inline
  // hands over new objects every render, and an identity test would set state
  // on every render forever.
  const unseen = options.filter((o) => {
    const known = memory.get(o.value);
    return (
      !known ||
      known.label !== o.label ||
      known.hint !== o.hint ||
      known.group !== o.group ||
      known.disabled !== o.disabled
    );
  });
  if (unseen.length > 0) {
    const next = new Map(memory);
    for (const o of unseen) next.set(o.value, o);
    setMemory(next);
  }
  return (value: string): ComboboxOption | undefined => memory.get(value);
}

/** Options in list order: grouped by first appearance, capped at `max`. */
function arrange(options: ComboboxOption[], max: number): { shown: ComboboxOption[]; hidden: number } {
  const order: string[] = [];
  const byGroup = new Map<string, ComboboxOption[]>();
  for (const o of options) {
    const key = o.group ?? "";
    let bucket = byGroup.get(key);
    if (!bucket) {
      bucket = [];
      byGroup.set(key, bucket);
      order.push(key);
    }
    bucket.push(o);
  }
  const all = order.flatMap((k) => byGroup.get(k) ?? []);
  return { shown: all.slice(0, max), hidden: Math.max(0, all.length - max) };
}

type ListState = "idle" | "loading" | "error" | "empty" | "nomatch" | "results";

interface ListModel {
  state: ListState;
  shown: ComboboxOption[];
  hidden: number;
  /** What the hidden count region says after each change. */
  count: string;
}

function useListModel(
  options: ComboboxOption[],
  query: string,
  r: Resolved,
  loading: boolean | undefined,
  loadError: string | undefined,
): ListModel {
  return React.useMemo(() => {
    const q = query.trim();
    if (loading) return { state: "loading", shown: [], hidden: 0, count: "Searching" };
    if (loadError) return { state: "error", shown: [], hidden: 0, count: loadError };
    if (q.length < r.minQueryLength) {
      return {
        state: "idle",
        shown: [],
        hidden: 0,
        count: `Type at least ${r.minQueryLength} characters to search`,
      };
    }
    const filtered = r.filterOptions ? options.filter((o) => matches(o, q)) : options;
    if (filtered.length === 0) {
      const empty = options.length === 0 && q === "";
      return { state: empty ? "empty" : "nomatch", shown: [], hidden: 0, count: empty ? r.emptyLabel : "No matches" };
    }
    const { shown, hidden } = arrange(filtered, r.maxResults);
    const total = shown.length + hidden;
    return { state: "results", shown, hidden, count: `${total} ${total === 1 ? "match" : "matches"}` };
  }, [options, query, r.minQueryLength, r.filterOptions, r.emptyLabel, r.maxResults, loading, loadError]);
}

/** Keyboard movement over the rows a reader can actually choose. */
function useActiveRow(shown: ComboboxOption[], isDisabled: (o: ComboboxOption) => boolean) {
  const [raw, setActiveIndex] = React.useState(0);
  // Clamped during render: an index past the end of a shortened list would name
  // an option that is not there for one frame.
  const activeIndex = Math.min(raw, Math.max(0, shown.length - 1));

  const edge = (from: "start" | "end"): number => {
    const order = from === "start" ? shown.map((_, i) => i) : shown.map((_, i) => shown.length - 1 - i);
    for (const i of order) if (!isDisabled(shown[i] as ComboboxOption)) return i;
    return activeIndex;
  };

  const step = (delta: number) => {
    const n = shown.length;
    if (n === 0) return;
    setActiveIndex((i) => {
      for (let k = 1; k <= n; k += 1) {
        const next = (i + delta * k + n * n) % n;
        const o = shown[next];
        if (o && !isDisabled(o)) return next;
      }
      return i;
    });
  };

  return { activeIndex, setActiveIndex, edge, step };
}

/**
 * Opens upward when the space below the field cannot hold the list and the
 * space above can hold more — a field near the foot of a long form otherwise
 * opens a list the reader has to scroll the page to see.
 *
 * Measured by the handler that OPENS the list, never by an effect afterwards:
 * an effect would render the list once in the wrong place and then move it.
 */
function usePlacement(anchor: React.RefObject<HTMLElement | null>) {
  const [placement, setPlacement] = React.useState<"bottom" | "top">("bottom");
  const measure = React.useCallback(() => {
    if (!anchor.current) return;
    const rect = anchor.current.getBoundingClientRect();
    const below = window.innerHeight - rect.bottom;
    const above = rect.top;
    // 18rem is the list's cap in combobox.css.
    const wanted = 18 * parseFloat(getComputedStyle(document.documentElement).fontSize || "16");
    setPlacement(below < wanted && above > below ? "top" : "bottom");
  }, [anchor]);
  return { placement, measure };
}

interface ListProps {
  baseId: string;
  listId: string;
  label: string;
  model: ListModel;
  activeIndex: number;
  placement: "bottom" | "top";
  multiselectable?: boolean;
  isChosen: (o: ComboboxOption) => boolean;
  isDisabled: (o: ComboboxOption) => boolean;
  onChoose: (index: number) => void;
  onHover: (index: number) => void;
  listRef: React.RefObject<HTMLUListElement | null>;
  /** A line above the options — the multiple mode's limit notice. */
  notice?: string;
  showTicks?: boolean;
  noMatchLabel: string;
  emptyLabel: string;
  loadError?: string;
  onRetry?: () => void;
  minQueryLength: number;
}

function ComboboxList({
  baseId,
  listId,
  label,
  model,
  activeIndex,
  placement,
  multiselectable,
  isChosen,
  isDisabled,
  onChoose,
  onHover,
  listRef,
  notice,
  showTicks,
  noMatchLabel,
  emptyLabel,
  loadError,
  onRetry,
  minQueryLength,
}: ListProps): React.JSX.Element {
  // A press anywhere in the popup — a row, a heading, the scrollbar — must not
  // take focus from the input, or the field's blur closes the list under the
  // pointer. Mouse only: preventing a TOUCH start would stop the list scrolling.
  const keepFocus = (e: React.MouseEvent) => e.preventDefault();

  if (model.state !== "results") {
    return (
      /* eslint-disable-next-line jsx-a11y/no-static-element-interactions -- not a
         control: it only stops a press from taking focus out of the input, which
         owns every key (WAI-ARIA combobox pattern). */
      <div id={listId} className="ds-combobox__list ds-combobox__list--message" data-placement={placement} onMouseDown={keepFocus}>
        {model.state === "loading" ? (
          <div className="ds-combobox__skeleton" aria-hidden="true">
            <Skeleton height="1rem" width="70%" />
            <Skeleton height="1rem" width="55%" />
            <Skeleton height="1rem" width="62%" />
          </div>
        ) : model.state === "error" ? (
          <p className="ds-combobox__message">
            {loadError}
            {onRetry ? (
              <Button
                type="button"
                variant="primary"
                appearance="text"
                size="sm"
                className="ds-combobox__retry"
                onClick={onRetry}
              >
                Try again
              </Button>
            ) : null}
          </p>
        ) : (
          <p className="ds-combobox__message">
            {model.state === "idle"
              ? `Type at least ${minQueryLength} characters to search.`
              : model.state === "empty"
                ? emptyLabel
                : noMatchLabel}
          </p>
        )}
      </div>
    );
  }

  // Group runs, preserving the flat index each option's id and keyboard use.
  const runs: { group: string; items: { option: ComboboxOption; index: number }[] }[] = [];
  model.shown.forEach((option, index) => {
    const group = option.group ?? "";
    const last = runs[runs.length - 1];
    if (last && last.group === group) last.items.push({ option, index });
    else runs.push({ group, items: [{ option, index }] });
  });

  const row = ({ option, index }: { option: ComboboxOption; index: number }) => {
    const chosen = isChosen(option);
    const disabled = isDisabled(option);
    return (
      /* eslint-disable-next-line jsx-a11y/click-events-have-key-events -- the
         keyboard is on the input, which names this row with
         aria-activedescendant; focus never moves to the option itself. */
      <li
        key={option.value}
        id={`${baseId}-opt-${index}`}
        data-active={index === activeIndex}
        role="option"
        aria-selected={chosen}
        aria-disabled={disabled || undefined}
        className={cn(
          "ds-combobox__option",
          index === activeIndex && "is-active",
          chosen && "is-selected",
          disabled && "is-disabled",
        )}
        // Click, not pointerdown: a finger that lands on a row to scroll the
        // list must not choose it. Focus is kept by `keepFocus` above.
        onClick={() => onChoose(index)}
        onMouseMove={() => !disabled && index !== activeIndex && onHover(index)}
      >
        {showTicks ? (
          // A tick, not only weight: a chosen row reads as chosen without
          // comparing it to its neighbours.
          <span className="ds-combobox__option-check" aria-hidden="true">
            {chosen ? <Icon name="check" size={20} /> : null}
          </span>
        ) : null}
        <span className="ds-combobox__option-label">{option.label}</span>
        {option.hint ? <span className="ds-combobox__option-hint">{option.hint}</span> : null}
      </li>
    );
  };

  return (
    <ul
      ref={listRef}
      id={listId}
      role="listbox"
      aria-label={label}
      aria-multiselectable={multiselectable || undefined}
      className="ds-combobox__list"
      data-placement={placement}
      onMouseDown={keepFocus}
    >
      {notice ? (
        <li role="presentation" className="ds-combobox__notice">
          {notice}
        </li>
      ) : null}
      {runs.map((run, r) =>
        run.group ? (
          <li key={`g-${r}`} role="group" aria-labelledby={`${baseId}-group-${r}`} className="ds-combobox__group">
            <span id={`${baseId}-group-${r}`} role="presentation" className="ds-combobox__group-label">
              {run.group}
            </span>
            <ul role="none" className="ds-combobox__group-list">
              {run.items.map(row)}
            </ul>
          </li>
        ) : (
          run.items.map(row)
        ),
      )}
      {model.hidden > 0 ? (
        <li role="presentation" className="ds-combobox__notice">
          {`Showing ${model.shown.length} of ${model.shown.length + model.hidden}. Type more to narrow the list.`}
        </li>
      ) : null}
    </ul>
  );
}

/* ── Single ───────────────────────────────────────────────────────────────── */

function SingleCombobox({
  label,
  options,
  value,
  onChange,
  placeholder,
  noMatchLabel,
  emptyLabel,
  filterOptions,
  minQueryLength,
  maxResults,
  invalid,
  name,
  onQueryChange,
  loading,
  loadError,
  onRetry,
  control,
}: ControlProps<ComboboxSingleProps>): React.JSX.Element {
  const baseId = control.id;
  const listId = `${baseId}-list`;
  const countId = `${baseId}-count`;
  const { disabled = false, readOnly = false, required = false, size = "md" } = control;
  const status = resolveFieldStatus(control.status, invalid);

  const recall = useOptionMemory(options);
  const selected = value ? recall(value) : undefined;
  // A value with no option behind it is shown as itself rather than as nothing:
  // it is still what the form will submit.
  const selectedLabel = selected?.label ?? value;

  const [query, setQueryState] = React.useState(() => selectedLabel);
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const fieldRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);

  const setQuery = (q: string) => {
    setQueryState(q);
    onQueryChange?.(q);
  };

  /**
   * Resynced during render when the SELECTED LABEL changes (React's
   * adjust-state-on-prop-change pattern). Keying on the label rather than on
   * `options` means an inline options array re-rendering does not wipe what
   * the applicant is typing.
   */
  const [prevSelectedLabel, setPrevSelectedLabel] = React.useState(selectedLabel);
  if (prevSelectedLabel !== selectedLabel) {
    setPrevSelectedLabel(selectedLabel);
    setQueryState(selectedLabel);
  }

  // Filter only once the query differs from the chosen label — otherwise
  // opening a settled field shows exactly one option.
  const effectiveQuery = selected && query === selected.label ? "" : query;
  const model = useListModel(options, effectiveQuery, { placeholder, noMatchLabel, emptyLabel, filterOptions, minQueryLength, maxResults }, loading, loadError);
  const isDisabled = (o: ComboboxOption) => o.disabled === true;
  const { activeIndex, setActiveIndex, edge, step } = useActiveRow(model.shown, isDisabled);
  const { placement, measure } = usePlacement(fieldRef);
  const openList = () => {
    measure();
    setOpen(true);
  };
  const interactive = !disabled && !readOnly;

  function commitOrRevert() {
    setOpen(false);
    // Unmatched text must never survive as a value.
    if (query !== selectedLabel) setQuery(selectedLabel);
  }

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) commitOrRevert();
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  });

  React.useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector<HTMLElement>('[data-active="true"]')?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  const choose = (index: number) => {
    const option = model.shown[index];
    if (!option || option.disabled) return;
    onChange(option.value);
    setQuery(option.label);
    setOpen(false);
    inputRef.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.nativeEvent.isComposing || !interactive) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) openList();
        else step(1);
        return;
      case "ArrowUp":
        e.preventDefault();
        if (!open) openList();
        else step(-1);
        return;
      case "Home":
        if (!open) return;
        e.preventDefault();
        setActiveIndex(edge("start"));
        return;
      case "End":
        if (!open) return;
        e.preventDefault();
        setActiveIndex(edge("end"));
        return;
      case "Enter":
        if (!open) return;
        e.preventDefault();
        choose(activeIndex);
        return;
      case "Escape":
        e.preventDefault();
        // First Escape closes; a second clears. Closing and clearing are
        // different intents and one key should not do both at once.
        if (open) setOpen(false);
        else {
          setQuery("");
          onChange("");
        }
        return;
      case "Tab":
        if (open) commitOrRevert();
        return;
      default:
        break;
    }
  };

  const hasRows = model.state === "results" && model.shown.length > 0;

  return (
    <div ref={rootRef} className="ds-combobox">
      <div
        ref={fieldRef}
        className={cn("ds-input-shell", `ds-input-shell--${size}`, "ds-combobox__field")}
        data-status={status}
        data-size={size}
        data-disabled={disabled || undefined}
        data-readonly={readOnly || undefined}
      >
        <input
          ref={inputRef}
          id={baseId}
          className="ds-input ds-input--bare ds-combobox__input"
          type="text"
          role="combobox"
          autoComplete="off"
          placeholder={readOnly ? undefined : placeholder}
          value={query}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-autocomplete="list"
          aria-activedescendant={open && hasRows ? `${baseId}-opt-${activeIndex}` : undefined}
          aria-describedby={[control["aria-describedby"], open ? countId : null].filter(Boolean).join(" ") || undefined}
          aria-invalid={status === "error" || undefined}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!open) openList();
            setActiveIndex(0);
          }}
          onKeyDown={onKeyDown}
          onBlur={(e) => {
            // Blur into our own popup (the retry button) is not leaving the field.
            if (!rootRef.current?.contains(e.relatedTarget as Node)) commitOrRevert();
          }}
        />
        {interactive ? (
          /* raw-button-ok(primitive): the combobox's own listbox disclosure (WAI-ARIA combobox pattern) — out of the tab order, inside the field's border, placed by the field's stylesheet */
          <button
            type="button"
            className="ds-combobox__trigger"
            tabIndex={-1}
            aria-label={open ? "Hide suggestions" : "Show suggestions"}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              if (open) setOpen(false);
              else openList();
              inputRef.current?.focus();
            }}
          >
            <Icon name={open ? "expand_less" : "expand_more"} size={20} />
          </button>
        ) : null}
      </div>

      {name ? <input type="hidden" name={name} value={value} /> : null}

      {/* THE COUNT IS ANNOUNCED — a reader who cannot see the list shrink is typing blind. */}
      {open ? (
        <span id={countId} className="ds-sr-only" role="status">
          {model.count}
        </span>
      ) : null}

      {open ? (
        <ComboboxList
          baseId={baseId}
          listId={listId}
          label={label}
          model={model}
          activeIndex={activeIndex}
          placement={placement}
          isChosen={(o) => o.value === value}
          isDisabled={isDisabled}
          onChoose={choose}
          onHover={setActiveIndex}
          listRef={listRef}
          noMatchLabel={noMatchLabel}
          emptyLabel={emptyLabel}
          loadError={loadError}
          onRetry={onRetry}
          minQueryLength={minQueryLength}
        />
      ) : null}
    </div>
  );
}

/* ── Multiple ─────────────────────────────────────────────────────────────── */

function MultiCombobox({
  label,
  options,
  value,
  onChange,
  placeholder,
  noMatchLabel,
  emptyLabel,
  filterOptions,
  minQueryLength,
  maxResults,
  invalid,
  name,
  onQueryChange,
  loading,
  loadError,
  onRetry,
  maxSelected,
  maxVisibleChips = 5,
  control,
}: ControlProps<ComboboxMultipleProps>): React.JSX.Element {
  const baseId = control.id;
  const listId = `${baseId}-list`;
  const countId = `${baseId}-count`;
  const chosenId = `${baseId}-chosen`;
  const { disabled = false, readOnly = false, required = false, size = "md" } = control;
  const status = resolveFieldStatus(control.status, invalid);
  const interactive = !disabled && !readOnly;

  const [query, setQueryState] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  /**
   * What just changed, for a screen reader. A chip appearing is silent to
   * someone who cannot see it, and focus stays in the text box, so without
   * this a reader pressing Enter hears nothing at all.
   */
  const [announcement, setAnnouncement] = React.useState("");

  const rootRef = React.useRef<HTMLDivElement>(null);
  const fieldRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);

  const setQuery = (q: string) => {
    setQueryState(q);
    onQueryChange?.(q);
  };

  const recall = useOptionMemory(options);
  // De-duplicated: a value passed twice is one answer, and one chip.
  const values = React.useMemo(() => [...new Set(value)], [value]);
  const chosen = React.useMemo(() => new Set(values), [values]);
  // In the order chosen. A value with no option behind it still gets a chip,
  // labelled with the value itself — it is still what the form will submit,
  // and a chosen value the reader cannot see is one they cannot remove.
  const chips = values.map((v) => recall(v) ?? { value: v, label: v });
  const atLimit = maxSelected != null && values.length >= maxSelected;

  const model = useListModel(options, query, { placeholder, noMatchLabel, emptyLabel, filterOptions, minQueryLength, maxResults }, loading, loadError);
  const isDisabled = (o: ComboboxOption) => o.disabled === true || (atLimit && !chosen.has(o.value));
  const { activeIndex, setActiveIndex, edge, step } = useActiveRow(model.shown, isDisabled);
  const { placement, measure } = usePlacement(fieldRef);
  const openList = () => {
    measure();
    setOpen(true);
  };

  const folds = Number.isFinite(maxVisibleChips) && chips.length > maxVisibleChips;
  const visibleChips = folds && !expanded ? chips.slice(0, maxVisibleChips) : chips;
  const foldedCount = chips.length - visibleChips.length;

  const close = () => {
    setOpen(false);
    // The box only ever holds a query, so leaving it discards the query — the
    // single mode's refusal of unmatched text, with nothing to revert to.
    if (query !== "") setQuery("");
  };

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close();
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  });

  React.useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector<HTMLElement>('[data-active="true"]')?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  const commit = (next: string[], message: string) => {
    onChange(next);
    setAnnouncement(`${message} ${next.length} selected.`);
  };

  const remove = (option: ComboboxOption) => {
    commit(values.filter((v) => v !== option.value), `${option.label} removed.`);
    inputRef.current?.focus();
  };

  const toggle = (index: number) => {
    const option = model.shown[index];
    if (!option || option.disabled) return;
    if (chosen.has(option.value)) {
      commit(values.filter((v) => v !== option.value), `${option.label} removed.`);
    } else if (atLimit) {
      setAnnouncement(`You can choose up to ${maxSelected}. Remove one to choose ${option.label}.`);
      return;
    } else {
      commit([...values, option.value], `${option.label} added.`);
    }
    // Clear the query so the next choice starts from the whole list, and keep
    // the highlight on the option just chosen so a second Enter undoes it.
    if (query !== "") {
      setQuery("");
      if (filterOptions) {
        const whole = arrange(options, maxResults).shown;
        setActiveIndex(Math.max(0, whole.findIndex((o) => o.value === option.value)));
      }
    }
    inputRef.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.nativeEvent.isComposing || !interactive) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) openList();
        else step(1);
        return;
      case "ArrowUp":
        e.preventDefault();
        if (!open) openList();
        else step(-1);
        return;
      case "Home":
        if (!open) return;
        e.preventDefault();
        setActiveIndex(edge("start"));
        return;
      case "End":
        if (!open) return;
        e.preventDefault();
        setActiveIndex(edge("end"));
        return;
      case "Enter":
        if (!open) return;
        e.preventDefault();
        toggle(activeIndex);
        return;
      case "Backspace": {
        if (query !== "") return;
        const last = chips[chips.length - 1];
        if (last) remove(last);
        return;
      }
      case "Escape":
        e.preventDefault();
        if (open) setOpen(false);
        else if (query !== "") setQuery("");
        return;
      case "Tab":
        if (open) close();
        return;
      default:
        break;
    }
  };

  const hasRows = model.state === "results" && model.shown.length > 0;
  const describedBy = [chips.length > 0 ? chosenId : null, control["aria-describedby"], open ? countId : null]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={rootRef} className="ds-combobox">
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions -- see onMouseDown below */}
      <div
        ref={fieldRef}
        className={cn("ds-input-shell", `ds-input-shell--${size}`, "ds-combobox__field", "ds-combobox__field--multiple")}
        data-status={status}
        data-size={size}
        data-disabled={disabled || undefined}
        data-readonly={readOnly || undefined}
        // A press on the field's empty space reaches for the text box, as it
        // would on a single field whose whole face is the input. Not a control:
        // the text box inside it is, and owns the keyboard.
        onMouseDown={(e) => {
          const t = e.target as HTMLElement;
          if (interactive && (t === e.currentTarget || t.classList.contains("ds-combobox__values"))) {
            e.preventDefault();
            inputRef.current?.focus();
          }
        }}
      >
        <div id={`${baseId}-values`} className="ds-combobox__values">
          {visibleChips.map((option) => (
            <Chip
              key={option.value}
              size="sm"
              className="ds-combobox__chip"
              title={option.label}
              disabled={disabled}
              onDismiss={interactive ? () => remove(option) : undefined}
              dismissLabel={`Remove ${option.label}`}
            >
              {option.label}
            </Chip>
          ))}
          {folds ? (
            /* raw-button-ok(primitive): the chip row's own overflow disclosure, sized to the 24px chip rhythm inside the field */
            <button
              type="button"
              className="ds-combobox__more"
              aria-expanded={expanded}
              aria-controls={`${baseId}-values`}
              onClick={() => {
                setExpanded((v) => !v);
                inputRef.current?.focus();
              }}
            >
              {expanded ? "Show fewer" : `+${foldedCount} more`}
              <span className="ds-sr-only">
                {expanded ? "" : `, show all ${chips.length} selected`}
              </span>
            </button>
          ) : null}
          <input
            ref={inputRef}
            id={baseId}
            className="ds-input ds-input--bare ds-combobox__input"
            type="text"
            role="combobox"
            autoComplete="off"
            // Once something is chosen the chips say what the field is for.
            placeholder={chips.length === 0 && !readOnly ? placeholder : undefined}
            value={query}
            disabled={disabled}
            readOnly={readOnly}
            // A native `required` would demand TEXT, and this box is empty by
            // design once options are chosen — so it is stated here and
            // enforced by the proxy below.
            aria-required={required || undefined}
            aria-expanded={open}
            aria-controls={open ? listId : undefined}
            aria-autocomplete="list"
            aria-activedescendant={open && hasRows ? `${baseId}-opt-${activeIndex}` : undefined}
            aria-describedby={describedBy || undefined}
            aria-invalid={status === "error" || undefined}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!open) openList();
              setActiveIndex(0);
            }}
            onKeyDown={onKeyDown}
            onBlur={(e) => {
              if (!rootRef.current?.contains(e.relatedTarget as Node)) close();
            }}
          />
        </div>
        {chips.length > 0 && interactive ? (
          /* raw-button-ok(primitive): the same in-field trigger as the chevron beside it — same class, same 32px box, paired by `.ds-combobox__trigger + .ds-combobox__trigger` */
          <button
            type="button"
            className="ds-combobox__trigger"
            // Out of the tab order like the chevron: each chip already has its
            // own remove button, and Backspace clears from the keyboard.
            tabIndex={-1}
            aria-label="Remove all"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              commit([], "All removed.");
              setExpanded(false);
              inputRef.current?.focus();
            }}
          >
            <Icon name="close" size={20} />
          </button>
        ) : null}
        {interactive ? (
          /* raw-button-ok(primitive): the multiple-select form of the same listbox disclosure — see the single-select chevron above */
          <button
            type="button"
            className="ds-combobox__trigger"
            tabIndex={-1}
            aria-label={open ? "Hide suggestions" : "Show suggestions"}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              if (open) setOpen(false);
              else openList();
              inputRef.current?.focus();
            }}
          >
            <Icon name={open ? "expand_less" : "expand_more"} size={20} />
          </button>
        ) : null}

        {/*
          NATIVE VALIDATION FOR A FIELD WHOSE TEXT BOX IS EMPTY BY DESIGN. A form
          submitted with nothing chosen is stopped here, and the browser's focus
          on this proxy is handed straight to the real input.
        */}
        {required && interactive && values.length === 0 ? (
          <input
            className="ds-combobox__required-proxy"
            tabIndex={-1}
            aria-hidden="true"
            required
            value=""
            onChange={() => undefined}
            onFocus={() => inputRef.current?.focus()}
          />
        ) : null}
      </div>

      {name ? values.map((v) => <input key={v} type="hidden" name={name} value={v} />) : null}

      {chips.length > 0 ? (
        <span id={chosenId} className="ds-sr-only">
          {`${chips.length} selected: ${chips.map((o) => o.label).join(", ")}`}
        </span>
      ) : null}

      {/* Always mounted: a live region that appears with its text is often not read. */}
      <span className="ds-sr-only" role="status" aria-live="polite">
        {announcement}
      </span>
      {open ? (
        <span id={countId} className="ds-sr-only" role="status">
          {model.count}
        </span>
      ) : null}

      {open ? (
        <ComboboxList
          baseId={baseId}
          listId={listId}
          label={label}
          model={model}
          activeIndex={activeIndex}
          placement={placement}
          multiselectable
          showTicks
          isChosen={(o) => chosen.has(o.value)}
          isDisabled={isDisabled}
          onChoose={toggle}
          onHover={setActiveIndex}
          listRef={listRef}
          notice={atLimit ? `${maxSelected} chosen, the most allowed. Remove one to choose another.` : undefined}
          noMatchLabel={noMatchLabel}
          emptyLabel={emptyLabel}
          loadError={loadError}
          onRetry={onRetry}
          minQueryLength={minQueryLength}
        />
      ) : null}
    </div>
  );
}
