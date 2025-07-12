/* pages/editors/slate.tsx */
import React, { useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  createEditor,
  Descendant,
  Transforms,
  Editor,
  Element as SlateElement,
  Text,
} from "slate";
import { Slate, Editable, withReact, useSlate } from "slate-react";
import { withHistory, HistoryEditor } from "slate-history";
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

/* ---------- Plugin toggle setup ---------- */
const PLUGINS = {
  History: true,
  Lists: true,
};
const DEFAULT_PLUGINS = Object.keys(PLUGINS);

/* ---------- Initial value ---------- */
const initialValue: Descendant[] = [
  { type: "paragraph", children: [{ text: "" }] },
];

/* ---------- Element & leaf renderers ---------- */
const Element = ({ attributes, children, element }: any) => {
  switch (element.type) {
    case "heading-one":
      return <h1 {...attributes}>{children}</h1>;
    case "heading-two":
      return <h2 {...attributes}>{children}</h2>;
    case "heading-three":
      return <h3 {...attributes}>{children}</h3>;
    case "bulleted-list":
      return <ul {...attributes}>{children}</ul>;
    case "numbered-list":
      return <ol {...attributes}>{children}</ol>;
    case "list-item":
      return <li {...attributes}>{children}</li>;
    case "blockquote":
      return <blockquote {...attributes}>{children}</blockquote>;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const Leaf = ({ attributes, children, leaf }: any) => {
  if (leaf.bold) children = <strong>{children}</strong>;
  if (leaf.code) children = <code>{children}</code>;
  if (leaf.italic) children = <em>{children}</em>;
  if (leaf.underline) children = <u>{children}</u>;
  if (leaf.strikethrough) children = <s>{children}</s>;
  return <span {...attributes}>{children}</span>;
};

/* ---------- Helpers ---------- */
const isMarkActive = (editor: Editor, format: string) => {
  const marks = Editor.marks(editor);
  return marks ? (marks as any)[format] === true : false;
};
const toggleMark = (editor: Editor, format: string) => {
  const active = isMarkActive(editor, format);
  if (active) Editor.removeMark(editor, format);
  else Editor.addMark(editor, format, true);
};

const isBlockActive = (editor: Editor, type: string) => {
  const [match] = Array.from(
    Editor.nodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === type,
    }),
  );
  return !!match;
};
const toggleBlock = (editor: Editor, type: string) => {
  const isActive = isBlockActive(editor, type);
  const isList = type === "bulleted-list" || type === "numbered-list";
  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      (n.type === "bulleted-list" || n.type === "numbered-list"),
    split: true,
  });
  const newType = isActive ? "paragraph" : isList ? "list-item" : type;
  Transforms.setNodes(editor, { type: newType });
  if (!isActive && isList) {
    const block = { type, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

/* ---------- Toolbar component ---------- */
const ToolbarButton = ({
  icon,
  onClick,
  active,
  title,
}: {
  icon: JSX.Element;
  onClick: () => void;
  active?: boolean;
  title: string;
}) => (
  <button
    className={`px-2 py-1 rounded ${active ? "bg-indigo-100" : ""}`}
    onMouseDown={(e) => {
      e.preventDefault();
      onClick();
    }}
    title={title}
  >
    {icon}
  </button>
);

const FormatToolbar = () => {
  const editor = useSlate();
  return (
    <>
      <ToolbarButton
        icon={<Bold className="w-4 h-4" />}
        onClick={() => toggleMark(editor, "bold")}
        active={isMarkActive(editor, "bold")}
        title="Bold"
      />
      <ToolbarButton
        icon={<Italic className="w-4 h-4" />}
        onClick={() => toggleMark(editor, "italic")}
        active={isMarkActive(editor, "italic")}
        title="Italic"
      />
      <ToolbarButton
        icon={<UnderlineIcon className="w-4 h-4" />}
        onClick={() => toggleMark(editor, "underline")}
        active={isMarkActive(editor, "underline")}
        title="Underline"
      />
      <ToolbarButton
        icon={<Strikethrough className="w-4 h-4" />}
        onClick={() => toggleMark(editor, "strikethrough")}
        active={isMarkActive(editor, "strikethrough")}
        title="Strikethrough"
      />
      <ToolbarButton
        icon={<Code className="w-4 h-4" />}
        onClick={() => toggleMark(editor, "code")}
        active={isMarkActive(editor, "code")}
        title="Inline Code"
      />
      <ToolbarButton
        icon={<Quote className="w-4 h-4" />}
        onClick={() => toggleBlock(editor, "blockquote")}
        active={isBlockActive(editor, "blockquote")}
        title="Blockquote"
      />
      <ToolbarButton
        icon={<List className="w-4 h-4" />}
        onClick={() => toggleBlock(editor, "bulleted-list")}
        active={isBlockActive(editor, "bulleted-list")}
        title="Bullet List"
      />
      <ToolbarButton
        icon={<ListOrdered className="w-4 h-4" />}
        onClick={() => toggleBlock(editor, "numbered-list")}
        active={isBlockActive(editor, "numbered-list")}
        title="Numbered List"
      />
      <ToolbarButton
        icon={<Undo2 className="w-4 h-4" />}
        onClick={() => HistoryEditor.undo(editor)}
        title="Undo"
      />
      <ToolbarButton
        icon={<Redo2 className="w-4 h-4" />}
        onClick={() => HistoryEditor.redo(editor)}
        title="Redo"
      />
    </>
  );
};

/* ---------- Main page ---------- */
function SlateEditorPage() {
  const [pluginsEnabled, setPluginsEnabled] = useState<string[]>(() => {
    if (typeof window === "undefined") return DEFAULT_PLUGINS;
    return (
      JSON.parse(localStorage.getItem("slatePlugins") ?? "null") ??
      DEFAULT_PLUGINS
    );
  });
  const [showPluginMenu, setShowPluginMenu] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const editor = useMemo(() => {
    let e = withReact(createEditor());
    if (pluginsEnabled.includes("History")) e = withHistory(e);
    return e;
  }, [pluginsEnabled]);

  const handleSave = () => {
    alert(JSON.stringify(editor.children, null, 2)); // swap for HTML serialization if preferred
  };

  return (
    <div className="fixed inset-0 z-30 bg-white flex flex-col">
      {/* ---------- Toolbar header ---------- */}
      <header className="flex items-center gap-2 bg-gray-100 px-6 py-3 border-b w-full">
        <h1 className="text-xl font-bold mr-6">Slate Editor</h1>

        {/* Formatting toolbar */}
        <Slate editor={editor} value={initialValue} onChange={() => {}}>
          <FormatToolbar />
        </Slate>
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
                    checked={pluginsEnabled.includes(name)}
                    onChange={() =>
                      setPluginsEnabled((prev) =>
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

        {/* Version History dropdown (dummy) */}
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

      {/* ---------- Slate canvas ---------- */}
      <main className="flex-1 overflow-auto px-4 py-6">
        <Slate editor={editor} value={initialValue} onChange={() => {}}>
          <Editable
            renderElement={(props) => <Element {...props} />}
            renderLeaf={(props) => <Leaf {...props} />}
            placeholder="Start typing…"
            className="outline-none slate-content"
          />
        </Slate>
      </main>
    </div>
  );
}

/* Disable SSR */
export default dynamic(() => Promise.resolve(SlateEditorPage), { ssr: false });
