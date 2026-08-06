/**
 * HMAC primitives shared by the site gate and the hub admin auth.
 *
 * Both carry a secret in a cookie without carrying the secret itself: the
 * cookie holds HMAC-SHA256(secret, label), so a stolen cookie does not reveal
 * the password. The label provides domain separation — a gate cookie can never
 * be replayed as an admin cookie.
 */

function base64url(buffer: ArrayBuffer): string {
  let binary = "";
  for (const byte of new Uint8Array(buffer)) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * base64url HMAC-SHA256 of `secret`, keyed by `label`. Always 43 characters.
 *
 * The label is the key and the secret is the message, not the other way round.
 * Web Crypto rejects a zero-length HMAC key, so keying on the secret would
 * throw on an empty password — which is reachable, because a form can be POSTed
 * without its field. Labels are non-empty constants, so this construction
 * accepts any secret including "". Domain separation is unaffected: a different
 * label is a different key and therefore a different digest.
 */
export async function hmacToken(secret: string, label: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(label),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(secret),
  );
  return base64url(signature);
}

/**
 * Length-independent comparison. Callers compare HMAC digests, which are always
 * the same width, so the early length exit leaks nothing about the secret.
 */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
