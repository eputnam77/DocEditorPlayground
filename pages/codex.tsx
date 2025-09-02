import React, { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";

/**
 * Editor.js demo page with basic plugin toggles and template loading.
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

const PLUGINS = [
  { name: "header", label: "Header" },
  { name: "list", label: "List" },
];

function CodexPage() {
  const [enabled, setEnabled] = useState<string[]>(PLUGINS.map((p) => p.name));
  const [content, setContent] = useState("");
  const [validationResults, setValidationResults] = useState<
    ValidationResult[]
  >([]);
  const holderRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<EditorJS | null>(null);

  useEffect(() => {
    const tools: Record<string, any> = {};
    if (enabled.includes("header")) tools.header = Header;
    if (enabled.includes("list")) tools.list = List;

    const editor = new EditorJS({
      holder: holderRef.current!,
      tools,
      async onChange() {
        const data = await editor.save();
        const text = data.blocks
          .map((b: any) => (b.data && b.data.text ? b.data.text : ""))
          .join("\n");
        setContent(text);
      },
    });
    editorRef.current = editor;
    (window as any).editor = editor;
    return () => {
      editor.destroy();
      editorRef.current = null;
    };
  }, [enabled]);

  async function loadTemplate(filename: string) {
    try {
      const res = await fetch(`/templates/${filename}`);
      if (!res.ok) throw new Error("fetch failed");
      const html = await res.text();
      const sanitized = sanitizeHtml(html);
      editorRef.current?.blocks.renderFromHTML(sanitized);
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
        <h1>Editor.js</h1>
        <div className="flex gap-2">
          <TemplateLoader
            templates={TEMPLATES}
            onLoad={loadTemplate}
            onClear={() => editorRef.current?.blocks.renderFromHTML("")}
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
        <div
          id="codex-editor"
          data-testid="codex-editor"
          ref={holderRef}
          className="w-full border rounded p-2 min-h-[60vh]"
        />
        <TrackChanges content={content} />
        {validationResults.length > 0 && (
          <ValidationStatus
            results={validationResults}
            onClear={() => setValidationResults([])}
          />
        )}
        <CommentTrack />
        <EditorIntegrationInfo editorName="Editor.js" />
      </div>
    </ModernLayout>
  );
}

export default CodexPage;
