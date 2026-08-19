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
  $createTextNode,
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
import { LIPSUM_PARAGRAPHS } from "../utils/lipsum";
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

/**
 * Lexical's class map. Node type -> CSS class; the classes themselves are
 * defined in styles/lexical.css.
 */
const LEXICAL_THEME = {
  paragraph: "lexical-paragraph",
  quote: "lexical-quote",
  heading: {
    h1: "lexical-h1",
    h2: "lexical-h2",
    h3: "lexical-h3",
    h4: "lexical-h4",
    h5: "lexical-h5",
    h6: "lexical-h6",
  },
  list: {
    ul: "lexical-ul",
    ol: "lexical-ol",
    listitem: "lexical-li",
    nested: { listitem: "lexical-li-nested" },
  },
  text: {
    bold: "lexical-bold",
    italic: "lexical-italic",
    underline: "lexical-underline",
    strikethrough: "lexical-strikethrough",
    code: "lexical-code",
  },
};

/**
 * The top-level block containing `node`, or null.
 *
 * getTopLevelElementOrThrow throws when the selection is anchored on the root
 * itself, which happens for a beat after root.clear() during a template load.
 * Every caller here wants "no block" rather than an exception.
 */
function topLevelBlockOf(node: any): any | null {
  try {
    if (!node || node.getKey?.() === "root") {
      return null;
    }
    return node.getTopLevelElementOrThrow();
  } catch {
    return null;
  }
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
      const topLevel = topLevelBlockOf(anchorNode);
      const listType = findNearestListType(anchorNode);
      const nextState: LexicalFormatState = {
        bold: selection.hasFormat("bold"),
        italic: selection.hasFormat("italic"),
        heading: topLevel?.getType() === "heading",
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
    <div className="dep-toolbar mb-3">
      <span className="dep-toolbar__label">Marks</span>
      <FormatToggleButton
        label="Bold"
        shortcut="Ctrl+B"
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
        shortcut="Ctrl+I"
        active={state.italic}
        onMouseDown={(event) => {
          event.preventDefault();
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
      >
        <Italic size={16} />
      </FormatToggleButton>
      <span aria-hidden="true" className="dep-toolbar__sep" />
      <span className="dep-toolbar__label">Blocks</span>
      <FormatToggleButton
        label="Heading 2"
        active={state.heading}
        onMouseDown={(event) => {
          event.preventDefault();
          editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) {
              return;
            }
            const anchorNode = selection.anchor.getNode();
            const topLevel = topLevelBlockOf(anchorNode);
            if (topLevel?.getType() === "heading") {
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
      <span aria-hidden="true" className="dep-toolbar__sep" />
      <FormatToggleButton
        label="Undo"
        shortcut="Ctrl+Z"
        onMouseDown={(event) => {
          event.preventDefault();
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
      >
        <Undo2 size={16} />
      </FormatToggleButton>
      <FormatToggleButton
        label="Redo"
        shortcut="Ctrl+Shift+Z"
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
      // Lexical renders semantic elements but styles nothing: with an empty
      // theme, an h2 inherited paragraph styling from Tailwind's preflight and
      // "make this a heading" appeared to do nothing at all. Every node type
      // therefore has to be mapped to a class explicitly.
      theme: LEXICAL_THEME,
      onError(error: Error) {
        throw error;
      },
      nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode],
      editorState: () => {
        const root = $getRoot();
        LIPSUM_PARAGRAPHS.forEach((text) => {
          const paragraph = $createParagraphNode();
          paragraph.append($createTextNode(text));
          root.append(paragraph);
        });
      },
    }),
    [],
  );

  function loadTemplate(filename: string) {
    const html = sanitizeHtml(getTemplateHtml(filename));
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
    <>
      <Head>
        <title>Lexical · Document Editor Playground</title>
      </Head>
      <EditorWorkspace
      editorId="lexical"
      title="Lexical"
      description="Meta's editor core, deliberately small. Rich text, history, and lists are three separate plugins on this page - remove one and that capability simply stops existing."
      toolDescription={EDITOR_BY_ID.lexical.toolDescription}
      toolRepoUrl={EDITOR_BY_ID.lexical.githubRepoUrl}
      surfaceNote={
        <>
          <strong>Look for:</strong> heading and list formatting now render visibly
          because this page maps every Lexical node type to a CSS class. Lexical emits
          semantic <code>&lt;h2&gt;</code> and <code>&lt;ul&gt;</code> elements but
          styles nothing itself - the theme object is the app&apos;s job.
        </>
      }
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
            editorName="Lexical"
            nativeFormat={EDITOR_BY_ID.lexical.nativeFormat}
            available={["json", "html"]}
            getters={{
              json: () => JSON.stringify(contentJson),
              html: () => contentHtml,
            }}
          />
          <TrackChanges content={contentText} />
        </div>
      }
      sidePanel={
        <div className="space-y-5">
          <EditorProfile editorId="lexical" />
          <hr className="dep-rule" />
          <CommentTrack />
        </div>
      }
    >
      <div className="dep-doc relative h-full p-3">
        <LexicalComposer initialConfig={initialConfig}>
          <Toolbar onStateChange={setFormatState} />
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                data-testid="lexical-editor"
                dir="ltr"
                className="dep-sheet h-[58vh] w-full overflow-auto p-4 outline-none"
                style={{
                  direction: "ltr",
                  unicodeBidi: "plaintext",
                  textAlign: "left",
                }}
              />
            }
            placeholder={
              <p
                className="pointer-events-none absolute p-4"
                style={{ color: "var(--ink-42)" }}
              >
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
    </>
  );
}

export default
  typeof process !== "undefined" && process.env.NODE_ENV === "test"
    ? LexicalPage
    : dynamic(() => Promise.resolve(LexicalPage), { ssr: false });
