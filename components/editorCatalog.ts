export interface EditorCatalogItem {
  id: string;
  name: string;
  path: string;
  summary: string;
  toolDescription: string;
  githubRepoUrl: string;
  /** One-line framing of the editing model, shown under the editor name. */
  tagline: string;
  /** How the editor represents a document internally. */
  dataModel: string;
  /** The format the editor treats as its own source of truth. */
  nativeFormat: "HTML" | "Markdown" | "Block JSON" | "Node tree (JSON)";
  /** Which output formats this playground can read out of the editor. */
  outputs: Array<"html" | "json" | "markdown">;
  /** Where the formatting controls live, so the UI can say so up front. */
  toolbarStyle: string;
  /** What this editor does that none of the others do. */
  distinctive: string[];
  /** Short trade-off note - what you give up by choosing it. */
  tradeoff: string;
}

/**
 * Single source of truth for editor metadata.
 *
 * Order is intentional and drives both the nav and the home page: the two
 * batteries-included WYSIWYG editors first, then the markdown/block editors,
 * then the two low-level frameworks that ship no UI at all.
 */
export const EDITOR_CATALOG: EditorCatalogItem[] = [
  {
    id: "ckeditor",
    name: "CKEditor 5",
    path: "/ckeditor",
    summary: "Batteries-included WYSIWYG. The toolbar and UI ship with it.",
    toolDescription:
      "CKEditor 5 is a modern rich-text editor framework with production-ready collaboration and formatting capabilities.",
    githubRepoUrl: "https://github.com/ckeditor/ckeditor5",
    tagline: "Classic word-processor WYSIWYG, out of the box",
    dataModel: "Custom tree model with its own change/undo pipeline",
    nativeFormat: "HTML",
    outputs: ["html"],
    toolbarStyle: "Ships its own toolbar - the gray bar above the page",
    distinctive: [
      "The only editor here whose toolbar, dropdowns, and balloon UI come pre-built",
      "Own document model rather than the browser's contenteditable tree",
      "Commercial add-ons for real-time collaboration, comments, and track changes",
    ],
    tradeoff: "Heaviest bundle, and its UI is opinionated - restyling it means fighting its own CSS.",
  },
  {
    id: "tiptap",
    name: "TipTap",
    path: "/tiptap",
    summary: "Headless ProseMirror. You build every button yourself.",
    toolDescription:
      "TipTap is a headless rich-text framework built on ProseMirror for highly customizable editing experiences.",
    githubRepoUrl: "https://github.com/ueberdosis/tiptap",
    tagline: "Headless ProseMirror with an extension for everything",
    dataModel: "ProseMirror document with a strict, validating schema",
    nativeFormat: "HTML",
    outputs: ["html", "json"],
    toolbarStyle: "Headless - every toolbar button on this page is hand-written",
    distinctive: [
      "Schema validation rejects invalid structure instead of silently repairing it",
      "Deepest extension ecosystem: tables, collaboration, watermarks, slash commands, linting",
      "Yjs CRDT collaboration is a first-class extension, not an add-on product",
    ],
    tradeoff: "No UI at all out of the box - the toolbar is your problem.",
  },
  {
    id: "toast",
    name: "Toast UI Editor",
    path: "/toast",
    summary: "The only one here with a real Markdown source mode.",
    toolDescription:
      "Toast UI Editor is an open-source Markdown and WYSIWYG editor focused on practical formatting tools.",
    githubRepoUrl: "https://github.com/nhn/tui.editor",
    tagline: "Markdown and WYSIWYG, switchable mid-document",
    dataModel: "Markdown text, mirrored into a WYSIWYG ProseMirror view",
    nativeFormat: "Markdown",
    outputs: ["markdown", "html"],
    toolbarStyle: "Ships its own icon toolbar plus a Markdown/WYSIWYG switch",
    distinctive: [
      "The only editor here that can round-trip Markdown as its source of truth",
      "Live split preview while writing Markdown",
      "Switch between raw Markdown and WYSIWYG without losing the document",
    ],
    tradeoff: "Everything must be expressible in Markdown, so rich inline structure is limited.",
  },
  {
    id: "codex",
    name: "Editor.js",
    path: "/codex",
    summary: "Not HTML at all - a JSON array of typed blocks.",
    toolDescription:
      "Editor.js is a block-styled editor where each block is a structured content unit with its own tool.",
    githubRepoUrl: "https://github.com/codex-team/editor.js",
    tagline: "Block editor that outputs structured JSON, not markup",
    dataModel: "Flat array of typed blocks, each owned by its own tool plugin",
    nativeFormat: "Block JSON",
    outputs: ["json", "html"],
    toolbarStyle: "Per-block plus/handle controls and an inline selection popup",
    distinctive: [
      "The only editor here with no HTML source of truth - the document *is* JSON",
      "Each block type is an independently installable plugin with its own UI",
      "Clean data for APIs and renderers: no markup to sanitize downstream",
    ],
    tradeoff: "No document-wide rich text - formatting that spans blocks does not exist.",
  },
  {
    id: "slate",
    name: "Slate",
    path: "/slate",
    summary: "A toolkit, not an editor. You define the schema.",
    toolDescription:
      "Slate is a customizable framework for building rich-text editors with complete control over schema and behavior.",
    githubRepoUrl: "https://github.com/ianstormtaylor/slate",
    tagline: "Framework-level toolkit - you write the schema and the rendering",
    dataModel: "Nested JSON node tree you define; immutable, React-rendered",
    nativeFormat: "Node tree (JSON)",
    outputs: ["json", "html"],
    toolbarStyle: "None supplied - the toolbar and renderers are written per app",
    distinctive: [
      "You define every node and mark type; there is no built-in schema to work around",
      "Rendering is plain React components, so any node can be any UI",
      "HTML serialization is something you write, not something you get",
    ],
    tradeoff: "The most code per feature of anything here, and no HTML in or out for free.",
  },
  {
    id: "lexical",
    name: "Lexical",
    path: "/lexical",
    summary: "Meta's successor to Draft.js. Small, fast, plugin-driven.",
    toolDescription:
      "Lexical is Meta's extensible text editor framework for React with a focus on reliability and performance.",
    githubRepoUrl: "https://github.com/facebook/lexical",
    tagline: "Meta's small, fast, accessibility-first editor core",
    dataModel: "Immutable node tree updated inside transactional editor.update()",
    nativeFormat: "Node tree (JSON)",
    outputs: ["json", "html"],
    toolbarStyle: "Headless core - plugins supply behavior, you supply the toolbar",
    distinctive: [
      "Smallest core here; every capability arrives as a separately imported plugin",
      "All mutations run in transactional update() blocks, which makes history reliable",
      "Built at Meta for screen-reader correctness at very large scale",
    ],
    tradeoff: "Youngest ecosystem, and its theme object must map every node to a CSS class.",
  },
];

export const EDITOR_BY_ID: Record<string, EditorCatalogItem> = Object.fromEntries(
  EDITOR_CATALOG.map((item) => [item.id, item]),
);

export const OUTPUT_LABELS: Record<"html" | "json" | "markdown", string> = {
  html: "HTML",
  json: "JSON",
  markdown: "Markdown",
};
