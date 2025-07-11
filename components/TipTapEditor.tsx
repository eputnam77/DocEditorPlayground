import { useEffect } from "react";
import { EditorContent, useEditor, Extension } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

// Extend this for more extensions/plugins if desired!
interface TipTapEditorProps {
  value: string;
  onChange: (val: string) => void;
  extensions?: Extension[]; // For custom plugins/extensions
  editable?: boolean;
}

export default function TipTapEditor({
  value,
  onChange,
  extensions = [],
  editable = true,
}: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      ...extensions, // Add other extensions if passed
    ],
    content: value,
    editable,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  // If value changes externally, update the editor content
  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value, false);
    }
  }, [value, editor]);

  return (
    <div
      className="border rounded bg-white dark:bg-zinc-900 min-h-[200px]"
      data-testid="simple-editor"
    >
      <EditorContent editor={editor} />
    </div>
  );
}
