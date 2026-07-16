import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/smile-admin/utils";

const alertVariants = cva(
  "relative w-full rounded-md border-l-4 bg-white p-md text-body-3 [&>svg]:absolute [&>svg]:left-md [&>svg]:top-md [&>svg]:h-4 [&>svg]:w-4 [&>svg]:shrink-0 [&>svg~*]:pl-7",
  {
    variants: {
      tone: {
        info:    "border-info bg-info-50/40 text-info-600 [&>svg]:text-info-600",
        success: "border-success bg-success-50/40 text-success-600 [&>svg]:text-success-600",
        warning: "border-warning bg-warning-50/40 text-warning-600 [&>svg]:text-warning-600",
        danger:  "border-danger bg-danger-50/40 text-danger-600 [&>svg]:text-danger-600",
        neutral: "border-stroke-300 bg-neutral-50/60 text-foreground [&>svg]:text-foreground-muted",
      },
    },
    defaultVariants: { tone: "info" },
  },
);

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, tone, role = "status", ...props }, ref) => (
    <div
      ref={ref}
      role={role}
      className={cn(alertVariants({ tone }), className)}
      {...props}
    />
  ),
);
Alert.displayName = "Alert";

export const AlertTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-semibold leading-snug text-foreground", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

export const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-body-3 text-foreground-muted [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";
