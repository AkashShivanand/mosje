"use client";

import * as React from "react";
import { Icon } from "@mosje/design-system";

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
              <Icon name="check" size={16} style={{ color: "var(--sa-text-status-success-base)" }} />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Icon name="content_copy" size={16} />
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
