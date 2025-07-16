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
import PluginManager from "../components/PluginManager";
import TemplateLoader from "../components/TemplateLoader";
import EditorIntegrationInfo from "../components/EditorIntegrationInfo";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  ChevronDown,
  ChevronUp,
  Clock,
  Code,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo2,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

/* -------- Initial content (blank) -------- */
const initialContent = ""; // replace with your preferred starter HTML

/* -------- Extension Management -------- */
const AVAILABLE_EXTENSIONS = [
  { name: "StarterKit", extension: StarterKit.configure({ history: false }) },
  { name: "Underline", extension: Underline },
  { name: "Document", extension: DocumentExtension },
  { name: "Paragraph", extension: Paragraph },
  { name: "Text", extension: TextExtension },
  { name: "History", extension: History },
  { name: "Bold", extension: BoldExtension },
  { name: "Italic", extension: ItalicExtension },
  { name: "Strike", extension: StrikeExtension },
  { name: "Heading", extension: Heading },
  { name: "Code", extension: CodeExtension },
  { name: "CodeBlock", extension: CodeBlock },
  { name: "Blockquote", extension: Blockquote },
  { name: "BulletList", extension: BulletList },
  { name: "OrderedList", extension: OrderedList },
  { name: "ListItem", extension: ListItem },
  { name: "HardBreak", extension: HardBreak },
  { name: "HorizontalRule", extension: HorizontalRule },
  { name: "Dropcursor", extension: Dropcursor },
  { name: "Gapcursor", extension: Gapcursor },
  { name: "TextStyle", extension: TextStyle },
];

/* -------- Extensions Default -------- */
const DEFAULT_TOOLBAR_EXTENSIONS = [
  "StarterKit",
  "Underline",
  "Document",
  "Paragraph",
  "Text",
  "History",
  "Bold",
  "Italic",
  "Strike",
  "Heading",
  "Code",
  "CodeBlock",
  "Blockquote",
  "BulletList",
  "OrderedList",
  "ListItem",
  "HardBreak",
];

// Extensions that must remain enabled for TipTap to function
const ALWAYS_ENABLED = ["Document", "Paragraph", "Text"];

// Template metadata
const TEMPLATES = [
  {
    label: "FAA Advisory Circular",
    filename: "faa-advisory-circular.html",
  },
  {
    label: "Software Release Notes",
    filename: "software-release-notes.html",
  },
  {
    label: "Medical Research Article",
    filename: "medical-research-article.html",
  },
  {
    label: "Legal Contract Template",
    filename: "legal-contract-template.html",
  },
];

function TiptapEditorPage() {
  const [enabledExtensions, setEnabledExtensions] = useState<string[]>(() => {
    if (typeof window === "undefined") return DEFAULT_TOOLBAR_EXTENSIONS;
    const stored = localStorage.getItem("tiptapExtensions");
    const parsed = stored ? JSON.parse(stored) : DEFAULT_TOOLBAR_EXTENSIONS;
    return Array.from(new Set([...parsed, ...ALWAYS_ENABLED]));
  });

  const extensions = useMemo(
    () =>
      AVAILABLE_EXTENSIONS.filter((e) =>
        enabledExtensions.includes(e.name),
      ).map((e) => e.extension),
    [enabledExtensions],
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "tiptapExtensions",
        JSON.stringify(enabledExtensions),
      );
    }
  }, [enabledExtensions]);

  /* -------- Editor instance -------- */
  const [content, setContent] = useState<string>(initialContent);
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
    return () => {
      editor.off("update", updateHandler);
    };
  }, [editor]);

  const setHeading = (level: number) => {
    editor?.chain().focus().toggleHeading({ level }).run();
  };

  const handleSave = () => {
    if (editor) {
      alert(editor.getHTML());
      // Hook up to your backend / autosave here
    }
  };

  const [loadingTemplate, setLoadingTemplate] = useState(false);

  // Template loader handler
  const handleTemplateLoad = async (filename: string) => {
    if (!editor) return;
    setLoadingTemplate(true);
    try {
      const res = await fetch(`/templates/${filename}`);
      const html = await res.text();
      editor.commands.setContent(html);
    } catch (e) {
      alert("Failed to load template: " + filename);
    } finally {
      setLoadingTemplate(false);
    }
  };

  /* -------- Toolbar button helper -------- */
  const toolbarButton = (
    icon: any,
    command: () => void,
    active: boolean,
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

  /* -------- Dummy version history -------- */
  const [showHistory, setShowHistory] = useState(false);
  const DUMMY_HISTORY = [
    { id: 1, label: "Draft - Jul 9, 8:00 am" },
    { id: 2, label: "AutoSave - Jul 8, 3:30 pm" },
    { id: 3, label: "Submitted - Jul 7, 12:15 pm" },
  ];

  // Validation state
  const [validationSets, setValidationSets] = useState<any[]>([]);
  const [selectedValidation, setSelectedValidation] = useState<string>("");
  const [validationRules, setValidationRules] = useState<any[]>([]);
  const [validationResults, setValidationResults] = useState<any[]>([]);
  const [loadingValidation, setLoadingValidation] = useState(false);
  const [showValidationPanel, setShowValidationPanel] = useState(true);

  // Fetch validation sets on mount
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
      } catch (e) {
        setValidationSets([]);
      }
    }
    fetchValidations();
  }, []);

  // Load rules when validation set changes
  useEffect(() => {
    if (!selectedValidation) return;
    const set = validationSets.find((v) => v.filename === selectedValidation);
    setValidationRules(set ? set.rules : []);
    setValidationResults([]);
  }, [selectedValidation, validationSets]);

  // Validation logic
  function runValidation() {
    if (!editor) return;
    const html = editor.getHTML();
    // Use DOMParser for browser-safe HTML parsing
    const parser = new window.DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const results = validationRules.map((rule: any) => {
      if (rule.type === "header") {
        // Check for header of given level
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
        // Check for heading with given text (any level)
        const found = Array.from(
          doc.body.querySelectorAll("h1, h2, h3, h4, h5, h6"),
        ).find(
          (el) =>
            el.textContent?.trim().toLowerCase() ===
            rule.text.trim().toLowerCase(),
        );
        return {
          ...rule,
          passed: !!found,
          detail: found
            ? `Found section: ${found.textContent}`
            : `Section '${rule.text}' not found`,
        };
      } else if (rule.type === "footer") {
        // Check for text in the last block (simulate footer)
        const blocks = Array.from(
          doc.body.querySelectorAll(
            "p, div, footer, section, h1, h2, h3, h4, h5, h6",
          ),
        );
        const last = blocks[blocks.length - 1];
        const found =
          last && rule.text ? last.textContent?.includes(rule.text) : !!last;
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
  }

  if (!editor) return <div>Loading TipTap…</div>;

  return (
    <div className="fixed inset-0 z-30 bg-white flex flex-col">
      {/* Ensure testable heading for Playwright */}
      <h1 className="sr-only">TipTap Editor</h1>
      {/* -------- Toolbar -------- */}
      <header className="flex items-center gap-2 bg-gray-100 px-6 py-3 border-b w-full">
        <span className="text-xl font-bold mr-6">TipTap Editor</span>

        {/* Formatting toolbar */}
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
              if (typeof (chain as any).toggleUnderline === "function") {
                (chain as any).toggleUnderline().run();
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

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Template Loader */}
        <div className="relative mr-2">
          <TemplateLoader
            templates={TEMPLATES}
            disabled={loadingTemplate}
            onLoad={handleTemplateLoad}
            onClear={() => editor?.commands.clearContent()}
          />
        </div>

        {/* Extension Manager */}
        <div className="relative">
          <PluginManager
            plugins={AVAILABLE_EXTENSIONS.filter(
              (e) => !ALWAYS_ENABLED.includes(e.name),
            ).map((e) => ({ name: e.name }))}
            enabled={enabledExtensions}
            locked={ALWAYS_ENABLED}
            onChange={(exts) =>
              setEnabledExtensions(
                Array.from(new Set([...exts, ...ALWAYS_ENABLED])),
              )
            }
          />
        </div>

        {/* Version History */}
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

        {/* Validation Dropdown */}
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
        {/* Run Validation Button */}
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

      {/* Validation Results UI */}
      {validationResults.length > 0 &&
        (showValidationPanel ? (
          <div className="fixed top-24 right-4 bg-yellow-50 border rounded shadow-md p-4 max-w-sm max-h-[70vh] overflow-y-auto z-40">
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Validation Results</span>
              <div className="space-x-2">
                <button
                  className="text-xs"
                  onClick={() => setValidationResults([])}
                >
                  Clear
                </button>
                <button
                  className="text-xs"
                  onClick={() => setShowValidationPanel(false)}
                >
                  Hide
                </button>
              </div>
            </div>
            <ul className="text-sm">
              {validationResults.map((r) => (
                <li
                  key={r.id}
                  className={r.passed ? "text-green-700" : "text-red-700"}
                >
                  <span className="font-medium">{r.label}:</span>{" "}
                  {r.passed ? "PASS" : "FAIL"}{" "}
                  <span className="text-xs">({r.detail})</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <button
            className="fixed top-24 right-4 bg-yellow-50 border rounded shadow-md px-3 py-1 text-sm z-40"
            onClick={() => setShowValidationPanel(true)}
          >
            Show Validation
          </button>
        ))}

      {/* -------- Editor -------- */}
      <main className="flex-1 overflow-auto">
        <EditorContent editor={editor} className="tiptap-content" />
        <EditorIntegrationInfo editorName="TipTap" />
      </main>
    </div>
  );
}

/* Disable SSR for Next.js hydration issues */
export default dynamic(() => Promise.resolve(TiptapEditorPage), { ssr: false });
