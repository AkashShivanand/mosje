import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/smile-admin/utils";
import * as React from "react";

const badgeVariants = cva(
  "inline-flex items-center gap-xs whitespace-nowrap rounded-full px-2 py-0.5 text-label-3 font-semibold tracking-[0.04em] ring-1 ring-inset",
  {
    variants: {
      tone: {
        neutral: "bg-neutral-100 text-neutral-600 ring-neutral-200",
        primary: "bg-primary-50 text-primary ring-primary-100",
        info:    "bg-info-50 text-info-600 ring-info-100",
        success: "bg-success-50 text-success-600 ring-success-100",
        warning: "bg-warning-50 text-warning-600 ring-warning-100",
        danger:  "bg-danger-50 text-danger-600 ring-danger-100",
      },
      size: {
        sm: "text-label-3 px-2",
        md: "text-label-2 px-sm py-1",
      },
      solid: {
        true: "ring-transparent",
        false: "",
      },
    },
    compoundVariants: [
      { tone: "primary", solid: true, class: "bg-primary text-white" },
      { tone: "info", solid: true, class: "bg-info-600 text-white" },
      { tone: "success", solid: true, class: "bg-success-600 text-white" },
      { tone: "warning", solid: true, class: "bg-warning-600 text-white" },
      { tone: "danger", solid: true, class: "bg-danger-600 text-white" },
      { tone: "neutral", solid: true, class: "bg-neutral-700 text-white" },
    ],
    defaultVariants: { tone: "neutral", size: "sm", solid: false },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  withDot?: boolean;
}

export function Badge({ className, tone, size, solid, withDot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ tone, size, solid }), className)} {...props}>
      {withDot ? (
        <span
          aria-hidden
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            tone === "success" && "bg-success",
            tone === "info" && "bg-info",
            tone === "warning" && "bg-warning",
            tone === "danger" && "bg-danger",
            tone === "primary" && "bg-primary",
            (tone === "neutral" || !tone) && "bg-neutral-500",
          )}
        />
      ) : null}
      {children}
    </span>
  );
}

export function statusTone(status: string): BadgeProps["tone"] {
  const k = status.toLowerCase();
  if (k.includes("rehab") || k.includes("active") || k.includes("approved") || k.includes("success") || k.includes("sent")) return "success";
  if (k.includes("identif") || k.includes("draft") || k.includes("pilot") || k.includes("invited") || k.includes("scheduled")) return "info";
  if (k.includes("mobiliz") || k.includes("mobilised") || k.includes("shelter")) return "primary";
  if (k.includes("under") || k.includes("audit") || k.includes("pending") || k.includes("medium")) return "warning";
  if (k.includes("rejected") || k.includes("failure") || k.includes("suspended") || k.includes("closed") || k.includes("high")) return "danger";
  return "neutral";
}
