import { useState } from "react";
import dynamic from "next/dynamic";
import { validateDocument } from "../utils/validation";
import USWDSDocEditorLayout from "../components/USWDSDocEditorLayout";
import EditorToolbar from "../components/EditorToolbar";
import PluginManager from "../components/PluginManager";
import TemplateLoader from "../components/TemplateLoader";
import EditorIntegrationInfo from "../components/EditorIntegrationInfo";
import SlateEditor from "../components/SlateEditor"; // Your Slate editor component

function SlatePage() {
  const [content, setContent] = useState("");
  const [valid, setValid] = useState(true);

  return (
    <USWDSDocEditorLayout
      editorName="Slate"
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
      <div className="mb-4">
        <SlateEditor
          value={content}
          onChange={(val: string) => {
            setContent(val);
            setValid(validateDocument({ content: val }));
          }}
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
              "history",
              "links",
              "tables",
              "lists",
              "images",
              "bold",
              "italic",
              "underline",
            ]}
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
        <EditorIntegrationInfo editorName="slate" />
      </div>
    </USWDSDocEditorLayout>
  );
}

export default dynamic(() => Promise.resolve(SlatePage), { ssr: false });
