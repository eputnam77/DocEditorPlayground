import { useState } from "react";

export interface PluginManagerProps {
  /** Names of available plugins to toggle. */
  plugins: string[];
  /** Optional callback fired when a plugin is enabled or disabled. */
  onToggle?: (plugin: string, enabled: boolean) => void;
}

/**
 * Displays checkboxes for enabling or disabling editor plugins.
 */
/**
 * Displays checkboxes for enabling or disabling editor plugins. Each
 * checkbox change optionally notifies a parent component via `onToggle`.
 */
export default function PluginManager({
  plugins,
  onToggle,
}: PluginManagerProps) {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(plugins.map((p) => [p, false])),
  );

  function toggle(plugin: string) {
    setEnabled((prev) => {
      const next = !prev[plugin];
      const newState = { ...prev, [plugin]: next };
      onToggle?.(plugin, next);
      return newState;
    });
  }

  return (
    <div>
      {plugins.map((p) => (
        <label key={p} style={{ marginRight: "0.5rem" }}>
          <input
            type="checkbox"
            checked={enabled[p]}
            onChange={() => toggle(p)}
            data-testid={`plugin-${p}`}
          />
          {p}
        </label>
      ))}
    </div>
  );
}
