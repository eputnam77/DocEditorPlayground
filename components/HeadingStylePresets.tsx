import React from "react";

export interface HeadingStylePresetsProps {
  onSelect(level: number): void;
}

/** Buttons for quickly applying heading levels */
export default function HeadingStylePresets({ onSelect }: HeadingStylePresetsProps) {
  return (
    <div className="inline-flex gap-1" role="group">
      {[1, 2, 3].map((lvl) => (
        <button
          key={lvl}
          className="px-2 py-1 border rounded"
          onClick={() => onSelect(lvl)}
          aria-label={`Heading ${lvl}`}
        >
          H{lvl}
        </button>
      ))}
    </div>
  );
}
