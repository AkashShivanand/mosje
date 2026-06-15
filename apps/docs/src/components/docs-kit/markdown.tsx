import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./markdown.css";

interface MarkdownProps {
  /** Raw markdown source. */
  children: string;
}

/**
 * Renders trusted, in-repo markdown (e.g. design.md) with the portal's token
 * styling. GFM enabled (tables, task lists, strikethrough). Raw HTML is NOT
 * rendered (no rehype-raw) — safe by default; HTML comments are dropped.
 */
export function Markdown({ children }: MarkdownProps): React.JSX.Element {
  return (
    <div className="markdown-body">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}
