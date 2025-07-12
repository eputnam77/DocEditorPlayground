/* pages/editors/lexical.tsx */
import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";

/* ---------- Lexical core & React helpers ---------- */
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { CodeHighlightPlugin } from "@lexical/react/LexicalCodeHighlightPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { HeadingNode, $createHeadingNode } from "@lexical/heading";
import { ListItemNode, ListNode } from "@lexical/list";
import { QuoteNode } from "@lexical/quote";
import { CodeNode } from "@lexical/code";

/* ---------- Icons ---------- */
import {
  Bold,
  Italic,
  Strikethrough,
  Underline as UnderlineIcon,
  Code,
  List,
  ListOrdered,
  Quote,
  Undo2,
  Redo2,
  ChevronDown,
  ChevronUp,
  Clock,
} from "lucide-react";
import "../styles/lexical.css";

/* ---------- Plugin registry (toggleable) ---------- */
const PLUGINS: Record<
  string,
  (props?: Record<string, unknown>) => JSX.Element | null
> = {
  History: HistoryPlugin,
  Lists: ListPlugin,
  CodeHighlight: CodeHighlightPlugin,
  Link: LinkPlugin,
};

const DEFAULT_PLUGINS = Object.keys(PLUGINS);

/* ---------- Dummy version-history data ---------- */
const DUMMY_HISTORY = [
  { id: 1, label: "Draft – Jul 9 08:00" },
  { id: 2, label: "Autosave – Jul 8 15:30" },
  { id: 3, label: "Submitted – Jul 7 12:15" },
];

/* ---------- Toolbar helper (inside Lexical tree) ---------- */
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  $createParagraphNode,
  $setSelection,
  $createTextNode,
  UNDO_COMMAND,
  REDO_COMMAND,
  $isQuoteNode,
  $wrapNodes,
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

function Toolbar() {
  const [editor] = useLexicalComposerContext();
  const [selectionFormat, setSelectionFormat] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    code: false,
    quote: false,
  });

  /* Update button active state on selection change */
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const sel = $getSelection();
        if ($isRangeSelection(sel)) {
          setSelectionFormat({
            bold: sel.hasFormat("bold"),
            italic: sel.hasFormat("italic"),
            underline: sel.hasFormat("underline"),
            strikethrough: sel.hasFormat("strikethrough"),
            code: sel.hasFormat("code"),
            quote: sel.anchor
              ?.getNodes()
              .some((n) => $isQuoteNode(n.getParent())),
          });
        }
      });
    });
  }, [editor]);

  const button = (
    icon: JSX.Element,
    command: () => void,
    active?: boolean,
    title = "",
  ) => (
    <button
      type="button"
      className={`px-2 py-1 rounded ${active ? "bg-indigo-100" : ""}`}
      onClick={command}
      title={title}
    >
      {icon}
    </button>
  );

  /* Commands */
  const format = (type: string) =>
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, type);
  const insertQuote = () =>
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;
      const paragraph = $createParagraphNode();
      const quote = new QuoteNode();
      quote.append(paragraph);
      $wrapNodes(selection, quote);
    });

  return (
    <>
      {button(
        <Bold className="w-4 h-4" />,
        () => format("bold"),
        selectionFormat.bold,
        "Bold",
      )}
      {button(
        <Italic className="w-4 h-4" />,
        () => format("italic"),
        selectionFormat.italic,
        "Italic",
      )}
      {button(
        <UnderlineIcon className="w-4 h-4" />,
        () => format("underline"),
        selectionFormat.underline,
        "Underline",
      )}
      {button(
        <Strikethrough className="w-4 h-4" />,
        () => format("strikethrough"),
        selectionFormat.strikethrough,
        "Strikethrough",
      )}
      {button(
        <Code className="w-4 h-4" />,
        () => format("code"),
        selectionFormat.code,
        "Inline Code",
      )}
      {button(
        <Quote className="w-4 h-4" />,
        insertQuote,
        selectionFormat.quote,
        "Blockquote",
      )}
      {button(
        <List className="w-4 h-4" />,
        () => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined),
        false,
        "Bullet List",
      )}
      {button(
        <ListOrdered className="w-4 h-4" />,
        () => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined),
        false,
        "Numbered List",
      )}
      {button(
        <Undo2 className="w-4 h-4" />,
        () => editor.dispatchCommand(UNDO_COMMAND, undefined),
        false,
        "Undo",
      )}
      {button(
        <Redo2 className="w-4 h-4" />,
        () => editor.dispatchCommand(REDO_COMMAND, undefined),
        false,
        "Redo",
      )}
    </>
  );
}

/* ---------- Main page component ---------- */
function LexicalEditorPage() {
  const [enabledPlugins, setEnabledPlugins] = useState<string[]>(() => {
    if (typeof window === "undefined") return DEFAULT_PLUGINS;
    return (
      JSON.parse(localStorage.getItem("lexicalPlugins") ?? "null") ??
      DEFAULT_PLUGINS
    );
  });
  const [showPluginMenu, setShowPluginMenu] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    localStorage.setItem("lexicalPlugins", JSON.stringify(enabledPlugins));
  }, [enabledPlugins]);

  /* LexicalComposer config */
  const initialConfig = useMemo(
    () => ({
      namespace: "lexical-editor",
      theme: {
        paragraph: "lexical-paragraph",
      },
      onError: (e: Error) => console.error(e),
      nodes: [HeadingNode, ListNode, ListItemNode, QuoteNode, CodeNode],
    }),
    [],
  );

  /* Build plugin components list from enabledPlugins */
  const PluginComponents = enabledPlugins.map((k) => PLUGINS[k]);

  /* Save handler: export HTML */
  const [saveHtml, setSaveHtml] = useState<string>("");

  return (
    <div className="fixed inset-0 z-30 bg-white flex flex-col">
      {/* ---------- Toolbar header ---------- */}
      <header className="flex items-center gap-2 bg-gray-100 px-6 py-3 border-b w-full">
        <h1 className="text-xl font-bold mr-6">Lexical Editor</h1>

        {/* Toolbar formatting buttons (inside LexicalComposer) */}
        <div className="flex items-center gap-1">
          {/* We inject toolbar via separate Lexical Composer to get context */}
          <LexicalComposer initialConfig={initialConfig}>
            <Toolbar />
          </LexicalComposer>

          <button
            onClick={() => alert(saveHtml)}
            className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Save
          </button>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Plugin toggle menu */}
        <div className="relative">
          <button
            onClick={() => setShowPluginMenu(!showPluginMenu)}
            className="px-3 py-1 border rounded bg-gray-50 hover:bg-gray-200 flex items-center gap-1"
            title="Manage Plugins"
          >
            Plugins <ChevronDown className="w-4 h-4" />
          </button>
          {showPluginMenu && (
            <div className="absolute right-0 mt-2 bg-white shadow-lg border rounded p-4 z-50 max-h-72 overflow-y-auto w-64">
              <div className="mb-2 font-semibold">Enabled Plugins</div>
              {Object.keys(PLUGINS).map((name) => (
                <label
                  key={name}
                  className="flex items-center gap-2 text-sm my-1"
                >
                  <input
                    type="checkbox"
                    checked={enabledPlugins.includes(name)}
                    onChange={() =>
                      setEnabledPlugins((prev) =>
                        prev.includes(name)
                          ? prev.filter((n) => n !== name)
                          : [...prev, name],
                      )
                    }
                  />
                  {name}
                </label>
              ))}
              <button
                className="mt-2 text-xs px-2 py-1 rounded bg-gray-200"
                onClick={() => setShowPluginMenu(false)}
              >
                Close
              </button>
            </div>
          )}
        </div>

        {/* Version history */}
        <div className="relative ml-4">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="px-3 py-1 border rounded bg-gray-50 hover:bg-gray-200 flex items-center gap-1"
            title="Version History"
          >
            <Clock className="w-4 h-4" />
            History
            {showHistory ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          {showHistory && (
            <div className="absolute right-0 mt-2 bg-white shadow-lg border rounded p-2 z-50 w-56">
              <div className="mb-2 font-semibold">Version History</div>
              <ul>
                {DUMMY_HISTORY.map((v) => (
                  <li
                    key={v.id}
                    className="py-1 border-b last:border-none text-xs"
                  >
                    {v.label}
                  </li>
                ))}
              </ul>
              <button
                className="mt-2 text-xs px-2 py-1 rounded bg-gray-200"
                onClick={() => setShowHistory(false)}
              >
                Close
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ---------- Editor canvas ---------- */}
      <main className="flex-1 overflow-auto px-4 py-6">
        <LexicalComposer initialConfig={initialConfig}>
          <RichTextPlugin
            placeholder={<div className="text-gray-400">Start typing…</div>}
            contentEditable={
              <ContentEditable className="outline-none lexical-content" />
            }
          />
          {/* Enable core plugins always */}
          {PluginComponents.map((Comp, idx) => (
            <Comp key={idx} />
          ))}

          {/* Capture HTML for “Save” */}
          <OnChangePlugin
            onChange={(e) => {
              e.read(() => {
                setSaveHtml(e.toJSON().root.children[0]?.text || "");
              });
            }}
          />
        </LexicalComposer>
      </main>
    </div>
  );
}

/* Disable SSR */
export default dynamic(() => Promise.resolve(LexicalEditorPage), {
  ssr: false,
});
