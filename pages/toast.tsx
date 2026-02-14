import React, { useEffect, useMemo, useRef, useState } from "react";
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
import EditorWorkspace from "../components/EditorWorkspace";

const PLUGINS = [
  { name: "CodeSyntax", label: "CodeSyntax", plugin: codeSyntaxHighlight },
  { name: "TableMerge", label: "TableMerge", plugin: tableMergedCell },
  { name: "ColorSyntax", label: "ColorSyntax", plugin: colorSyntax },
  { name: "Chart", label: "Chart", plugin: chart },
];

function ToastPage() {
  const editorRef = useRef<Editor>(null);
  const [enabled, setEnabled] = useState<string[]>(PLUGINS.map((p) => p.name));
  const [content, setContent] = useState("");
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);

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

  useEffect(() => {
    if (typeof window !== "undefined" && editorRef.current) {
      (window as any).toastEditor = editorRef.current.getInstance();
    }
  }, []);

  return (
    <EditorWorkspace
      title="Toast UI Editor"
      description="Review plugin toggles and markdown-style formatting in a full-page Toast UI workspace."
      controls={
        <>
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
          <EditorIntegrationInfo editorName="Toast UI Editor" />
        </div>
      }
    >
      <div className="h-full p-3">
        <div className="h-[58vh] overflow-auto rounded-md border border-slate-300 bg-white p-2 dark:border-slate-600 dark:bg-slate-900">
          <Editor
            ref={editorRef}
            initialValue={content}
            plugins={activePlugins}
            height="100%"
            previewStyle="vertical"
            usageStatistics={false}
            onChange={() => {
              const html = editorRef.current?.getInstance().getHTML() ?? "";
              setContent(html);
            }}
          />
        </div>
      </div>
    </EditorWorkspace>
  );
}

export default
  typeof process !== "undefined" && process.env.NODE_ENV === "test"
    ? ToastPage
    : dynamic(() => Promise.resolve(ToastPage), { ssr: false });
