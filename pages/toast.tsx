/* pages/editors/toast.tsx */
import React, { useRef, useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import { Editor as ToastEditor } from "@toast-ui/react-editor";

const ToastEditorComponent = ToastEditor as unknown as any;
import codeSyntaxHighlight from "@toast-ui/editor-plugin-code-syntax-highlight";
import tableMergedCell from "@toast-ui/editor-plugin-table-merged-cell";
import colorSyntax from "@toast-ui/editor-plugin-color-syntax";
import Prism from "prismjs";

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
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

/* ---------- Plugin registry ---------- */
const PLUGINS: Record<
  string,
  { plugin: any; options?: Record<string, unknown> }
> = {
  CodeSyntax: { plugin: codeSyntaxHighlight, options: { highlighter: Prism } },
  TableMerge: { plugin: tableMergedCell },
  ColorSyntax: { plugin: colorSyntax },
};
const DEFAULT_PLUGINS = Object.keys(PLUGINS);

/* ---------- Dummy version-history ---------- */
const DUMMY_HISTORY = [
  { id: 1, label: "Draft – Jul 9 08:00" },
  { id: 2, label: "Autosave – Jul 8 15:30" },
  { id: 3, label: "Submitted – Jul 7 12:15" },
];

/* ---------- Page ---------- */
function ToastUIEditorPage() {
  const editorRef = useRef<any>(null);

  const [enabledPlugins, setEnabledPlugins] = useState<string[]>(() => {
    if (typeof window === "undefined") return DEFAULT_PLUGINS;
    return (
      JSON.parse(localStorage.getItem("toastPlugins") ?? "null") ??
      DEFAULT_PLUGINS
    );
  });
  const [showPluginMenu, setShowPluginMenu] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  /* Persist plugin selection */
  useEffect(() => {
    localStorage.setItem("toastPlugins", JSON.stringify(enabledPlugins));
  }, [enabledPlugins]);

  /* Build plugin list for current selection */
  const plugins = useMemo(
    () =>
      enabledPlugins.map((name) => {
        const entry = PLUGINS[name];
        return entry.options ? [entry.plugin, entry.options] : entry.plugin;
      }),
    [enabledPlugins],
  );

  /* Save handler */
  const handleSave = () => {
    const instance = editorRef.current?.getInstance();
    const html = instance?.getHTML() ?? "";
    alert(html); // swap with backend call
  };

  /* Quasi-toolbar actions that map to Toast UI commands */
  const exec = (cmd: string, payload?: any) => () =>
    editorRef.current?.getInstance().exec(cmd, payload);

  /* Simple inline buttons */
  const button = (icon: JSX.Element, cmd: () => void, title: string) => (
    <button
      type="button"
      onClick={cmd}
      title={title}
      className="px-2 py-1 rounded hover:bg-indigo-100"
    >
      {icon}
    </button>
  );

  return (
    <div className="fixed inset-0 z-30 bg-white flex flex-col">
      {/* ---------- Header / Toolbar ---------- */}
      <header className="flex items-center gap-2 bg-gray-100 px-6 py-3 border-b w-full">
        <h1 className="text-xl font-bold mr-6">Toast UI Editor</h1>

        {/* Formatting buttons */}
        <div className="flex items-center gap-1">
          {button(<Bold className="w-4 h-4" />, exec("bold"), "Bold")}
          {button(<Italic className="w-4 h-4" />, exec("italic"), "Italic")}
          {button(
            <UnderlineIcon className="w-4 h-4" />,
            exec("underline"),
            "Underline",
          )}
          {button(
            <Strikethrough className="w-4 h-4" />,
            exec("strike"),
            "Strikethrough",
          )}
          {button(<Code className="w-4 h-4" />, exec("code"), "Inline Code")}
          {button(
            <Quote className="w-4 h-4" />,
            exec("blockquote"),
            "Blockquote",
          )}
          {button(
            <List className="w-4 h-4" />,
            exec("bulletList"),
            "Bullet List",
          )}
          {button(
            <ListOrdered className="w-4 h-4" />,
            exec("orderedList"),
            "Numbered List",
          )}
          {button(<Undo2 className="w-4 h-4" />, exec("undo"), "Undo")}
          {button(<Redo2 className="w-4 h-4" />, exec("redo"), "Redo")}

          <button
            onClick={handleSave}
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

        {/* Version history (dummy) */}
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

      {/* ---------- Toast UI canvas ---------- */}
      <main className="flex-1 overflow-auto px-4 py-6">
        <ToastEditorComponent
          ref={editorRef}
          initialValue=""
          previewStyle="vertical"
          height="100%"
          usageStatistics={false}
          toolbarItems={[]} // we supply our own buttons
          plugins={plugins as any}
        />
      </main>
    </div>
  );
}

/* Disable SSR to avoid hydration issues */
export default dynamic(() => Promise.resolve(ToastUIEditorPage), {
  ssr: false,
});
