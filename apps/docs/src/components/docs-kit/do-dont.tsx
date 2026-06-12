import * as React from "react";

interface DoDontCard {
  type: "do" | "dont";
  preview: React.ReactNode;
  label: string;
}

export function DoDont({ cards }: { cards: DoDontCard[] }): React.JSX.Element {
  return (
    <div className="do-dont">
      {cards.map((card, i) => (
        <div key={i} className="do-dont__card">
          <div className="do-dont__preview">{card.preview}</div>
          <div className={`do-dont__label do-dont__label--${card.type}`}>
            {card.type === "do" ? "✓ Do" : "✕ Don't"}
          </div>
          <p className="do-dont__body">{card.label}</p>
        </div>
      ))}
    </div>
  );
}
