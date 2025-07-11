import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useEffect, useRef } from "react";

interface CkEditorProps {
  value: string;
  onChange: (val: string) => void;
  config?: Record<string, any>;
  readOnly?: boolean;
}

export default function CkEditor({
  value,
  onChange,
  config,
  readOnly = false,
}: CkEditorProps) {
  const editorRef = useRef<any>(null);

  // Prevent loop: only update editor if value prop actually changes
  useEffect(() => {
    if (
      editorRef.current &&
      value !== editorRef.current.getData() &&
      typeof value === "string"
    ) {
      editorRef.current.setData(value);
    }
  }, [value]);

  return (
    <div
      className="border rounded bg-white dark:bg-zinc-900 min-h-[200px] p-2"
      data-testid="simple-editor"
    >
      <CKEditor
        editor={ClassicEditor}
        data={value}
        disabled={readOnly}
        config={{
          toolbar: [
            "heading",
            "|",
            "bold",
            "italic",
            "underline",
            "link",
            "bulletedList",
            "numberedList",
            "blockQuote",
            "outdent",
            "indent",
            "|",
            "undo",
            "redo",
            "insertTable",
            "imageUpload",
            "codeBlock",
          ],
          ...config,
        }}
        onReady={(editor: any) => {
          editorRef.current = editor;
        }}
        onChange={(_event: any, editor: any) => {
          const data = editor.getData();
          onChange(data);
        }}
      />
    </div>
  );
}
