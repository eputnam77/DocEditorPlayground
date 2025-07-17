import dynamic from "next/dynamic";
import EditorIntegrationInfo from "../components/EditorIntegrationInfo";

function ToastPage() {
  return (
    <div className="p-4">
      <h1>Toast UI Editor</h1>
      <p>Toast UI integration is not available in this demo.</p>
      <EditorIntegrationInfo editorName="Toast UI" />
    </div>
  );
}

export default dynamic(() => Promise.resolve(ToastPage), { ssr: false });
