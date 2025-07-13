import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import CKEditorBase from "@ckeditor/ckeditor5-build-classic";

import Essentials from "@ckeditor/ckeditor5-essentials/src/essentials";
import Paragraph from "@ckeditor/ckeditor5-paragraph/src/paragraph";
import Heading from "@ckeditor/ckeditor5-heading/src/heading";

import Bold from "@ckeditor/ckeditor5-basic-styles/src/bold";
import Italic from "@ckeditor/ckeditor5-basic-styles/src/italic";
import Underline from "@ckeditor/ckeditor5-basic-styles/src/underline";
import Strikethrough from "@ckeditor/ckeditor5-basic-styles/src/strikethrough";
import Code from "@ckeditor/ckeditor5-basic-styles/src/code";

import BlockQuote from "@ckeditor/ckeditor5-block-quote/src/blockquote";
import List from "@ckeditor/ckeditor5-list/src/list";
import CodeBlock from "@ckeditor/ckeditor5-code-block/src/codeblock";
import Link from "@ckeditor/ckeditor5-link/src/link";
import HorizontalLine from "@ckeditor/ckeditor5-horizontal-line/src/horizontalline";
import Undo from "@ckeditor/ckeditor5-undo/src/undo";
import Redo from "@ckeditor/ckeditor5-undo/src/redo";

/* --------- Initial content (blank) --------- */
const initialData = ""; // set your own default HTML if desired

/* --------- Plugin registry --------- */
const PLUGINS = {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  BlockQuote,
  List,
  CodeBlock,
  Link,
  HorizontalLine,
};

const DEFAULT_PLUGINS = Object.keys(PLUGINS);

/* --------- Toolbar map --------- */
const TOOLBAR_MAP: Record<string, string | string[]> = {
  Bold: "bold",
  Italic: "italic",
  Underline: "underline",
  Strikethrough: "strikethrough",
  Code: "code",
  BlockQuote: "blockQuote",
  List: ["bulletedList", "numberedList"],
  CodeBlock: "codeBlock",
  Link: "link",
  HorizontalLine: "horizontalLine",
};

/* --------- Page --------- */
function CkeditorPage() {
  const [enabledPlugins, setEnabledPlugins] = useState<string[]>(() => {
    if (typeof window === "undefined") return DEFAULT_PLUGINS;
    const stored = localStorage.getItem("ckeditorPlugins");
    return stored ? JSON.parse(stored) : DEFAULT_PLUGINS;
  });
  const [showPluginMenu, setShowPluginMenu] = useState(false);

  /* Build a custom editor each time plugins change */
  const EditorConstructor = useMemo(() => {
    class Editor extends CKEditorBase {}
    Editor.builtinPlugins = [
      Essentials,
      Paragraph,
      Heading,
      Undo,
      Redo,
      ...enabledPlugins.map((n) => PLUGINS[n]),
    ];

    const toolbarItems: string[] = ["heading", "|"];
    enabledPlugins.forEach((name) => {
      const item = TOOLBAR_MAP[name];
      Array.isArray(item)
        ? toolbarItems.push(...item)
        : toolbarItems.push(item);
    });
    toolbarItems.push("|", "undo", "redo");

    Editor.defaultConfig = {
      toolbar: { items: toolbarItems },
      heading: {
        options: [
          { model: "paragraph", title: "Paragraph" },
          { model: "heading1", title: "Heading 1" },
          { model: "heading2", title: "Heading 2" },
          { model: "heading3", title: "Heading 3" },
        ],
      },
      language: "en",
    };
    return Editor;
  }, [enabledPlugins]);

  /* Version-history stub */
  const [showHistory, setShowHistory] = useState(false);
  const DUMMY_HISTORY = [
    { id: 1, label: "Draft – Jul 9, 8:00 am" },
    { id: 2, label: "Autosave – Jul 8, 3:30 pm" },
    { id: 3, label: "Submitted – Jul 7, 12:15 pm" },
  ];

  /* Persist plugin selection */
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("ckeditorPlugins", JSON.stringify(enabledPlugins));
    }
  }, [enabledPlugins]);

  const handleSave = (html: string) => {
    alert(html); // hook up to your backend / autosave
  };

  return (
    <div className="fixed inset-0 z-30 bg-white flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-2 bg-gray-100 px-6 py-3 border-b w-full">
        <h1 className="text-xl font-bold mr-6">CKEditor 5</h1>

        <div className="flex-1" />

        {/* Plugins menu */}
        <div className="relative mr-2">
          <button
            onClick={() => setShowPluginMenu(!showPluginMenu)}
            className="px-3 py-1 border rounded bg-gray-50 hover:bg-gray-200"
            title="Manage Plugins"
          >
            Plugins
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
        <div className="relative">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="px-3 py-1 border rounded bg-gray-50 hover:bg-gray-200"
            title="Version History"
          >
            History
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

      {/* Editor */}
      <main className="flex-1 overflow-auto px-4 py-6">
        <CKEditor
          editor={EditorConstructor}
          data={initialData}
          onReady={(editor) => (window.__ckeditor = editor)}
          onChange={(_, editor) =>
            setTimeout(() => handleSave(editor.getData()), 0)
          }
          config={EditorConstructor.defaultConfig}
        />
      </main>
    </div>
  );
}

/* Disable SSR */
export default dynamic(() => Promise.resolve(CkeditorPage), { ssr: false });
