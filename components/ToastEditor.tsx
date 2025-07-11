import { useRef, useEffect } from "react";
import { Editor } from "@toast-ui/react-editor";

interface ToastEditorProps {
  value: string;
  onChange: (val: string) => void;
  height?: string;
  previewStyle?: "vertical" | "tab";
  initialEditType?: "markdown" | "wysiwyg";
  readOnly?: boolean;
}

function ToastEditor({
  value,
  onChange,
  height = "300px",
  previewStyle = "vertical",
  initialEditType = "wysiwyg",
  readOnly = false,
}: ToastEditorProps): JSX.Element {
  const editorRef = useRef<Editor | null>(null);

  // Handle controlled input: update editor when `value` prop changes
  useEffect(() => {
    const instance = editorRef.current?.getInstance();
    if (
      instance &&
      instance.getMarkdown() !== value &&
      typeof value === "string"
    ) {
      instance.setMarkdown(value, false);
    }
  }, [value]);

  // Set up onChange event to update parent
  function handleChange() {
    const instance = editorRef.current?.getInstance();
    if (instance) {
      onChange(instance.getMarkdown());
    }
  }

  return (
    <div
      className="border rounded bg-white dark:bg-zinc-900 min-h-[200px] p-2"
      data-testid="simple-editor"
    >
      <Editor
        ref={editorRef}
        initialValue={value || ""}
        previewStyle={previewStyle}
        height={height}
        initialEditType={initialEditType}
        useCommandShortcut={true}
        onChange={handleChange}
        toolbarItems={[
          // USWDS/Word-style basic toolbar
          ["heading", "bold", "italic", "strike"],
          ["hr"],
          ["quote", "ul", "ol", "task", "indent", "outdent"],
          ["table", "image", "link"],
          ["code", "codeblock"],
        ]}
        hideModeSwitch={true}
        readOnly={readOnly}
      />
    </div>
  );
}

export default ToastEditor;
