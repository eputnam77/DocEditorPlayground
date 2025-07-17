import dynamic from "next/dynamic";
import EditorIntegrationInfo from "../components/EditorIntegrationInfo";

function LexicalPage() {
  return (
    <div className="p-4">
      <h1>Lexical</h1>
      <p>Lexical integration is not available in this demo.</p>
      <EditorIntegrationInfo editorName="Lexical" />
    </div>
  );
}

export default dynamic(() => Promise.resolve(LexicalPage), { ssr: false });
