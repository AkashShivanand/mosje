"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { Icon } from "../utilities/icon";
import "./accordion.css";

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * `card` — each item a raised, shaded card: an accordion that IS the page's content.
   * `flush` — the form language: no fill, no shadow, a hairline between items. For an accordion
   * inside a panel that is already a card, such as the sections of an application under review,
   * where a stack of shaded cards inside a card reads as heavy furniture. @default "card"
   */
  variant?: "card" | "flush";
}

export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ className, variant = "card", ...props }, ref) => {
    return <div ref={ref} className={cn("sa-accordion", variant === "flush" && "sa-accordion--flush", className)} {...props} />;
  }
);
Accordion.displayName = "Accordion";

export interface AccordionItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode;
  defaultOpen?: boolean;
}

export const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ title, defaultOpen = false, children, className, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(defaultOpen);
    const contentId = React.useId();

    return (
      <div ref={ref} className={cn("sa-accordion-item", className)} {...props}>
        {/* raw-button-ok(primitive): the accordion header IS this component — it owns aria-expanded, aria-controls and the panel it discloses */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="sa-accordion-item__trigger"
          aria-expanded={isOpen}
          aria-controls={isOpen ? contentId : undefined}
        >
          <span className="sa-accordion-item__title">{title}</span>
          <Icon name={isOpen ? "expand_less" : "expand_more"} className="sa-accordion-item__icon" aria-hidden />
        </button>
        {isOpen && (
          <div className="sa-accordion-item__content" id={contentId}>
            {children}
          </div>
        )}
      </div>
    );
  }
);
AccordionItem.displayName = "AccordionItem";
