import React, { useEffect, useRef, useState } from "react";
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

function ToastPage() {
  const hostRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);
  const [content, setContent] = useState("");
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);

  function tagEditableSurface() {
    const editable = hostRef.current?.querySelector(
      '.toastui-editor-ww-container [contenteditable="true"]',
    ) as HTMLElement | null;
    if (!editable) {
      return;
    }
    editable.setAttribute("data-testid", "toast-editor");
    editable.setAttribute("dir", "ltr");
    editable.style.direction = "ltr";
    editable.style.unicodeBidi = "plaintext";
    editable.style.textAlign = "left";
  }

  useEffect(() => {
    if (!hostRef.current || editorRef.current) {
      return;
    }

    let mounted = true;
    void import("@toast-ui/editor").then((module) => {
      if (!mounted || !hostRef.current) {
        return;
      }

      const ToastEditor = module.default;
      const editor = new ToastEditor({
        el: hostRef.current,
        height: "58vh",
        initialEditType: "wysiwyg",
        previewStyle: "vertical",
        initialValue: "",
        usageStatistics: false,
        toolbarItems: [
          ["heading"],
          ["bold", "italic"],
          ["ul", "ol"],
          ["link"],
        ],
        events: {
          change: () => {
            const html = editor.getHTML();
            setContent(html);
            tagEditableSurface();
          },
        },
      });

      editorRef.current = editor;
      (window as unknown as Record<string, unknown>).toastEditor = editor;
      tagEditableSurface();
    });

    return () => {
      mounted = false;
      const editor = editorRef.current;
      if (editor) {
        editor.destroy();
      }
      editorRef.current = null;
    };
  }, []);

  async function loadTemplate(filename: string) {
    try {
      const res = await fetch(`/templates/${filename}`);
      if (!res.ok) {
        throw new Error("fetch failed");
      }
      const html = sanitizeHtml(await res.text());
      editorRef.current?.setHTML(html);
      setContent(html);
      tagEditableSurface();
    } catch {
      alert(`Failed to load template: ${filename}`);
    }
  }

  function runDiagnostics() {
    if (!editorRef.current) {
      return;
    }
    const html = editorRef.current.getHTML();
    const markdown = editorRef.current.getMarkdown();
    const editable = hostRef.current?.querySelector(
      '.toastui-editor-ww-container [contenteditable="true"]',
    ) as HTMLElement | null;
    setValidationResults(
      runEditorDiagnostics({
        editorName: "Toast UI Editor",
        capabilities: {
          heading: true,
          bulletList: true,
          numberedList: true,
        },
        getContent: () => ({
          text: htmlToText(html),
          html,
          json: { markdown },
        }),
        getDirection: () =>
          editable ? window.getComputedStyle(editable).direction : null,
        getSelectionFormatState: () => ({
          bold: !!hostRef.current?.querySelector(".toastui-editor-toolbar-icons.bold.active"),
          italic: !!hostRef.current?.querySelector(".toastui-editor-toolbar-icons.italic.active"),
        }),
      }),
    );
  }

  return (
    <EditorWorkspace
      title="Toast UI Editor"
      description="Official Toast UI WYSIWYG integration with built-in icon toolbar and active-state formatting controls."
      toolDescription={EDITOR_BY_ID.toast.toolDescription}
      toolRepoUrl={EDITOR_BY_ID.toast.githubRepoUrl}
      controls={
        <>
          <TemplateLoader
            templates={TEMPLATES}
            onLoad={loadTemplate}
            onClear={() => {
              editorRef.current?.setHTML("");
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
          <EditorIntegrationInfo editorName="Toast UI Editor" />
        </div>
      }
    >
      <div className="h-full p-3">
        <p className="mb-2 text-xs text-slate-600 dark:text-slate-300">
          Use the editor&apos;s built-in icon toolbar for heading, bold/italic, and list formatting.
        </p>
        <div
          dir="ltr"
          className="toast-editor-shell h-[58vh] overflow-auto rounded-md border border-slate-300 bg-white p-2 text-left dark:border-slate-600 dark:bg-slate-900"
        >
          <div ref={hostRef} />
        </div>
      </div>
    </EditorWorkspace>
  );
}

export default
  typeof process !== "undefined" && process.env.NODE_ENV === "test"
    ? ToastPage
    : dynamic(() => Promise.resolve(ToastPage), { ssr: false });
