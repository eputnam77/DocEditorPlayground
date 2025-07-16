import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export interface PluginItem {
  name: string;
  label?: string;
}

export interface PluginManagerProps {
  plugins: PluginItem[];
  enabled: string[];
  /**
   * Names of plugins that cannot be toggled off.
   * These will always remain enabled and their
   * checkboxes will be disabled in the UI.
   */
  locked?: string[];
  onChange(enabled: string[]): void;
}

/**
 * PluginManager renders a simple list of checkboxes for enabling/disabling
 * editor plugins. It maintains no internal state and delegates changes to
 * the parent via the `onChange` callback.
 */
export default function PluginManager({
  plugins,
  enabled,
  locked = [],
  onChange,
}: PluginManagerProps) {
  const [open, setOpen] = useState(false);
  const toggle = (name: string) => {
    if (locked.includes(name)) return;
    const next = enabled.includes(name)
      ? enabled.filter((n) => n !== name)
      : [...enabled, name];
    onChange(next);
  };
  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        className="px-3 py-1 border rounded bg-gray-50 hover:bg-gray-200 flex items-center gap-1"
        onClick={() => setOpen(!open)}
        title="Extensions"
        aria-label="Extensions"
      >
        Extensions
        {open ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 bg-white shadow-lg border rounded p-2 z-50 w-48 space-y-1">
          {plugins.map((p) => (
            <label key={p.name} className="flex items-center gap-2 text-sm">
              <input
                id={`plugin-toggle-${p.name}`}
                type="checkbox"
                checked={enabled.includes(p.name)}
                onChange={() => toggle(p.name)}
                disabled={locked.includes(p.name)}
                aria-label={p.name}
              />
              {p.label ?? p.name}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
