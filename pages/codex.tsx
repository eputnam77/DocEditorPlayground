import PluginManager from '../components/PluginManager';
import TemplateLoader from '../components/TemplateLoader';
import EditorIntegrationInfo from '../components/EditorIntegrationInfo';
import NavBar from '../components/NavBar';

export default function CodexPage() {
  return (
    <div>
      <NavBar />
      <h1>Editor.js</h1>
      <textarea data-testid="editor" />
      <PluginManager plugins={['header', 'list']} />
      <TemplateLoader onLoad={console.log} />
      <EditorIntegrationInfo editorName="codex" />
    </div>
  );
}
