import * as React from "react";
import { cn } from "../../utils/cn";
import "./form-section.css";

export interface FormInsetProps {
  /** Names the entry — "Employment 2", "Key Functionary 1". */
  title?: React.ReactNode;
  /** Controls at the right of the entry's head — Remove. */
  actions?: React.ReactNode;
  /** Field-grid columns inside the entry. @default 2 */
  columns?: 1 | 2 | 3;
  children: React.ReactNode;
  className?: string;
}

/**
 * MoSJE / SAMAVESH FormInset — one entry of a repeatable group, drawn as a tinted inset
 * panel inside a sub-section. Follow the last entry with a small outlined "Add More" button.
 */
export function FormInset({ title, actions, columns = 2, children, className }: FormInsetProps) {
  return (
    <div className={cn("ds-form-inset", className)}>
      {(title || actions) && (
        <div className="ds-form-inset__head">
          {title ? <p className="ds-form-inset__title">{title}</p> : <span />}
          {actions}
        </div>
      )}
      <div className={cn("ds-form-section__grid", `ds-form-section__grid--${columns}`)}>{children}</div>
    </div>
  );
}
