import React, { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { EditorContent, useEditor } from "@tiptap/react";

// Core Extensions
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Image from "@tiptap/extension-image";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import SlashCommand from "../extensions/slash-command";
import Lint from "../extensions/lint";
import Head from "next/head";
import sanitizeHtml from "../utils/sanitize";
import { TEMPLATES, getTemplateHtml } from "../utils/templates";
import { LIPSUM_HTML } from "../utils/lipsum";
import { WorkspaceChrome } from "../components/EditorWorkspace";
import TemplateLoader from "../components/TemplateLoader";
import FormatToggleButton from "../components/FormatToggleButton";
import EditorProfile from "../components/EditorProfile";
import EditorOutputPanel from "../components/EditorOutputPanel";
import ValidationStatus, {
  type ValidationResult,
} from "../components/ValidationStatus";
import CommentTrack from "../components/CommentTrack";
import TrackChanges from "../components/TrackChanges";
import { EDITOR_BY_ID } from "../components/editorCatalog";
import { runEditorDiagnostics } from "../utils/editorDiagnostics";

// Custom TipTap extensions
import { tiptapHeadingLock } from "../extensions/tiptapHeadingLock";
import { tiptapIndentation } from "../extensions/tiptapIndentation";
import { tiptapSectionNode } from "../extensions/tiptapSectionNode";
import { tiptapWatermark } from "../extensions/tiptapWatermark";
import { tiptapMarkReview } from "../extensions/tiptapMarkReview";

// Yjs for collaboration
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";

// Icons
const Bold = dynamic(() => import("lucide-react").then((m) => m.Bold));
const Italic = dynamic(() => import("lucide-react").then((m) => m.Italic));
const UnderlineIcon = dynamic(() =>
  import("lucide-react").then((m) => m.Underline),
);
const Strikethrough = dynamic(() =>
  import("lucide-react").then((m) => m.Strikethrough),
);
const Code = dynamic(() => import("lucide-react").then((m) => m.Code));
const Quote = dynamic(() => import("lucide-react").then((m) => m.Quote));
const List = dynamic(() => import("lucide-react").then((m) => m.List));
const ListOrdered = dynamic(() =>
  import("lucide-react").then((m) => m.ListOrdered),
);
const Undo2 = dynamic(() => import("lucide-react").then((m) => m.Undo2));
const Redo2 = dynamic(() => import("lucide-react").then((m) => m.Redo2));
const ImageIcon = dynamic(() => import("lucide-react").then((m) => m.Image));
const TableIcon = dynamic(() => import("lucide-react").then((m) => m.Table));
const MenuIcon = dynamic(() => import("lucide-react").then((m) => m.Menu));
const XIcon = dynamic(() => import("lucide-react").then((m) => m.X));
const Loader2 = dynamic(() => import("lucide-react").then((m) => m.Loader2));

interface NewSuggestion {
  from: number;
  to: number;
  original: string;
  suggestion: string;
}

const EMPTY_TEXT_RE = /[\s\u200B-\u200D\u2060-\u206F\uFEFF]+/g;

export function AiSuggestButton({
  editor,
  aiSuggestEnabled,
  onNewSuggestion,
}: {
  editor: any;
  aiSuggestEnabled: boolean;
  onNewSuggestion?: (data: NewSuggestion) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSuggest() {
    setError(null);
    if (!editor) return;
    const { from, to, empty } = editor.state.selection;
    const rawSelected = empty
      ? editor.state.doc.textContent
      : editor.state.doc.textBetween(from, to, " ");
    const selectedText =
      typeof rawSelected === "string" ? rawSelected : String(rawSelected ?? "");

    const normalized = selectedText.replace(EMPTY_TEXT_RE, "");
    if (!normalized) {
      setError("Select some text before requesting a suggestion.");
      return;
    }

    const requestText = selectedText.trim() || normalized;
    setLoading(true);

    try {
      const res = await fetch("/api/ai-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: requestText,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      const rawSuggestion =
        typeof data?.suggestion === "string"
          ? data.suggestion
          : String(data?.suggestion ?? "");
      const cleanSuggestion = sanitizeHtml(rawSuggestion);

      if (aiSuggestEnabled && onNewSuggestion) {
        onNewSuggestion({
          from,
          to,
          original: selectedText,
          suggestion: cleanSuggestion,
        });
      } else {
        editor.chain().focus();
        if (empty) {
          editor.commands.setContent(cleanSuggestion);
        } else {
          editor.commands.insertContentAt({ from, to }, cleanSuggestion);
        }
      }
    } catch (err: any) {
      setError(err.message || "AI Suggest failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <span className="relative">
      <button
        type="button"
        onClick={handleSuggest}
        disabled={loading}
        className="dep-btn"
        title="Rewrite the selected text with the AI Suggest endpoint"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>AI Suggest</span>}
      </button>
      {error && (
        <div
          className="absolute left-0 z-50 mt-2 whitespace-nowrap px-2 py-1 text-xs"
          style={{
            background: "var(--mark-soft)",
            border: "1px solid var(--mark-line)",
            color: "var(--mark)",
          }}
        >
          {error}
        </div>
      )}
    </span>
  );
}

export function useCollabResources(collabEnabled: boolean) {
  const [collabDoc, setCollabDoc] = useState<Y.Doc | null>(null);
  const providerRef = useRef<any>(null);
  const docRef = useRef<Y.Doc | null>(null);
  const safeDestroyDoc = (doc: Y.Doc | null) => {
    if (doc && typeof (doc as unknown as { destroy?: () => void }).destroy === "function") {
      (doc as unknown as { destroy: () => void }).destroy();
    }
  };

  useEffect(() => {
    if (!collabEnabled) {
      if (providerRef.current) {
        providerRef.current.destroy?.();
        providerRef.current = null;
      }
      safeDestroyDoc(docRef.current);
      docRef.current = null;
      setCollabDoc(null);
      return;
    }

    try {
      const doc = new Y.Doc();
      docRef.current = doc;
      const providerInstance = new WebrtcProvider("tiptap-demo-room", doc);
      providerRef.current = providerInstance;
      setCollabDoc(doc);

      return () => {
        providerInstance.destroy?.();
        if (providerRef.current === providerInstance) {
          providerRef.current = null;
        }
        if (docRef.current === doc) {
          docRef.current = null;
        }
        safeDestroyDoc(doc);
        setCollabDoc((prev) => (prev === doc ? null : prev));
      };
    } catch (err) {
      console.warn("Failed to initialize collaboration", err);
      safeDestroyDoc(docRef.current);
      docRef.current = null;
      providerRef.current = null;
      setCollabDoc(null);
    }
  }, [collabEnabled]);

  return { collabDoc, collabProvider: providerRef.current };
}

interface SidebarProps {
  show: boolean;
  onClose: () => void;
  onTemplateLoad: (filename: string) => void;
  onToggleLint: () => void;
  lintEnabled: boolean;
  onToggleCollab: () => void;
  collabEnabled: boolean;
  onToggleAiSuggest: () => void;
  aiSuggestEnabled: boolean;
  onToggleHeadingLock: () => void;
  headingLockEnabled: boolean;
  onToggleIndentation: () => void;
  indentationEnabled: boolean;
  onToggleSectionNode: () => void;
  sectionNodeEnabled: boolean;
  onToggleMarkReview: () => void;
  markReviewEnabled: boolean;
  onToggleWatermark: () => void;
  watermarkEnabled: boolean;
  watermarkText: string;
  onWatermarkText: (text: string) => void;
  suggestions: any[];
  acceptSuggestion: (id: number) => void;
  rejectSuggestion: (id: number) => void;
  clearSuggestions: () => void;
  history: any[];
}

function Sidebar(props: SidebarProps) {
  const {
    show,
    onClose,
    onTemplateLoad,
    onToggleLint,
    lintEnabled,
    onToggleCollab,
    collabEnabled,
    onToggleAiSuggest,
    aiSuggestEnabled,
    onToggleHeadingLock,
    headingLockEnabled,
    onToggleIndentation,
    indentationEnabled,
    onToggleSectionNode,
    sectionNodeEnabled,
    onToggleMarkReview,
    markReviewEnabled,
    onToggleWatermark,
    watermarkEnabled,
    watermarkText,
    onWatermarkText,
    suggestions,
    acceptSuggestion,
    rejectSuggestion,
    clearSuggestions,
    history,
  } = props;
  return (
    <aside
      className={`dep-extension-panel ${show ? "is-open" : ""}`}
      aria-hidden={!show}
    >
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "1px solid var(--ink-16)" }}
      >
        <span className="dep-eyebrow">TipTap extensions</span>
        <button
          type="button"
          onClick={onClose}
          className="dep-btn dep-btn--quiet dep-btn--icon"
          aria-label="Close sidebar"
        >
          <XIcon className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-5 overflow-y-auto px-4 py-3" style={{ maxHeight: "calc(100vh - 4rem)" }}>
        <p className="dep-muted">
          Every switch below is a separate TipTap extension. Nothing here ships with
          the editor - this is what &quot;headless&quot; buys you.
        </p>

        {/* Templates */}
        <section>
          <div className="dep-eyebrow mb-1.5">Templates</div>
          <ul className="space-y-1">
            {TEMPLATES.map((tpl) => (
              <li key={tpl.filename}>
                <button
                  type="button"
                  className="dep-link text-sm"
                  title={tpl.note}
                  onClick={() => onTemplateLoad(tpl.filename)}
                >
                  {tpl.label}
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Validation (Lint) */}
        <section>
          <div className="dep-eyebrow mb-1.5">Validation (Lint)</div>
          <button
            className="dep-btn w-full"
            aria-pressed={lintEnabled}
            onClick={onToggleLint}
          >
            {lintEnabled ? "Disable Lint" : "Enable Lint"}
          </button>
        </section>

        {/* AI Suggest */}
        <section>
          <div className="dep-eyebrow mb-1.5 flex items-center gap-1">
            AI Suggest
            {/* Optional info icon, if you have one */}
            {/* <InfoIcon className="w-4 h-4 text-blue-500" /> */}
          </div>
          <button
            className="dep-btn w-full"
            aria-pressed={aiSuggestEnabled}
            onClick={onToggleAiSuggest}
          >
            {aiSuggestEnabled ? "Disable AI Suggest" : "Enable AI Suggest"}
          </button>
          {aiSuggestEnabled && (
            <div className="mt-2 space-y-2">
              <div className="dep-muted mb-1">
                Select text in the editor and press "AI Suggest" in the toolbar
                to get suggestions.
              </div>
              {suggestions.length === 0 ? (
                <div className="dep-muted">
                  No AI suggestions yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {suggestions.map((s) => (
                    <div
                      key={s.id}
                      className="dep-card px-3 py-2 text-sm"
                    >
                      <div className="dep-muted mb-1">
                        For: <em>{s.original.slice(0, 40)}...</em>
                      </div>
                      <div className="mb-2">{s.suggestion}</div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => acceptSuggestion(s.id)}
                          className="dep-btn dep-btn--mark"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => rejectSuggestion(s.id)}
                          className="dep-btn"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={clearSuggestions}
                    className="dep-btn dep-btn--quiet mt-2"
                  >
                    Clear all suggestions
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Heading Lock */}
        <section>
          <div className="dep-eyebrow mb-1.5">Heading Lock</div>
          <button
            className="dep-btn w-full"
            aria-pressed={headingLockEnabled}
            onClick={onToggleHeadingLock}
          >
            {headingLockEnabled ? "Disable" : "Enable"} Heading Lock
          </button>
        </section>

        {/* Indentation */}
        <section>
          <div className="dep-eyebrow mb-1.5">Indentation</div>
          <button
            className="dep-btn w-full"
            aria-pressed={indentationEnabled}
            onClick={onToggleIndentation}
          >
            {indentationEnabled ? "Disable" : "Enable"} Indentation
          </button>
        </section>

        {/* Section Node */}
        <section>
          <div className="dep-eyebrow mb-1.5">Section Node</div>
          <button
            className="dep-btn w-full"
            aria-pressed={sectionNodeEnabled}
            onClick={onToggleSectionNode}
          >
            {sectionNodeEnabled ? "Disable" : "Enable"} Section Node
          </button>
        </section>

        {/* Mark Review */}
        <section>
          <div className="dep-eyebrow mb-1.5">Mark Review</div>
          <button
            className="dep-btn w-full"
            aria-pressed={markReviewEnabled}
            onClick={onToggleMarkReview}
          >
            {markReviewEnabled ? "Disable" : "Enable"} Mark Review
          </button>
        </section>

        {/* Watermark */}
        <section>
          <div className="dep-eyebrow mb-1.5">Watermark</div>
          <button
            className="dep-btn w-full"
            aria-pressed={watermarkEnabled}
            onClick={onToggleWatermark}
          >
            {watermarkEnabled ? "Disable" : "Enable"} Watermark
          </button>
          {watermarkEnabled && (
            <input
              className="dep-input mt-2 w-full"
              value={watermarkText}
              onChange={(e) => onWatermarkText(e.target.value)}
              placeholder="Watermark text"
            />
          )}
        </section>

        {/* Collaboration */}
        <section>
          <div className="dep-eyebrow mb-1.5">Collaboration</div>
          <button
            className="dep-btn w-full"
            aria-pressed={collabEnabled}
            onClick={onToggleCollab}
          >
            {collabEnabled ? "Disconnect" : "Connect"}
          </button>
        </section>

        {/* History */}
        <section>
          <div className="dep-eyebrow mb-1.5">History</div>
          <ul className="dep-mono space-y-1" style={{ color: "var(--ink-60)" }}>
            {history.map((h: any) => (
              <li key={h.id}>{h.label}</li>
            ))}
          </ul>
        </section>
      </div>
    </aside>
  );
}

export default function TipTapEditorPage() {
  // Yjs Setup
  const [collabEnabled, setCollabEnabled] = useState(false);
  const { collabDoc, collabProvider } = useCollabResources(collabEnabled);

  // Lint (validation)
  const [lintEnabled, setLintEnabled] = useState(false);

  // Optional extensions
  const [headingLockEnabled, setHeadingLockEnabled] = useState(false);
  const [indentationEnabled, setIndentationEnabled] = useState(false);
  const [sectionNodeEnabled, setSectionNodeEnabled] = useState(false);
  const [markReviewEnabled, setMarkReviewEnabled] = useState(false);
  const [watermarkEnabled, setWatermarkEnabled] = useState(false);
  const [watermarkText, setWatermarkText] = useState("Sample");

  // Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [aiSuggestEnabled, setAiSuggestEnabled] = useState(false);
  interface Suggestion extends NewSuggestion {
    id: number;
  }
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);

  // Version History (dummy)
  const DUMMY_HISTORY = [
    { id: 1, label: "Draft - Jul 9, 8:00 am" },
    { id: 2, label: "AutoSave - Jul 8, 3:30 pm" },
    { id: 3, label: "Submitted - Jul 7, 12:15 pm" },
  ];

  // Editor Extensions
  const extensions = useMemo(() => {
    const base = [
      StarterKit,
      Underline,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      Image,
      SlashCommand,
    ];
    if (lintEnabled) {
      base.push(
        Lint.configure({
          rule: {
            match: ({ tr }) => {
              const issues: any[] = [];
              tr.doc.descendants((node, pos) => {
                // Heading check
                if (node.type.name === "heading") {
                  const text = node.textContent || "";
                  if (!text.trim().endsWith(".")) {
                    issues.push({
                      message: "Heading must end with a period.",
                      from: pos + 1,
                      to: pos + 1 + text.length,
                    });
                  }
                }
                // Prohibited 'DRAFT'
                if (node.textContent && node.textContent.includes("DRAFT")) {
                  const start = node.textContent.indexOf("DRAFT");
                  issues.push({
                    message:
                      '"DRAFT" must not appear in the finalized document.',
                    from: pos + 1 + start,
                    to: pos + 1 + start + 5,
                  });
                }
              });
              // Rule: Missing "1. Purpose." heading
              let foundPurpose = false;
              tr.doc.descendants((node) => {
                if (
                  node.type.name === "heading" &&
                  /^1\. Purpose\./.test(node.textContent)
                ) {
                  foundPurpose = true;
                }
              });
              if (!foundPurpose) {
                issues.push({
                  message: 'Missing required heading: "1. Purpose."',
                  from: 0,
                  to: 1,
                });
              }
              return issues;
            },
          },
        }),
      );
    }
    if (collabEnabled && collabDoc && collabProvider) {
      base.push(
        Collaboration.configure({ document: collabDoc }),
        CollaborationCursor.configure({
          provider: collabProvider,
          user: { name: "You", color: "#3b82f6" },
        }),
      );
    }
    if (headingLockEnabled) {
      base.push(tiptapHeadingLock());
    }
    if (indentationEnabled) {
      base.push(tiptapIndentation());
    }
    if (sectionNodeEnabled) {
      base.push(tiptapSectionNode());
    }
    if (markReviewEnabled) {
      base.push(tiptapMarkReview());
    }
    if (watermarkEnabled) {
      base.push(tiptapWatermark(watermarkText));
    }
    return base;
  }, [
    lintEnabled,
    collabEnabled,
    collabDoc,
    collabProvider,
    headingLockEnabled,
    indentationEnabled,
    sectionNodeEnabled,
    markReviewEnabled,
    watermarkEnabled,
    watermarkText,
  ]);

  // TipTap Editor
  const [content, setContent] = useState(LIPSUM_HTML);
  const editor = useEditor(
    {
      extensions,
      content,
      autofocus: true,
      immediatelyRender: false,
      editorProps: {
        attributes: {
          dir: "ltr",
          style: "direction:ltr;text-align:left;",
          class:
            "tiptap-content focus:outline-none w-full h-full min-h-[400px] max-w-[860px] mx-auto text-left",
        },
      },
      onUpdate: ({ editor }) => setContent(editor.getHTML()),
    },
    [extensions],
  );

  function getCurrentBlock(editor: any) {
    if (editor.isActive("heading", { level: 1 })) return "h1";
    if (editor.isActive("heading", { level: 2 })) return "h2";
    if (editor.isActive("heading", { level: 3 })) return "h3";
    return "p";
  }
  function setBlock(editor: any, val: string) {
    if (val === "p") editor.chain().focus().setParagraph().run();
    else if (val === "h1")
      editor.chain().focus().toggleHeading({ level: 1 }).run();
    else if (val === "h2")
      editor.chain().focus().toggleHeading({ level: 2 }).run();
    else if (val === "h3")
      editor.chain().focus().toggleHeading({ level: 3 }).run();
  }
  function toolbarButton(
    icon: React.ReactNode,
    command: () => void,
    active: boolean,
    title = "",
  ) {
    return (
      <button
        type="button"
        className={`p-2 rounded ${active ? "bg-indigo-100" : ""}`}
        onClick={command}
        title={title}
      >
        {icon}
      </button>
    );
  }

  function handleTemplateLoad(filename: string) {
    if (!editor) return;
    // Compiled into the bundle - see utils/templateContent.ts.
    const sanitized = sanitizeHtml(getTemplateHtml(filename));
    editor.commands.setContent(sanitized);
    setContent(sanitized);
    setSidebarOpen(false);
  }

  function runDiagnostics() {
    if (!editor) return;
    const editable = document.querySelector(".tiptap-content") as HTMLElement | null;
    setValidationResults(
      runEditorDiagnostics({
        editorName: "TipTap",
        capabilities: {
          heading: true,
          bulletList: true,
          numberedList: true,
        },
        getContent: () => ({
          text: editor.state.doc.textContent,
          html: editor.getHTML(),
          json: editor.getJSON(),
        }),
        getDirection: () =>
          editable ? window.getComputedStyle(editable).direction : null,
        getSelectionFormatState: () => ({
          bold: editor.isActive("bold"),
          italic: editor.isActive("italic"),
          heading: editor.isActive("heading"),
          bulletList: editor.isActive("bulletList"),
          numberedList: editor.isActive("orderedList"),
        }),
      }),
    );
  }

  function handleToggleLint() {
    setLintEnabled((prev) => !prev);
  }
  function handleToggleCollab() {
    setCollabEnabled((prev) => !prev);
  }

  function handleToggleAiSuggest() {
    setAiSuggestEnabled((prev) => !prev);
  }

  function handleToggleHeadingLock() {
    setHeadingLockEnabled((prev) => !prev);
  }
  function handleToggleIndentation() {
    setIndentationEnabled((prev) => !prev);
  }
  function handleToggleSectionNode() {
    setSectionNodeEnabled((prev) => !prev);
  }
  function handleToggleMarkReview() {
    setMarkReviewEnabled((prev) => !prev);
  }
  function handleToggleWatermark() {
    setWatermarkEnabled((prev) => !prev);
  }

  function handleNewSuggestion(data: NewSuggestion) {
    setSuggestions((prev) => [
      ...prev,
      { ...data, id: Date.now() + Math.random() },
    ]);
  }

  function acceptSuggestion(id: number) {
    const s = suggestions.find((x) => x.id === id);
    if (s && editor) {
      editor
        .chain()
        .focus()
        .insertContentAt({ from: s.from, to: s.to }, s.suggestion)
        .run();
    }
    setSuggestions((prev) => prev.filter((x) => x.id !== id));
  }

  function rejectSuggestion(id: number) {
    setSuggestions((prev) => prev.filter((x) => x.id !== id));
  }

  function clearSuggestions() {
    setSuggestions([]);
  }

  function insertTable() {
    editor
      ?.chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  }
  function insertImage() {
    const url = prompt("Image URL?");
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  }

  if (!editor)
    return (
      <div className="dep-shell items-center justify-center">
        <p className="dep-muted p-10">Loading TipTap…</p>
      </div>
    );

  return (
    <>
      <Head>
        <title>TipTap · Document Editor Playground</title>
      </Head>
      <div className="dep-shell">
        <WorkspaceChrome subtitle={EDITOR_BY_ID.tiptap.tagline}>
          <main className="dep-wrap flex flex-1 flex-col gap-4 py-5">
            <section className="dep-card">
              <div className="mb-3">
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="dep-num">02 / 6</span>
                  <h1 className="dep-title">TipTap</h1>
                  <span className="dep-tag dep-tag--mark">
                    {EDITOR_BY_ID.tiptap.nativeFormat}
                  </span>
                </div>
                <p className="dep-lede mt-1">
                  Headless by design: every button in the toolbar below is written by
                  hand in this page&apos;s source. TipTap ships the document model and
                  the commands, and nothing else.
                </p>
                <p className="dep-muted mt-2">
                  {EDITOR_BY_ID.tiptap.toolDescription}{" "}
                  <a
                    href={EDITOR_BY_ID.tiptap.githubRepoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="dep-link"
                  >
                    Source on GitHub
                  </a>
                </p>
              </div>

              {/* ---- Document controls ---------------------------------- */}
              <div
                className="flex flex-wrap items-center gap-2"
                data-testid="workspace-controls"
              >
                <TemplateLoader
                  templates={TEMPLATES}
                  onLoad={handleTemplateLoad}
                  onClear={() => {
                    editor.commands.clearContent();
                    setContent("");
                  }}
                  onError={(error) =>
                    alert(`Could not load template: ${String(error)}`)
                  }
                />
                <button
                  type="button"
                  className="dep-btn dep-btn--mark"
                  onClick={runDiagnostics}
                >
                  Run diagnostics
                </button>
                <AiSuggestButton
                  editor={editor}
                  aiSuggestEnabled={aiSuggestEnabled}
                  onNewSuggestion={handleNewSuggestion}
                />
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  className="dep-btn"
                  aria-label="Open extensions panel"
                >
                  <MenuIcon className="h-4 w-4" />
                  Extensions
                </button>
              </div>

              {validationResults.length > 0 && (
                <div className="mt-3">
                  <ValidationStatus
                    results={validationResults}
                    onClear={() => setValidationResults([])}
                  />
                </div>
              )}

              <div className="dep-callout mt-3">
                <strong>Look for:</strong> hover any toolbar button and it names itself
                with its shortcut. Type <code>/</code> in the document for the
                slash-command menu, and open <em>Extensions</em> to switch on heading
                locks, watermarks, linting, or live collaboration &mdash; each one is a
                separate TipTap package.
              </div>

              {/* ---- Formatting toolbar -------------------------------- */}
              <div className="dep-toolbar mt-3">
                <span className="dep-toolbar__label">Block</span>
                <select
                  value={getCurrentBlock(editor)}
                  onChange={(e) => setBlock(editor, e.target.value)}
                  className="dep-select"
                  aria-label="Block style"
                  title="Paragraph or heading level for the current block"
                >
                  <option value="p">Paragraph</option>
                  <option value="h1">Heading 1</option>
                  <option value="h2">Heading 2</option>
                  <option value="h3">Heading 3</option>
                </select>

                <span aria-hidden="true" className="dep-toolbar__sep" />
                <span className="dep-toolbar__label">Marks</span>
                <FormatToggleButton
                  label="Bold"
                  shortcut="Ctrl+B"
                  active={editor.isActive("bold")}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    editor.chain().focus().toggleBold().run();
                  }}
                >
                  <Bold className="h-4 w-4" />
                </FormatToggleButton>
                <FormatToggleButton
                  label="Italic"
                  shortcut="Ctrl+I"
                  active={editor.isActive("italic")}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    editor.chain().focus().toggleItalic().run();
                  }}
                >
                  <Italic className="h-4 w-4" />
                </FormatToggleButton>
                <FormatToggleButton
                  label="Underline"
                  shortcut="Ctrl+U"
                  active={editor.isActive("underline")}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    editor.chain().focus().toggleUnderline?.().run();
                  }}
                >
                  <UnderlineIcon className="h-4 w-4" />
                </FormatToggleButton>
                <FormatToggleButton
                  label="Strikethrough"
                  active={editor.isActive("strike")}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    editor.chain().focus().toggleStrike().run();
                  }}
                >
                  <Strikethrough className="h-4 w-4" />
                </FormatToggleButton>
                <FormatToggleButton
                  label="Inline code"
                  active={editor.isActive("code")}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    editor.chain().focus().toggleCode().run();
                  }}
                >
                  <Code className="h-4 w-4" />
                </FormatToggleButton>

                <span aria-hidden="true" className="dep-toolbar__sep" />
                <span className="dep-toolbar__label">Lists</span>
                <FormatToggleButton
                  label="Bullet list"
                  active={editor.isActive("bulletList")}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    editor.chain().focus().toggleBulletList().run();
                  }}
                >
                  <List className="h-4 w-4" />
                </FormatToggleButton>
                <FormatToggleButton
                  label="Numbered list"
                  active={editor.isActive("orderedList")}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    editor.chain().focus().toggleOrderedList().run();
                  }}
                >
                  <ListOrdered className="h-4 w-4" />
                </FormatToggleButton>
                <FormatToggleButton
                  label="Block quote"
                  active={editor.isActive("blockquote")}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    editor.chain().focus().toggleBlockquote().run();
                  }}
                >
                  <Quote className="h-4 w-4" />
                </FormatToggleButton>

                <span aria-hidden="true" className="dep-toolbar__sep" />
                <span className="dep-toolbar__label">Insert</span>
                <FormatToggleButton
                  label="Insert table"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    insertTable();
                  }}
                >
                  <TableIcon className="h-4 w-4" />
                </FormatToggleButton>
                <FormatToggleButton
                  label="Insert image"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    insertImage();
                  }}
                >
                  <ImageIcon className="h-4 w-4" />
                </FormatToggleButton>

                <span aria-hidden="true" className="dep-toolbar__sep" />
                <FormatToggleButton
                  label="Undo"
                  shortcut="Ctrl+Z"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    editor.chain().focus().undo().run();
                  }}
                >
                  <Undo2 className="h-4 w-4" />
                </FormatToggleButton>
                <FormatToggleButton
                  label="Redo"
                  shortcut="Ctrl+Shift+Z"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    editor.chain().focus().redo().run();
                  }}
                >
                  <Redo2 className="h-4 w-4" />
                </FormatToggleButton>
              </div>

              {/* ---- The document -------------------------------------- */}
              <div
                className="dep-doc dep-sheet mt-3 max-h-[62vh] overflow-auto"
                data-testid="workspace-editor"
              >
                <EditorContent editor={editor} />
              </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
              <div className="dep-card space-y-3">
                <EditorOutputPanel
                  editorName="TipTap"
                  nativeFormat={EDITOR_BY_ID.tiptap.nativeFormat}
                  available={["html", "json"]}
                  getters={{
                    html: () => editor.getHTML(),
                    json: () => JSON.stringify(editor.getJSON()),
                  }}
                />
                <TrackChanges content={content} />
              </div>
              <aside className="dep-card space-y-5">
                <EditorProfile editorId="tiptap" />
                <hr className="dep-rule" />
                <CommentTrack />
              </aside>
            </section>
          </main>
        </WorkspaceChrome>

        {/* Lint (Validation) Overlay */}
        {lintEnabled && (
          <div
            className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 px-5 py-2"
            style={{
              background: "var(--mark-soft)",
              border: "1px solid var(--mark-line)",
              color: "var(--mark)",
            }}
          >
            <span className="text-sm font-semibold">
              Linting enabled &mdash; issues are highlighted inline.
            </span>
          </div>
        )}

        {/* Sidebar for templates, validation, collab, history */}
        <Sidebar
          show={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onTemplateLoad={handleTemplateLoad}
          onToggleLint={handleToggleLint}
          lintEnabled={lintEnabled}
          onToggleCollab={handleToggleCollab}
          collabEnabled={collabEnabled}
          onToggleAiSuggest={handleToggleAiSuggest}
          aiSuggestEnabled={aiSuggestEnabled}
          onToggleHeadingLock={handleToggleHeadingLock}
          headingLockEnabled={headingLockEnabled}
          onToggleIndentation={handleToggleIndentation}
          indentationEnabled={indentationEnabled}
          onToggleSectionNode={handleToggleSectionNode}
          sectionNodeEnabled={sectionNodeEnabled}
          onToggleMarkReview={handleToggleMarkReview}
          markReviewEnabled={markReviewEnabled}
          onToggleWatermark={handleToggleWatermark}
          watermarkEnabled={watermarkEnabled}
          watermarkText={watermarkText}
          onWatermarkText={setWatermarkText}
          suggestions={suggestions}
          acceptSuggestion={acceptSuggestion}
          rejectSuggestion={rejectSuggestion}
          clearSuggestions={clearSuggestions}
          history={DUMMY_HISTORY}
        />
      </div>
    </>
  );
}
