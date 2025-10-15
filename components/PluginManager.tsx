import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import icons so the entire lucide-react bundle isn't loaded
const ChevronDown = dynamic(() =>
  import("lucide-react").then((m) => m.ChevronDown),
);
const ChevronUp = dynamic(() =>
  import("lucide-react").then((m) => m.ChevronUp),
);

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
  if (!Array.isArray(plugins)) {
    console.warn("PluginManager: expected `plugins` prop to be an array.");
    return null;
  }
  if (!Array.isArray(enabled)) {
    console.warn("PluginManager: expected `enabled` prop to be an array.");
    return null;
  }
  const [open, setOpen] = useState(false);
  const lockedSet = useMemo(() => new Set(locked), [locked]);
  const normalizedEnabled = useMemo(
    () => Array.from(new Set([...enabled, ...locked])),
    [enabled, locked],
  );

  useEffect(() => {
    if (locked.length === 0) return;
    const missingLocked = locked.filter((name) => !enabled.includes(name));
    if (missingLocked.length > 0) {
      onChange(Array.from(new Set([...enabled, ...locked])));
    }
  }, [enabled, locked, onChange]);

  const toggle = (name: string) => {
    if (lockedSet.has(name)) return;
    // Toggle plugin name in the enabled list without mutating state directly
    // to keep React state updates predictable.
    const selectable = normalizedEnabled.filter((n) => !lockedSet.has(n));
    const nextSelectable = selectable.includes(name)
      ? selectable.filter((n) => n !== name)
      : [...selectable, name];
    const next = Array.from(new Set([...locked, ...nextSelectable]));
    onChange(next);
  };
  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        className="px-3 py-1 border rounded bg-gray-50 hover:bg-gray-200 flex items-center gap-1"
        onClick={() => setOpen(!open)}
        title="Plugins"
        aria-label="Plugins"
      >
        Plugins
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
                    checked={normalizedEnabled.includes(p.name)}
                    onChange={() => toggle(p.name)}
                    disabled={lockedSet.has(p.name)}
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
