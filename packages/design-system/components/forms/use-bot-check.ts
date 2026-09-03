"use client";

import * as React from "react";
import type { BotCheckStatus } from "./bot-check";

/**
 * What a solved check hands to the form.
 *
 * This is the shape a real server would issue and verify. It is a real
 * proof-of-work receipt, not a placeholder object — `hash` genuinely is
 * SHA-256(`challenge` + `nonce`) and it genuinely has `difficulty` leading zero
 * bits. A reviewer can recompute it.
 */
export interface BotCheckToken {
  /** The random string the work was done against. */
  challenge: string;
  /** Leading zero BITS the hash had to clear. */
  difficulty: number;
  /** The value that satisfied it. */
  nonce: number;
  /** SHA-256(challenge + nonce), hex. */
  hash: string;
  /** How many hashes were computed to get there. */
  attempts: number;
  /** Wall-clock milliseconds spent. */
  solvedInMs: number;
  /** When the challenge was minted. A server would expire this. */
  issuedAt: number;
}

export interface UseBotCheckOptions {
  /**
   * Leading zero bits required. Each extra bit doubles the expected work.
   *
   * 12 is ~4,096 hashes. Measured in this implementation that is well under a
   * second; the earlier unbatched loop took 16.6s for the same work, which is
   * why the solver batches. Long enough to be real work, short enough that
   * nobody waits. Do not raise this to "make it more secure"; past ~20 bits the oldest
   * devices on this estate start timing out and you have excluded the people
   * the scheme exists for. @default 12
   */
  difficulty?: number;
  /**
   * Start solving as soon as the component mounts. @default true
   *
   * `false` is for `checkbox` mode, where the citizen's gesture starts it.
   */
  auto?: boolean;
}

export interface UseBotCheckResult {
  status: BotCheckStatus;
  token: BotCheckToken | null;
  /** Start (or restart) the work. */
  solve: () => void;
  /** Back to `idle` and no token — call after a rejected submit. */
  reset: () => void;
}

function randomChallenge(bytes = 16): string {
  const a = new Uint8Array(bytes);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) crypto.getRandomValues(a);
  else for (let i = 0; i < bytes; i++) a[i] = Math.floor(Math.random() * 256);
  let s = "";
  for (const b of a) s += b.toString(16).padStart(2, "0");
  return s;
}

function toHex(buf: ArrayBuffer): string {
  let s = "";
  for (const b of new Uint8Array(buf)) s += b.toString(16).padStart(2, "0");
  return s;
}

/** Count leading zero BITS of a hex digest, without parsing it as a number. */
function leadingZeroBits(hex: string): number {
  let bits = 0;
  for (const ch of hex) {
    const v = parseInt(ch, 16);
    if (v === 0) {
      bits += 4;
      continue;
    }
    // 8→0, 4→1, 2→2, 1→3 extra leading zeros inside the nibble
    bits += Math.clz32(v) - 28;
    break;
  }
  return bits;
}

/**
 * PROTOTYPE proof-of-work for `BotCheck`. Real algorithm, one missing half.
 *
 * ## What is real here
 *
 * The work is genuine. The hook mints a random challenge, then hashes
 * `challenge + nonce` with SHA-256 through the Web Crypto API, incrementing
 * `nonce` until the digest has `difficulty` leading zero bits. At the default
 * 12 bits that is ~4,096 hashes — real elapsed time, a real receipt, and a
 * `status` that moves `idle → verifying → verified` because work actually
 * happened. Nothing is faked and no timer is pretending.
 *
 * The hashes are issued in batches of 512 rather than one at a time, because
 * `crypto.subtle.digest` is asynchronous and awaiting each one separately pays
 * its overhead thousands of times — measured, that was 16.6 SECONDS for work
 * the batched version does in a fraction of it. The loop yields between
 * batches, so the page stays responsive and assistive technology is not
 * starved.
 *
 * ## What is NOT real, and what a developer must build
 *
 * **The challenge is minted in the browser.** That is the whole difference, and
 * it is the difference between a demonstration and a defence. A bot can mint its
 * own challenge, solve it, and present a perfectly valid token — because nobody
 * asked whether that challenge was ever issued.
 *
 * To make this a real check, four things move to the server:
 *
 * 1. **Issue the challenge.** `GET /api/bot-check/challenge` returns
 *    `{ challenge, difficulty, issuedAt }`, and the server remembers it. The
 *    challenge must be unguessable and single-use.
 * 2. **Verify the token.** On submit, the server recomputes
 *    `SHA-256(challenge + nonce)`, checks the leading zero bits, and checks that
 *    it issued that exact challenge. A token it did not issue is refused.
 * 3. **Burn it.** Mark the challenge used. Replaying a solved token must fail,
 *    or one solve buys unlimited submissions.
 * 4. **Expire it.** Reject anything older than a few minutes, so a token cannot
 *    be farmed in advance.
 *
 * Everything else — this hook's shape, `BotCheckToken`, the status transitions,
 * the component — stays exactly as it is. The client half is finished; only the
 * issuing and verifying half is stubbed.
 *
 * **Two things NOT to do when you wire it up.** Do not raise `difficulty` to
 * compensate for a missing server: the cost lands on the oldest phone on the
 * estate, not on the attacker, who has better hardware than any citizen. And do
 * not treat a passing check as authentication — it says "probably a person", not
 * "this person".
 *
 * @example
 * const check = useBotCheck();
 * <BotCheck status={check.status} helpHref="/help/contact" />
 * // on submit: send check.token alongside the credentials
 */
export function useBotCheck({
  difficulty = 12,
  auto = true,
}: UseBotCheckOptions = {}): UseBotCheckResult {
  const [status, setStatus] = React.useState<BotCheckStatus>("idle");
  const [token, setToken] = React.useState<BotCheckToken | null>(null);
  // Bumped to start a run; also cancels any run already in flight.
  const [runId, setRunId] = React.useState(auto ? 1 : 0);

  const solve = React.useCallback(() => setRunId((n) => n + 1), []);
  const reset = React.useCallback(() => {
    setToken(null);
    setStatus("idle");
    setRunId(0);
  }, []);

  React.useEffect(() => {
    if (runId === 0) return;
    // No Web Crypto (older browser, or a non-secure origin) is a real state, not
    // an exception: the check cannot run, so it reports failure and the citizen
    // gets the route out rather than a form that silently will not submit.
    if (typeof crypto === "undefined" || !crypto.subtle) {
      setStatus("failed");
      return;
    }

    let cancelled = false;
    setStatus("verifying");
    setToken(null);

    const challenge = randomChallenge();
    const issuedAt = Date.now();
    const encoder = new TextEncoder();

    // BATCHED, and it has to be. `crypto.subtle.digest` is asynchronous, so
    // awaiting one hash at a time pays its per-call overhead ~4,000 times: the
    // first version of this loop measured 8,156 hashes in 16.6 SECONDS on a
    // desktop, which is not a check, it is an outage. Issuing a batch and
    // awaiting them together amortises that overhead and also yields to the
    // browser once per batch, so the page stays responsive.
    const BATCH = 512;
    const run = async () => {
      const startedAt = performance.now();
      for (let base = 0; ; base += BATCH) {
        const digests = await Promise.all(
          Array.from({ length: BATCH }, (_, i) =>
            crypto.subtle.digest("SHA-256", encoder.encode(challenge + (base + i))),
          ),
        );
        if (cancelled) return;
        for (let i = 0; i < BATCH; i++) {
          const hash = toHex(digests[i]!);
          if (leadingZeroBits(hash) >= difficulty) {
            setToken({
              challenge,
              difficulty,
              nonce: base + i,
              hash,
              attempts: base + i + 1,
              solvedInMs: Math.round(performance.now() - startedAt),
              issuedAt,
            });
            setStatus("verified");
            return;
          }
        }
        // Hand the main thread back between batches. A hashing loop that never
        // yields freezes scrolling and starves assistive technology.
        await new Promise((r) => setTimeout(r, 0));
        if (cancelled) return;
      }
    };

    void run().catch(() => {
      if (!cancelled) setStatus("failed");
    });

    return () => {
      cancelled = true;
    };
  }, [runId, difficulty]);

  return { status, token, solve, reset };
}
