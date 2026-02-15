import React, { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import {
  $createParagraphNode,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListItemNode,
  ListNode,
  REMOVE_LIST_COMMAND,
  $isListNode,
} from "@lexical/list";
import { HeadingNode, QuoteNode, $createHeadingNode } from "@lexical/rich-text";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { $setBlocksType } from "@lexical/selection";
import {
  Bold,
  Heading2,
  Italic,
  List as ListIcon,
  ListOrdered,
  Redo2,
  Undo2,
} from "lucide-react";
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
import FormatToggleButton from "../components/FormatToggleButton";
import { EDITOR_BY_ID } from "../components/editorCatalog";
import { runEditorDiagnostics } from "../utils/editorDiagnostics";

type LexicalFormatState = {
  bold: boolean;
  italic: boolean;
  heading: boolean;
  bulletList: boolean;
  numberedList: boolean;
};

const INITIAL_FORMAT_STATE: LexicalFormatState = {
  bold: false,
  italic: false,
  heading: false,
  bulletList: false,
  numberedList: false,
};

function findNearestListType(node: any): "bullet" | "number" | null {
  let cursor = node;
  while (cursor) {
    if ($isListNode(cursor)) {
      const type = cursor.getListType?.();
      return type === "number" ? "number" : "bullet";
    }
    cursor = cursor.getParent?.() ?? null;
  }
  return null;
}

function Toolbar({
  onStateChange,
}: {
  onStateChange(next: LexicalFormatState): void;
}) {
  const [editor] = useLexicalComposerContext();
  const [state, setState] = useState<LexicalFormatState>(INITIAL_FORMAT_STATE);

  function refreshState() {
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) {
        setState(INITIAL_FORMAT_STATE);
        onStateChange(INITIAL_FORMAT_STATE);
        return;
      }

      const anchorNode = selection.anchor.getNode();
      const topLevel = anchorNode.getTopLevelElementOrThrow();
      const listType = findNearestListType(anchorNode);
      const nextState: LexicalFormatState = {
        bold: selection.hasFormat("bold"),
        italic: selection.hasFormat("italic"),
        heading: topLevel.getType() === "heading",
        bulletList: listType === "bullet",
        numberedList: listType === "number",
      };
      setState(nextState);
      onStateChange(nextState);
    });
  }

  useEffect(() => {
    refreshState();
    const unregisterUpdate = editor.registerUpdateListener(() => {
      refreshState();
    });
    const unregisterSelection = editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        refreshState();
        return false;
      },
      COMMAND_PRIORITY_LOW,
    );
    return () => {
      unregisterUpdate();
      unregisterSelection();
    };
  }, [editor]);

  return (
    <div className="mb-3 flex flex-wrap gap-2">
      <FormatToggleButton
        label="Bold"
        active={state.bold}
        onMouseDown={(event) => {
          event.preventDefault();
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
      >
        <Bold size={16} />
      </FormatToggleButton>
      <FormatToggleButton
        label="Italic"
        active={state.italic}
        onMouseDown={(event) => {
          event.preventDefault();
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
      >
        <Italic size={16} />
      </FormatToggleButton>
      <FormatToggleButton
        label="Heading"
        active={state.heading}
        onMouseDown={(event) => {
          event.preventDefault();
          editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) {
              return;
            }
            const anchorNode = selection.anchor.getNode();
            const topLevel = anchorNode.getTopLevelElementOrThrow();
            if (topLevel.getType() === "heading") {
              $setBlocksType(selection, () => $createParagraphNode());
              return;
            }
            $setBlocksType(selection, () => $createHeadingNode("h2"));
          });
        }}
      >
        <Heading2 size={16} />
      </FormatToggleButton>
      <FormatToggleButton
        label="Bullet List"
        active={state.bulletList}
        onMouseDown={(event) => {
          event.preventDefault();
          editor.dispatchCommand(
            state.bulletList ? REMOVE_LIST_COMMAND : INSERT_UNORDERED_LIST_COMMAND,
            undefined,
          );
        }}
      >
        <ListIcon size={16} />
      </FormatToggleButton>
      <FormatToggleButton
        label="Numbered List"
        active={state.numberedList}
        onMouseDown={(event) => {
          event.preventDefault();
          editor.dispatchCommand(
            state.numberedList ? REMOVE_LIST_COMMAND : INSERT_ORDERED_LIST_COMMAND,
            undefined,
          );
        }}
      >
        <ListOrdered size={16} />
      </FormatToggleButton>
      <FormatToggleButton
        label="Undo"
        onMouseDown={(event) => {
          event.preventDefault();
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
      >
        <Undo2 size={16} />
      </FormatToggleButton>
      <FormatToggleButton
        label="Redo"
        onMouseDown={(event) => {
          event.preventDefault();
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
      >
        <Redo2 size={16} />
      </FormatToggleButton>
    </div>
  );
}

function EditorRefPlugin({
  onEditorReady,
}: {
  onEditorReady(editor: any): void;
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    onEditorReady(editor);
  }, [editor, onEditorReady]);

  return null;
}

function LexicalPage() {
  const editorRef = useRef<any>(null);
  const [contentText, setContentText] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [contentJson, setContentJson] = useState<unknown>(null);
  const [formatState, setFormatState] = useState<LexicalFormatState>(
    INITIAL_FORMAT_STATE,
  );
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);

  const initialConfig = useMemo(
    () => ({
      namespace: "DocEditorPlaygroundLexical",
      theme: {},
      onError(error: Error) {
        throw error;
      },
      nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode],
    }),
    [],
  );

  async function loadTemplate(filename: string) {
    try {
      const response = await fetch(`/templates/${filename}`);
      if (!response.ok) {
        throw new Error("fetch failed");
      }
      const html = sanitizeHtml(await response.text());
      const editor = editorRef.current;
      if (!editor) {
        return;
      }
      editor.update(() => {
        const parser = new DOMParser();
        const dom = parser.parseFromString(html, "text/html");
        const nodes = $generateNodesFromDOM(editor, dom);
        const root = $getRoot();
        root.clear();
        if (nodes.length > 0) {
          root.append(...nodes);
        } else {
          root.append($createParagraphNode());
        }
      });
    } catch {
      alert(`Failed to load template: ${filename}`);
    }
  }

  function runDiagnostics() {
    const editable = document.querySelector("[data-testid='lexical-editor']") as HTMLElement | null;
    setValidationResults(
      runEditorDiagnostics({
        editorName: "Lexical",
        capabilities: {
          heading: true,
          bulletList: true,
          numberedList: true,
        },
        getContent: () => ({
          text: contentText,
          html: contentHtml,
          json: contentJson,
        }),
        getDirection: () =>
          editable ? window.getComputedStyle(editable).direction : null,
        getSelectionFormatState: () => ({
          bold: formatState.bold,
          italic: formatState.italic,
          heading: formatState.heading,
          bulletList: formatState.bulletList,
          numberedList: formatState.numberedList,
        }),
      }),
    );
  }

  return (
    <EditorWorkspace
      title="Lexical editor"
      description="Official Lexical React setup with ListPlugin, heading nodes, and selection-aware toolbar state."
      toolDescription={EDITOR_BY_ID.lexical.toolDescription}
      toolRepoUrl={EDITOR_BY_ID.lexical.githubRepoUrl}
      controls={
        <>
          <TemplateLoader
            templates={TEMPLATES}
            onLoad={loadTemplate}
            onClear={() => {
              const editor = editorRef.current;
              if (!editor) {
                return;
              }
              editor.update(() => {
                const root = $getRoot();
                root.clear();
                root.append($createParagraphNode());
              });
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
          <TrackChanges content={contentText} />
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
        <LexicalComposer initialConfig={initialConfig}>
          <Toolbar onStateChange={setFormatState} />
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                data-testid="lexical-editor"
                dir="ltr"
                className="h-[58vh] w-full rounded-md border border-slate-300 bg-white p-3 text-left text-slate-900 outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                style={{
                  direction: "ltr",
                  unicodeBidi: "plaintext",
                  textAlign: "left",
                }}
              />
            }
            placeholder={
              <p className="pointer-events-none absolute m-3 text-sm text-slate-400">
                Start writing...
              </p>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <ListPlugin />
          <EditorRefPlugin
            onEditorReady={(editor) => {
              editorRef.current = editor;
            }}
          />
          <OnChangePlugin
            onChange={(editorState, editor) => {
              editorState.read(() => {
                setContentText($getRoot().getTextContent().replace(/\s+/g, " ").trim());
                setContentHtml($generateHtmlFromNodes(editor, null));
                setContentJson(editorState.toJSON());
              });
            }}
          />
        </LexicalComposer>
      </div>
    </EditorWorkspace>
  );
}

export default
  typeof process !== "undefined" && process.env.NODE_ENV === "test"
    ? LexicalPage
    : dynamic(() => Promise.resolve(LexicalPage), { ssr: false });
