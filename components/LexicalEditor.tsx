import * as React from "react";
import { useEffect, useRef } from "react";
import {
  LexicalComposer,
  ContentEditable,
  useLexicalComposerContext,
  PlainTextPlugin,
  HistoryPlugin,
  OnChangePlugin,
} from "@lexical/react/LexicalComposer";
import { $getRoot, $getSelection } from "lexical";

interface LexicalEditorProps {
  value: string;
  onChange: (val: string) => void;
  editable?: boolean;
}

function EditorOnChangePlugin({
  onChange,
}: {
  onChange: (value: string) => void;
}) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const html = $getRoot().getTextContent();
        onChange(html);
      });
    });
  }, [editor, onChange]);
  return null;
}

export default function LexicalEditor({
  value,
  onChange,
  editable = true,
}: LexicalEditorProps) {
  const initialConfig = {
    namespace: "LexicalEditor",
    editable,
    theme: {
      // Example: add custom theme here if needed
      paragraph: "my-lexical-paragraph",
    },
    onError: (error: Error) => {
      throw error;
    },
  };

  // For controlled value: update editor when `value` changes
  // (Lexical is best as uncontrolled, but this allows sync with parent)
  const initialLoad = useRef(true);
  function MyControlledValuePlugin() {
    const [editor] = useLexicalComposerContext();
    useEffect(() => {
      // Only set initial value on first mount, otherwise it resets cursor!
      if (initialLoad.current) {
        editor.update(() => {
          // Lexical is text-based by default; adjust for HTML if needed
          const root = $getRoot();
          root.clear();
          root.append(value || "");
        });
        initialLoad.current = false;
      }
    }, [editor]);
    return null;
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div
        className="border rounded bg-white dark:bg-zinc-900 min-h-[200px] p-2"
        data-testid="simple-editor"
      >
        <PlainTextPlugin
          contentEditable={
            <ContentEditable className="outline-none min-h-[160px] p-2 bg-transparent" />
          }
          placeholder={
            <div className="text-gray-400">Start writing your document…</div>
          }
        />
        <HistoryPlugin />
        <EditorOnChangePlugin onChange={onChange} />
        <MyControlledValuePlugin />
      </div>
    </LexicalComposer>
  );
}
