import { useState } from 'react';
import example from '../templates/example.json';
import helloWorld from '../templates/hello-world.json';

export interface TemplateLoaderProps {
  /** Callback fired with the selected template. */
  onLoad: (template: unknown) => void;
}

const templates = { example, helloWorld };

/**
 * Provides a dropdown to select and load example templates.
 */
export default function TemplateLoader({ onLoad }: TemplateLoaderProps) {
  const [selected, setSelected] = useState<keyof typeof templates>('example');

  return (
    <div>
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value as keyof typeof templates)}
        data-testid="template-select"
      >
        {Object.keys(templates).map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
      <button
        onClick={() => onLoad(templates[selected])}
        data-testid="template-load-btn"
      >
        Load
      </button>
    </div>
  );
}
