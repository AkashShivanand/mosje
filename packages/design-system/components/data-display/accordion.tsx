"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { Icon } from "../icon/icon";
import "./accordion.css";

export const Accordion = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("sa-accordion", className)} {...props} />;
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

    return (
      <div ref={ref} className={cn("sa-accordion-item", className)} {...props}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="sa-accordion-item__trigger"
          aria-expanded={isOpen}
        >
          <span className="sa-accordion-item__title">{title}</span>
          <Icon name={isOpen ? "expand_less" : "expand_more"} className="sa-accordion-item__icon" />
        </button>
        {isOpen && (
          <div className="sa-accordion-item__content">
            {children}
          </div>
        )}
      </div>
    );
  }
);
AccordionItem.displayName = "AccordionItem";
