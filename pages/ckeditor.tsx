import React, { useMemo, useRef, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
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
  { name: "bold", label: "Bold" },
  { name: "italic", label: "Italic" },
  { name: "underline", label: "Underline" },
  { name: "heading", label: "Heading" },
  { name: "paragraph", label: "Paragraph" },
  { name: "bulletedList", label: "Bullet list" },
  { name: "numberedList", label: "Numbered list" },
];

export default function CkeditorPage() {
  const editorRef = useRef<any>(null);
  const [enabled, setEnabled] = useState<string[]>(PLUGINS.map((p) => p.name));
  const [content, setContent] = useState("");
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);

  const toolbarItems = useMemo(() => [...enabled, "undo", "redo"], [enabled]);

  async function loadTemplate(filename: string) {
    try {
      const res = await fetch(`/templates/${filename}`);
      if (!res.ok) throw new Error("fetch failed");
      const html = await res.text();
      const sanitized = sanitizeHtml(html);
      setContent(sanitized);
      editorRef.current?.setData(sanitized);
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

  return (
    <EditorWorkspace
      title="CKEditor 5"
      description="Evaluate classic rich-text commands and plugin toggles in a full-page CKEditor flow."
      controls={
        <>
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
          <EditorIntegrationInfo editorName="CKEditor 5" />
        </div>
      }
    >
      <div className="h-full p-3">
        <p className="mb-2 text-xs text-slate-600 dark:text-slate-300">
          Press Enter in the editor to create a new paragraph.
        </p>
        <div
          dir="ltr"
          className="ckeditor-editor-shell h-[58vh] overflow-auto rounded-md border border-slate-300 bg-white p-2 text-left dark:border-slate-600 dark:bg-slate-900"
        >
          <CKEditor
            editor={ClassicEditor}
            data={content}
            key={enabled.join(",")}
            onReady={(editor: any) => {
              editorRef.current = editor;
              const editableElement =
                editor?.ui?.getEditableElement?.() ??
                editor?.ui?.view?.editable?.element ??
                null;
              if (editableElement && editableElement.setAttribute) {
                editableElement.setAttribute("dir", "ltr");
                editableElement.setAttribute("data-testid", "ckeditor-editable");
                editableElement.style.direction = "ltr";
                editableElement.style.textAlign = "left";
              }
            }}
            onChange={(event, editor: any) => {
              setContent(editor.getData());
            }}
            config={{ toolbar: { items: toolbarItems } }}
          />
        </div>
      </div>
    </EditorWorkspace>
  );
}
