import { useState } from "react";
import PluginManager from "../components/PluginManager";
import TemplateLoader from "../components/TemplateLoader";
import EditorIntegrationInfo from "../components/EditorIntegrationInfo";
import NavBar from "../components/NavBar";
import SimpleEditor from "../components/SimpleEditor";

export default function LexicalPage() {
  const [content, setContent] = useState("");

  return (
    <div>
      <NavBar />
      <h1>Lexical Editor</h1>
      <SimpleEditor initialValue={content} onChange={setContent} />
      <PluginManager plugins={["history", "markdown"]} />
      <TemplateLoader
        onLoad={(tpl) => setContent(JSON.stringify(tpl, null, 2))}
      />
      <EditorIntegrationInfo editorName="lexical" />
    </div>
  );
}
