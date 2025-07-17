import dynamic from "next/dynamic";
import EditorIntegrationInfo from "../components/EditorIntegrationInfo";

function CodexPage() {
  return (
    <div className="p-4">
      <h1>Editor.js</h1>
      <p>Editor.js integration is not available in this demo.</p>
      <EditorIntegrationInfo editorName="Editor.js" />
    </div>
  );
}

export default dynamic(() => Promise.resolve(CodexPage), { ssr: false });
