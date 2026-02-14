import React, { useMemo, useState } from "react";
import { createEditor } from "slate";
import { Slate, Editable, withReact, useSlate } from "slate-react";
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

const PLUGINS = [{ name: "history", label: "History" }, { name: "lists", label: "Lists" }];

function SlateToolbar({ enabled }: { enabled: string[] }) {
  const editor = useSlate();

  return (
    <div className="mb-3 flex flex-wrap gap-2">
      <button
        aria-label="Bold"
        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-900 dark:hover:bg-slate-800"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.exec("bold");
        }}
      >
        Bold
      </button>
      <button
        aria-label="Italic"
        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-900 dark:hover:bg-slate-800"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.exec("italic");
        }}
      >
        Italic
      </button>
      <button
        aria-label="Link"
        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-900 dark:hover:bg-slate-800"
        onMouseDown={(e) => {
          e.preventDefault();
          const url = window.prompt("Enter the link URL.");
          if (url) editor.exec("createLink", url);
        }}
      >
        Link
      </button>
      <button
        aria-label="Bullet List"
        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-100 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-900 dark:hover:bg-slate-800"
        disabled={!enabled.includes("lists")}
        onMouseDown={(e) => {
          e.preventDefault();
          editor.exec("insertUnorderedList");
        }}
      >
        Bullet list
      </button>
      <button
        aria-label="Numbered List"
        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-100 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-900 dark:hover:bg-slate-800"
        disabled={!enabled.includes("lists")}
        onMouseDown={(e) => {
          e.preventDefault();
          editor.exec("insertOrderedList");
        }}
      >
        Numbered list
      </button>
    </div>
  );
}

export default function SlatePage() {
  const [enabled, setEnabled] = useState<string[]>(PLUGINS.map((p) => p.name));
  const [value, setValue] = useState("");
  const [content, setContent] = useState("");
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);

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
      title="Slate editor"
      description="Test formatting commands and plugin toggles in a full-page Slate authoring environment."
      controls={
        <>
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
          <EditorIntegrationInfo editorName="Slate" />
        </div>
      }
    >
      <div className="h-full p-3">
        <Slate
          editor={editor}
          value={value}
          onChange={() => {
            setValue(editor.getHTML());
            setContent(editor.getText());
          }}
        >
          <SlateToolbar enabled={enabled} />
          <Editable
            className="h-[58vh] w-full rounded-md border border-slate-300 bg-white p-3 text-slate-900 outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          />
        </Slate>
      </div>
    </EditorWorkspace>
  );
}
