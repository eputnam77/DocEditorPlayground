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
          .map((b: any) => {
            if (b?.data?.text) {
              return b.data.text;
            }
            if (Array.isArray(b?.data?.items)) {
              return b.data.items.join(" ");
            }
            return "";
          })
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
      setValidationResults([
        {
          id: 1,
          label: "Document",
          passed,
          detail: "Checks that the editor content contains non-whitespace text.",
        },
      ]);
    } catch {
      alert("Validation failed.");
    }
  }

  async function insertBlock(type: "paragraph" | "header" | "list", data: Record<string, any>) {
    try {
      await editorRef.current?.blocks.insert(type, data);
    } catch {
      alert("Could not insert block.");
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
        <p className="mb-2 text-xs text-slate-600 dark:text-slate-300">
          Press Enter in the editor to create a new paragraph block.
        </p>
        <div className="mb-3 flex flex-wrap gap-2">
          <button
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-900 dark:hover:bg-slate-800"
            onMouseDown={(e) => {
              e.preventDefault();
              void insertBlock("paragraph", { text: "" });
            }}
          >
            Paragraph
          </button>
          <button
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-100 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-900 dark:hover:bg-slate-800"
            disabled={!enabled.includes("header")}
            onMouseDown={(e) => {
              e.preventDefault();
              void insertBlock("header", { text: "Heading", level: 2 });
            }}
          >
            Heading
          </button>
          <button
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-100 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-900 dark:hover:bg-slate-800"
            disabled={!enabled.includes("list")}
            onMouseDown={(e) => {
              e.preventDefault();
              void insertBlock("list", {
                style: "unordered",
                items: [content.trim() || "List item"],
              });
            }}
          >
            Bullet list
          </button>
          <button
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-100 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-900 dark:hover:bg-slate-800"
            disabled={!enabled.includes("list")}
            onMouseDown={(e) => {
              e.preventDefault();
              void insertBlock("list", {
                style: "ordered",
                items: [content.trim() || "List item"],
              });
            }}
          >
            Numbered list
          </button>
        </div>
        <div
          id="codex-editor"
          data-testid="codex-editor"
          ref={holderRef}
          dir="ltr"
          className="h-[58vh] w-full rounded-md border border-slate-300 bg-white p-3 text-left text-slate-900 outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
        />
      </div>
    </EditorWorkspace>
  );
}
