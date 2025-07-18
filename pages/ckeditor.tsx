import dynamic from "next/dynamic";
import { useState } from "react";
import EditorIntegrationInfo from "../components/EditorIntegrationInfo";
import PluginManager from "../components/PluginManager";
import TemplateLoader from "../components/TemplateLoader";
import sanitizeHtml from "../utils/sanitize";
import ValidationStatus, {
  ValidationResult,
} from "../components/ValidationStatus";
import CommentTrack from "../components/CommentTrack";
import TrackChanges from "../components/TrackChanges";
import { validateDocument } from "../utils/validation";
import { TEMPLATES } from "../utils/templates";
import ModernLayout from "../components/ModernLayout";

const PLUGINS = [{ name: "bold" }, { name: "italic" }];

function CkeditorPage() {
  const [enabled, setEnabled] = useState<string[]>(PLUGINS.map((p) => p.name));
  const [content, setContent] = useState("");
  const [validationResults, setValidationResults] = useState<
    ValidationResult[]
  >([]);

  async function loadTemplate(filename: string) {
    try {
      const res = await fetch(`/templates/${filename}`);
      if (!res.ok) throw new Error("fetch failed");
      const html = await res.text();
      setContent(sanitizeHtml(html));
    } catch {
      alert("Failed to load template: " + filename);
    }
  }

  function runValidation() {
    try {
      const passed = validateDocument({ content });
      setValidationResults([{ id: 1, label: "Document", passed }]);
    } catch {
      alert("Validation failed");
    }
  }

  return (
    <ModernLayout>
      <div className="p-4 space-y-2">
        <h1>CKEditor 5</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          This demo uses a simple textarea placeholder.
        </p>
        <p className="text-sm italic text-red-600 dark:text-red-400">
          Full CKEditor integration requires additional dependencies and is not
          available in this offline demo.
        </p>
        <div className="flex gap-2">
          <TemplateLoader
            templates={TEMPLATES}
            onLoad={loadTemplate}
            onClear={() => setContent("")}
            onError={(e) => alert(String(e))}
          />
          <PluginManager
            plugins={PLUGINS}
            enabled={enabled}
            onChange={setEnabled}
          />
          <button
            className="px-3 py-1 border rounded bg-gray-50 hover:bg-gray-200"
            onClick={runValidation}
          >
            Validate
          </button>
        </div>
        <textarea
          className="w-full border rounded p-2 min-h-[200px]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <TrackChanges content={content} />
        {validationResults.length > 0 && (
          <ValidationStatus
            results={validationResults}
            onClear={() => setValidationResults([])}
          />
        )}
        <CommentTrack />
        <EditorIntegrationInfo editorName="CKEditor 5" />
      </div>
    </ModernLayout>
  );
}

export default dynamic(() => Promise.resolve(CkeditorPage), { ssr: false });
