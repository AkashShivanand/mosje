"use client";

import * as React from "react";
import { Icon, IconButton, Input, Select } from "@mosje/design-system";
import "./ui.css";

export interface DbimSelectControl {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  /** The option shown when nothing is chosen, e.g. "Category" or "Sort by". */
  placeholder: string;
  label: string;
}

export interface DbimFilterBarProps {
  search: { value: string; onChange: (value: string) => void; placeholder?: string; label?: string };
  sort?: DbimSelectControl;
  category?: DbimSelectControl;
  perPage?: { value: number; onChange: (value: number) => void; options?: number[] };
  /**
   * "default" is the reference's `col-lg-4` search capped at 375px; "wide" is the
   * Related Links form's `col-md-5` (544px at 1440) with its 24px bottom margin.
   */
  searchWidth?: "default" | "wide";
  className?: string;
}

/**
 * The reference's filter row: Search on the left; Sort by, Category and "10 per page"
 * on the right, each a bordered field behind its own icon cell. Below 768 only the
 * search stays in the row, and a filter button beside it discloses the selects.
 *
 * Every field is the design system's (`Input`, `Select`) in the reference's dress. The
 * placeholder option ("Category") stays SELECTABLE — choosing it is how a reader goes
 * back to everything — so it is passed as an ordinary option, not as the DS
 * `placeholder`, which is disabled by design.
 */
export function DbimFilterBar({ search, sort, category, perPage, searchWidth = "default", className }: DbimFilterBarProps) {
  const [open, setOpen] = React.useState(false);
  const panelId = React.useId();
  const hasSelects = Boolean(sort || category || perPage);

  return (
    <form className={["db-filter", searchWidth === "wide" && "db-filter--wide", className].filter(Boolean).join(" ")} role="search" onSubmit={(e) => e.preventDefault()}>
      <div className="db-filter__lead">
        <label className="db-field db-field--search">
          <span className="db-field__icon" aria-hidden="true">
            <Icon name="search" size={24} />
          </span>
          <Input
            type="search"
            value={search.value}
            onChange={(e) => search.onChange(e.target.value)}
            placeholder={search.placeholder ?? "Search..."}
            aria-label={search.label ?? "Search"}
            className="db-field__control"
          />
        </label>
        {hasSelects && (
          <IconButton
            variant="neutral"
            appearance="outlined"
            className="db-filter__toggle"
            aria-label="Filters"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((o) => !o)}
            icon={<Icon name="filter_alt" size={24} />}
          />
        )}
      </div>
      {hasSelects && (
        <div id={panelId} className={open ? "db-filter__rest is-open" : "db-filter__rest"}>
          {sort && <SelectField control={sort} icon="sort" modifier="sort" />}
          {category && <SelectField control={category} icon="sort" modifier="sort" />}
          {perPage && (
            <label className="db-field db-field--perpage">
              <span className="db-field__icon" aria-hidden="true">
                <Icon name="list_alt" size={24} />
              </span>
              <Select
                value={String(perPage.value)}
                onChange={(e) => perPage.onChange(Number(e.target.value))}
                aria-label="Rows per page"
                className="db-field__control"
              >
                {(perPage.options ?? [10, 15, 20]).map((n) => (
                  <option key={n} value={n}>
                    {n} per page
                  </option>
                ))}
              </Select>
            </label>
          )}
        </div>
      )}
    </form>
  );
}

function SelectField({ control, icon, modifier }: { control: DbimSelectControl; icon: string; modifier: string }) {
  return (
    <label className={`db-field db-field--${modifier}`}>
      <span className="db-field__icon" aria-hidden="true">
        <Icon name={icon} size={24} />
      </span>
      <Select
        value={control.value}
        onChange={(e) => control.onChange(e.target.value)}
        aria-label={control.label}
        className="db-field__control"
      >
        <option value="">{control.placeholder}</option>
        {control.options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </Select>
    </label>
  );
}
