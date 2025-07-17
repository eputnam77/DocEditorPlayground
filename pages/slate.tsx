import dynamic from "next/dynamic";
import { useState } from "react";
import EditorIntegrationInfo from "../components/EditorIntegrationInfo";
import PluginManager from "../components/PluginManager";
import TemplateLoader from "../components/TemplateLoader";
import { TEMPLATES } from "../utils/templates";

const PLUGINS = [{ name: "history" }, { name: "links" }];

function SlatePage() {
  const [enabled, setEnabled] = useState<string[]>(PLUGINS.map((p) => p.name));
  const [content, setContent] = useState("");

  async function loadTemplate(filename: string) {
    const res = await fetch(`/templates/${filename}`);
    setContent(await res.text());
  }

  return (
    <div className="p-4 space-y-2">
      <h1>Slate</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-300">
        This demo uses a simple textarea placeholder.
      </p>
      <div className="flex gap-2">
        <TemplateLoader
          templates={TEMPLATES}
          onLoad={loadTemplate}
          onClear={() => setContent("")}
        />
        <PluginManager
          plugins={PLUGINS}
          enabled={enabled}
          onChange={setEnabled}
        />
      </div>
      <textarea
        className="w-full border rounded p-2 min-h-[200px]"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <EditorIntegrationInfo editorName="Slate" />
    </div>
  );
}

export default dynamic(() => Promise.resolve(SlatePage), { ssr: false });
