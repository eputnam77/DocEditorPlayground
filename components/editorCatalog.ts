export interface EditorCatalogItem {
  id: string;
  name: string;
  path: string;
  summary: string;
  toolDescription: string;
  githubRepoUrl: string;
}

export const EDITOR_CATALOG: EditorCatalogItem[] = [
  {
    id: "tiptap",
    name: "TipTap",
    path: "/tiptap",
    summary: "Extensible ProseMirror-based editor with advanced extensions.",
    toolDescription:
      "TipTap is a headless rich-text framework built on ProseMirror for highly customizable editing experiences.",
    githubRepoUrl: "https://github.com/ueberdosis/tiptap",
  },
  {
    id: "toast",
    name: "Toast UI Editor",
    path: "/toast",
    summary: "Markdown and WYSIWYG editor with plugin-driven formatting.",
    toolDescription:
      "Toast UI Editor is an open-source Markdown and WYSIWYG editor focused on practical formatting tools.",
    githubRepoUrl: "https://github.com/nhn/tui.editor",
  },
  {
    id: "codex",
    name: "Editor.js",
    path: "/codex",
    summary: "Block-style editor focused on structured content workflows.",
    toolDescription:
      "Editor.js is a block-styled editor where each block is a structured content unit with its own tool.",
    githubRepoUrl: "https://github.com/codex-team/editor.js",
  },
  {
    id: "slate",
    name: "Slate",
    path: "/slate",
    summary: "Framework-level rich text toolkit with custom behavior control.",
    toolDescription:
      "Slate is a customizable framework for building rich-text editors with complete control over schema and behavior.",
    githubRepoUrl: "https://github.com/ianstormtaylor/slate",
  },
  {
    id: "lexical",
    name: "Lexical",
    path: "/lexical",
    summary: "Composable React editor architecture optimized for speed.",
    toolDescription:
      "Lexical is Meta's extensible text editor framework for React with a focus on reliability and performance.",
    githubRepoUrl: "https://github.com/facebook/lexical",
  },
  {
    id: "ckeditor",
    name: "CKEditor 5",
    path: "/ckeditor",
    summary: "Feature-rich classic editor with polished authoring UX.",
    toolDescription:
      "CKEditor 5 is a modern rich-text editor framework with production-ready collaboration and formatting capabilities.",
    githubRepoUrl: "https://github.com/ckeditor/ckeditor5",
  },
];

export const EDITOR_BY_ID: Record<string, EditorCatalogItem> = Object.fromEntries(
  EDITOR_CATALOG.map((item) => [item.id, item]),
);
