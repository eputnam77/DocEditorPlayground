import { useState } from "react";
import { validateDocument } from "../utils/validation";
import PluginManager from "../components/PluginManager";
import TemplateLoader from "../components/TemplateLoader";
import EditorIntegrationInfo from "../components/EditorIntegrationInfo";
import NavBar from "../components/NavBar";
import SimpleEditor from "../components/SimpleEditor";

export default function CkeditorPage() {
  const [content, setContent] = useState("");
  const [valid, setValid] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top gov banner */}
      <div className="w-full bg-gray-200 text-xs py-1 px-4 text-center text-gray-700 border-b border-gray-300">
        An official website of the United States government.{" "}
        <a href="#" className="text-blue-700 underline ml-1">
          Here’s how you know <span aria-hidden>›</span>
        </a>
      </div>

      {/* Header with project title and NavBar */}
      <header className="w-full bg-white border-b border-gray-200 py-3 px-6 flex items-center justify-between">
        <span className="font-bold text-lg text-gray-800">Project title</span>
        <NavBar />
      </header>

      {/* Main layout */}
      <div className="flex flex-1 w-full max-w-6xl mx-auto mt-6 gap-8 px-4">
        {/* Sidebar navigation */}
        <aside className="w-56 flex-shrink-0">
          <nav className="space-y-1">
            <a href="#" className="block px-3 py-2 font-medium text-gray-700 rounded hover:bg-gray-100">Parent link</a>
            <a href="#" className="block px-3 py-2 font-medium text-blue-700 bg-blue-50 rounded border-l-4 border-blue-700">Current page</a>
            <a href="#" className="block px-3 py-2 font-medium text-gray-700 rounded hover:bg-gray-100">Child link</a>
            <a href="#" className="block px-3 py-2 font-medium text-gray-700 rounded hover:bg-gray-100">Child link</a>
            <div className="pl-3">
              <a href="#" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">Grandchild link</a>
              <a href="#" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">Grandchild link</a>
              <div className="pl-3">
                <a href="#" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">Greatgrandchild link</a>
              </div>
            </div>
            <a href="#" className="block px-3 py-2 font-medium text-gray-700 rounded hover:bg-gray-100">Child link</a>
            <a href="#" className="block px-3 py-2 font-medium text-gray-700 rounded hover:bg-gray-100">Child link</a>
            <a href="#" className="block px-3 py-2 font-medium text-gray-700 rounded hover:bg-gray-100">Parent link</a>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1">
          <h1 className="text-3xl font-bold mb-3 text-gray-900">CKEditor 5</h1>
          <p className="mb-4 text-gray-800">
            Enterprise-ready editor with extensive plugin ecosystem.
          </p>
          <div className="mb-4">
            <SimpleEditor
              initialValue={content}
              onChange={(val) => {
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
              <h2 className="text-lg font-semibold mb-2 text-gray-800">
                Plugins
              </h2>
              <PluginManager plugins={["alignment", "image"]} />
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
            <EditorIntegrationInfo editorName="ckeditor" />
          </div>
          <a href="#" className="text-blue-700 underline text-sm block mt-8">
            Return to top
          </a>
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 bg-gray-50 py-6">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center px-4">
          <nav className="flex gap-6 mb-2">
            <a href="#" className="text-gray-700 hover:underline text-sm">Primary link</a>
            <a href="#" className="text-gray-700 hover:underline text-sm">Primary link</a>
            <a href="#" className="text-gray-700 hover:underline text-sm">Primary link</a>
            <a href="#" className="text-gray-700 hover:underline text-sm">Primary link</a>
            <a href="#" className="text-gray-700 hover:underline text-sm">Primary link</a>
            <a href="#" className="text-gray-700 hover:underline text-sm">Primary link</a>
          </nav>
          <div className="flex items-center gap-8">
            <span className="font-semibold text-gray-800 text-sm">Name of Agency</span>
            <div className="text-xs text-gray-500">
              Agency Contact Center<br />
              (800) CALL GOVT &nbsp;|&nbsp; info@agency.gov
            </div>
            <div className="flex gap-2">
              <a href="#" className="p-2" aria-label="Social 1">
                <svg width="18" height="18" fill="currentColor"><circle cx="9" cy="9" r="8" /></svg>
              </a>
              <a href="#" className="p-2" aria-label="Social 2">
                <svg width="18" height="18" fill="currentColor"><rect x="3" y="3" width="12" height="12" rx="2" /></svg>
              </a>
              <a href="#" className="p-2" aria-label="Social 3">
                <svg width="18" height="18" fill="currentColor"><polygon points="9,3 15,15 3,15" /></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
