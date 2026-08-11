"use client";

import * as React from "react";

interface TerminalCodeProps {
  title?: string;
  codeText: string;
  children: React.ReactNode;
}

export function TerminalCode({ title = "bash", codeText, children }: TerminalCodeProps): React.JSX.Element {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="terminal-code">
      <div className="terminal-code__header">
        <div className="terminal-code__controls">
          <span className="terminal-code__dot terminal-code__dot--red" />
          <span className="terminal-code__dot terminal-code__dot--yellow" />
          <span className="terminal-code__dot terminal-code__dot--green" />
        </div>
        <span className="terminal-code__title">{title}</span>
        <button 
          type="button" 
          className="terminal-code__copy" 
          onClick={handleCopy}
          aria-label={copied ? "Copied code" : "Copy code"}
        >
          {copied ? (
            <>
              <svg viewBox="0 0 20 20" width="14" height="14" fill="none" aria-hidden="true" style={{ color: "var(--sa-color-status-success)" }}>
                <path d="M4 10l4 4 8-8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Copied!</span>
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="terminal-code__body" style={{ margin: 0 }}>
        <code>{children}</code>
      </pre>
    </div>
  );
}
