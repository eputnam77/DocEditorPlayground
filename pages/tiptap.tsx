import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { EditorContent, useEditor } from "@tiptap/react";

import Blockquote from "@tiptap/extension-blockquote";
import BoldExtension from "@tiptap/extension-bold";
import BulletList from "@tiptap/extension-bullet-list";
import CodeExtension from "@tiptap/extension-code";
import CodeBlock from "@tiptap/extension-code-block";
import DocumentExtension from "@tiptap/extension-document";
import Dropcursor from "@tiptap/extension-dropcursor";
import Gapcursor from "@tiptap/extension-gapcursor";
import HardBreak from "@tiptap/extension-hard-break";
import Heading from "@tiptap/extension-heading";
import History from "@tiptap/extension-history";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import ItalicExtension from "@tiptap/extension-italic";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Paragraph from "@tiptap/extension-paragraph";
import StrikeExtension from "@tiptap/extension-strike";
import TextExtension from "@tiptap/extension-text";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";

// Custom extensions implementing playground tasks
import { tiptapHeadingLock } from "../extensions/tiptapHeadingLock";
import { tiptapStructure } from "../extensions/tiptapStructure";
import { tiptapIndentation } from "../extensions/tiptapIndentation";
import { tiptapWatermark } from "../extensions/tiptapWatermark";
import { tiptapSectionNode } from "../extensions/tiptapSectionNode";
import { tiptapYjsCollab } from "../extensions/tiptapYjsCollab";

// Plug in your own
import PluginManager from "../components/PluginManager";
import TemplateLoader from "../components/TemplateLoader";
import EditorIntegrationInfo from "../components/EditorIntegrationInfo";
import ValidationStatus from "../components/ValidationStatus";
import CommentTrack from "../components/CommentTrack";
import TrackChanges from "../components/TrackChanges";
import HeadingStylePresets from "../components/HeadingStylePresets";
import { TEMPLATES } from "../utils/templates";

interface ValidationRule {
  id: string;
  label: string;
  type: string;
  level?: number;
  text?: string;
}

interface ValidationSet {
  name: string;
  filename: string;
  rules: ValidationRule[];
}

interface ValidationResultItem extends ValidationRule {
  passed: boolean;
  detail?: string;
}

// Icons
// Dynamically load icons to avoid bundling the entire set
const Bold = dynamic(() => import("lucide-react").then((m) => m.Bold));
const ChevronDown = dynamic(() =>
  import("lucide-react").then((m) => m.ChevronDown),
);
const ChevronUp = dynamic(() =>
  import("lucide-react").then((m) => m.ChevronUp),
);
const Clock = dynamic(() => import("lucide-react").then((m) => m.Clock));
const Code = dynamic(() => import("lucide-react").then((m) => m.Code));
const Italic = dynamic(() => import("lucide-react").then((m) => m.Italic));
const List = dynamic(() => import("lucide-react").then((m) => m.List));
const ListOrdered = dynamic(() =>
  import("lucide-react").then((m) => m.ListOrdered),
);
const Quote = dynamic(() => import("lucide-react").then((m) => m.Quote));
const Redo2 = dynamic(() => import("lucide-react").then((m) => m.Redo2));
const Strikethrough = dynamic(() =>
  import("lucide-react").then((m) => m.Strikethrough),
);
const UnderlineIcon = dynamic(() =>
  import("lucide-react").then((m) => m.Underline),
);
const Undo2 = dynamic(() => import("lucide-react").then((m) => m.Undo2));

// ----- Required Extensions: ALWAYS ON, HIDDEN FROM USER -----
const ALWAYS_ENABLED = [
  { name: "Document", extension: DocumentExtension },
  { name: "Paragraph", extension: Paragraph },
  { name: "Text", extension: TextExtension },
  { name: "HeadingLock", extension: tiptapHeadingLock() },
  { name: "Structure", extension: tiptapStructure() },
];

// ----- Core Editing Features: ALWAYS ON, HIDDEN FROM USER -----
const CORE_DEFAULTS = [
  { name: "History", extension: History },
  { name: "Bold", extension: BoldExtension },
  { name: "Italic", extension: ItalicExtension },
  { name: "Strike", extension: StrikeExtension },
  { name: "Underline", extension: Underline },
  { name: "Heading", extension: Heading },
  { name: "Code", extension: CodeExtension },
  { name: "CodeBlock", extension: CodeBlock },
  { name: "Blockquote", extension: Blockquote },
  { name: "BulletList", extension: BulletList },
  { name: "OrderedList", extension: OrderedList },
  { name: "ListItem", extension: ListItem },
  { name: "Indentation", extension: tiptapIndentation() },
];

// ----- "Internals": Loaded but not user-toggleable -----
const INTERNALS = [
  { name: "HardBreak", extension: HardBreak },
  { name: "HorizontalRule", extension: HorizontalRule },
  { name: "Dropcursor", extension: Dropcursor },
  { name: "Gapcursor", extension: Gapcursor },
  { name: "TextStyle", extension: TextStyle },
];

// ----- Only show these in the Extension Dropdown -----
const TOGGLEABLE_EXTENSIONS = [
  { name: "Watermark", extension: tiptapWatermark() },
  { name: "SectionNode", extension: tiptapSectionNode() },
  { name: "YjsCollab", extension: tiptapYjsCollab() },
];

function TiptapEditorPage() {
  const getInitialExtensions = () => {
    if (typeof window === "undefined") return [] as string[];
    const stored = localStorage.getItem("tiptapToggleableExtensions");
    return stored
      ? (JSON.parse(stored) as string[])
      : TOGGLEABLE_EXTENSIONS.map((e) => e.name);
  };
  const [enabledExtensions, setEnabledExtensions] = useState<string[]>(
    getInitialExtensions(),
  );

  // Compose the extensions in this order:
  const extensions = useMemo(
    () =>
      [
        ...ALWAYS_ENABLED,
        ...CORE_DEFAULTS,
        ...INTERNALS,
        ...TOGGLEABLE_EXTENSIONS.filter((e) =>
          enabledExtensions.includes(e.name),
        ),
      ].map((e) => e.extension),
    [enabledExtensions],
  );

  // Store only toggled extensions
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "tiptapToggleableExtensions",
        JSON.stringify(enabledExtensions),
      );
    }
  }, [enabledExtensions]);

  const initialContent = "";

  const [content, setContent] = useState(initialContent);
  const editor = useEditor(
    {
      extensions,
      content,
      autofocus: true,
      editorProps: {
        attributes: {
          class: "tiptap-content focus:outline-none w-full h-full",
        },
      },
    },
    [extensions],
  );

  // Update content state on every editor change
  useEffect(() => {
    if (!editor) return;
    const updateHandler = () => setContent(editor.getHTML());
    editor.on("update", updateHandler);
    return () => editor.off("update", updateHandler);
  }, [editor]);

  const setHeading = (level) => {
    editor?.chain().focus().toggleHeading({ level }).run();
  };

  const handleSave = () => {
    if (editor) {
      alert(editor.getHTML());
      // Save logic
    }
  };

  const [loadingTemplate, setLoadingTemplate] = useState(false);

  const handleTemplateLoad = async (filename) => {
    if (!editor) return;
    setLoadingTemplate(true);
    try {
      const res = await fetch(`/templates/${filename}`);
      const html = await res.text();
      editor.commands.setContent(html);
    } catch {
      alert("Failed to load template: " + filename);
    } finally {
      setLoadingTemplate(false);
    }
  };

  // Toolbar helper
  const toolbarButton = (icon, command, active, title = "") => (
    <button
      type="button"
      className={`px-2 py-1 rounded ${active ? "bg-indigo-100" : ""}`}
      onClick={command}
      title={title}
    >
      {icon}
    </button>
  );

  // Dummy history
  const [showHistory, setShowHistory] = useState(false);
  const DUMMY_HISTORY = [
    { id: 1, label: "Draft - Jul 9, 8:00 am" },
    { id: 2, label: "AutoSave - Jul 8, 3:30 pm" },
    { id: 3, label: "Submitted - Jul 7, 12:15 pm" },
  ];

  // Validation state (unchanged)
  const [validationSets, setValidationSets] = useState<ValidationSet[]>([]);
  const [selectedValidation, setSelectedValidation] = useState("");
  const [validationRules, setValidationRules] = useState<ValidationRule[]>([]);
  const [validationResults, setValidationResults] = useState<
    ValidationResultItem[]
  >([]);
  const [loadingValidation, setLoadingValidation] = useState(false);

  useEffect(() => {
    async function fetchValidations() {
      try {
        const files = [
          "faa-advisory-circular.json",
          "software-release-notes.json",
          "medical-research-article.json",
          "legal-contract-template.json",
        ];
        const sets = await Promise.all(
          files.map(async (f) => {
            const res = await fetch(`/validation/${f}`);
            if (!res.ok) return null;
            const data = await res.json();
            return { ...data, filename: f };
          }),
        );
        setValidationSets(sets.filter(Boolean));
      } catch {
        setValidationSets([]);
      }
    }
    fetchValidations();
  }, []);

  useEffect(() => {
    if (!selectedValidation) return;
    const set = validationSets.find((v) => v.filename === selectedValidation);
    setValidationRules(set ? set.rules : []);
    setValidationResults([]);
  }, [selectedValidation, validationSets]);

  function runValidation() {
    if (!editor) return;
    try {
      const html = editor.getHTML();
      const parser = new window.DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const results = validationRules.map((rule) => {
        if (rule.type === "header") {
          const tag = `h${rule.level}`;
          const found = doc.body.querySelector(tag);
          return {
            ...rule,
            passed: !!found,
            detail: found
              ? `Found <${tag}>: ${found.textContent}`
              : `No <${tag}> found`,
          };
        } else if (rule.type === "section") {
          const found = Array.from(
            doc.body.querySelectorAll("h1, h2, h3, h4, h5, h6"),
          ).find(
            (el) =>
              el.textContent?.trim().toLowerCase() ===
              (rule.text ?? "").trim().toLowerCase(),
          );
          return {
            ...rule,
            passed: !!found,
            detail: found
              ? `Found section: ${found.textContent}`
              : `Section '${rule.text ?? ""}' not found`,
          };
        } else if (rule.type === "footer") {
          const blocks = Array.from(
            doc.body.querySelectorAll(
              "p, div, footer, section, h1, h2, h3, h4, h5, h6",
            ),
          );
          const last = blocks[blocks.length - 1];
          const found =
            last && rule.text
              ? !!last.textContent?.includes(rule.text)
              : !!last;
          return {
            ...rule,
            passed: found,
            detail: found
              ? `Footer contains required info.`
              : `Footer requirement not met`,
          };
        }
        return { ...rule, passed: false, detail: "Unknown rule type" };
      });
      setValidationResults(results);
    } catch {
      alert("Validation failed");
    }
  }

  if (!editor) return <div>Loading TipTap…</div>;

  return (
    <div className="fixed inset-0 z-30 bg-white flex flex-col">
      <h1 className="sr-only">TipTap Editor</h1>
      <header className="flex items-center gap-2 bg-gray-100 px-6 py-3 border-b w-full">
        <span className="text-xl font-bold mr-6">TipTap Editor</span>
        <HeadingStylePresets onSelect={setHeading} />
        <div className="flex items-center gap-1">
          <select
            value={
              editor.isActive("heading", { level: 1 })
                ? "h1"
                : editor.isActive("heading", { level: 2 })
                  ? "h2"
                  : editor.isActive("heading", { level: 3 })
                    ? "h3"
                    : "p"
            }
            onChange={(e) => {
              const val = e.target.value;
              if (val === "p") editor.chain().focus().setParagraph().run();
              else if (val === "h1") setHeading(1);
              else if (val === "h2") setHeading(2);
              else if (val === "h3") setHeading(3);
            }}
            className="rounded border px-2 py-1"
            aria-label="Formatting"
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
            () => {
              const chain = editor.chain().focus();
              if (typeof chain.toggleUnderline === "function") {
                chain.toggleUnderline().run();
              }
            },
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
            onClick={handleSave}
            className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Save
          </button>
        </div>
        <div className="flex-1"></div>
        <div className="relative mr-2">
          <TemplateLoader
            templates={TEMPLATES}
            disabled={loadingTemplate}
            onLoad={handleTemplateLoad}
            onClear={() => editor?.commands.clearContent()}
            onError={(e) => alert(String(e))}
          />
        </div>
        <div className="relative">
          {/* Only show toggleable extensions in PluginManager */}
          <PluginManager
            plugins={TOGGLEABLE_EXTENSIONS.map((e) => ({ name: e.name }))}
            enabled={enabledExtensions}
            locked={[]}
            onChange={(exts) => setEnabledExtensions(exts)}
          />
        </div>
        <div className="relative ml-4">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="px-3 py-1 border rounded bg-gray-50 hover:bg-gray-200 flex items-center gap-1"
            title="Version History"
            aria-label="History"
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
                aria-label="Close"
              >
                Close
              </button>
            </div>
          )}
        </div>
        <div className="relative ml-2">
          <select
            className="px-3 py-1 border rounded bg-gray-50 hover:bg-gray-200"
            title="Select Validation"
            aria-label="Validation"
            value={selectedValidation}
            onChange={(e) => setSelectedValidation(e.target.value)}
            disabled={loadingValidation || validationSets.length === 0}
          >
            <option value="" disabled>
              Validation
            </option>
            {validationSets.map((v) => (
              <option key={v.filename} value={v.filename}>
                {v.name}
              </option>
            ))}
          </select>
        </div>
        {selectedValidation && (
          <button
            className="ml-2 px-3 py-1 border rounded bg-green-600 text-white hover:bg-green-700"
            onClick={runValidation}
            disabled={validationRules.length === 0}
          >
            Run Validation
          </button>
        )}
      </header>

      {validationResults.length > 0 && (
        <div className="fixed top-24 right-4 z-40">
          <ValidationStatus
            results={validationResults}
            onClear={() => setValidationResults([])}
          />
        </div>
      )}

      <main className="flex-1 overflow-auto">
        <EditorContent editor={editor} className="tiptap-content" />
        <TrackChanges content={content} />
        <CommentTrack />
        <EditorIntegrationInfo editorName="TipTap" />
      </main>
    </div>
  );
}

// Disable SSR for Next.js hydration issues
export default dynamic(() => Promise.resolve(TiptapEditorPage), { ssr: false });
