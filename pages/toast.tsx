import React, { useEffect, useRef, useState } from "react";
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
import { LIPSUM_MARKDOWN } from "../utils/lipsum";
import EditorWorkspace from "../components/EditorWorkspace";
import { EDITOR_BY_ID } from "../components/editorCatalog";
import { runEditorDiagnostics } from "../utils/editorDiagnostics";

type EditorMode = "markdown" | "wysiwyg";

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
  const [mode, setMode] = useState<EditorMode>("wysiwyg");
  const [darkTheme, setDarkTheme] = useState(false);
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

  // Toast ships its own theme, keyed off a class on the container rather than
  // the document, so the app's dark mode has to be mirrored onto it.
  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setDarkTheme(root.classList.contains("dark"));
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

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
        // Fill the host element instead of a viewport-relative height, which
        // previously pushed the Markdown/WYSIWYG switch past the container's
        // bottom edge where it was all but invisible.
        height: "100%",
        initialEditType: "wysiwyg",
        previewStyle: "vertical",
        initialValue: LIPSUM_MARKDOWN,
        usageStatistics: false,
        toolbarItems: [
          ["heading", "bold", "italic", "strike"],
          ["hr", "quote"],
          ["ul", "ol", "task", "indent", "outdent"],
          ["table", "link"],
          ["code", "codeblock"],
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
      setContent(editor.getHTML());
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

  function changeMode(next: EditorMode) {
    editorRef.current?.changeMode?.(next);
    setMode(next);
    if (next === "wysiwyg") {
      // The WYSIWYG DOM is rebuilt on every mode change.
      window.setTimeout(tagEditableSurface, 0);
    }
  }

  function loadTemplate(filename: string) {
    const html = sanitizeHtml(getTemplateHtml(filename));
    editorRef.current?.setHTML(html);
    setContent(html);
    tagEditableSurface();
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
          bold: !!hostRef.current?.querySelector(
            ".toastui-editor-toolbar-icons.bold.active",
          ),
          italic: !!hostRef.current?.querySelector(
            ".toastui-editor-toolbar-icons.italic.active",
          ),
        }),
      }),
    );
  }

  return (
    <>
      <Head>
        <title>Toast UI Editor · Document Editor Playground</title>
      </Head>
      <EditorWorkspace
        editorId="toast"
        title="Toast UI Editor"
        description="The only editor here that treats Markdown as its source of truth. Switch modes mid-document and the same content is re-rendered from the Markdown, not converted and lost."
        toolDescription={EDITOR_BY_ID.toast.toolDescription}
        toolRepoUrl={EDITOR_BY_ID.toast.githubRepoUrl}
        surfaceNote={
          <>
            <strong>Try this:</strong> make a heading and a bullet list in WYSIWYG,
            then press <em>Markdown</em> above. You are now editing the raw{" "}
            <code>## heading</code> and <code>- item</code> source, with a live preview
            beside it. Type Markdown syntax by hand and switch back - no other editor on
            this site can do that.
          </>
        }
        controls={
          <>
            <div className="dep-toolbar" role="group" aria-label="Editing mode">
              <span className="dep-toolbar__label">Mode</span>
              <button
                type="button"
                className="dep-tool"
                aria-pressed={mode === "wysiwyg"}
                onClick={() => changeMode("wysiwyg")}
                title="Rich-text editing"
              >
                <span className="dep-tool__text">WYSIWYG</span>
              </button>
              <button
                type="button"
                className="dep-tool"
                aria-pressed={mode === "markdown"}
                onClick={() => changeMode("markdown")}
                title="Edit the Markdown source with a live preview"
              >
                <span className="dep-tool__text">Markdown source</span>
              </button>
            </div>
            <TemplateLoader
              templates={TEMPLATES}
              onLoad={loadTemplate}
              onClear={() => {
                editorRef.current?.setMarkdown("");
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
              editorName="Toast UI Editor"
              nativeFormat={EDITOR_BY_ID.toast.nativeFormat}
              available={["markdown", "html"]}
              getters={{
                markdown: () => editorRef.current?.getMarkdown?.() ?? "",
                html: () => editorRef.current?.getHTML?.() ?? content,
              }}
            />
            <TrackChanges content={content} />
          </div>
        }
        sidePanel={
          <div className="space-y-5">
            <EditorProfile editorId="toast" />
            <hr className="dep-rule" />
            <CommentTrack />
          </div>
        }
      >
        <div className="dep-doc h-full p-3">
          <div
            dir="ltr"
            className={`toast-editor-shell dep-sheet h-[58vh] overflow-hidden p-2 ${
              darkTheme ? "toastui-editor-dark" : ""
            }`}
          >
            <div ref={hostRef} className="h-full" />
          </div>
        </div>
      </EditorWorkspace>
    </>
  );
}

export default
  typeof process !== "undefined" && process.env.NODE_ENV === "test"
    ? ToastPage
    : dynamic(() => Promise.resolve(ToastPage), { ssr: false });
