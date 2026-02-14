export interface EditorCatalogItem {
  id: string;
  name: string;
  path: string;
  summary: string;
}

export const EDITOR_CATALOG: EditorCatalogItem[] = [
  {
    id: "tiptap",
    name: "TipTap",
    path: "/tiptap",
    summary: "Extensible ProseMirror-based editor with advanced extensions.",
  },
  {
    id: "toast",
    name: "Toast UI Editor",
    path: "/toast",
    summary: "Markdown and WYSIWYG editor with plugin-driven formatting.",
  },
  {
    id: "codex",
    name: "Editor.js",
    path: "/codex",
    summary: "Block-style editor focused on structured content workflows.",
  },
  {
    id: "slate",
    name: "Slate",
    path: "/slate",
    summary: "Framework-level rich text toolkit with custom behavior control.",
  },
  {
    id: "lexical",
    name: "Lexical",
    path: "/lexical",
    summary: "Composable React editor architecture optimized for speed.",
  },
  {
    id: "ckeditor",
    name: "CKEditor 5",
    path: "/ckeditor",
    summary: "Feature-rich classic editor with polished authoring UX.",
  },
];
