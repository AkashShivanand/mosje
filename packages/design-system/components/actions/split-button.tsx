"use client";

import * as React from "react";
import { Button, type ButtonProps } from "./button";
import { ButtonGroup } from "./button-group";
import { Menu, type MenuEntry } from "./menu";

export interface SplitButtonProps {
  /** The default action's label — the one most people want. */
  children: React.ReactNode;
  /** Called when the default action is chosen. */
  onClick: () => void;
  /** The alternatives, offered from the attached trigger. */
  items: MenuEntry[];
  /** Called with the chosen alternative's `id`. */
  onSelect: (id: string) => void;
  /**
   * Names the pair and the menu — "Approve this application". Required for the
   * same reason `Menu`'s and `ButtonGroup`'s are: an unnamed group announces
   * four loose buttons, and an unnamed menu says nothing about what has opened.
   */
  label: string;
  /** @default "primary" */
  variant?: ButtonProps["variant"];
  /** @default "md" */
  size?: ButtonProps["size"];
  disabled?: boolean;
  className?: string;
}

/**
 * MoSJE / SAMAVESH Split button.
 *
 * One default action with its alternatives one press away — "Approve", beside a
 * trigger offering "Approve with remarks" and "Approve and notify".
 *
 * **It is two buttons, not one.** The default action is a real button that
 * activates on Enter and Space; the trigger beside it is a separate control with
 * its own accessible name and its own `aria-expanded`. Merging them into a
 * single control that behaves differently depending on which half was hit is how
 * this pattern is usually built, and it is unusable from a keyboard.
 *
 * It composes `ButtonGroup attached` rather than drawing its own seam, so the
 * join, the collapsed inner corners and the group's role and name are the ones
 * the estate already publishes — and this component cannot drift from them.
 *
 * **Reach for it only when there IS a default.** Where the alternatives are
 * equally likely, a split button quietly makes one of them the path of least
 * resistance; on an approval screen that is a thumb on the scale. Use `Menu`
 * when no option is the obvious one, and `ButtonGroup` when there are two or
 * three and all of them should be visible.
 */
export function SplitButton({
  children,
  onClick,
  items,
  onSelect,
  label,
  variant = "primary",
  size = "md",
  disabled = false,
  className,
}: SplitButtonProps): React.JSX.Element {
  return (
    <ButtonGroup aria-label={label} attached className={className}>
      <Button variant={variant} size={size} disabled={disabled} onClick={onClick}>
        {children}
      </Button>
      <Menu items={items} label={label} onSelect={onSelect} align="end" disabled={disabled}>
        <Button
          variant={variant}
          size={size}
          disabled={disabled}
          // The trigger has one glyph and no words, so it needs a name of its
          // own — "Approve this application" would repeat the group's.
          aria-label={`More ways to ${String(children).toLowerCase()}`}
        >
          <span aria-hidden>▾</span>
        </Button>
      </Menu>
    </ButtonGroup>
  );
}
