declare module "@toast-ui/react-editor" {
  import React from "react";
  export class Editor {
    getInstance(): any;
  }
  export const ToastEditor: React.FC<any>;
}
declare module "@toast-ui/editor/dist/toastui-editor.css";
declare module "@editorjs/editorjs" {
  export default class EditorJS {
    constructor(options?: any);
    save(): Promise<any>;
    render(data: any): void;
    destroy(): void;
  }
}
declare module "@editorjs/header" {
  export default class Header {}
}
declare module "@editorjs/list" {
  export default class List {}
}
declare module "quill" {
  export default class Quill {
    constructor(el: HTMLElement, options?: any);
    root: { innerHTML: string };
    on(event: string, cb: () => void): void;
  }
}
declare module "slate" {
  export type Descendant = any;
  export function createEditor(): any;
}
declare module "slate-react" {
  export function Slate(props: any): any;
  export function Editable(props: any): any;
  export function withReact(e: any): any;
}
declare module "lexical" {
  export function $getRoot(): any;
  export function $getSelection(): any;
}
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
declare module "@tiptap/react" {
  export function EditorContent(props: any): any;
  export function useEditor(props: any): any;
  export type Extension = any;
}
declare module "@tiptap/starter-kit" {
  const StarterKit: any;
  export default StarterKit;
}
