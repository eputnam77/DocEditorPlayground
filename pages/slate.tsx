import dynamic from "next/dynamic";
import EditorIntegrationInfo from "../components/EditorIntegrationInfo";

function SlatePage() {
  return (
    <div className="p-4">
      <h1>Slate</h1>
      <p>Slate integration is not available in this demo.</p>
      <EditorIntegrationInfo editorName="Slate" />
    </div>
  );
}

export default dynamic(() => Promise.resolve(SlatePage), { ssr: false });
