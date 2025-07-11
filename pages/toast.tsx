import { useState } from "react";
import PluginManager from "../components/PluginManager";
import TemplateLoader from "../components/TemplateLoader";
import EditorIntegrationInfo from "../components/EditorIntegrationInfo";
import NavBar from "../components/NavBar";
import SimpleEditor from "../components/SimpleEditor";

export default function ToastPage() {
  const [content, setContent] = useState("");

  return (
    <div>
      <NavBar />
      <h1>Toast UI Editor</h1>
      <SimpleEditor initialValue={content} onChange={setContent} />
      <PluginManager plugins={["chart", "table"]} />
      <TemplateLoader
        onLoad={(tpl) => setContent(JSON.stringify(tpl, null, 2))}
      />
      <EditorIntegrationInfo editorName="toast" />
    </div>
  );
}
