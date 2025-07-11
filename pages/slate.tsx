import PluginManager from '../components/PluginManager';
import TemplateLoader from '../components/TemplateLoader';
import EditorIntegrationInfo from '../components/EditorIntegrationInfo';
import NavBar from '../components/NavBar';

export default function SlatePage() {
  return (
    <div>
      <NavBar />
      <h1>Slate Editor</h1>
      <textarea data-testid="editor" />
      <PluginManager plugins={['history', 'links']} />
      <TemplateLoader onLoad={console.log} />
      <EditorIntegrationInfo editorName="slate" />
    </div>
  );
}
