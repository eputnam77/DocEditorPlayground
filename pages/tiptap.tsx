import { useState } from "react";
import { validateDocument } from "../utils/validation";
import USWDSDocEditorLayout from "../components/USWDSDocEditorLayout";
import EditorToolbar from "../components/EditorToolbar";
import PluginManager from "../components/PluginManager";
import TemplateLoader from "../components/TemplateLoader";
import EditorIntegrationInfo from "../components/EditorIntegrationInfo";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function TiptapPage() {
  const [content, setContent] = useState("");
  const [valid, setValid] = useState(true);
  const [plugins, setPlugins] = useState({
    bold: true,
    italic: true,
    underline: true,
    heading: true,
    bulletList: true,
    orderedList: true,
    blockquote: true,
    codeBlock: true,
    comment: false, // Example for future extension
    trackChanges: false, // Example for future extension
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: plugins.bold,
        italic: plugins.italic,
        underline: plugins.underline,
        heading: plugins.heading,
        bulletList: plugins.bulletList,
        orderedList: plugins.orderedList,
        blockquote: plugins.blockquote,
        codeBlock: plugins.codeBlock,
      }),
      // Add any other TipTap extensions you want to toggle here
    ],
    content,
    onUpdate({ editor }) {
      setContent(editor.getHTML());
    },
  });

  return (
    <USWDSDocEditorLayout
      editorName="TipTap"
      toolbar={<EditorToolbar />}
      menu={
        <nav className="flex gap-2">
          <button className="px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-300 rounded hover:bg-blue-100">
            New
          </button>
          <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200">
            Open
          </button>
          <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200">
            Save
          </button>
        </nav>
      }
    >
      <div className="mb-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 min-h-[200px]">
        <EditorContent
          editor={editor}
          data-testid="tiptap-editor"
          className="min-h-[60vh]"
          onBlur={() => setValid(validateDocument({ content }))}
        />
        <div className="mt-2 text-sm">
          {valid ? (
            <span className="text-green-700">Document valid</span>
          ) : (
            <span className="text-red-700">Document invalid</span>
          )}
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">Plugins</h2>
          <PluginManager
            plugins={[
              "bold",
              "italic",
              "underline",
              "heading",
              "bulletList",
              "orderedList",
              "blockquote",
              "codeBlock",
              // Add more as needed
            ]}
            onToggle={(name, enabled) =>
              setPlugins((p) => ({ ...p, [name]: enabled }))
            }
          />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">
            Templates
          </h2>
          <TemplateLoader
            onLoad={(tpl) => setContent(JSON.stringify(tpl, null, 2))}
          />
        </div>
      </div>
      <div className="mt-6">
        <EditorIntegrationInfo editorName="tiptap" />
      </div>
    </USWDSDocEditorLayout>
  );
}
