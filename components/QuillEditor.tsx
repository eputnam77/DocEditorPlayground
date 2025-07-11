import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

interface QuillEditorProps {
  value: string;
  onChange: (val: string) => void;
  // You can add more props for customization as needed
}

export default function QuillEditor({ value, onChange }: QuillEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

  // Set up the Quill editor once on mount
  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ color: [] }, { background: [] }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],
            ["blockquote", "code-block"],
            ["link", "image"],
            ["clean"],
          ],
        },
        placeholder: "Start writing your document…",
      });

      // Set initial value
      quillRef.current.root.innerHTML = value || "";

      // Handle text change
      quillRef.current.on("text-change", () => {
        const html = quillRef.current!.root.innerHTML;
        onChange(html);
      });
    }
  }, [onChange]);

  // Sync external value changes
  useEffect(() => {
    if (quillRef.current && quillRef.current.root.innerHTML !== value) {
      quillRef.current.root.innerHTML = value || "";
    }
  }, [value]);

  return (
    <div>
      <div ref={editorRef} style={{ minHeight: 200 }} className="rounded border" />
    </div>
  );
}
