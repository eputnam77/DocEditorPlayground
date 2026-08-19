import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import EditorProfile from "../components/EditorProfile";
import EditorOutputPanel from "../components/EditorOutputPanel";
import TemplateLoader from "../components/TemplateLoader";
import sanitizeHtml from "../utils/sanitize";
import ValidationStatus, {
  type ValidationResult,
} from "../components/ValidationStatus";
import CommentTrack from "../components/CommentTrack";
import TrackChanges from "../components/TrackChanges";
import { TEMPLATES, getTemplateHtml } from "../utils/templates";
import { LIPSUM_HTML } from "../utils/lipsum";
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
  const [content, setContent] = useState(LIPSUM_HTML);
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

  function loadTemplate(filename: string) {
    // Templates are compiled into the bundle, so this cannot fail on a network
    // hop the way the previous fetch("/templates/...") could.
    const html = sanitizeHtml(getTemplateHtml(filename));
    editorRef.current?.setData(html);
    setContent(html);
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
    <>
      <Head>
        <title>CKEditor 5 · Document Editor Playground</title>
      </Head>
      <EditorWorkspace
        editorId="ckeditor"
        title="CKEditor 5"
        description="The batteries-included option: the toolbar, dropdowns, and balloon UI below all ship with the editor. Nothing on this page draws CKEditor's controls - it draws its own."
        toolDescription={EDITOR_BY_ID.ckeditor.toolDescription}
        toolRepoUrl={EDITOR_BY_ID.ckeditor.githubRepoUrl}
        surfaceNote={
          <>
            <strong>Look for:</strong> the gray toolbar below is CKEditor&apos;s own.
            Select a heading from its dropdown and the paragraph style changes
            immediately - CKEditor maintains its own document model, so it never
            produces invalid markup. Its output is HTML and only HTML.
          </>
        }
        controls={
          <>
            <TemplateLoader
              templates={TEMPLATES}
              onLoad={loadTemplate}
              onClear={() => {
                editorRef.current?.setData("");
                setContent("");
              }}
              onError={(error) => alert(`Could not load template: ${String(error)}`)}
            />
            <button
              type="button"
              className="dep-btn dep-btn--mark"
              onClick={runDiagnostics}
            >
              Run diagnostics
            </button>
          </>
        }
        diagnostics={
          <ValidationStatus
            results={validationResults}
            onClear={() => setValidationResults([])}
          />
        }
        statusPanel={
          <div className="space-y-3">
            <EditorOutputPanel
              editorName="CKEditor 5"
              nativeFormat={EDITOR_BY_ID.ckeditor.nativeFormat}
              available={["html"]}
              getters={{
                html: () => editorRef.current?.getData?.() ?? content,
              }}
            />
            <TrackChanges content={content} />
          </div>
        }
        sidePanel={
          <div className="space-y-5">
            <EditorProfile editorId="ckeditor" />
            <hr className="dep-rule" />
            <CommentTrack />
          </div>
        }
      >
        <div className="dep-doc h-full p-3">
          <div
            dir="ltr"
            className="ckeditor-editor-shell dep-sheet h-[58vh] overflow-auto p-2"
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
                onChange={(_: unknown, editor: any) => {
                  setContent(editor.getData());
                }}
                config={{
                  toolbar: {
                    items: [
                      "heading",
                      "|",
                      "bold",
                      "italic",
                      "link",
                      "bulletedList",
                      "numberedList",
                      "|",
                      "blockQuote",
                      "insertTable",
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
    </>
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
