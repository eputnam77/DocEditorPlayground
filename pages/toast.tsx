import { useState } from "react";
import { validateDocument } from "../utils/validation";
import PluginManager from "../components/PluginManager";
import TemplateLoader from "../components/TemplateLoader";
import EditorIntegrationInfo from "../components/EditorIntegrationInfo";
import NavBar from "../components/NavBar";
import SimpleEditor from "../components/SimpleEditor";

export default function ToastPage() {
  const [content, setContent] = useState("");
  const [valid, setValid] = useState(true);

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-slate-100 to-orange-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-700 flex flex-col items-center py-8">
      <div className="w-full max-w-5xl">
        <NavBar />
      </div>
      <section className="w-full max-w-3xl mx-auto mt-8 bg-white/80 dark:bg-zinc-800/95 shadow-xl rounded-2xl px-8 py-10 flex flex-col gap-8 border border-zinc-100 dark:border-zinc-700">
        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-amber-500 drop-shadow">
          Toast UI Editor
        </h1>
        <p className="text-zinc-600 dark:text-zinc-300">
          Full-featured Markdown editor with preview.
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
            {valid ? "Document valid" : "Document invalid"}
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <h2 className="text-lg font-semibold mb-2 text-zinc-700 dark:text-zinc-200">
              Plugins
            </h2>
            <PluginManager plugins={["chart", "table"]} />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold mb-2 text-zinc-700 dark:text-zinc-200">
              Templates
            </h2>
            <TemplateLoader
              onLoad={(tpl) => setContent(JSON.stringify(tpl, null, 2))}
            />
          </div>
        </div>
        <EditorIntegrationInfo editorName="toast" />
      </section>
    </main>
  );
}
