import type { ValidationResult } from "../components/ValidationStatus";

export interface EditorSelectionFormatState {
  bold: boolean;
  italic: boolean;
  heading: boolean;
  bulletList: boolean;
  numberedList: boolean;
}

export interface EditorCapabilities {
  heading: boolean;
  bulletList: boolean;
  numberedList: boolean;
}

export interface EditorContentSnapshot {
  text: string;
  html?: string;
  json?: unknown;
}

export interface EditorDiagnosticsAdapter {
  editorName: string;
  capabilities: EditorCapabilities;
  getContent: () => EditorContentSnapshot;
  getDirection: () => string | null;
  getSelectionFormatState?: () => Partial<EditorSelectionFormatState>;
}

function hasVisibleText(text: string): boolean {
  return text.replace(/[\s\u200B-\u200D\u2060-\u206F\uFEFF]+/g, "").length > 0;
}

function hasSerializableJson(value: unknown): boolean {
  if (value === null || value === undefined) {
    return false;
  }
  try {
    JSON.stringify(value);
    return true;
  } catch {
    return false;
  }
}

export function runEditorDiagnostics(
  adapter: EditorDiagnosticsAdapter,
): ValidationResult[] {
  const snapshot = adapter.getContent();
  const direction = (adapter.getDirection() ?? "").toLowerCase();
  const formatState = adapter.getSelectionFormatState?.() ?? {};

  return [
    {
      id: "content",
      label: "Non-empty content",
      passed: hasVisibleText(snapshot.text),
      detail: hasVisibleText(snapshot.text)
        ? "Editor contains visible text."
        : "Editor is empty or contains only whitespace.",
    },
    {
      id: "direction",
      label: "Typing direction (LTR)",
      passed: direction === "ltr",
      detail:
        direction === "ltr"
          ? "Editable surface resolves to direction:ltr."
          : `Editable surface direction resolved to "${direction || "unset"}".`,
    },
    {
      id: "html-export",
      label: "HTML export",
      passed: typeof snapshot.html === "string",
      detail:
        typeof snapshot.html === "string"
          ? "Editor exposes HTML export."
          : "No HTML export available.",
    },
    {
      id: "json-export",
      label: "JSON export",
      passed: hasSerializableJson(snapshot.json),
      detail: hasSerializableJson(snapshot.json)
        ? "Editor exposes serializable JSON output."
        : "No serializable JSON output available.",
    },
    {
      id: "heading-capability",
      label: "Heading support",
      passed: adapter.capabilities.heading,
      detail: adapter.capabilities.heading
        ? "Heading formatting is configured."
        : "Heading formatting is not configured.",
    },
    {
      id: "bullet-capability",
      label: "Bullet list support",
      passed: adapter.capabilities.bulletList,
      detail: adapter.capabilities.bulletList
        ? "Bullet list formatting is configured."
        : "Bullet list formatting is not configured.",
    },
    {
      id: "numbered-capability",
      label: "Numbered list support",
      passed: adapter.capabilities.numberedList,
      detail: adapter.capabilities.numberedList
        ? "Numbered list formatting is configured."
        : "Numbered list formatting is not configured.",
    },
    {
      id: "selection-state",
      label: "Selection format state",
      passed: Object.keys(formatState).length > 0,
      detail:
        Object.keys(formatState).length > 0
          ? `Selection state available (${Object.entries(formatState)
              .map(([k, v]) => `${k}:${Boolean(v)}`)
              .join(", ")}).`
          : "Selection state is not available from this integration.",
    },
  ];
}
