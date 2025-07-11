import PluginManager from '../components/PluginManager';
import TemplateLoader from '../components/TemplateLoader';
import EditorIntegrationInfo from '../components/EditorIntegrationInfo';
import NavBar from '../components/NavBar';

export default function ToastPage() {
  return (
    <div>
      <NavBar />
      <h1>Toast UI Editor</h1>
      <textarea data-testid="editor" />
      <PluginManager plugins={['chart', 'table']} />
      <TemplateLoader onLoad={console.log} />
      <EditorIntegrationInfo editorName="toast" />
    </div>
  );
}
