import * as React from "react";

/**
 * A value that is controlled when the caller passes it and uncontrolled when they do not.
 *
 * Every selection control was controlled-only — `checked` and `onChange` required — so a
 * plain HTML form that only wanted the browser to post a value had to hold React state for
 * it. Carbon, Material, Radix, Primer and the native input all offer both; this is the
 * shape they converge on: `value` wins when it is defined, `defaultValue` seeds the local
 * copy otherwise, and `onChange` fires either way.
 */
export function useControllableState<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (next: T) => void,
): [T, (next: T) => void] {
  const [internal, setInternal] = React.useState<T>(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? (value as T) : internal;
  const onChangeRef = React.useRef(onChange);
  onChangeRef.current = onChange;
  const set = React.useCallback(
    (next: T) => {
      if (!isControlled) setInternal(next);
      onChangeRef.current?.(next);
    },
    [isControlled],
  );
  return [current, set];
}
