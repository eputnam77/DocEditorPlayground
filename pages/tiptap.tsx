import PluginManager from '../components/PluginManager';
import TemplateLoader from '../components/TemplateLoader';
import EditorIntegrationInfo from '../components/EditorIntegrationInfo';
import NavBar from '../components/NavBar';

export default function TiptapPage() {
  return (
    <div>
      <NavBar />
      <h1>TipTap Editor</h1>
      <textarea data-testid="editor" />
      <PluginManager plugins={['bold', 'italic']} />
      <TemplateLoader onLoad={console.log} />
      <EditorIntegrationInfo editorName="tiptap" />
    </div>
  );
}
