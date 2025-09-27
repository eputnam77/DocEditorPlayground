import React, { createContext, useContext, useRef, useEffect } from 'react';
import {
  FORMAT_TEXT_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
} from './lexical';

interface Editor {
  rootRef: React.RefObject<HTMLDivElement>;
  dispatchCommand(command: string, payload?: any): void;
  getHTML(): string;
  getText(): string;
  saveHistory(): void;
}

const EditorContext = createContext<Editor | null>(null);

export function LexicalComposer({
  children,
}: {
  children: React.ReactNode;
  initialConfig?: Record<string, unknown>;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<string[]>(['']);
  const indexRef = useRef(0);

  const editor: Editor = {
    rootRef,
    dispatchCommand(command: string, payload?: any) {
      const el = rootRef.current;
      if (!el) return;
      const exec = (cmd: string) => {
        if (typeof document.execCommand === 'function') {
          document.execCommand(cmd);
        }
      };
      switch (command) {
        case FORMAT_TEXT_COMMAND:
          exec(payload);
          break;
        case INSERT_UNORDERED_LIST_COMMAND:
          exec('insertUnorderedList');
          break;
        case INSERT_ORDERED_LIST_COMMAND:
          exec('insertOrderedList');
          break;
        case UNDO_COMMAND:
          if (indexRef.current > 0) {
            indexRef.current--;
            el.innerHTML = historyRef.current[indexRef.current];
          }
          break;
        case REDO_COMMAND:
          if (indexRef.current < historyRef.current.length - 1) {
            indexRef.current++;
            el.innerHTML = historyRef.current[indexRef.current];
          }
          break;
        default:
          break;
      }
    },
    getHTML() {
      return rootRef.current?.innerHTML || '';
    },
    getText() {
      return rootRef.current?.innerText || '';
    },
    saveHistory() {
      const html = editor.getHTML();
      historyRef.current = historyRef.current.slice(0, indexRef.current + 1);
      historyRef.current.push(html);
      indexRef.current++;
    },
  };

  return (
    <EditorContext.Provider value={editor}>{children}</EditorContext.Provider>
  );
}

export function useLexicalComposerContext(): [Editor] {
  const editor = useContext(EditorContext);
  if (!editor) throw new Error('No LexicalComposer context');
  return [editor];
}

export function ContentEditable(
  props: React.HTMLAttributes<HTMLDivElement>,
) {
  const [editor] = useLexicalComposerContext();
  return <div id="lexical-editor" {...props} ref={editor.rootRef} contentEditable />;
}

export function RichTextPlugin({
  contentEditable,
  placeholder,
}: {
  contentEditable: React.ReactNode;
  placeholder?: React.ReactNode;
}) {
  return (
    <>
      {contentEditable}
      {placeholder || null}
    </>
  );
}

export function HistoryPlugin() {
  return null;
}

export function ListPlugin() {
  return null;
}

export function OnChangePlugin({
  onChange,
}: {
  onChange: (editor: Editor) => void;
}) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    const el = editor.rootRef.current;
    if (!el) return;
    const handler = () => {
      editor.saveHistory();
      onChange(editor);
    };
    el.addEventListener('input', handler);
    return () => el.removeEventListener('input', handler);
  }, [editor, onChange]);
  return null;
}
