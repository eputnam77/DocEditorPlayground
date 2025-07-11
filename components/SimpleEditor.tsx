import { useState } from "react";

export interface SimpleEditorProps {
  /** Optional initial text value */
  initialValue?: string;
  /** Callback fired when the text changes */
  onChange?: (value: string) => void;
}

/**
 * Very small text editor using a textarea and simple toolbar.
 * Formatting toggles update textarea styling but do not modify the text.
 * This avoids heavy dependencies while providing minimal editor behaviour.
 */
export default function SimpleEditor({
  initialValue = "",
  onChange,
}: SimpleEditorProps) {
  const [value, setValue] = useState(initialValue);
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [heading, setHeading] = useState<"normal" | "h1" | "h2">("normal");
  const [comments, setComments] = useState<string[]>([]);
  const [tracking, setTracking] = useState(false);

  function toggleBold() {
    setBold((b) => !b);
  }
  function toggleItalic() {
    setItalic((b) => !b);
  }
  function toggleUnderline() {
    setUnderline((u) => !u);
  }
  function setHeadingLevel(level: "normal" | "h1" | "h2") {
    setHeading(level);
  }
  function toggleTracking() {
    setTracking((t) => !t);
  }
  function addComment() {
    const text = window.prompt("Comment");
    if (text) setComments((c) => [...c, text]);
  }

  function handleChange(e: any) {
    const newValue = e.target.value;
    setValue(newValue);
    onChange?.(newValue);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-2 flex flex-wrap gap-2" data-testid="toolbar">
        <button
          onClick={toggleBold}
          data-testid="btn-bold"
          className="px-2 py-1 border rounded"
        >
          Bold
        </button>
        <button
          onClick={toggleItalic}
          data-testid="btn-italic"
          className="px-2 py-1 border rounded"
        >
          Italic
        </button>
        <button
          onClick={toggleUnderline}
          data-testid="btn-underline"
          className="px-2 py-1 border rounded"
        >
          Underline
        </button>
        <button
          onClick={() => setHeadingLevel("h1")}
          data-testid="btn-h1"
          className="px-2 py-1 border rounded"
        >
          H1
        </button>
        <button
          onClick={() => setHeadingLevel("h2")}
          data-testid="btn-h2"
          className="px-2 py-1 border rounded"
        >
          H2
        </button>
        <button
          onClick={addComment}
          data-testid="btn-comment"
          className="px-2 py-1 border rounded"
        >
          Comment
        </button>
        <button
          onClick={toggleTracking}
          data-testid="btn-track"
          className="px-2 py-1 border rounded"
        >
          {tracking ? "Stop Track" : "Track"}
        </button>
      </div>
      <textarea
        value={value}
        onChange={handleChange}
        className="flex-1 w-full min-h-[400px] resize-none border rounded p-2"
        style={{
          fontWeight: bold ? "bold" : "normal",
          fontStyle: italic ? "italic" : "normal",
          textDecoration: underline ? "underline" : "none",
          fontSize:
            heading === "h1" ? "1.5rem" : heading === "h2" ? "1.25rem" : "1rem",
        }}
        data-testid="simple-editor"
      />
      {comments.length > 0 && (
        <ul className="mt-2 text-sm list-disc pl-4" data-testid="comment-list">
          {comments.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
