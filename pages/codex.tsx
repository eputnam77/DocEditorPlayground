import React, { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
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
import EditorWorkspace from "../components/EditorWorkspace";

const PLUGINS = [
  { name: "header", label: "Header" },
  { name: "list", label: "List" },
];

export default function CodexPage() {
  const [enabled, setEnabled] = useState<string[]>(PLUGINS.map((p) => p.name));
  const [content, setContent] = useState("");
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
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
      await editorRef.current?.blocks.renderFromHTML(sanitized);
    } catch {
      alert(`Failed to load template: ${filename}`);
    }
  }

  function runValidation() {
    try {
      const passed = validateDocument({ content });
      setValidationResults([{ id: 1, label: "Document", passed }]);
    } catch {
      alert("Validation failed.");
    }
  }

  return (
    <EditorWorkspace
      title="Editor.js"
      description="Test block-based authoring, plugin toggles, and content updates in one full-page canvas."
      controls={
        <>
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
            className="rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white hover:bg-sky-700"
            onClick={runValidation}
          >
            Run validation
          </button>
        </>
      }
      statusPanel={
        <div className="space-y-3">
          <TrackChanges content={content} />
          {validationResults.length > 0 && (
            <ValidationStatus
              results={validationResults}
              onClear={() => setValidationResults([])}
            />
          )}
        </div>
      }
      sidePanel={
        <div className="space-y-4">
          <CommentTrack />
          <EditorIntegrationInfo editorName="Editor.js" />
        </div>
      }
    >
      <div className="h-full p-3">
        <div
          id="codex-editor"
          data-testid="codex-editor"
          ref={holderRef}
          className="h-[58vh] w-full rounded-md border border-slate-300 bg-white p-3 text-slate-900 outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
        />
      </div>
    </EditorWorkspace>
  );
}
