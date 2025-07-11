export interface EditorIntegrationInfoProps {
  /** Identifier for the editor to display information about. */
  editorName: string;
}

const infoMap: Record<string, string> = {
  tiptap: 'Use @tiptap/react and register extensions.',
  toast: 'Import @toast-ui/react-editor and configure plugins.',
  codex: 'Initialize Editor.js with desired tools.',
  quill: 'Use react-quill and register modules.',
  slate: 'Compose Slate with custom schema.',
  lexical: 'Create a Lexical editor with nodes.',
  ckeditor: 'Install @ckeditor/ckeditor5-react and build.',
};

/**
 * Renders short integration instructions for a given editor.
 */
export default function EditorIntegrationInfo({ editorName }: EditorIntegrationInfoProps) {
  const info = infoMap[editorName] ?? 'No instructions available.';
  return <pre data-testid="integration-info">{info}</pre>;
}
