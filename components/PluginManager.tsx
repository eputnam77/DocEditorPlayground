import { useState } from 'react';

export interface PluginManagerProps {
  /** Names of available plugins to toggle. */
  plugins: string[];
}

/**
 * Displays checkboxes for enabling or disabling editor plugins.
 */
export default function PluginManager({ plugins }: PluginManagerProps) {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(plugins.map((p) => [p, false]))
  );

  function toggle(plugin: string) {
    setEnabled((prev) => ({ ...prev, [plugin]: !prev[plugin] }));
  }

  return (
    <div>
      {plugins.map((p) => (
        <label key={p} style={{ marginRight: '0.5rem' }}>
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
