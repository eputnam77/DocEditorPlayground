import { useState } from "react";
import example from "../templates/example.json";
import helloWorld from "../templates/hello-world.json";
import simpleArticle from "../templates/simple-article.json";
import { validateTemplate } from "../utils/validation";

export interface TemplateLoaderProps {
  /** Callback fired with the selected template. */
  onLoad: (template: unknown) => void;
}

const templates = { example, helloWorld, simpleArticle } as const;

type TemplateName = keyof typeof templates;

/**
 * Provides a dropdown to select and load example templates. Displays
 * validation result after loading.
 */
export default function TemplateLoader({ onLoad }: TemplateLoaderProps) {
  const [selected, setSelected] = useState<TemplateName>("example");
  const [message, setMessage] = useState("");

  function handleLoad() {
    const tpl = templates[selected];
    onLoad(tpl);
    setMessage(validateTemplate(tpl) ? "Template valid" : "Template invalid");
  }

  return (
    <div>
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value as TemplateName)}
        data-testid="template-select"
      >
        {Object.keys(templates).map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
      <button onClick={handleLoad} data-testid="template-load-btn">
        Load
      </button>
      {message && <span data-testid="template-msg">{message}</span>}
    </div>
  );
}
