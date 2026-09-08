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
  /*
   * The latest `onChange`, kept in a ref so `set` can stay stable while still
   * calling the callback the caller passed on THIS render.
   *
   * Updated in an effect, not in render. Writing `ref.current` during render is
   * the older form of this idiom and `react-hooks/refs` refuses it for a real
   * reason: render can run and be thrown away (Strict Mode's double invoke,
   * an abandoned Suspense attempt), so a render-phase write can install a
   * callback from a render that never committed. The effect runs after commit,
   * which is the only point at which "the current callback" is a fact.
   *
   * The first call still sees the right function: the ref is SEEDED with
   * `onChange` by `useRef`, and `set` is only reachable from an event handler,
   * which cannot fire before the mount effect has run.
   */
  const onChangeRef = React.useRef(onChange);
  React.useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  const set = React.useCallback(
    (next: T) => {
      if (!isControlled) setInternal(next);
      onChangeRef.current?.(next);
    },
    [isControlled],
  );
  return [current, set];
}
