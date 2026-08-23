import * as React from "react";
import { cn } from "../../utils/cn";
import "./vertical-timeline.css";

export const VerticalTimeline = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("sa-vertical-timeline", className)} {...props} />;
  }
);
VerticalTimeline.displayName = "VerticalTimeline";

export interface VerticalTimelineItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode;
  date?: React.ReactNode;
}

export const VerticalTimelineItem = React.forwardRef<HTMLDivElement, VerticalTimelineItemProps>(
  ({ title, date, children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("sa-vertical-timeline-item", "group", className)} {...props}>
        <div className="sa-vertical-timeline-item__marker-container">
          <div className="sa-vertical-timeline-item__marker" />
        </div>
        <div className="sa-vertical-timeline-item__content">
          <div className="sa-vertical-timeline-item__header">
            <h3 className="sa-vertical-timeline-item__title">{title}</h3>
            {date && <span className="sa-vertical-timeline-item__date">{date}</span>}
          </div>
          <div className="sa-vertical-timeline-item__body">{children}</div>
        </div>
      </div>
    );
  }
);
VerticalTimelineItem.displayName = "VerticalTimelineItem";
