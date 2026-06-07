"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, leftIcon, rightIcon, error, hint, id, ...props }, ref) => {
    const reactId = React.useId();
    const inputId = id ?? reactId;
    const hintId = `${inputId}-hint`;
    const describedBy = error || hint ? hintId : props["aria-describedby"];

    return (
      <div className="w-full">
        <div
          className={cn(
            "group flex h-10 items-center rounded-md border bg-white text-body-2 shadow-xs transition-all duration-150 ease-swift-out",
            error
              ? "border-danger focus-within:border-danger focus-within:ring-2 focus-within:ring-danger/20"
              : "border-stroke-300 hover:border-stroke-400 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15",
          )}
        >
          {leftIcon ? (
            <div
              aria-hidden
              className={cn(
                "pl-md transition-colors",
                error
                  ? "text-danger"
                  : "text-foreground-hint group-focus-within:text-primary",
              )}
            >
              {leftIcon}
            </div>
          ) : null}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={cn(
              "flex-1 bg-transparent px-md text-foreground placeholder:text-foreground-hint outline-none disabled:cursor-not-allowed disabled:opacity-60",
              className,
            )}
            {...props}
          />
          {rightIcon ? (
            <div className="pr-md text-foreground-hint">{rightIcon}</div>
          ) : null}
        </div>
        {error ? (
          <p id={hintId} className="mt-xs text-label-3 text-danger" role="alert">
            {error}
          </p>
        ) : hint ? (
          <p id={hintId} className="mt-xs text-label-3 text-foreground-hint">
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);
Input.displayName = "Input";
