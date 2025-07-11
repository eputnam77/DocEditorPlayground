import { useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import PluginManager from "../components/PluginManager";
import TemplateLoader from "../components/TemplateLoader";
import EditorIntegrationInfo from "../components/EditorIntegrationInfo";
import NavBar from "../components/NavBar";

export interface TiptapPageProps {
  /** Additional TipTap extensions to load */
  extensions?: any[];
}

export default function TiptapPage({ extensions = [] }: TiptapPageProps) {
  const [content, setContent] = useState("");
  // Track which optional extensions are enabled. Keys correspond to
  // PluginManager entries and map to StarterKit configuration options.
  const [plugins, setPlugins] = useState({ bold: true, italic: true });
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: plugins.bold,
        italic: plugins.italic,
      }),
      ...extensions,
    ],
    content,
    onUpdate({ editor }) {
      setContent(editor.getHTML());
    },
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-slate-100 to-pink-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-700 flex flex-col items-center py-8">
      <div className="w-full max-w-5xl">
        <NavBar />
      </div>
      <section className="w-full max-w-3xl mx-auto mt-8 bg-white/80 dark:bg-zinc-800/95 shadow-xl rounded-2xl px-8 py-10 flex flex-col gap-8 border border-zinc-100 dark:border-zinc-700">
        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-indigo-500 to-fuchsia-500 drop-shadow">
          TipTap Editor
        </h1>
        <div className="mb-4 rounded-lg border border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 p-4 min-h-[200px]">
          <EditorContent editor={editor} data-testid="tiptap-editor" />
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <h2 className="text-lg font-semibold mb-2 text-zinc-700 dark:text-zinc-200">
              Plugins
            </h2>
            <PluginManager
              plugins={["bold", "italic"]}
              onToggle={(name, enabled) =>
                setPlugins((p) => ({ ...p, [name]: enabled }))
              }
            />
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
        <EditorIntegrationInfo editorName="tiptap" />
      </section>
    </main>
  );
}
