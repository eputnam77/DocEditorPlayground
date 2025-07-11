import { useState } from "react";
import PluginManager from "../components/PluginManager";
import TemplateLoader from "../components/TemplateLoader";
import EditorIntegrationInfo from "../components/EditorIntegrationInfo";
import NavBar from "../components/NavBar";
import SimpleEditor from "../components/SimpleEditor";

export default function CkeditorPage() {
  const [content, setContent] = useState("");

  return (
    <div>
      <NavBar />
      <h1>CKEditor 5</h1>
      <SimpleEditor initialValue={content} onChange={setContent} />
      <PluginManager plugins={["alignment", "image"]} />
      <TemplateLoader
        onLoad={(tpl) => setContent(JSON.stringify(tpl, null, 2))}
      />
      <EditorIntegrationInfo editorName="ckeditor" />
    </div>
  );
}
