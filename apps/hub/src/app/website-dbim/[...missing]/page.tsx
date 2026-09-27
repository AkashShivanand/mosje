import { notFound } from "next/navigation";

/**
 * Any address under the DBIM tree that no route claims. Without this, Next falls back
 * to the hub's root not-found — the estate's generic 404 with no DBIM header, menu or
 * footer. Calling notFound() here renders this tree's own not-found.tsx inside the
 * DBIM layout, with a real 404 status.
 */
export default function DbimMissing(): never {
  notFound();
}
