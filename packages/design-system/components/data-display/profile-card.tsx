import * as React from "react";
import { cn } from "../../utils/cn";
import "./profile-card.css";

export interface ProfileCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  /** Pass a raw <img /> or <Image /> component. Ensure it has `fill` or `w-full h-full object-cover` classes */
  image: React.ReactNode;
  tag?: React.ReactNode;
}

export const ProfileCard = React.forwardRef<HTMLDivElement, ProfileCardProps>(
  ({ title, subtitle, image, tag, className, ...props }, ref) => {
    return (
      <div ref={ref} /* `group` is a Tailwind marker class and cannot be @apply-ed in CSS —
         it has to sit on the element for `group-hover:` inside to resolve. */
        className={cn("sa-profile-card", "group", className)} {...props}>
        <div className="sa-profile-card__image-wrapper">
          {image}
          {tag && (
            <div className="sa-profile-card__tag">
              <span className="sa-profile-card__tag-text">{tag}</span>
            </div>
          )}
        </div>
        <div className="sa-profile-card__content">
          <h3 className="sa-profile-card__title">{title}</h3>
          <p className="sa-profile-card__subtitle">{subtitle}</p>
        </div>
      </div>
    );
  }
);

ProfileCard.displayName = "ProfileCard";
