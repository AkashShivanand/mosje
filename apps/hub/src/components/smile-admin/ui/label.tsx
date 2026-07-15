"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/smile-admin/utils";

interface LabelProps extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {
  required?: boolean;
  hint?: React.ReactNode;
}

export const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, required, hint, children, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      "inline-flex items-center gap-xs text-label-1 font-semibold text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className,
    )}
    {...props}
  >
    {children}
    {required ? (
      <span aria-hidden className="text-danger">
        *
      </span>
    ) : null}
    {hint ? (
      <span className="font-normal text-foreground-hint">{hint}</span>
    ) : null}
  </LabelPrimitive.Root>
));
Label.displayName = "Label";
