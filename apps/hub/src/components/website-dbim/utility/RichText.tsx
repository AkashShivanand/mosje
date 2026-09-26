import Link from "next/link";
import { dbimHref } from "@/lib/website-dbim/nav";
import type { DbimBlock, DbimInline } from "@/lib/website-dbim/utility";

/** One inline run of the utility pages' rich text: text, bold, an internal or an external link. */
export function DbimInlineText({ runs }: { runs: DbimInline[] }) {
  return (
    <>
      {runs.map((run, i) => {
        if (typeof run === "string") return run;
        if ("strong" in run) return <strong key={i}>{run.strong}</strong>;
        if ("path" in run)
          return (
            <Link key={i} href={dbimHref(run.path)}>
              {run.text}
            </Link>
          );
        return (
          <a key={i} href={run.href} target="_blank" rel="noopener noreferrer">
            {run.text}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        );
      })}
    </>
  );
}

/** A policy's text — the reference's `.policyContent`: paragraphs, blue h2s, lists. */
export function DbimPolicyText({ blocks }: { blocks: DbimBlock[] }) {
  return (
    <div className="db-u-prose">
      {blocks.map((b, i) => {
        if (b.kind === "h2")
          return (
            <h2 key={i} id={b.id}>
              {b.text}
            </h2>
          );
        if (b.kind === "ul")
          return (
            <ul key={i}>
              {b.items.map((item, j) => (
                <li key={j}>
                  <DbimInlineText runs={item} />
                </li>
              ))}
            </ul>
          );
        return (
          <p key={i}>
            <DbimInlineText runs={b.text} />
          </p>
        );
      })}
    </div>
  );
}
