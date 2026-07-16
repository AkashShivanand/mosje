import * as React from "react";
import { cn, initials } from "@/lib/smile-admin/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string;
  src?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  tone?: "primary" | "neutral";
}

const sizeMap = {
  xs: "h-6 w-6 text-label-3",
  sm: "h-8 w-8 text-label-3",
  md: "h-9 w-9 text-label-1",
  lg: "h-11 w-11 text-body-2",
  xl: "h-14 w-14 text-title-2",
};

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, name, src, size = "md", tone = "neutral", ...props }, ref) => {
    return (
      <div
        ref={ref}
        aria-label={name ? `Avatar for ${name}` : "Avatar"}
        className={cn(
          "relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-md ring-1 ring-inset",
          tone === "primary"
            ? "bg-primary text-white ring-primary-700/30"
            : "bg-primary-50 text-primary ring-primary-100",
          sizeMap[size],
          className,
        )}
        {...props}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={name ?? ""}
            className="h-full w-full object-cover"
            loading="lazy"
            draggable={false}
          />
        ) : (
          <span className="font-bold tracking-[0.04em]">
            {name ? initials(name) : "?"}
          </span>
        )}
      </div>
    );
  },
);
Avatar.displayName = "Avatar";
