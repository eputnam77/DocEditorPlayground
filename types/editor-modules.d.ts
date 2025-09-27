declare module "@toast-ui/editor/dist/toastui-editor.css";
declare module "@editorjs/editorjs" {
  export default class EditorJS {
    constructor(options?: any);
    save(): Promise<any>;
    render(data: any): void;
    destroy(): void;
    blocks: {
      renderFromHTML(html: string): void;
      [key: string]: any;
    };
  }
}
declare module "@editorjs/header" {
  export default class Header {}
}
declare module "@editorjs/list" {
  export default class List {}
}
declare module "slate";
declare module "slate-react";
declare module "lexical";
declare module "@lexical/react/LexicalComposer" {
  export function LexicalComposer(props: any): any;
  export function ContentEditable(props: any): any;
  export function PlainTextPlugin(props: any): any;
  export function HistoryPlugin(): any;
  export function OnChangePlugin(): any;
  export function useLexicalComposerContext(): any;
}
declare module "@ckeditor/ckeditor5-react" {
  export function CKEditor(props: any): any;
}
declare module "@ckeditor/ckeditor5-build-classic" {
  const ClassicEditor: any;
  export default ClassicEditor;
}
declare module "@ckeditor/*";
declare module "@tiptap/react" {
  export function EditorContent(props: any): any;
  export function useEditor(props: any, deps?: any[]): any;
  export type Extension = any;
}
declare module "@tiptap/core" {
  export class Editor {
    constructor(options?: any);
    chain(): ChainedCommands;
    getHTML(): string;
    getAttributes(name: string): Record<string, unknown>;
  }
  export interface ChainedCommands {
    setTextSelection(pos: number): ChainedCommands;
    indent(): ChainedCommands;
    outdent(): ChainedCommands;
    run(): void;
  }
  export type RawCommands = Record<string, any>;
  export const Extension: {
    create<T = any>(config: any): any;
  };
  export function mergeAttributes(...inputs: any[]): Record<string, any>;
  export class Node {
    static create(config: any): any;
  }
}
declare module "@tiptap/starter-kit" {
  const StarterKit: any;
  export default StarterKit;
}

declare module "next/router";
declare module "framer-motion";
declare module "react-editor-js";
declare module "@editorjs/*";
declare module "@lexical/*";
declare module "slate-history";
declare module "@tiptap/*";
declare module "@toast-ui/editor-plugin-code-syntax-highlight";
declare module "@toast-ui/editor-plugin-table-merged-cell";
declare module "@toast-ui/editor-plugin-color-syntax";
declare module "prismjs";
