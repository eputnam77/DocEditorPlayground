import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";
import EditorIntegrationInfo from "../components/EditorIntegrationInfo";
import TemplateLoader from "../components/TemplateLoader";
import sanitizeHtml from "../utils/sanitize";
import ValidationStatus, {
  type ValidationResult,
} from "../components/ValidationStatus";
import CommentTrack from "../components/CommentTrack";
import TrackChanges from "../components/TrackChanges";
import { TEMPLATES } from "../utils/templates";
import EditorWorkspace from "../components/EditorWorkspace";
import { EDITOR_BY_ID } from "../components/editorCatalog";
import { runEditorDiagnostics } from "../utils/editorDiagnostics";

function htmlToText(html: string): string {
  if (typeof window === "undefined") {
    return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  }
  const doc = new DOMParser().parseFromString(html, "text/html");
  return (doc.body.textContent || "").replace(/\s+/g, " ").trim();
}

function CkeditorPage() {
  const editorRef = useRef<any>(null);
  const [editorConstructor, setEditorConstructor] = useState<any>(null);
  const [content, setContent] = useState("");
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);

  React.useEffect(() => {
    let mounted = true;
    void import("@ckeditor/ckeditor5-build-classic").then((module) => {
      if (mounted) {
        setEditorConstructor(() => module.default);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  async function loadTemplate(filename: string) {
    try {
      const response = await fetch(`/templates/${filename}`);
      if (!response.ok) {
        throw new Error("fetch failed");
      }
      const html = sanitizeHtml(await response.text());
      editorRef.current?.setData(html);
      setContent(html);
    } catch {
      alert(`Failed to load template: ${filename}`);
    }
  }

  function runDiagnostics() {
    const editor = editorRef.current;
    const editable = editor?.ui?.getEditableElement?.() ?? null;
    setValidationResults(
      runEditorDiagnostics({
        editorName: "CKEditor 5",
        capabilities: {
          heading: true,
          bulletList: true,
          numberedList: true,
        },
        getContent: () => ({
          text: htmlToText(content),
          html: content,
          json: editor?.getData ? { html: editor.getData() } : null,
        }),
        getDirection: () =>
          editable ? window.getComputedStyle(editable).direction : null,
        getSelectionFormatState: () => ({
          bold: Boolean(editor?.commands?.get("bold")?.value),
          italic: Boolean(editor?.commands?.get("italic")?.value),
          heading: Boolean(editor?.commands?.get("heading")?.value),
          bulletList: Boolean(editor?.commands?.get("bulletedList")?.value),
          numberedList: Boolean(editor?.commands?.get("numberedList")?.value),
        }),
      }),
    );
  }

  return (
    <EditorWorkspace
      title="CKEditor 5"
      description="Official Classic build configuration with icon toolbar, active command states, and paragraph/list/heading support."
      toolDescription={EDITOR_BY_ID.ckeditor.toolDescription}
      toolRepoUrl={EDITOR_BY_ID.ckeditor.githubRepoUrl}
      controls={
        <>
          <TemplateLoader
            templates={TEMPLATES}
            onLoad={loadTemplate}
            onClear={() => {
              editorRef.current?.setData("");
              setContent("");
            }}
            onError={(error) => alert(String(error))}
          />
          <button
            type="button"
            className="rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white hover:bg-sky-700"
            onClick={runDiagnostics}
          >
            Run diagnostics
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
          Use CKEditor&apos;s built-in toolbar for heading, bold/italic, and list formatting with automatic active indicators.
        </p>
        <div
          dir="ltr"
          className="ckeditor-editor-shell h-[58vh] overflow-auto rounded-md border border-slate-300 bg-white p-2 text-left dark:border-slate-600 dark:bg-slate-900"
        >
          {editorConstructor && (
            <ClientCKEditor
              editor={editorConstructor}
              data={content}
              onReady={(editor: any) => {
                editorRef.current = editor;
                (window as unknown as Record<string, unknown>).ckeditorEditor = editor;
                const editable =
                  editor?.ui?.getEditableElement?.() ??
                  editor?.ui?.view?.editable?.element ??
                  null;
                if (editable) {
                  editable.setAttribute("dir", "ltr");
                  editable.setAttribute("data-testid", "ckeditor-editable");
                  editable.style.direction = "ltr";
                  editable.style.unicodeBidi = "plaintext";
                  editable.style.textAlign = "left";
                }
              }}
              onChange={(_, editor: any) => {
                setContent(editor.getData());
              }}
              config={{
                toolbar: {
                  items: [
                    "heading",
                    "|",
                    "bold",
                    "italic",
                    "bulletedList",
                    "numberedList",
                    "|",
                    "undo",
                    "redo",
                  ],
                  shouldNotGroupWhenFull: true,
                },
                placeholder: "Start writing...",
              }}
            />
          )}
        </div>
      </div>
    </EditorWorkspace>
  );
}

const ClientCKEditor = dynamic(
  async () => {
    const module = await import("@ckeditor/ckeditor5-react");
    return module.CKEditor as any;
  },
  { ssr: false },
);

export default
  typeof process !== "undefined" && process.env.NODE_ENV === "test"
    ? CkeditorPage
    : dynamic(() => Promise.resolve(CkeditorPage), { ssr: false });
