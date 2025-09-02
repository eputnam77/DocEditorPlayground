import React, { useState, useRef, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import { Editor } from "@toast-ui/react-editor";
import codeSyntaxHighlight from "@toast-ui/editor-plugin-code-syntax-highlight";
import tableMergedCell from "@toast-ui/editor-plugin-table-merged-cell";
import colorSyntax from "@toast-ui/editor-plugin-color-syntax";
import chart from "@toast-ui/editor-plugin-chart";

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
  { name: "CodeSyntax", plugin: codeSyntaxHighlight },
  { name: "TableMerge", plugin: tableMergedCell },
  { name: "ColorSyntax", plugin: colorSyntax },
  { name: "Chart", plugin: chart },
];

function ToastPage() {
  const editorRef = useRef<Editor>(null);
  const [enabled, setEnabled] = useState<string[]>(PLUGINS.map((p) => p.name));
  const [content, setContent] = useState("");
  const [validationResults, setValidationResults] = useState<
    ValidationResult[]
  >([]);

  const activePlugins = useMemo(
    () => PLUGINS.filter((p) => enabled.includes(p.name)).map((p) => p.plugin),
    [enabled],
  );

  async function loadTemplate(filename: string) {
    try {
      const res = await fetch(`/templates/${filename}`);
      if (!res.ok) throw new Error("fetch failed");
      const html = sanitizeHtml(await res.text());
      setContent(html);
      editorRef.current?.getInstance().setHTML(html);
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

  useEffect(() => {
    if (typeof window !== "undefined" && editorRef.current) {
      (window as any).toastEditor = editorRef.current.getInstance();
    }
  }, []);

  return (
    <ModernLayout>
      <div className="p-4 space-y-2">
        <h1>Toast UI Editor</h1>
        <div className="flex gap-2">
          <TemplateLoader
            templates={TEMPLATES}
            onLoad={loadTemplate}
            onClear={() => {
              setContent("");
              editorRef.current?.getInstance().setHTML("");
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
        <div className="w-full border rounded min-h-[60vh]">
          <Editor
            ref={editorRef}
            initialValue={content}
            plugins={activePlugins}
            height="100%"
            previewStyle="vertical"
            usageStatistics={false}
            onChange={() => {
              const html =
                editorRef.current?.getInstance().getHTML() ?? "";
              setContent(html);
            }}
          />
        </div>
        <TrackChanges content={content} />
        {validationResults.length > 0 && (
          <ValidationStatus
            results={validationResults}
            onClear={() => setValidationResults([])}
          />
        )}
        <CommentTrack />
        <EditorIntegrationInfo editorName="Toast UI" />
      </div>
    </ModernLayout>
  );
}

export default
  typeof process !== "undefined" && process.env.NODE_ENV === "test"
    ? ToastPage
    : dynamic(() => Promise.resolve(ToastPage), { ssr: false });
