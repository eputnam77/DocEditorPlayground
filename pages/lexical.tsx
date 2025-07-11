import { useState } from "react";
import PluginManager from "../components/PluginManager";
import TemplateLoader from "../components/TemplateLoader";
import EditorIntegrationInfo from "../components/EditorIntegrationInfo";
import NavBar from "../components/NavBar";
import SimpleEditor from "../components/SimpleEditor";

export default function LexicalPage() {
  const [content, setContent] = useState("");

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-slate-100 to-violet-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-700 flex flex-col items-center py-8">
      <div className="w-full max-w-5xl">
        <NavBar />
      </div>
      <section className="w-full max-w-3xl mx-auto mt-8 bg-white/80 dark:bg-zinc-800/95 shadow-xl rounded-2xl px-8 py-10 flex flex-col gap-8 border border-zinc-100 dark:border-zinc-700">
        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-sky-500 to-indigo-500 drop-shadow">
          Lexical Editor
        </h1>
        <div className="mb-4">
          <SimpleEditor initialValue={content} onChange={setContent} />
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <h2 className="text-lg font-semibold mb-2 text-zinc-700 dark:text-zinc-200">Plugins</h2>
            <PluginManager plugins={["history", "markdown"]} />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold mb-2 text-zinc-700 dark:text-zinc-200">Templates</h2>
            <TemplateLoader
              onLoad={(tpl) => setContent(JSON.stringify(tpl, null, 2))}
            />
          </div>
        </div>
        <EditorIntegrationInfo editorName="lexical" />
      </section>
    </main>
  );
}
