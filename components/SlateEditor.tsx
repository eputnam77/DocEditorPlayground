import { useMemo, useCallback, useEffect, useState } from "react";
import { createEditor, Descendant } from "slate";
import { Slate, Editable, withReact } from "slate-react";

interface SlateEditorProps {
  value: string; // serialized JSON string
  onChange: (val: string) => void;
  editable?: boolean;
}

// Helper to parse and stringify the value safely
function safeParseValue(value: string): Descendant[] {
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed;
  } catch {}
  // Default to one empty paragraph
  return [
    {
      type: "paragraph",
      children: [{ text: "" }],
    },
  ];
}

export default function SlateEditor({
  value,
  onChange,
  editable = true,
}: SlateEditorProps) {
  const editor = useMemo(() => withReact(createEditor()), []);

  // Keep internal value in sync with external changes
  const initialValue = useMemo(() => safeParseValue(value), []);
  const [localValue, setLocalValue] = useState<Descendant[]>(initialValue);

  useEffect(() => {
    // If the external value changes, update local
    const external = safeParseValue(value);
    if (JSON.stringify(external) !== JSON.stringify(localValue)) {
      setLocalValue(external);
    }
    // eslint-disable-next-line
  }, [value]);

  // On change, update local and bubble up to parent
  const handleChange = useCallback(
    (val: Descendant[]) => {
      setLocalValue(val);
      onChange(JSON.stringify(val));
    },
    [onChange],
  );

  return (
    <div
      className="border rounded bg-white dark:bg-zinc-900 min-h-[200px] p-2"
      data-testid="simple-editor"
    >
      <Slate editor={editor} value={localValue} onChange={handleChange}>
        <Editable
          readOnly={!editable}
          placeholder="Start writing your document…"
        />
      </Slate>
    </div>
  );
}
