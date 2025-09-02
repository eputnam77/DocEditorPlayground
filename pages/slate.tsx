import React, { useMemo, useState } from "react";
import { createEditor } from "slate";
import { Slate, Editable, withReact, useSlate } from "slate-react";

/**
 * Minimal Slate-style editor using lightweight stubs. This integrates
 * template loading, plugin toggles and basic formatting commands.
 */
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

const PLUGINS = [{ name: "history" }, { name: "lists" }];

function SlateToolbar({ enabled }: { enabled: string[] }) {
  const editor = useSlate();
  return (
    <div className="flex gap-2 mb-2">
      <button
        aria-label="Bold"
        className="px-2 py-1 border rounded"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.exec("bold");
        }}
      >
        Bold
      </button>
      <button
        aria-label="Italic"
        className="px-2 py-1 border rounded"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.exec("italic");
        }}
      >
        Italic
      </button>
      <button
        aria-label="Link"
        className="px-2 py-1 border rounded"
        onMouseDown={(e) => {
          e.preventDefault();
          const url = window.prompt("Enter URL");
          if (url) editor.exec("createLink", url);
        }}
      >
        Link
      </button>
      <button
        aria-label="Bullet List"
        className="px-2 py-1 border rounded"
        disabled={!enabled.includes("lists")}
        onMouseDown={(e) => {
          e.preventDefault();
          editor.exec("insertUnorderedList");
        }}
      >
        Bullet List
      </button>
      <button
        aria-label="Numbered List"
        className="px-2 py-1 border rounded"
        disabled={!enabled.includes("lists")}
        onMouseDown={(e) => {
          e.preventDefault();
          editor.exec("insertOrderedList");
        }}
      >
        Numbered List
      </button>
    </div>
  );
}

function SlatePage() {
  const [enabled, setEnabled] = useState<string[]>(PLUGINS.map((p) => p.name));
  const [value, setValue] = useState("");
  const [content, setContent] = useState("");
  const [validationResults, setValidationResults] = useState<
    ValidationResult[]
  >([]);

  const editor = useMemo(() => withReact(createEditor()), []);

  async function loadTemplate(filename: string) {
    try {
      const res = await fetch(`/templates/${filename}`);
      if (!res.ok) throw new Error("fetch failed");
      const html = await res.text();
      const clean = sanitizeHtml(html);
      setValue(clean);
      const doc = new DOMParser().parseFromString(clean, "text/html");
      setContent(doc.body.textContent || "");
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
      <div className="p-4 space-y-2 h-screen flex flex-col">
        <h1>Slate</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Basic Slate-style editor with formatting toolbar.
        </p>
        <div className="flex gap-2">
          <TemplateLoader
            templates={TEMPLATES}
            onLoad={loadTemplate}
            onClear={() => {
              setValue("");
              setContent("");
            }}
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
        <Slate
          editor={editor}
          value={value}
          onChange={() => {
            setValue(editor.getHTML());
            setContent(editor.getText());
          }}
        >
          <SlateToolbar enabled={enabled} />
          <Editable className="flex-1 border rounded p-2 min-h-[200px]" />
        </Slate>
        <TrackChanges content={content} />
        {validationResults.length > 0 && (
          <ValidationStatus
            results={validationResults}
            onClear={() => setValidationResults([])}
          />
        )}
        <CommentTrack />
        <EditorIntegrationInfo editorName="Slate" />
      </div>
    </ModernLayout>
  );
}

export default SlatePage;
