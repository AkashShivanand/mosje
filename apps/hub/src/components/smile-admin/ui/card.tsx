import * as React from "react";
import { cn } from "@/lib/smile-admin/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  interactive?: boolean;
}

export function Card({ className, elevated, interactive, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-stroke-200 bg-white",
        elevated ? "shadow-s" : "shadow-xs",
        interactive &&
          "cursor-pointer transition-all duration-200 ease-swift-out hover:-translate-y-0.5 hover:border-stroke-300 hover:shadow-md",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-md px-lg pb-md pt-lg",
        className,
      )}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-title-2 font-semibold tracking-tight text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-body-3 text-foreground-muted", className)} {...props} />
  );
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-lg pb-lg", className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center gap-sm border-t border-stroke-100 px-lg py-md",
        className,
      )}
      {...props}
    />
  );
}

export function CardSeparator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("h-px bg-stroke-100", className)} {...props} />;
}
