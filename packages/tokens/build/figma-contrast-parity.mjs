/**
 * The contrast SENTENCE each variable publishes, extracted from the built Figma payload.
 *
 * `figma-value-parity.mjs` answers "do the library and the code agree on VALUES?". This
 * answers the question next to it, which nothing asked until 2026-09-04: **do they agree on
 * what those values MEASURE?**
 *
 * They did not. A read of the live library that day found 31 of 94 contrast notes wrong or
 * absent:
 *
 *   - the whole `bg/status/success/*` ramp was stale by up to three points — the library
 *     said 2.01:1 where the code computed 3.19:1 — because the ramp had been rebuilt and
 *     nothing carried the new figures across;
 *   - `bg/brand/secondary/bolder` was published at 3.94:1, BELOW its 4.5:1 threshold, when
 *     it actually measures 4.97:1. The library was warning designers off a colour that
 *     passes, which is the more expensive direction for this kind of error to fail in;
 *   - twelve variables — the entire `"bolder"` rung across border, icon and text — carried
 *     no figure at all, and those are precisely the rungs that exist for tinted surfaces,
 *     the case a designer most needs guidance on.
 *
 * None of it was caught, because every existing check compares NAMES or VALUES. A published
 * measurement is neither: it is a CLAIM ABOUT a value, and a claim can rot while the value
 * behind it stays put. That is what this module makes checkable.
 */

/** The trailing contract sentence, or null when a variable publishes none. */
export function contrastSentence(description) {
  if (typeof description !== "string") return null;
  const m = description.match(/(Contrast\s+\d[^]*)$/);
  return m ? m[1].trim() : null;
}

/**
 * Every published contrast sentence in the payload, keyed by variable name.
 *
 * Keyed by NAME rather than path because that is what a designer sees in the library and
 * what a reconciliation read returns, so a failure names the thing you would go and look at.
 */
export function contrastSentences(payload) {
  const out = {};
  for (const collection of payload.collections ?? []) {
    for (const v of collection.variables ?? []) {
      const sentence = contrastSentence(v.description);
      if (sentence) out[v.name] = sentence;
    }
  }
  return out;
}
