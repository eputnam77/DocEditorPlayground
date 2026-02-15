import React, { useEffect, useState } from "react";
import {
  LexicalComposer,
  RichTextPlugin,
  ContentEditable,
  HistoryPlugin,
  ListPlugin,
  OnChangePlugin,
  useLexicalComposerContext,
} from "../stubs/lexical-react";
import {
  FORMAT_TEXT_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
} from "../stubs/lexical";
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

function Toolbar({ enabled }: { enabled: string[] }) {
  const [editor] = useLexicalComposerContext();
  const [active, setActive] = useState({
    bold: false,
    italic: false,
  });

  const refreshActive = () => {
    if (typeof document === "undefined" || typeof document.queryCommandState !== "function") {
      return;
    }
    const root = editor.rootRef?.current ?? null;
    const selection =
      typeof window !== "undefined" ? window.getSelection() : null;
    const inEditor = !!root && !!selection?.anchorNode && root.contains(selection.anchorNode);
    if (!inEditor) {
      setActive({ bold: false, italic: false });
      return;
    }
    setActive({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
    });
  };

  useEffect(() => {
    refreshActive();
    if (typeof document === "undefined") {
      return;
    }
    document.addEventListener("selectionchange", refreshActive);
    return () => document.removeEventListener("selectionchange", refreshActive);
  }, []);

  const baseButtonClass =
    "rounded-md border px-3 py-2 text-sm font-semibold disabled:opacity-50";
  const inactiveButtonClass =
    "border-slate-300 bg-white hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-900 dark:hover:bg-slate-800";
  const activeButtonClass =
    "border-sky-500 bg-sky-100 text-sky-900 hover:bg-sky-200 dark:border-sky-400 dark:bg-sky-900/40 dark:text-sky-100 dark:hover:bg-sky-900/60";

  return (
    <div className="mb-3 flex flex-wrap gap-2">
      <button
        aria-label="Bold"
        aria-pressed={active.bold}
        className={`${baseButtonClass} ${active.bold ? activeButtonClass : inactiveButtonClass}`}
        onMouseDown={(e) => {
          e.preventDefault();
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
          refreshActive();
        }}
      >
        Bold
      </button>
      <button
        aria-label="Italic"
        aria-pressed={active.italic}
        className={`${baseButtonClass} ${active.italic ? activeButtonClass : inactiveButtonClass}`}
        onMouseDown={(e) => {
          e.preventDefault();
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
          refreshActive();
        }}
      >
        Italic
      </button>
      <button
        aria-label="Bullet List"
        className={`${baseButtonClass} ${inactiveButtonClass}`}
        disabled={!enabled.includes("lists")}
        onMouseDown={(e) => {
          e.preventDefault();
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND);
        }}
      >
        Bullet list
      </button>
      <button
        aria-label="Numbered List"
        className={`${baseButtonClass} ${inactiveButtonClass}`}
        disabled={!enabled.includes("lists")}
        onMouseDown={(e) => {
          e.preventDefault();
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND);
        }}
      >
        Numbered list
      </button>
      <button
        aria-label="Undo"
        className={`${baseButtonClass} ${inactiveButtonClass}`}
        disabled={!enabled.includes("history")}
        onMouseDown={(e) => {
          e.preventDefault();
          editor.dispatchCommand(UNDO_COMMAND);
        }}
      >
        Undo
      </button>
      <button
        aria-label="Redo"
        className={`${baseButtonClass} ${inactiveButtonClass}`}
        disabled={!enabled.includes("history")}
        onMouseDown={(e) => {
          e.preventDefault();
          editor.dispatchCommand(REDO_COMMAND);
        }}
      >
        Redo
      </button>
    </div>
  );
}

export default function LexicalPage() {
  const [enabled, setEnabled] = useState<string[]>(PLUGINS.map((p) => p.name));
  const [content, setContent] = useState("");
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);

  async function loadTemplate(filename: string) {
    try {
      const res = await fetch(`/templates/${filename}`);
      if (!res.ok) throw new Error("fetch failed");
      const html = await res.text();
      setContent(sanitizeHtml(html));
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
      title="Lexical editor"
      description="Test core text formatting, list commands, and plugin toggles in a full-page Lexical workflow."
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
          <EditorIntegrationInfo editorName="Lexical" />
        </div>
      }
    >
      <div className="h-full p-3">
        <LexicalComposer initialConfig={{}}>
          <Toolbar enabled={enabled} />
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                data-testid="lexical-editor"
                dir="ltr"
                className="h-[58vh] w-full rounded-md border border-slate-300 bg-white p-3 text-left text-slate-900 outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              />
            }
          />
          {enabled.includes("history") && <HistoryPlugin />}
          {enabled.includes("lists") && <ListPlugin />}
          <OnChangePlugin onChange={(e: any) => setContent(e.getText())} />
        </LexicalComposer>
      </div>
    </EditorWorkspace>
  );
}
