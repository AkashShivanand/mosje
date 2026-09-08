import * as React from "react";

/**
 * False on the server and through the hydrating render, true afterwards.
 *
 * WHAT IT REPLACES. Six components portal their overlay into `document.body`,
 * and a portal needs a DOM node the server has not got. Each of them guarded it
 * the same way:
 *
 *     const [mounted, setMounted] = React.useState(false);
 *     React.useEffect(() => setMounted(true), []);
 *
 * That is a state write in an effect purely to learn something about the
 * environment, and `react-hooks/set-state-in-effect` refuses it: the effect
 * commits, sets state, and forces a second render pass on every mount of every
 * overlay in the estate — for a value that never changes again.
 *
 * `useSyncExternalStore` answers the same question without a render pass. It
 * takes separate client and server snapshots, so React returns `false` while
 * rendering on the server and during hydration (where client and server output
 * must match), then `true` for every render after — which is precisely the
 * moment a portal becomes safe. Nothing subscribes, because nothing changes:
 * the subscribe function is a no-op returning a no-op unsubscribe.
 *
 * WHY NOT `typeof document !== "undefined"`. It is true during hydration on the
 * client and false on the server, so the two trees disagree and React throws a
 * hydration mismatch. The whole point of the flag is to be false on BOTH sides
 * of hydration and true only once hydration is done.
 */
const subscribeToNothing = (): (() => void) => () => {};
const onClient = (): boolean => true;
const onServer = (): boolean => false;

export function useHydrated(): boolean {
  return React.useSyncExternalStore(subscribeToNothing, onClient, onServer);
}
