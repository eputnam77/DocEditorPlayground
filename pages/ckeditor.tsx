import dynamic from "next/dynamic";
import EditorIntegrationInfo from "../components/EditorIntegrationInfo";

function CkeditorPage() {
  return (
    <div className="p-4">
      <h1>CKEditor 5</h1>
      <p>CKEditor integration is not available in this demo.</p>
      <EditorIntegrationInfo editorName="CKEditor 5" />
    </div>
  );
}

export default dynamic(() => Promise.resolve(CkeditorPage), { ssr: false });
