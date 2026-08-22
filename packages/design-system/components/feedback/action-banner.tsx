import * as React from "react";
import { cn } from "../../utils/cn";
import "./action-banner.css";

export interface ActionBannerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode;
  description?: React.ReactNode;
  action: React.ReactNode;
}

/**
 * ActionBanner — A high-visibility call to action block.
 * Uses the standard gradient tone and layout for CTA strips on public pages.
 */
export const ActionBanner = React.forwardRef<HTMLDivElement, ActionBannerProps>(
  ({ title, description, action, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("sa-action-banner", className)} {...props}>
        <div className="sa-action-banner__content">
          <h3 className="sa-action-banner__title">{title}</h3>
          {description && <p className="sa-action-banner__description">{description}</p>}
        </div>
        <div className="sa-action-banner__action">{action}</div>
      </div>
    );
  }
);

ActionBanner.displayName = "ActionBanner";
