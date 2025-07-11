import PluginManager from '../components/PluginManager';
import TemplateLoader from '../components/TemplateLoader';
import EditorIntegrationInfo from '../components/EditorIntegrationInfo';
import NavBar from '../components/NavBar';

export default function QuillPage() {
  return (
    <div>
      <NavBar />
      <h1>Quill Editor</h1>
      <textarea data-testid="editor" />
      <PluginManager plugins={['toolbar', 'syntax']} />
      <TemplateLoader onLoad={console.log} />
      <EditorIntegrationInfo editorName="quill" />
    </div>
  );
}
