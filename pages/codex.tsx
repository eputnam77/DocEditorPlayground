/* pages/editors/codex.tsx */
import React, { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { createReactEditorJS, ReactEditorJS } from "react-editor-js";

import Header from "@editorjs/header";
import List from "@editorjs/list";
import Checklist from "@editorjs/checklist";
import Quote from "@editorjs/quote";
import CodeTool from "@editorjs/code";
import InlineCode from "@editorjs/inline-code";
import Underline from "editorjs-underline";

import { ChevronDown, ChevronUp, Clock } from "lucide-react";

/* -------- Editor.js plugin registry -------- */
const PLUGINS = {
  Header: { class: Header, inlineToolbar: true, shortcut: "CMD+SHIFT+H" },
  List: { class: List, inlineToolbar: true },
  Checklist: { class: Checklist, inlineToolbar: true },
  Quote: { class: Quote, inlineToolbar: true },
  Code: { class: CodeTool },
  InlineCode: { class: InlineCode },
  Underline: { class: Underline },
};

const DEFAULT_PLUGINS = Object.keys(PLUGINS);

/* -------- Dummy version-history data -------- */
const DUMMY_HISTORY = [
  { id: 1, label: "Draft – Jul 9, 8:00 am" },
  { id: 2, label: "Autosave – Jul 8, 3:30 pm" },
  { id: 3, label: "Submitted – Jul 7, 12:15 pm" },
];

/* -------- React component -------- */
function CodexEditorPage() {
  const [enabledPlugins, setEnabledPlugins] = useState<string[]>(() => {
    if (typeof window === "undefined") return DEFAULT_PLUGINS;
    const stored = localStorage.getItem("codexPlugins");
    return stored ? JSON.parse(stored) : DEFAULT_PLUGINS;
  });
  const [showPluginMenu, setShowPluginMenu] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  /* Persist selection */
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("codexPlugins", JSON.stringify(enabledPlugins));
    }
  }, [enabledPlugins]);

  /* Build Editor.js tools config */
  const tools = useMemo(() => {
    const config: Record<string, any> = {};
    enabledPlugins.forEach((name) => {
      config[name] = PLUGINS[name];
    });
    return config;
  }, [enabledPlugins]);

  /* Editor ref for saving */
  const editorCore = useRef<ReactEditorJS>(null);
  const ReactEditor = useMemo(() => createReactEditorJS(), []);

  const handleSave = async () => {
    if (!editorCore.current) return;
    const output = await editorCore.current.save();
    alert(JSON.stringify(output, null, 2)); // replace with backend call
  };

  return (
    <div className="fixed inset-0 z-30 bg-white flex flex-col">
      {/* ---------- Header ---------- */}
      <header className="flex items-center gap-2 bg-gray-100 px-6 py-3 border-b w-full">
        <h1 className="text-xl font-bold mr-6">Editor.js</h1>

        {/* Save button */}
        <button
          onClick={handleSave}
          className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Save
        </button>

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

      {/* ---------- Editor.js canvas ---------- */}
      <main className="flex-1 overflow-auto px-4 py-6">
        <ReactEditor
          ref={editorCore}
          holder="codex-holder"
          tools={tools}
          defaultValue={{ time: Date.now(), blocks: [] }}
          autofocus
          minHeight={300}
        >
          <div id="codex-holder" className="prose max-w-none" />
        </ReactEditor>
      </main>
    </div>
  );
}

/* Disable SSR to avoid hydration issues */
export default dynamic(() => Promise.resolve(CodexEditorPage), { ssr: false });
