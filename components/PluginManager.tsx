import React from 'react';

export interface PluginItem {
  name: string;
  label?: string;
}

export interface PluginManagerProps {
  plugins: PluginItem[];
  enabled: string[];
  onChange(enabled: string[]): void;
}

/**
 * PluginManager renders a simple list of checkboxes for enabling/disabling
 * editor plugins. It maintains no internal state and delegates changes to
 * the parent via the `onChange` callback.
 */
export default function PluginManager({ plugins, enabled, onChange }: PluginManagerProps) {
  const toggle = (name: string) => {
    const next = enabled.includes(name)
      ? enabled.filter((n) => n !== name)
      : [...enabled, name];
    onChange(next);
  };
  return (
    <div className="space-y-1">
      {plugins.map((p) => (
        <label key={p.name} className="flex items-center gap-2 text-sm">
          <input
            id={`plugin-toggle-${p.name}`}
            type="checkbox"
            checked={enabled.includes(p.name)}
            onChange={() => toggle(p.name)}
            aria-label={p.name}
          />
          {p.label ?? p.name}
        </label>
      ))}
    </div>
  );
}
