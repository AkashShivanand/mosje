import * as React from "react";

interface TokenRow {
  token: string;
  value: string;
  description: string;
  isColor?: boolean;
}

export function TokenTable({ tokens }: { tokens: TokenRow[] }): React.JSX.Element {
  return (
    <div style={{ overflowX: "auto" }}>
      <table className="token-table">
        <thead>
          <tr>
            <th scope="col">Token</th>
            <th scope="col">Value</th>
            <th scope="col">Usage</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((t) => (
            <tr key={t.token}>
              <td><code className="token-table__name">{t.token}</code></td>
              <td>
                {t.isColor && (
                  <span
                    className="token-table__preview"
                    style={{ backgroundColor: t.value, display: "inline-block", marginRight: "var(--sa-stack-8)", verticalAlign: "middle" }}
                    aria-hidden="true"
                  />
                )}
                <code className="token-table__value">{t.value}</code>
              </td>
              <td style={{ color: "var(--sa-text-neutral-subtle)", fontSize: "var(--sa-type-body-2-size)" }}>{t.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
