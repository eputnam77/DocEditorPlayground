import React, { createContext, useContext, useEffect } from 'react';
import { Editor } from './slate';

const SlateContext = createContext<Editor | null>(null);

export function Slate({ editor, value = '', onChange, children }: { editor: Editor; value?: string; onChange?: (e: Editor) => void; children: React.ReactNode; }) {
  useEffect(() => {
    const el = editor.rootRef.current;
    if (!el) return;
    if (typeof value === 'string') {
      el.innerHTML = value;
    }
    const handler = () => onChange && onChange(editor);
    el.addEventListener('input', handler);
    return () => el.removeEventListener('input', handler);
  }, [editor, value, onChange]);
  return <SlateContext.Provider value={editor}>{children}</SlateContext.Provider>;
}

export function Editable(props: React.HTMLAttributes<HTMLDivElement>) {
  const editor = useSlate();
  return <div data-testid="slate-editor" {...props} ref={editor.rootRef} contentEditable />;
}

export function useSlate(): Editor {
  const editor = useContext(SlateContext);
  if (!editor) {
    throw new Error('Slate context not found');
  }
  return editor;
}

export function withReact(editor: Editor): Editor {
  return editor;
}
