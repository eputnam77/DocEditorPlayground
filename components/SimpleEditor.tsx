import { useState } from "react";

export interface SimpleEditorProps {
  /** Optional initial text value */
  initialValue?: string;
  /** Callback fired when the text changes */
  onChange?: (value: string) => void;
  /** Names of enabled plugins controlling which toolbar buttons show. */
  enabledPlugins?: string[];
}

/**
 * Very small text editor using a textarea and simple toolbar.
 * Formatting toggles update textarea styling but do not modify the text.
 * `enabledPlugins` controls which formatting buttons appear, allowing
 * external components to enable/disable features without complex logic.
 * This avoids heavy dependencies while providing minimal editor behaviour.
 */
export default function SimpleEditor({
  initialValue = "",
  onChange,
  enabledPlugins = ["bold", "italic"],
}: SimpleEditorProps) {
  const [value, setValue] = useState(initialValue);
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);

  function toggleBold() {
    setBold((b) => !b);
  }
  function toggleItalic() {
    setItalic((b) => !b);
  }

  function handleChange(e: any) {
    const newValue = e.target.value;
    setValue(newValue);
    onChange?.(newValue);
  }

  return (
    <div>
      <div style={{ marginBottom: "0.5rem" }}>
        {enabledPlugins.includes("bold") && (
          <button onClick={toggleBold} data-testid="btn-bold">
            Bold
          </button>
        )}
        {enabledPlugins.includes("italic") && (
          <button
            onClick={toggleItalic}
            data-testid="btn-italic"
            style={{ marginLeft: "0.5rem" }}
          >
            Italic
          </button>
        )}
      </div>
      <textarea
        value={value}
        onChange={handleChange}
        style={{
          fontWeight: bold ? "bold" : "normal",
          fontStyle: italic ? "italic" : "normal",
        }}
        data-testid="simple-editor"
      />
    </div>
  );
}
