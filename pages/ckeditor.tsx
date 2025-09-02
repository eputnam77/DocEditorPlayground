import React, { useRef, useState, useMemo } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

/**
 * CKEditor demo page.
 *
 * Basic CKEditor 5 integration with plugin toggles and template loading.
 */
import EditorIntegrationInfo from "../components/EditorIntegrationInfo";
import PluginManager from "../components/PluginManager";
import TemplateLoader from "../components/TemplateLoader";
import sanitizeHtml from "../utils/sanitize";
import ValidationStatus, {
  ValidationResult,
} from "../components/ValidationStatus";
import CommentTrack from "../components/CommentTrack";
import TrackChanges from "../components/TrackChanges";
import { validateDocument } from "../utils/validation";
import { TEMPLATES } from "../utils/templates";
import ModernLayout from "../components/ModernLayout";

const PLUGINS = [
  { name: "bold", label: "Bold" },
  { name: "italic", label: "Italic" },
  { name: "underline", label: "Underline" },
];

function CkeditorPage() {
  const editorRef = useRef<any>(null);
  const [enabled, setEnabled] = useState<string[]>(PLUGINS.map((p) => p.name));
  const [content, setContent] = useState("");
  const [validationResults, setValidationResults] = useState<
    ValidationResult[]
  >([]);

  const toolbarItems = useMemo(
    () => [...enabled, "undo", "redo"],
    [enabled],
  );

  async function loadTemplate(filename: string) {
    try {
      const res = await fetch(`/templates/${filename}`);
      if (!res.ok) throw new Error("fetch failed");
      const html = await res.text();
      const sanitized = sanitizeHtml(html);
      setContent(sanitized);
      editorRef.current?.setData(sanitized);
    } catch {
      alert("Failed to load template: " + filename);
    }
  }

  function runValidation() {
    try {
      const passed = validateDocument({ content });
      setValidationResults([{ id: 1, label: "Document", passed }]);
    } catch {
      alert("Validation failed");
    }
  }

  return (
    <ModernLayout>
      <div className="p-4 space-y-2">
        <h1>CKEditor 5</h1>
        <div className="flex gap-2">
          <TemplateLoader
            templates={TEMPLATES}
            onLoad={loadTemplate}
            onClear={() => setContent("")}
            onError={(e) => alert(String(e))}
          />
          <PluginManager
            plugins={PLUGINS}
            enabled={enabled}
            onChange={setEnabled}
          />
          <button
            className="px-3 py-1 border rounded bg-gray-50 hover:bg-gray-200"
            onClick={runValidation}
          >
            Validate
          </button>
        </div>
        <div className="w-full border rounded min-h-[60vh]">
          <CKEditor
            editor={ClassicEditor}
            data={content}
            key={enabled.join(",")}
            onReady={(editor: any) => {
              editorRef.current = editor;
            }}
            onChange={(event, editor: any) => {
              setContent(editor.getData());
            }}
            config={{ toolbar: { items: toolbarItems } }}
          />
        </div>
        <TrackChanges content={content} />
        {validationResults.length > 0 && (
          <ValidationStatus
            results={validationResults}
            onClear={() => setValidationResults([])}
          />
        )}
        <CommentTrack />
        <EditorIntegrationInfo editorName="CKEditor 5" />
      </div>
    </ModernLayout>
  );
}

export default CkeditorPage;
