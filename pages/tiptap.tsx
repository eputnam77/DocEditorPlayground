import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { EditorContent, useEditor } from "@tiptap/react";

// Core Extensions
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Image from "@tiptap/extension-image";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import SlashCommand from "../extensions/slash-command";
import Lint from "../extensions/lint";

// Yjs for collaboration
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";

// Icons
const Bold = dynamic(() => import("lucide-react").then((m) => m.Bold));
const Italic = dynamic(() => import("lucide-react").then((m) => m.Italic));
const UnderlineIcon = dynamic(() =>
  import("lucide-react").then((m) => m.Underline),
);
const Strikethrough = dynamic(() =>
  import("lucide-react").then((m) => m.Strikethrough),
);
const Code = dynamic(() => import("lucide-react").then((m) => m.Code));
const Quote = dynamic(() => import("lucide-react").then((m) => m.Quote));
const List = dynamic(() => import("lucide-react").then((m) => m.List));
const ListOrdered = dynamic(() =>
  import("lucide-react").then((m) => m.ListOrdered),
);
const Undo2 = dynamic(() => import("lucide-react").then((m) => m.Undo2));
const Redo2 = dynamic(() => import("lucide-react").then((m) => m.Redo2));
const ImageIcon = dynamic(() => import("lucide-react").then((m) => m.Image));
const TableIcon = dynamic(() => import("lucide-react").then((m) => m.Table));
const MenuIcon = dynamic(() => import("lucide-react").then((m) => m.Menu));
const XIcon = dynamic(() => import("lucide-react").then((m) => m.X));
const Loader2 = dynamic(() => import("lucide-react").then((m) => m.Loader2));

function AiSuggestButton({ editor }: { editor: any }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSuggest() {
    setError(null);
    if (!editor) return;
    setLoading(true);

    const { from, to, empty } = editor.state.selection;
    const selectedText = empty
      ? editor.state.doc.textContent
      : editor.state.doc.textBetween(from, to, " ");

    try {
      const res = await fetch("/api/ai-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: selectedText,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const { suggestion } = await res.json();

      editor.chain().focus();
      if (empty) {
        editor.commands.setContent(suggestion);
      } else {
        editor.commands.insertContentAt({ from, to }, suggestion);
      }
    } catch (err: any) {
      setError(err.message || "AI Suggest failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <span className="ml-2 relative">
      <button
        onClick={handleSuggest}
        disabled={loading}
        className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
        title="AI Suggest (rewrite selection)"
      >
        {loading ? (
          <Loader2 className="animate-spin w-4 h-4" />
        ) : (
          <span>AI Suggest</span>
        )}
      </button>
      {error && (
        <div className="absolute left-0 mt-2 bg-red-50 text-red-800 px-2 py-1 text-xs rounded shadow z-50">
          {error}
        </div>
      )}
    </span>
  );
}

function Sidebar({
  show,
  onClose,
  onTemplateLoad,
  onToggleLint,
  lintEnabled,
  onToggleCollab,
  collabEnabled,
  history,
}: any) {
  return (
    <aside
      className={`fixed top-0 right-0 h-full w-80 bg-gray-100 border-l z-50 shadow-lg transform transition-transform duration-200 ${
        show ? "translate-x-0" : "translate-x-full"
      }`}
      style={{ minWidth: "18rem" }}
    >
      <div className="flex justify-between items-center px-4 py-3 border-b">
        <span className="font-bold">Tools & Extensions</span>
        <button
          onClick={onClose}
          className="hover:bg-gray-300 rounded p-1"
          aria-label="Close"
        >
          <XIcon className="w-5 h-5" />
        </button>
      </div>
      <div className="px-4 py-2">
        <div className="mb-4">
          <div className="font-semibold mb-1">Templates</div>
          <button
            className="text-indigo-700 underline"
            onClick={() => onTemplateLoad("sample")}
          >
            Load Sample Template
          </button>
        </div>
        <div className="mb-4">
          <div className="font-semibold mb-1">Validation (Lint)</div>
          <button
            className={`px-2 py-1 rounded ${
              lintEnabled ? "bg-green-500 text-white" : "bg-gray-200"
            }`}
            onClick={onToggleLint}
          >
            {lintEnabled ? "Disable" : "Enable"} Lint
          </button>
        </div>
        <div className="mb-4">
          <div className="font-semibold mb-1">Collaboration</div>
          <button
            className={`px-2 py-1 rounded ${
              collabEnabled ? "bg-green-500 text-white" : "bg-gray-200"
            }`}
            onClick={onToggleCollab}
          >
            {collabEnabled ? "Disconnect" : "Connect"}
          </button>
        </div>
        <div>
          <div className="font-semibold mb-1">History</div>
          <ul className="text-xs">
            {history.map((h: any) => (
              <li key={h.id}>{h.label}</li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}

export default function TipTapEditorPage() {
  // Yjs Setup
  const [collabEnabled, setCollabEnabled] = useState(false);
  const [yDoc, setYDoc] = useState<Y.Doc | null>(null);
  const [provider, setProvider] = useState<any>(null);

  // Lint (validation)
  const [lintEnabled, setLintEnabled] = useState(false);

  // Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Version History (dummy)
  const DUMMY_HISTORY = [
    { id: 1, label: "Draft - Jul 9, 8:00 am" },
    { id: 2, label: "AutoSave - Jul 8, 3:30 pm" },
    { id: 3, label: "Submitted - Jul 7, 12:15 pm" },
  ];

  // Editor Extensions
  const extensions = useMemo(() => {
    const base = [
      StarterKit,
      Underline,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      Image,
      SlashCommand,
    ];
    if (lintEnabled) {
      base.push(
        Lint.configure({
          rule: {
            match: ({ tr }) => {
              const text = tr.doc.textContent;
              const issues: any[] = [];
    
              // Rule 1: Prohibited content: DRAFT
              let idx = text.indexOf("DRAFT");
              if (idx > -1) {
                issues.push({
                  message: '"DRAFT" must not appear in the finalized document.',
                  from: idx,
                  to: idx + 5,
                });
              }
    
              // Rule 2: Prohibited placeholder [Purpose goes here]
              let phIdx = text.indexOf("[Purpose goes here]");
              if (phIdx > -1) {
                issues.push({
                  message: 'Placeholder "[Purpose goes here]" must be removed.',
                  from: phIdx,
                  to: phIdx + 20,
                });
              }
    
              // Rule 3: Must have "1. Purpose." heading
              if (!text.match(/1\. Purpose\./)) {
                issues.push({
                  message: 'Missing required heading: "1. Purpose."',
                  from: 0,
                  to: 1,
                });
              }
    
              // Rule 4: Must have "2. Applicability." heading
              if (!text.match(/2\. Applicability\./)) {
                issues.push({
                  message: 'Missing required heading: "2. Applicability."',
                  from: 0,
                  to: 1,
                });
              }
    
              // Rule 5: Must have "4. Related Material." heading
              if (!text.match(/4\. Related Material\./)) {
                issues.push({
                  message: 'Missing required heading: "4. Related Material."',
                  from: 0,
                  to: 1,
                });
              }
    
              // Rule 6: Headings must end with a period (very basic check)
              // (For more accuracy, you'd walk the doc’s node tree!)
              const headingRegex = /(\d+\..+?)(\n|$)/g;
              let match;
              while ((match = headingRegex.exec(text)) !== null) {
                if (!match[1].trim().endsWith(".")) {
                  issues.push({
                    message: "Heading must end with a period.",
                    from: match.index,
                    to: match.index + match[1].length,
                  });
                }
              }
    
              // Rule 7: Prohibited: <ac no.> and <ac title.>
              let acnoIdx = text.indexOf("<ac no.>");
              if (acnoIdx > -1) {
                issues.push({
                  message: "Remove all <ac no.> placeholders.",
                  from: acnoIdx,
                  to: acnoIdx + 9,
                });
              }
              let actitleIdx = text.indexOf("<ac title.>");
              if (actitleIdx > -1) {
                issues.push({
                  message: "Remove all <ac title.> placeholders.",
                  from: actitleIdx,
                  to: actitleIdx + 12,
                });
              }
    
              // Add more rules as needed...
              return issues;
            },
          },
        }),
      );
    }
    if (collabEnabled) {
      if (!yDoc) {
        const doc = new Y.Doc();
        const webrtcProvider = new WebrtcProvider("tiptap-demo-room", doc);
        setYDoc(doc);
        setProvider(webrtcProvider);
        base.push(
          Collaboration.configure({ document: doc }),
          CollaborationCursor.configure({
            provider: webrtcProvider,
            user: { name: "You", color: "#3b82f6" },
          }),
        );
      } else if (yDoc && provider) {
        base.push(
          Collaboration.configure({ document: yDoc }),
          CollaborationCursor.configure({
            provider: provider,
            user: { name: "You", color: "#3b82f6" },
          }),
        );
      }
    }
    return base;
    // eslint-disable-next-line
  }, [lintEnabled, collabEnabled, yDoc, provider]);

  // TipTap Editor
  const [content, setContent] = useState("<p>Hello world!</p>");
  const editor = useEditor({
    extensions,
    content,
    autofocus: true,
    editorProps: {
      attributes: {
        class:
          "tiptap-content focus:outline-none w-full h-full min-h-[400px] max-w-[860px] mx-auto",
      },
    },
    onUpdate: ({ editor }) => setContent(editor.getHTML()),
  });

  function getCurrentBlock(editor: any) {
    if (editor.isActive("heading", { level: 1 })) return "h1";
    if (editor.isActive("heading", { level: 2 })) return "h2";
    if (editor.isActive("heading", { level: 3 })) return "h3";
    return "p";
  }
  function setBlock(editor: any, val: string) {
    if (val === "p") editor.chain().focus().setParagraph().run();
    else if (val === "h1")
      editor.chain().focus().toggleHeading({ level: 1 }).run();
    else if (val === "h2")
      editor.chain().focus().toggleHeading({ level: 2 }).run();
    else if (val === "h3")
      editor.chain().focus().toggleHeading({ level: 3 }).run();
  }
  function toolbarButton(
    icon: React.ReactNode,
    command: () => void,
    active: boolean,
    title = "",
  ) {
    return (
      <button
        type="button"
        className={`p-2 rounded ${active ? "bg-indigo-100" : ""}`}
        onClick={command}
        title={title}
      >
        {icon}
      </button>
    );
  }

  function handleTemplateLoad(name: string) {
    if (!editor) return;
    if (name === "sample") {
      editor.commands.setContent(
        "<h1>Sample Template</h1><p>This is a loaded template.</p>",
      );
    }
  }

  function handleToggleLint() {
    setLintEnabled((prev) => !prev);
  }
  function handleToggleCollab() {
    setCollabEnabled((prev) => !prev);
    if (!collabEnabled && yDoc && provider) {
      provider.disconnect();
      setYDoc(null);
      setProvider(null);
    }
  }

  function insertTable() {
    editor
      ?.chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  }
  function insertImage() {
    const url = prompt("Image URL?");
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  }

  if (!editor)
    return (
      <div className="flex items-center justify-center h-full">
        Loading TipTap…
      </div>
    );

  return (
    <div className="flex flex-col h-screen w-full bg-white">
      {/* Header Toolbar */}
      <header className="flex items-center gap-2 bg-gray-100 px-6 py-3 border-b w-full">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded bg-gray-200 mr-2"
          aria-label="Open sidebar"
        >
          <MenuIcon className="w-5 h-5" />
        </button>
        <span className="text-xl font-bold">TipTap Editor</span>
        <select
          value={getCurrentBlock(editor)}
          onChange={(e) => setBlock(editor, e.target.value)}
          className="rounded border px-2 py-1 ml-4"
          aria-label="Block style"
        >
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>
        {toolbarButton(
          <Bold className="w-4 h-4" />,
          () => editor.chain().focus().toggleBold().run(),
          editor.isActive("bold"),
          "Bold",
        )}
        {toolbarButton(
          <Italic className="w-4 h-4" />,
          () => editor.chain().focus().toggleItalic().run(),
          editor.isActive("italic"),
          "Italic",
        )}
        {toolbarButton(
          <UnderlineIcon className="w-4 h-4" />,
          () => editor.chain().focus().toggleUnderline?.().run(),
          editor.isActive("underline"),
          "Underline",
        )}
        {toolbarButton(
          <Strikethrough className="w-4 h-4" />,
          () => editor.chain().focus().toggleStrike().run(),
          editor.isActive("strike"),
          "Strikethrough",
        )}
        {toolbarButton(
          <Code className="w-4 h-4" />,
          () => editor.chain().focus().toggleCode().run(),
          editor.isActive("code"),
          "Inline Code",
        )}
        {toolbarButton(
          <Quote className="w-4 h-4" />,
          () => editor.chain().focus().toggleBlockquote().run(),
          editor.isActive("blockquote"),
          "Blockquote",
        )}
        {toolbarButton(
          <List className="w-4 h-4" />,
          () => editor.chain().focus().toggleBulletList().run(),
          editor.isActive("bulletList"),
          "Bullet List",
        )}
        {toolbarButton(
          <ListOrdered className="w-4 h-4" />,
          () => editor.chain().focus().toggleOrderedList().run(),
          editor.isActive("orderedList"),
          "Numbered List",
        )}
        {toolbarButton(
          <Undo2 className="w-4 h-4" />,
          () => editor.chain().focus().undo().run(),
          false,
          "Undo",
        )}
        {toolbarButton(
          <Redo2 className="w-4 h-4" />,
          () => editor.chain().focus().redo().run(),
          false,
          "Redo",
        )}
        <button
          onClick={insertTable}
          className="ml-2 p-2 rounded bg-gray-200"
          title="Insert Table"
        >
          <TableIcon className="w-4 h-4" />
        </button>
        <button
          onClick={insertImage}
          className="ml-1 p-2 rounded bg-gray-200"
          title="Insert Image"
        >
          <ImageIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => alert(editor.getHTML())}
          className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Save
        </button>
        <AiSuggestButton editor={editor} />
        <div className="flex-1" />
      </header>

      {/* Lint (Validation) Overlay */}
      {lintEnabled && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-red-50 border border-red-300 px-6 py-2 rounded z-40 shadow">
          <span className="text-red-600 font-semibold">
            Linting enabled — Issues will be highlighted inline.
          </span>
        </div>
      )}

      {/* Main Editor */}
      <main className="flex-1 overflow-auto flex justify-center items-start bg-white">
        <div className="w-full max-w-[860px] p-8">
          <EditorContent editor={editor} />
        </div>
      </main>

      {/* Sidebar for templates, validation, collab, history */}
      <Sidebar
        show={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onTemplateLoad={handleTemplateLoad}
        onToggleLint={handleToggleLint}
        lintEnabled={lintEnabled}
        onToggleCollab={handleToggleCollab}
        collabEnabled={collabEnabled}
        history={DUMMY_HISTORY}
      />
    </div>
  );
}
