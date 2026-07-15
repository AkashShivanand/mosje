"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/smile-admin/utils";

const buttonVariants = cva(
  [
    "inline-flex select-none items-center justify-center gap-sm whitespace-nowrap rounded-md font-semibold",
    "transition-all duration-150 ease-swift-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "active:translate-y-px",
    "[&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          "bg-primary text-white shadow-xs",
          "hover:bg-primary-600 hover:shadow-s",
          "active:bg-primary-700",
        ].join(" "),
        secondary: "bg-primary-50 text-primary hover:bg-primary-100",
        outline:
          "border border-stroke-300 bg-white text-foreground shadow-xs hover:border-stroke-400 hover:bg-neutral-50",
        ghost: "bg-transparent text-foreground hover:bg-neutral-100",
        soft: "bg-neutral-100 text-foreground hover:bg-neutral-200",
        destructive:
          "bg-danger text-white shadow-xs hover:bg-danger-600 active:translate-y-px",
        success:
          "bg-secondary text-white shadow-xs hover:bg-secondary-600 active:translate-y-px",
        link: "text-info underline-offset-4 hover:underline px-0 h-auto shadow-none",
      },
      size: {
        xs: "h-7 px-sm text-label-1",
        sm: "h-8 px-md text-body-3",
        md: "h-10 px-lg text-body-2",
        lg: "h-12 px-xl text-body-1",
        icon: "h-10 w-10 p-0",
        iconSm: "h-8 w-8 p-0",
        iconXs: "h-7 w-7 p-0",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
