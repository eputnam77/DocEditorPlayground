import React, { useState } from "react";
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

/**
 * Lexical demo page with a lightweight stub editor.
 */
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
import ModernLayout from "../components/ModernLayout";

const PLUGINS = [{ name: "history" }, { name: "lists" }];

function LexicalPage() {
  const [enabled, setEnabled] = useState<string[]>(PLUGINS.map((p) => p.name));
  const [content, setContent] = useState("");
  const [validationResults, setValidationResults] = useState<
    ValidationResult[]
  >([]);

  async function loadTemplate(filename: string) {
    try {
      const res = await fetch(`/templates/${filename}`);
      if (!res.ok) throw new Error("fetch failed");
      const html = await res.text();
      setContent(sanitizeHtml(html));
    } catch {
      alert("Failed to load template: " + filename);
    }
  }

  function runValidation() {
    try {
      const passed = validateDocument({ content });
      setValidationResults([{ id: 1, label: "Document", passed }]);
    } catch {
      alert("Validation failed");
    }
  }

  function Toolbar() {
    const [editor] = useLexicalComposerContext();
    return (
      <div className="flex gap-2 mb-2">
        <button
          aria-label="Bold"
          className="px-2 py-1 border rounded"
          onClick={() =>
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")
          }
        >
          Bold
        </button>
        <button
          aria-label="Italic"
          className="px-2 py-1 border rounded"
          onClick={() =>
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")
          }
        >
          Italic
        </button>
        <button
          aria-label="Bullet List"
          className="px-2 py-1 border rounded"
          disabled={!enabled.includes("lists")}
          onClick={() =>
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND)
          }
        >
          Bullet List
        </button>
        <button
          aria-label="Numbered List"
          className="px-2 py-1 border rounded"
          disabled={!enabled.includes("lists")}
          onClick={() =>
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND)
          }
        >
          Numbered List
        </button>
        <button
          aria-label="Undo"
          className="px-2 py-1 border rounded"
          disabled={!enabled.includes("history")}
          onClick={() => editor.dispatchCommand(UNDO_COMMAND)}
        >
          Undo
        </button>
        <button
          aria-label="Redo"
          className="px-2 py-1 border rounded"
          disabled={!enabled.includes("history")}
          onClick={() => editor.dispatchCommand(REDO_COMMAND)}
        >
          Redo
        </button>
      </div>
    );
  }

  return (
    <ModernLayout>
      <div className="p-4 space-y-2">
        <h1>Lexical</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Basic Lexical-style editor with formatting toolbar.
        </p>
        <div className="flex gap-2">
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
            className="px-3 py-1 border rounded bg-gray-50 hover:bg-gray-200"
            onClick={runValidation}
          >
            Validate
          </button>
        </div>
        <LexicalComposer initialConfig={{}}>
          <Toolbar />
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                data-testid="lexical-editor"
                className="w-full border rounded p-2 min-h-[200px]"
              />
            }
          />
          {enabled.includes("history") && <HistoryPlugin />}
          {enabled.includes("lists") && <ListPlugin />}
          <OnChangePlugin onChange={(e: any) => setContent(e.getText())} />
        </LexicalComposer>
        <TrackChanges content={content} />
        {validationResults.length > 0 && (
          <ValidationStatus
            results={validationResults}
            onClear={() => setValidationResults([])}
          />
        )}
        <CommentTrack />
        <EditorIntegrationInfo editorName="Lexical" />
      </div>
    </ModernLayout>
  );
}

export default LexicalPage;
