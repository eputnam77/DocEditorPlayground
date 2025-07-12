/* pages/editors/quill.tsx */
import React, { useMemo, useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import ReactQuill, { Quill } from "react-quill";
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

/* ---------- Quill module registry (toggleable) ---------- */
const MODULES: Record<string, any> = {
  History: { history: { delay: 1000, maxStack: 100, userOnly: false } },
  Clipboard: { clipboard: { matchVisual: false } },
  Keyboard: { keyboard: { bindings: {} } },
};
const DEFAULT_MODULES = Object.keys(MODULES);

/* ---------- Dummy version-history ---------- */
const DUMMY_HISTORY = [
  { id: 1, label: "Draft – Jul 9 08:00" },
  { id: 2, label: "Autosave – Jul 8 15:30" },
  { id: 3, label: "Submitted – Jul 7 12:15" },
];

/* ---------- Page ---------- */
function QuillEditorPage() {
  const [enabledModules, setEnabledModules] = useState<string[]>(() => {
    if (typeof window === "undefined") return DEFAULT_MODULES;
    return (
      JSON.parse(localStorage.getItem("quillModules") ?? "null") ??
      DEFAULT_MODULES
    );
  });
  const [showModuleMenu, setShowModuleMenu] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const quillRef = useRef<ReactQuill>(null);

  /* Persist module selection */
  useEffect(() => {
    localStorage.setItem("quillModules", JSON.stringify(enabledModules));
  }, [enabledModules]);

  /* Build Quill modules obj */
  const modules = useMemo(() => {
    const base: any = {
      toolbar: false, // we build a custom toolbar
    };
    enabledModules.forEach((m) => Object.assign(base, MODULES[m]));
    return base;
  }, [enabledModules]);

  /* Save handler */
  const handleSave = () => {
    const html = quillRef.current?.getEditor().root.innerHTML;
    alert(html);
  };

  /* Toolbar button helper */
  const button = (icon: JSX.Element, cmd: () => void, title = "") => (
    <button
      type="button"
      onClick={cmd}
      title={title}
      className="px-2 py-1 rounded hover:bg-indigo-100"
    >
      {icon}
    </button>
  );

  const editor = quillRef.current?.getEditor();

  return (
    <div className="fixed inset-0 z-30 bg-white flex flex-col">
      {/* ---------- Header / Toolbar ---------- */}
      <header className="flex items-center gap-2 bg-gray-100 px-6 py-3 border-b w-full">
        <h1 className="text-xl font-bold mr-6">Quill Editor</h1>

        {/* Formatting buttons */}
        <div className="flex items-center gap-1">
          {button(
            <Bold className="w-4 h-4" />,
            () => editor?.format("bold", !editor?.getFormat().bold),
            "Bold",
          )}
          {button(
            <Italic className="w-4 h-4" />,
            () => editor?.format("italic", !editor?.getFormat().italic),
            "Italic",
          )}
          {button(
            <UnderlineIcon className="w-4 h-4" />,
            () => editor?.format("underline", !editor?.getFormat().underline),
            "Underline",
          )}
          {button(
            <Strikethrough className="w-4 h-4" />,
            () => editor?.format("strike", !editor?.getFormat().strike),
            "Strikethrough",
          )}
          {button(
            <Code className="w-4 h-4" />,
            () => editor?.format("code", !editor?.getFormat().code),
            "Inline Code",
          )}
          {button(
            <Quote className="w-4 h-4" />,
            () => editor?.format("blockquote", !editor?.getFormat().blockquote),
            "Blockquote",
          )}
          {button(
            <List className="w-4 h-4" />,
            () => editor?.format("list", "bullet"),
            "Bullet List",
          )}
          {button(
            <ListOrdered className="w-4 h-4" />,
            () => editor?.format("list", "ordered"),
            "Numbered List",
          )}
          {button(
            <Undo2 className="w-4 h-4" />,
            () => editor?.history.undo(),
            "Undo",
          )}
          {button(
            <Redo2 className="w-4 h-4" />,
            () => editor?.history.redo(),
            "Redo",
          )}

          <button
            onClick={handleSave}
            className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Save
          </button>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Module toggle menu */}
        <div className="relative">
          <button
            onClick={() => setShowModuleMenu(!showModuleMenu)}
            className="px-3 py-1 border rounded bg-gray-50 hover:bg-gray-200 flex items-center gap-1"
            title="Manage Modules"
          >
            Modules <ChevronDown className="w-4 h-4" />
          </button>
          {showModuleMenu && (
            <div className="absolute right-0 mt-2 bg-white shadow-lg border rounded p-4 z-50 max-h-72 overflow-y-auto w-64">
              <div className="mb-2 font-semibold">Enabled Modules</div>
              {Object.keys(MODULES).map((name) => (
                <label
                  key={name}
                  className="flex items-center gap-2 text-sm my-1"
                >
                  <input
                    type="checkbox"
                    checked={enabledModules.includes(name)}
                    onChange={() =>
                      setEnabledModules((prev) =>
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
                onClick={() => setShowModuleMenu(false)}
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

      {/* ---------- Quill canvas ---------- */}
      <main className="flex-1 overflow-auto px-4 py-6">
        <ReactQuill
          ref={quillRef}
          defaultValue=""
          theme="snow"
          modules={modules}
          className="quill-content h-full"
        />
      </main>
    </div>
  );
}

/* Disable SSR */
export default dynamic(() => Promise.resolve(QuillEditorPage), { ssr: false });
