import React from "react";

export interface ToolbarAction {
  label: string;
  onClick(): void;
}

/**
 * Simple formatting toolbar with buttons triggering passed actions.
 */
export default function AdvancedToolbar({ actions }: { actions: ToolbarAction[] }) {
  return (
    <div className="inline-flex gap-1" role="toolbar">
      {actions.map((a) => (
        <button
          key={a.label}
          className="px-2 py-1 border rounded"
          onClick={a.onClick}
          aria-label={a.label}
        >
          {a.label}
        </button>
      ))}
    </div>
  );
}
